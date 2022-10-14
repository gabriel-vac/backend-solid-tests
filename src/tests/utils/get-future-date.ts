import { setYear, parseISO } from 'date-fns';

/**
 * Receives "2022-08-20" and returns "2023-8-10"
 */
export function getFutureDate(date: string): Date {
  //parseISO convert data em string para objeto date
  return setYear(parseISO(date), new Date().getFullYear() + 1);
}
