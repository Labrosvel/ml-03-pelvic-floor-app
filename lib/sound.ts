import {
  createAudioPlayer,
  setAudioModeAsync,
  type AudioPlayer,
  type AudioSource,
} from 'expo-audio';

import type { SoundPackId } from '@/constants/sounds';
import type { SessionStep } from '@/lib/session';

export type { SoundPackId } from '@/constants/sounds';
export { SOUND_PACKS, isSoundPackId } from '@/constants/sounds';

export type CueRole = 'prepare' | 'squeeze' | 'rest' | 'quickSqueeze' | 'complete';

type CueKey = `${SoundPackId}:${CueRole}`;

const SOURCES: Record<CueKey, AudioSource> = {
  'gentle:prepare': require('../assets/sounds/gentle/prepare.mp3'),
  'gentle:squeeze': require('../assets/sounds/gentle/squeeze.mp3'),
  'gentle:rest': require('../assets/sounds/gentle/rest.mp3'),
  'gentle:quickSqueeze': require('../assets/sounds/gentle/quickSqueeze.mp3'),
  'gentle:complete': require('../assets/sounds/gentle/complete.mp3'),
  'chime:prepare': require('../assets/sounds/chime/prepare.mp3'),
  'chime:squeeze': require('../assets/sounds/chime/squeeze.mp3'),
  'chime:rest': require('../assets/sounds/chime/rest.mp3'),
  'chime:quickSqueeze': require('../assets/sounds/chime/quickSqueeze.mp3'),
  'chime:complete': require('../assets/sounds/chime/complete.mp3'),
  'click:prepare': require('../assets/sounds/click/prepare.mp3'),
  'click:squeeze': require('../assets/sounds/click/squeeze.mp3'),
  'click:rest': require('../assets/sounds/click/rest.mp3'),
  'click:quickSqueeze': require('../assets/sounds/click/quickSqueeze.mp3'),
  'click:complete': require('../assets/sounds/click/complete.mp3'),
};

const ROLE_VOLUME: Record<CueRole, number> = {
  prepare: 0.85,
  squeeze: 0.85,
  rest: 0.85,
  quickSqueeze: 0.7,
  complete: 0.9,
};

let ready: Promise<void> | null = null;
const players: Partial<Record<CueKey, AudioPlayer>> = {};

async function ensureReady() {
  if (!ready) {
    ready = (async () => {
      await setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: false,
        interruptionMode: 'mixWithOthers',
      });

      (Object.keys(SOURCES) as CueKey[]).forEach((key) => {
        const role = key.split(':')[1] as CueRole;
        const player = createAudioPlayer(SOURCES[key]);
        player.volume = ROLE_VOLUME[role];
        players[key] = player;
      });
    })().catch((error) => {
      ready = null;
      throw error;
    });
  }

  return ready;
}

/** Soft session cues. Failures are ignored so practice can continue without audio. */
export async function playCue(pack: SoundPackId, role: CueRole) {
  try {
    await ensureReady();
    const key: CueKey = `${pack}:${role}`;
    const player = players[key];
    if (!player) return;
    await player.seekTo(0);
    player.play();
  } catch {
    // Web autoplay policy / missing native module — never block the session.
  }
}

/**
 * Pick the cue role for a session step.
 * Slow holds: squeeze + rest tones. Quick reps: squeeze tick only (no rest),
 * so rapid cycles stay easy to follow without constant chirping.
 */
export function cueRoleForStep(step: Pick<SessionStep, 'phase' | 'kind'>): CueRole | null {
  if (step.phase === 'prepare') return 'prepare';

  if (step.kind === 'quick') {
    return step.phase === 'squeeze' ? 'quickSqueeze' : null;
  }

  if (step.phase === 'squeeze') return 'squeeze';
  if (step.phase === 'rest') return 'rest';
  return null;
}

export function playStepCue(pack: SoundPackId, step: Pick<SessionStep, 'phase' | 'kind'>) {
  const role = cueRoleForStep(step);
  if (role) void playCue(pack, role);
}

/** Preview the pack’s squeeze tone when choosing a sound style in Settings. */
export function previewSoundPack(pack: SoundPackId) {
  void playCue(pack, 'squeeze');
}
