export type SoundPackId = 'gentle' | 'chime' | 'interface';

export const SOUND_PACKS: readonly SoundPackId[] = ['gentle', 'chime', 'interface'] as const;

export function isSoundPackId(value: unknown): value is SoundPackId {
  return value === 'gentle' || value === 'chime' || value === 'interface';
}
