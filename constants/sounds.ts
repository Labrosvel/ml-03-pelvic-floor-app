export type SoundPackId = 'gentle' | 'chime' | 'click';

export const SOUND_PACKS: readonly SoundPackId[] = ['gentle', 'chime', 'click'] as const;

export function isSoundPackId(value: unknown): value is SoundPackId {
  return value === 'gentle' || value === 'chime' || value === 'click';
}
