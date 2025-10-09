"use client";

import { useState, useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { Pie, PieChart, Cell, Sector, PieActiveShapeProps } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ChartContainer, ChartConfig, ChartTotal } from "@/components/ui/chart";

const chartData = [
  { browser: "Chrome", visitors: 275 },
  { browser: "Safari", visitors: 200 },
  { browser: "Firefox", visitors: 187 },
  { browser: "Edge", visitors: 173 },
  { browser: "Other", visitors: 90 },
];

const chartConfig: ChartConfig = {
  Chrome: { label: "Chrome", color: "var(--chart-1)" },
  Safari: { label: "Safari", color: "var(--chart-2)" },
  Firefox: { label: "Firefox", color: "var(--chart-3)" },
  Edge: { label: "Edge", color: "var(--chart-4)" },
  Other: { label: "Other", color: "var(--chart-5)" },
};
export function ChartPieLabel() {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const totalVisitors = useMemo(
    () => chartData.reduce((sum, item) => sum + item.visitors, 0),
    []
  );

  const renderActiveShape = (props: PieActiveShapeProps) => {
    const isHover = props.index === hoverIndex;
    const offset = isHover ? 8 : 0;

    return (
      <Sector
        {...props}
        outerRadius={(props.outerRadius ?? 0) + offset}
        stroke="var(--color-foreground)"
        strokeWidth={isHover ? 3 : 1}
        style={{
          transformOrigin: "center",
          transformBox: "fill-box",
          transition: "all 0.4s ease-in",
          transform: isHover ? "scale(1.05)" : "scale(1)",
          filter: isHover
            ? "drop-shadow(0 2px 6px rgba(0,0,0,0.25))"
            : "drop-shadow(0 0 0 rgba(0,0,0,0))",
        }}
      />
    );
  };
  const activeData = hoverIndex !== null ? chartData[hoverIndex] : null;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Budget Tracker</CardTitle>
        <CardDescription>January – June 2024</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[260px]"
        >
          <PieChart>
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={70}
              outerRadius={100}
              activeIndex={hoverIndex ?? undefined}
              activeShape={renderActiveShape}
              onMouseEnter={(_, index) => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
              isAnimationActive
              animationDuration={500}
              animationEasing="ease-out"
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.browser}
                  fill={
                    chartConfig[entry.browser as keyof typeof chartConfig]
                      ?.color || "var(--color-foreground)"
                  }
                  style={{
                    transition: "fill 0.4s ease, transform 0.3s ease",
                  }}
                />
              ))}
            </Pie>
          </PieChart>
          <ChartTotal>
            <div
              className={`flex flex-col items-center justify-center transform transition-all duration-300 ease-out ${
                activeData ? "scale-105 opacity-100" : "scale-100 opacity-90"
              }`}
            >
              {activeData ? (
                <>
                  <span className="text-sm text-muted-foreground">
                    {activeData.browser}
                  </span>
                  <span className="text-2xl font-bold tabular-nums">
                    {activeData.visitors.toLocaleString()}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-2xl font-bold tabular-nums">
                    {totalVisitors.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Total Visitors
                  </span>
                </>
              )}
            </div>
          </ChartTotal>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm text-center">
        <div className="flex items-center justify-center gap-2 font-medium leading-none">
          You spent <span className="font-bold text-foreground">x money</span>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
