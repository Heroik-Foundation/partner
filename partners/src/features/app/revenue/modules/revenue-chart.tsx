import { Button } from "@/modules/ui/button";
import { useRouter } from "@tanstack/react-router";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/modules/ui/chart";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "rgb(55 19 127)",
  },
} satisfies ChartConfig;

type MonthlyData = {
  month: string;
  amount: number;
  count: number;
};

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { useTicketSalesStatsQuery } from "../hooks/query";
import { formatMonth } from "@/helpers/time";

export const TicketRevenueChart = () => {
  const { navigate } = useRouter();
  const { data } = useTicketSalesStatsQuery();
  const stats: MonthlyData[] = data || [];

  const chartData = stats
    .map((item) => {
      return {
        month: formatMonth(item.month),
        amount: Number(item.amount),
      };
    })
    .sort((a, b) => new Date(b.month).getTime() - new Date(a.month).getTime()) // Sort descending
    .slice(0, 6);

  return (
    <div className="w-full space-y-5 flex items-center justify-center flex-col">
      <Button
        className="w-full text-sm font-semibold"
        onClick={() => {
          navigate({
            to: "/app/revenue/history",
          });
        }}
        size="lg"
      >
        Transaction History
      </Button>

      <span className="mx-auto text-sm font-bold text-primary w-fit bg-primary/10 rounded-full py-2.5 px-5">
        Ticket Revenue
      </span>

      <div className="shadow w-full p-5 rounded-xl">
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="amount" fill="var(--color-desktop)" radius={8} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
};
