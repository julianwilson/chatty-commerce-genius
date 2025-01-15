import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for the last 30 days
const generateMockData = () => {
  const data = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      promotions: Math.floor(Math.random() * 10) + 5,
      experiments: Math.floor(Math.random() * 8) + 3,
      aur: Math.floor(Math.random() * 50) + 100,
      aov: Math.floor(Math.random() * 100) + 200,
      upt: (Math.random() * 2 + 1).toFixed(2),
    });
  }
  return data;
};

export const MetricsGraph = () => {
  const data = generateMockData();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Key Metrics (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid gap-2">
                          <div className="font-semibold">{label}</div>
                          {payload.map((entry, index) => (
                            <div
                              key={`item-${index}`}
                              className="flex items-center justify-between gap-2"
                            >
                              <span className="text-[0.70rem] text-muted-foreground">
                                {entry.name}
                              </span>
                              <span className="text-[0.70rem] font-bold">
                                {entry.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="promotions"
                stroke="#8884d8"
                name="Promotions"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="experiments"
                stroke="#82ca9d"
                name="Experiments"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="aur"
                stroke="#ffc658"
                name="AUR"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="aov"
                stroke="#ff7300"
                name="AOV"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="upt"
                stroke="#0088fe"
                name="Units Per Transaction"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};