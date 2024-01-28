import { addDays } from "date-fns";
import { range } from "lodash";
import { dateToShortString } from "./utils";

export type Delta = {
  date: Date;
  delta: number;
};

export const makeDeltas = (
  lookaheadDays: number,
  checkpointDate: Date,
  vacationDays: Date[],
  aggregationDays: Date[],
  aggregationAmount: number
) =>
  range(lookaheadDays).map((dayOffset) => {
    const date = addDays(checkpointDate, dayOffset);
    const dateValue = dateToShortString(date);

    const isAggregationDay = aggregationDays
      .map(dateToShortString)
      .includes(dateValue);
    const isDayOff = vacationDays.map(dateToShortString).includes(dateValue);

    let delta = 0;
    if (isAggregationDay) delta += aggregationAmount;
    if (isDayOff) delta -= 1;

    return { date, delta };
  });
