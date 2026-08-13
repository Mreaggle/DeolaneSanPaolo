import type { HourBoundaryEvent, TimeAdvance } from './types';

export const CASE_START_HOUR = 7;
export const DEADLINE_HOURS = 154;
export const SLEEP_START_HOUR = 0;
export const SLEEP_END_HOUR = 9;
export const FIRST_ACTION_ELAPSED_HOURS = SLEEP_END_HOUR - CASE_START_HOUR;
export const INVESTIGATION_COSTS = [2, 3, 4] as const;
export const REVIEW_COST = 2;

export const investigationCost = (investigationsThisVisit: number): number => INVESTIGATION_COSTS[Math.min(investigationsThisVisit, 2)]!;

export const hourOfDay = (elapsedHours: number): number => (CASE_START_HOUR + elapsedHours) % 24;

export const isSleeping = (elapsedHours: number): boolean => {
  const hour = hourOfDay(elapsedHours);
  return hour >= SLEEP_START_HOUR && hour < SLEEP_END_HOUR;
};

export interface TimeAdvanceResult extends TimeAdvance {
  expired: boolean;
}

export const advanceTime = (elapsedHours: number, actionHours: number, deadlineHours = DEADLINE_HOURS): TimeAdvanceResult => {
  if (isSleeping(elapsedHours)) throw new Error('CHARACTER_SLEEPING');
  if (!Number.isInteger(actionHours) || actionHours < 0) throw new Error('INVALID_TIME_COST');

  const hourBoundaries: HourBoundaryEvent[] = [];
  let current = elapsedHours;
  let remainingActionHours = actionHours;
  const advanceOneHour = (phase: HourBoundaryEvent['phase']): boolean => {
    current += 1;
    hourBoundaries.push({ elapsedHours: current, phase });
    return current >= deadlineHours;
  };

  while (remainingActionHours > 0) {
    remainingActionHours -= 1;
    if (advanceOneHour('ACTION')) {
      return { fromElapsedHours: elapsedHours, elapsedHours: current, hourBoundaries, expired: true };
    }
    if (hourOfDay(current) === SLEEP_START_HOUR) {
      while (hourOfDay(current) !== SLEEP_END_HOUR) {
        if (advanceOneHour('SLEEP')) {
          return { fromElapsedHours: elapsedHours, elapsedHours: current, hourBoundaries, expired: true };
        }
      }
    }
  }

  return { fromElapsedHours: elapsedHours, elapsedHours: current, hourBoundaries, expired: current >= deadlineHours };
};

export const displayCaseTime = (elapsedHours: number): string => {
  const weekdays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const total = CASE_START_HOUR + elapsedHours;
  const day = Math.floor(total / 24);
  const hour = total % 24;
  return `${weekdays[day % weekdays.length]}, ${String(hour).padStart(2, '0')}:00`;
};
