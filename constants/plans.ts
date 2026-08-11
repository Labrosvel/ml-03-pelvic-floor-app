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
  hapticsEnabled: boolean;
  soundEnabled: boolean;
  onboardingComplete: boolean;
  reminders: ReminderSettings;
};

export const DEFAULT_PLAN: ExercisePlan = {
  id: 'default-nice-aligned',
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

export const DEFAULT_SETTINGS: AppSettings = {
  clinicName: 'Clinic practice',
  displayName: '',
  hapticsEnabled: true,
  soundEnabled: true,
  onboardingComplete: false,
  reminders: {
    enabled: false,
    times: ['09:00', '13:00', '20:00'],
  },
};

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
