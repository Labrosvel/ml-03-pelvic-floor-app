import { parseTime } from '@/lib/reminders';

export type HomePracticeStatus =
  | { kind: 'complete' }
  | { kind: 'reminders-off' }
  | { kind: 'scheduled'; time: string }
  | { kind: 'unscheduled' };

function padTimePart(value: number): string {
  return String(value).padStart(2, '0');
}

function formatClock(hour: number, minute: number): string {
  return `${padTimePart(hour)}:${padTimePart(minute)}`;
}

/**
 * What Home should say about the next practice time.
 * Uses configured clock times only — does not claim a notification will fire.
 */
export function getHomePracticeStatus({
  sessionsToday,
  sessionsPerDay,
  remindersEnabled,
  times,
  now = new Date(),
}: {
  sessionsToday: number;
  sessionsPerDay: number;
  remindersEnabled: boolean;
  times: readonly string[];
  now?: Date;
}): HomePracticeStatus {
  const required = Math.max(0, Math.floor(Number(sessionsPerDay)) || 0);
  const done = Math.max(0, Math.floor(Number(sessionsToday)) || 0);

  if (done >= required) {
    return { kind: 'complete' };
  }

  if (!remindersEnabled) {
    return { kind: 'reminders-off' };
  }

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  let nextMinutes = Number.POSITIVE_INFINITY;
  let nextLabel: string | null = null;

  for (const time of times) {
    const parsed = parseTime(time);
    if (!parsed) continue;
    const minutes = parsed.hour * 60 + parsed.minute;
    if (minutes < nowMinutes) continue;
    if (minutes < nextMinutes) {
      nextMinutes = minutes;
      nextLabel = formatClock(parsed.hour, parsed.minute);
    }
  }

  if (nextLabel) {
    return { kind: 'scheduled', time: nextLabel };
  }

  return { kind: 'unscheduled' };
}
