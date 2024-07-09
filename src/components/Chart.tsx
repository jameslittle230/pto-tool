import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DateBalance } from "@/lib/makeBalances";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useMemo } from "react";

const chartConfig = {
  desktop: {
    label: "PTO (days)",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export const Chart = ({ balances }: { balances: DateBalance[] }) => {
  const modifiedBalances = useMemo(
    () =>
      balances.map(b => ({
        ...b,
        date: b.date.toLocaleDateString(undefined, {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      })),
    [balances]
  );
  return (
    <ChartContainer className="w-full min-h-48" config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={modifiedBalances}
        margin={{
          left: 12,
          right: 12,
        }}>
        <defs>
          <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-desktop)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-desktop)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={true} />
        <XAxis
          dataKey="date"
          tickFormatter={value => value.slice(5)}
          interval={30}
          tickLine={true}
          tickMargin={12}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Area
          animationDuration={0}
          dataKey="amount"
          type="step"
          fill="url(#fillDesktop)"
          fillOpacity={0.4}
          stroke="var(--color-desktop)"
        />
      </AreaChart>
    </ChartContainer>
  );
};
