import { Button } from "@/modules/ui/button";
import { useRouter } from "@tanstack/react-router";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/modules/ui/chart";
const chartData = [
  { month: "January", amount: 186 },
  { month: "February", amount: 305 },
  { month: "March", amount: 237 },
  { month: "April", amount: 73 },
  { month: "May", amount: 209 },
  { month: "June", amount: 214 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "rgb(55 19 127)",
  },
} satisfies ChartConfig;

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

export const TicketRevenueChart = () => {
  const { navigate } = useRouter();
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
