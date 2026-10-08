export type SoundPackId = 'gentle' | 'chime' | 'click' | 'interface';

export const SOUND_PACKS: readonly SoundPackId[] = ['gentle', 'chime', 'click', 'interface'] as const;

export function isSoundPackId(value: unknown): value is SoundPackId {
  return (
    value === 'gentle' || value === 'chime' || value === 'click' || value === 'interface'
  );
}
