import { ExerciseBlock, ExercisePhase, ExercisePlan } from '@/constants/plans';

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

export function buildSessionSteps(plan: ExercisePlan): SessionStep[] {
  const steps: SessionStep[] = [
    {
      blockId: 'prepare',
      blockLabel: 'Prepare',
      kind: 'slow',
      phase: 'prepare',
      seconds: 3,
      repIndex: 0,
      repTotal: 0,
      cue: 'Find a comfortable position. Soften your shoulders and breathe normally.',
    },
  ];

  for (const block of plan.blocks) {
    for (let rep = 1; rep <= block.repetitions; rep += 1) {
      steps.push({
        blockId: block.id,
        blockLabel: block.label,
        kind: block.kind,
        phase: 'squeeze',
        seconds: block.squeezeSeconds,
        repIndex: rep,
        repTotal: block.repetitions,
        cue:
          block.kind === 'slow'
            ? 'Lift and close gently upward. Keep breathing.'
            : 'Quick lift and close — then let go fully.',
      });
      steps.push({
        blockId: block.id,
        blockLabel: block.label,
        kind: block.kind,
        phase: 'rest',
        seconds: Math.max(1, block.restSeconds),
        repIndex: rep,
        repTotal: block.repetitions,
        cue: 'Fully release. Soften the pelvic floor and wait for the next cue.',
      });
    }
  }

  return steps;
}
