import type { TFunction } from 'i18next';

import {
  displayBlockLabel,
  ExerciseBlock,
  ExercisePhase,
  ExercisePlan,
  planBreakSeconds,
} from '@/constants/plans';

export type SessionStep = {
  blockId: string;
  blockLabel: string;
  kind: ExerciseBlock['kind'];
  phase: Exclude<ExercisePhase, 'done'>;
  seconds: number;
  repIndex: number;
  repTotal: number;
  cue: string;
};

export function buildSessionSteps(plan: ExercisePlan, t: TFunction): SessionStep[] {
  const steps: SessionStep[] = [
    {
      blockId: 'prepare',
      blockLabel: t('exercise.prepare'),
      kind: 'slow',
      phase: 'prepare',
      seconds: 3,
      repIndex: 0,
      repTotal: 0,
      cue: t('exercise.cuePrepare'),
    },
  ];

  let slowDone = false;
  const breakSeconds = planBreakSeconds(plan);

  for (const block of plan.blocks) {
    if (block.repetitions <= 0) continue;

    if (block.kind === 'quick' && slowDone) {
      if (breakSeconds > 0) {
        steps.push({
          blockId: 'bridge',
          blockLabel: t('exercise.bridge'),
          kind: 'slow',
          phase: 'bridge',
          seconds: breakSeconds,
          repIndex: 0,
          repTotal: 0,
          cue: t('exercise.cueBridge'),
        });
      }
      slowDone = false;
    }

    const blockLabel = displayBlockLabel(block, t);
    for (let rep = 1; rep <= block.repetitions; rep += 1) {
      steps.push({
        blockId: block.id,
        blockLabel,
        kind: block.kind,
        phase: 'squeeze',
        seconds: block.squeezeSeconds,
        repIndex: rep,
        repTotal: block.repetitions,
        cue:
          block.kind === 'slow' ? t('exercise.cueSlowSqueeze') : t('exercise.cueQuickSqueeze'),
      });
      steps.push({
        blockId: block.id,
        blockLabel,
        kind: block.kind,
        phase: 'rest',
        seconds: Math.max(1, block.restSeconds),
        repIndex: rep,
        repTotal: block.repetitions,
        cue: t('exercise.cueRest'),
      });
    }

    if (block.kind === 'slow') slowDone = true;
  }

  return steps;
}
