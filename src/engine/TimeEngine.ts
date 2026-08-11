export const DEADLINE_HOURS = 120;
export const INVESTIGATION_COSTS = [2, 3, 4] as const;

export const investigationCost = (investigationsThisVisit: number): number => INVESTIGATION_COSTS[Math.min(investigationsThisVisit, 2)]!;
export const advanceTime = (elapsedHours: number, hours: number): { elapsedHours: number; expired: boolean } => {
  const next = elapsedHours + hours;
  return { elapsedHours: next, expired: next >= DEADLINE_HOURS };
};

export const displayCaseTime = (elapsedHours: number): string => {
  const weekdays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const total = 9 + elapsedHours;
  const day = Math.floor(total / 24);
  const hour = total % 24;
  return `${weekdays[day % weekdays.length]}, ${String(hour).padStart(2, '0')}:00`;
};

