import { addDays } from "date-fns";
import { range } from "lodash";

export const makeAggregationDays = (
  lookaheadDays: number,
  daysPerAggregationPeriod: number,
  checkpointDate: Date
): Date[] =>
  range(lookaheadDays)
    .flatMap((dayOffset) => {
      const isAggregationDay =
        dayOffset % daysPerAggregationPeriod === 0 && dayOffset != 0;

      return isAggregationDay ? addDays(checkpointDate, dayOffset) : null;
    })
    .filter((day) => day !== null) as Date[];
