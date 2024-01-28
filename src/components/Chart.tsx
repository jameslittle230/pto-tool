import { addDays, format } from "date-fns";
import { useMemo } from "react";
import { AxisOptions, Chart as ReactChart } from "react-charts";
import { cx } from "react-twc";

type BalanceDay = {
  date: Date;
  amount: number;
};

export const Chart = ({
  balances,
  checkpointDate,
  lookaheadDays,
}: {
  balances: BalanceDay[];
  checkpointDate: Date;
  lookaheadDays: number;
}) => {
  const primaryAxis = useMemo(
    (): AxisOptions<BalanceDay> => ({
      getValue: (datum) => datum.date,
      scaleType: "time",
      min: checkpointDate,
      max: addDays(checkpointDate, lookaheadDays),
    }),
    [checkpointDate, lookaheadDays]
  );

  const secondaryAxes = useMemo(
    (): AxisOptions<BalanceDay>[] => [
      {
        getValue: (datum) => datum.amount,
        min: -5,
        max: 35,
      },
    ],
    []
  );
  return (
    <div className="w-full h-full">
      <ReactChart
        options={{
          data: [{ label: "", data: balances }],
          primaryAxis,
          secondaryAxes,
          primaryCursor: false,
          secondaryCursor: false,
          tooltip: {
            groupingMode: "primary",
            render: ({ focusedDatum }) => {
              const date = focusedDatum?.primaryValue as Date;
              const balance = focusedDatum?.secondaryValue as number;
              if (!date || !balance) return null;
              return (
                <div
                  className={cx("py-1 px-2 rounded-md shadow-md", {
                    "bg-red-200": balance < 10,
                    "bg-yellow-200": balance < 20 && balance >= 10,
                    "bg-green-200": balance >= 20,
                  })}
                >
                  <div className="text-sm">{format(date, "PPP")}</div>
                  <div className="text-md font-bold">{balance.toFixed(2)}</div>
                </div>
              );
            },
          },
        }}
      />
    </div>
  );
};
