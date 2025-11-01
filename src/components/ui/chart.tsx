
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";

export const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [key: string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
    color?: string;
    theme?: Record<keyof typeof THEMES, string>;
  };
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

export function useChart(): ChartContextProps {
  const ctx = React.useContext(ChartContext);
  if (!ctx) throw new Error("useChart must be used within <ChartContainer />");
  return ctx;
}

export function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  config: ChartConfig;
  children: React.ReactElement;
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        className={cn("relative flex justify-center text-xs", className)}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <ResponsiveContainer>{children}</ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

export function ChartTotal({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "absolute inset-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center pointer-events-none",
        className
      )}
    >
      <div className="flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}

export function ChartStyle({
  id,
  config,
}: {
  id: string;
  config: ChartConfig;
}) {
  const entries = Object.entries(config).filter(([, c]) =>
    Boolean(c.color || c.theme)
  );
  if (!entries.length) return null;

  const css = Object.entries(THEMES)
    .map(([theme, prefix]) => {
      const body = entries
        .map(([key, cfg]) => {
          const color =
            cfg.theme?.[theme as keyof typeof cfg.theme] ?? cfg.color;
          return color ? `  --color-${key}: ${color};` : "";
        })
        .filter(Boolean)
        .join("\n");
      return `${prefix} [data-chart=${id}] {\n${body}\n}\n`;
    })
    .join("\n");

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

export type PayloadItem = {
  name?: string;
  value?: string | number;
  payload?: Record<string, unknown>;
  color?: string;
};

export const ChartTooltip = RechartsTooltip;

export function ChartTooltipContent({
  active,
  payload,
  label,
  className,
}: {
  active?: boolean;
  payload?: PayloadItem[] | null;
  label?: string | number;
  className?: string;
}) {
  const { config } = useChart();
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      className={cn(
        "rounded-lg border border-border/40 bg-background px-3 py-2 text-xs shadow-md",
        "z-50 relative",
        className
      )}
    >
      {label !== undefined && <div className="font-medium mb-1">{label}</div>}
      {payload.map((it, idx) => (
        <div key={idx} className="flex justify-between gap-2">
          <span className="text-muted-foreground">
            {config[it.name ?? ""]?.label ?? it.name}
          </span>
          <span className="font-mono tabular-nums font-semibold text-foreground">
            {typeof it.value === "number"
              ? it.value.toLocaleString()
              : it.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ChartLegendContent({
  payload,
  hideIcon = false,
  verticalAlign = "bottom",
}: {
  payload?: PayloadItem[] | null;
  hideIcon?: boolean;
  verticalAlign?: "top" | "bottom";
}) {
  const { config } = useChart();
  if (!payload || !payload.length) return null;

  return (
    <div
      className={`flex gap-4 justify-center ${
        verticalAlign === "top" ? "pb-3" : "pt-3"
      }`}
    >
      {payload.map((p, idx) => (
        <div key={idx} className="flex items-center gap-1.5">
          {!hideIcon && (
            <div
              className="h-2 w-2 rounded-[2px]"
              style={{ backgroundColor: p.color }}
            />
          )}
          <span>{config[p.name ?? ""]?.label ?? p.name}</span>
        </div>
      ))}
    </div>
  );
}
