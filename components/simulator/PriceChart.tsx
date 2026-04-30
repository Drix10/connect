"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PriceHistoryPoint } from "@/lib/types";

interface PriceChartProps {
  creditId: string | null;
  priceHistory: PriceHistoryPoint[];
  creditName?: string;
}

export function PriceChart({
  creditId,
  priceHistory,
  creditName,
}: PriceChartProps) {
  if (!creditId || priceHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Price History</CardTitle>
          <CardDescription>30-day price trend</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            Select a credit from the marketplace to view price history
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format data for Recharts
  const chartData = priceHistory.map((point) => ({
    date: new Date(point.date).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    }),
    price: point.price,
  }));

  const minPrice = Math.min(...priceHistory.map((p) => p.price));
  const maxPrice = Math.max(...priceHistory.map((p) => p.price));
  const priceRange = maxPrice - minPrice;
  const yAxisMin = Math.floor(minPrice - priceRange * 0.1);
  const yAxisMax = Math.ceil(maxPrice + priceRange * 0.1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price History</CardTitle>
        <CardDescription>
          {creditName ? `${creditName} - ` : ""}30-day price trend (₹/tCO₂e)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="date"
              stroke="#9CA3AF"
              style={{ fontSize: "12px" }}
              tick={{ fill: "#9CA3AF" }}
            />
            <YAxis
              stroke="#9CA3AF"
              style={{ fontSize: "12px" }}
              tick={{ fill: "#9CA3AF" }}
              domain={[yAxisMin, yAxisMax]}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#F3F4F6",
              }}
              labelStyle={{ color: "#9CA3AF" }}
              formatter={(value: any) => [
                `₹${Number(value).toLocaleString()}`,
                "Price",
              ]}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: "#10b981", r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
