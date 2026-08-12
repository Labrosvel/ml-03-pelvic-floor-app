import {
  createAudioPlayer,
  setAudioModeAsync,
  type AudioPlayer,
  type AudioSource,
} from 'expo-audio';

export type CueSound = 'prepare' | 'squeeze' | 'rest' | 'complete';

const SOURCES: Record<CueSound, AudioSource> = {
  prepare: require('../assets/sounds/prepare.mp3'),
  squeeze: require('../assets/sounds/squeeze.mp3'),
  rest: require('../assets/sounds/rest.mp3'),
  complete: require('../assets/sounds/complete.mp3'),
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
        player.volume = 0.85;
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
 * Skip per-phase cues on very short holds (e.g. 1s quick squeezes) so sound
 * stays helpful instead of chirping every second.
 */
export function shouldPlayPhaseCue(seconds: number) {
  return seconds >= 2;
}
