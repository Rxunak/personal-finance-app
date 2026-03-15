"use client";

import { Label, Pie, PieChart } from "recharts";

import { Card, CardContent } from "../components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../components/ui/chart";

export const description = "A donut chart";

export type PieChartBudgetItem = {
  budget: string;
  allocatedMoney: number;
  fill: string;
};

type ChartPieDonutProps = {
  data?: PieChartBudgetItem[];
  total?: number;
};

export function ChartPieDonut({ data = [], total = 0 }: ChartPieDonutProps) {
  const chartConfig = {
    allocatedMoney: {
      label: "Allocated Money",
    },
    ...Object.fromEntries(
      data.map((item) => [
        item.budget,
        { label: item.budget, color: item.fill },
      ]),
    ),
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col w-60 h-full ">
      <CardContent className="flex-1 pb-0 h-full">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-full w-full"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="allocatedMoney"
              nameKey="budget"
              innerRadius={70}
              outerRadius={110}
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
                          {total.toLocaleString("en-GB", {
                            style: "currency",
                            currency: "GBP",
                          })}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {`of ${total.toLocaleString("en-GB", {
                            style: "currency",
                            currency: "GBP",
                          })} limit`}
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
