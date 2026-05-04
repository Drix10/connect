"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { PriceHistoryPoint } from "@/lib/types";

interface PriceChartProps {
  creditId: string | null;
  priceHistory: PriceHistoryPoint[];
}

export function PriceChart({ creditId, priceHistory }: PriceChartProps) {
  if (!creditId || priceHistory.length === 0) {
    return (
      <div className="h-[250px] flex items-center justify-center text-muted-foreground">
        Select a credit to view price history
      </div>
    );
  }

  const chartData = priceHistory.map((point) => ({
    date: new Date(point.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    price: point.price,
  }));

  const minPrice = Math.min(...priceHistory.map((p) => p.price));
  const maxPrice = Math.max(...priceHistory.map((p) => p.price));
  const yAxisDomain = [Math.floor(minPrice * 0.98), Math.ceil(maxPrice * 1.02)];

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            opacity={0.3}
          />
          <XAxis
            dataKey="date"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `₹${value}`}
            domain={yAxisDomain}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              borderColor: "hsl(var(--border))",
              borderRadius: "8px",
              color: "hsl(var(--foreground))",
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
            formatter={(value) => {
              const numValue = typeof value === "number" ? value : 0;
              return [`₹${numValue.toFixed(2)}`, "Price"];
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "hsl(var(--primary))" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
