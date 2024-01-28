import { useState } from "react";
import { dateToShortString } from "./utils";

export const useDateSet = (input = []) => {
  const [days, rawSetDays] = useState<Map<string, Date>>(new Map(input));
  const [, setLastMapUpdateTime] = useState(Date.now());

  const toggleVacationDay = (day: Date) => {
    const dateValue = dateToShortString(day);
    if (days.has(dateValue)) {
      days.delete(dateValue);
      setLastMapUpdateTime(Date.now());
    } else {
      days.set(dateValue, day);
      setLastMapUpdateTime(Date.now());
    }
  };

  const setVacationDays = (days: Date[] | string[]) => {
    const newVacationDays = new Map(
      days.map((day) => [dateToShortString(new Date(day)), new Date(day)])
    );
    rawSetDays(newVacationDays);
    setLastMapUpdateTime(Date.now());
  };

  return [
    Array.from(days.values()),
    toggleVacationDay,
    setVacationDays,
  ] as const;
};
