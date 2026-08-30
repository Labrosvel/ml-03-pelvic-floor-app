import type { TFunction } from 'i18next';

import { DEFAULT_PHYSIO_NOTIFY_EMAIL } from '@/constants/notifications';
import { AppLanguage, isAppLanguage } from '@/i18n/types';
import { isSoundPackId, type SoundPackId } from '@/constants/sounds';

export type ExercisePhase = 'prepare' | 'squeeze' | 'rest' | 'done';

export type ExerciseBlock = {
  id: string;
  label: string;
  kind: 'slow' | 'quick';
  squeezeSeconds: number;
  restSeconds: number;
  repetitions: number;
};

export type ExercisePlan = {
  id: string;
  name: string;
  sessionsPerDay: number;
  blocks: ExerciseBlock[];
  notes?: string;
};

export type CompletedSession = {
  id: string;
  planId: string;
  completedAt: string;
  durationSeconds: number;
  completedReps: number;
  targetReps: number;
};

export type ReminderSettings = {
  enabled: boolean;
  times: string[]; // HH:mm
};

export type AppSettings = {
  clinicName: string;
  displayName: string;
  physioNotifyEmail: string;
  hapticsEnabled: boolean;
  soundEnabled: boolean;
  soundPack: SoundPackId;
  onboardingComplete: boolean;
  language: AppLanguage;
  reminders: ReminderSettings;
};

export const DEFAULT_PLAN_ID = 'default-nice-aligned';

const STOCK_PLAN_NAMES = new Set(['Starter plan', 'Αρχικό πρόγραμμα']);
const STOCK_SLOW_LABELS = new Set(['Slow squeezes', 'Αργές συσφίξεις']);
const STOCK_QUICK_LABELS = new Set(['Quick squeezes', 'Γρήγορες συσφίξεις']);

export const DEFAULT_PLAN: ExercisePlan = {
  id: DEFAULT_PLAN_ID,
  name: 'Starter plan',
  sessionsPerDay: 3,
  notes:
    'A gentle starter routine. Your physiotherapist can adjust squeeze time, rest, and repetitions.',
  blocks: [
    {
      id: 'slow',
      label: 'Slow squeezes',
      kind: 'slow',
      squeezeSeconds: 8,
      restSeconds: 8,
      repetitions: 8,
    },
    {
      id: 'quick',
      label: 'Quick squeezes',
      kind: 'quick',
      squeezeSeconds: 1,
      restSeconds: 1,
      repetitions: 10,
    },
  ],
};

export function createDefaultPlan(t: TFunction): ExercisePlan {
  return {
    id: DEFAULT_PLAN_ID,
    name: t('plan.defaultName'),
    sessionsPerDay: 3,
    notes: t('plan.defaultNotes'),
    blocks: [
      {
        id: 'slow',
        label: t('plan.slowSqueezes'),
        kind: 'slow',
        squeezeSeconds: 8,
        restSeconds: 8,
        repetitions: 8,
      },
      {
        id: 'quick',
        label: t('plan.quickSqueezes'),
        kind: 'quick',
        squeezeSeconds: 1,
        restSeconds: 1,
        repetitions: 10,
      },
    ],
  };
}

/** Prefer translated labels for the stock starter plan; keep custom names as-is. */
export function displayPlanName(plan: ExercisePlan, t: TFunction): string {
  if (plan.id === DEFAULT_PLAN_ID && STOCK_PLAN_NAMES.has(plan.name)) {
    return t('plan.defaultName');
  }
  return plan.name;
}

export function displayBlockLabel(block: ExerciseBlock, t: TFunction): string {
  if (block.kind === 'slow' && (STOCK_SLOW_LABELS.has(block.label) || block.id === 'slow')) {
    return t('plan.slowSqueezes');
  }
  if (block.kind === 'quick' && (STOCK_QUICK_LABELS.has(block.label) || block.id === 'quick')) {
    return t('plan.quickSqueezes');
  }
  return block.label;
}

export const DEFAULT_SETTINGS: AppSettings = {
  clinicName: 'Physiospecialists',
  displayName: '',
  physioNotifyEmail: DEFAULT_PHYSIO_NOTIFY_EMAIL,
  hapticsEnabled: true,
  soundEnabled: true,
  soundPack: 'gentle',
  onboardingComplete: false,
  language: 'system',
  reminders: {
    enabled: false,
    times: ['09:00', '13:00', '20:00'],
  },
};

export function normalizeSettings(raw: Partial<AppSettings> | null | undefined): AppSettings {
  return {
    ...DEFAULT_SETTINGS,
    ...raw,
    physioNotifyEmail:
      typeof raw?.physioNotifyEmail === 'string' ? raw.physioNotifyEmail : DEFAULT_SETTINGS.physioNotifyEmail,
    language: isAppLanguage(raw?.language) ? raw.language : DEFAULT_SETTINGS.language,
    soundPack: isSoundPackId(raw?.soundPack) ? raw.soundPack : DEFAULT_SETTINGS.soundPack,
    reminders: {
      ...DEFAULT_SETTINGS.reminders,
      ...raw?.reminders,
      times: raw?.reminders?.times?.length ? raw.reminders.times : DEFAULT_SETTINGS.reminders.times,
    },
  };
}

export function totalTargetReps(plan: ExercisePlan): number {
  return plan.blocks.reduce((sum, block) => sum + block.repetitions, 0);
}

export function estimateSessionSeconds(plan: ExercisePlan): number {
  const prepare = 3;
  return plan.blocks.reduce((sum, block) => {
    const cycle = block.squeezeSeconds + block.restSeconds;
    return sum + block.repetitions * cycle;
  }, prepare);
}
