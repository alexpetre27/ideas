"use client";

import { useState, useMemo } from "react";
import { Pie, PieChart, Cell, Sector } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ChartContainer, ChartConfig, ChartTotal } from "@/components/ui/chart";
import { useTransactions } from "@/components/TransactionBar/TransactionsProvider";

interface PieChartDataItem {
  name: string;
  value: number;
}

interface ChartPieLabelProps {
  data: PieChartDataItem[];
}

const COLOR_PALETTE = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export function ChartPieLabel({ data }: ChartPieLabelProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const { setCategory, setQuery } = useTransactions();

  const chartConfig: ChartConfig = useMemo(() => {
    const config: ChartConfig = {};
    data.forEach((item, index) => {
      config[item.name] = {
        label: item.name,
        color: COLOR_PALETTE[index % COLOR_PALETTE.length],
      };
    });
    return config;
  }, [data]);

  const totalValue = useMemo(
    () => data.reduce((sum, item) => sum + item.value, 0),
    [data]
  );

  const renderActiveShape = (props: any) => {
    const { outerRadius } = props;

    return (
      <Sector
        {...props}
        outerRadius={outerRadius + 8}
        stroke="var(--foreground)"
        strokeWidth={2}
        style={{
          filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.25))",
        }}
      />
    );
  };

  const activeData = hoverIndex !== null ? data[hoverIndex] : null;
  const activeLabel = activeData
    ? chartConfig[activeData.name as keyof typeof chartConfig]?.label ||
      activeData.name
    : "";

  const handleSliceClick = (data: any) => {
    setQuery("");
    setCategory(data.name);
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Total Cheltuieli pe Categorii</CardTitle>
        <CardDescription>Vizualizare buget curent</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <div className="relative mx-auto aspect-square max-h-80">
          <ChartContainer config={chartConfig} className="absolute inset-0">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={90}
                outerRadius={130}
                activeIndex={hoverIndex ?? undefined}
                activeShape={renderActiveShape}
                onMouseEnter={(_, index) => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
                onClick={handleSliceClick}
                isAnimationActive
                animationDuration={500}
                animationEasing="ease-out"
                style={{ cursor: "pointer" }}
                minAngle={3}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={
                      chartConfig[entry.name as keyof typeof chartConfig]
                        ?.color || COLOR_PALETTE[index % COLOR_PALETTE.length]
                    }
                    style={{
                      transition: "fill 0.4s ease, transform 0.3s ease",
                    }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>

          <ChartTotal>
            <div
              className={`flex flex-col items-center justify-center transform transition-all duration-300 ease-out ${
                activeData ? "scale-105 opacity-100" : "scale-100 opacity-90"
              }`}
            >
              {activeData ? (
                <>
                  <span className="text-lg font-bold tabular-nums">
                    {formatCurrency(activeData.value)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {activeLabel}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-lg font-bold tabular-nums">
                    {formatCurrency(totalValue)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Total Cheltuieli
                  </span>
                </>
              )}
            </div>
          </ChartTotal>
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm text-center">
        <div className="flex items-center justify-center gap-2 font-medium leading-none">
          Ai cheltuit{" "}
          <span className="font-bold text-foreground">
            {formatCurrency(totalValue)}
          </span>
        </div>
        <div className="text-muted-foreground leading-none">
          Afișează cheltuielile totale agregate pe categorie
        </div>
      </CardFooter>
    </Card>
  );
}
