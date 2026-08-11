import { Ionicons } from '@expo/vector-icons';

type Props = {
  name: 'home' | 'stats' | 'book' | 'settings' | 'play' | 'back';
  color: string | { toString(): string };
  size?: number;
};

const ionNames = {
  home: 'home',
  stats: 'stats-chart',
  book: 'book',
  settings: 'settings',
  play: 'play',
  back: 'chevron-back',
} as const;

export function TabIcon({ name, color, size = 24 }: Props) {
  return <Ionicons name={ionNames[name]} size={size} color={String(color)} />;
}
