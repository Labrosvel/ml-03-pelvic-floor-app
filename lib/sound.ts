import {
  createAudioPlayer,
  setAudioModeAsync,
  type AudioPlayer,
  type AudioSource,
} from 'expo-audio';

import type { SessionStep } from '@/lib/session';

export type CueSound =
  | 'prepare'
  | 'squeeze'
  | 'rest'
  | 'quickSqueeze'
  | 'quickRest'
  | 'complete';

const SOURCES: Record<CueSound, AudioSource> = {
  prepare: require('../assets/sounds/prepare.mp3'),
  squeeze: require('../assets/sounds/squeeze.mp3'),
  rest: require('../assets/sounds/rest.mp3'),
  quickSqueeze: require('../assets/sounds/quick-squeeze.mp3'),
  quickRest: require('../assets/sounds/quick-rest.mp3'),
  complete: require('../assets/sounds/complete.mp3'),
};

/** Slightly quieter ticks so rapid quick-reps stay comfortable. */
const VOLUMES: Record<CueSound, number> = {
  prepare: 0.85,
  squeeze: 0.85,
  rest: 0.85,
  quickSqueeze: 0.7,
  quickRest: 0.55,
  complete: 0.9,
};

let ready: Promise<void> | null = null;
const players: Partial<Record<CueSound, AudioPlayer>> = {};

async function ensureReady() {
  if (!ready) {
    ready = (async () => {
      await setAudioModeAsync({
        playsInSilentMode: true,
        shouldPlayInBackground: false,
        interruptionMode: 'mixWithOthers',
      });

      (Object.keys(SOURCES) as CueSound[]).forEach((name) => {
        const player = createAudioPlayer(SOURCES[name]);
        player.volume = VOLUMES[name];
        players[name] = player;
      });
    })().catch((error) => {
      ready = null;
      throw error;
    });
  }

  return ready;
}

/** Soft session cues. Failures are ignored so practice can continue without audio. */
export async function playCue(name: CueSound) {
  try {
    await ensureReady();
    const player = players[name];
    if (!player) return;
    await player.seekTo(0);
    player.play();
  } catch {
    // Web autoplay policy / missing native module — never block the session.
  }
}

/**
 * Pick the right cue for a session step.
 * Slow holds use short melodic tones; quick reps use metronome-style ticks
 * so 1s phases stay clear without overlapping audio.
 */
export function cueForStep(step: Pick<SessionStep, 'phase' | 'kind'>): CueSound | null {
  if (step.phase === 'prepare') return 'prepare';

  if (step.kind === 'quick') {
    if (step.phase === 'squeeze') return 'quickSqueeze';
    if (step.phase === 'rest') return 'quickRest';
    return null;
  }

  if (step.phase === 'squeeze') return 'squeeze';
  if (step.phase === 'rest') return 'rest';
  return null;
}

export function playStepCue(step: Pick<SessionStep, 'phase' | 'kind'>) {
  const cue = cueForStep(step);
  if (cue) void playCue(cue);
}
