import { type ClassValue, clsx } from "clsx";
import { format, setDay, startOfMonth } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const dateToShortString = (date: Date) => {
  return format(date, "yyyyMMdd");
};

export const firstFridayOfMonth = (date: Date) => {
  const firstDayOfMonth = startOfMonth(date);
  return setDay(firstDayOfMonth, 5);
};
