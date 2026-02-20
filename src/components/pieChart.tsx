"use client";

import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../components/ui/chart";

export const description = "A donut chart";

const chartData = [
  { budget: "Entertainment", allocatedMoney: 50, fill: "var(--color-green)" },
  { budget: "Bills", allocatedMoney: 750, fill: "var(--color-cyan)" },
  {
    budget: "Dining Out",
    allocatedMoney: 75,
    fill: "var(--color-yellow)",
  },
  {
    budget: "Personal Care",
    allocatedMoney: 100,
    fill: "var(--color-grey-500)",
  },
];

const chartConfig = {
  allocatedMoney: {
    label: "Allocated Money",
  },
  Entertainment: {
    label: "Entertainment",
    color: "var(--color-green)",
  },
  Bills: {
    label: "Bills",
    color: "var(--color-cyan)",
  },
  "Dining Out": {
    label: "Dining Out",
    color: "var(--color-yellow)",
  },
  "Personal Care": {
    label: "Personal Care",
    color: "var(--color-grey-500)",
  },
} satisfies ChartConfig;

export function ChartPieDonut() {
  return (
    <Card className="flex flex-col w-80 ">
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-80 w-full max-h-none"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="allocatedMoney"
              nameKey="budget"
              innerRadius={95}
              outerRadius={140}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {"$338"}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          of $975 limit
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
