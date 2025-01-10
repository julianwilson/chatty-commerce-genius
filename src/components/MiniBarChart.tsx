import React from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface MiniBarChartProps {
  data: { date: string; sales: number }[];
}

export const MiniBarChart = ({ data }: MiniBarChartProps) => {
  return (
    <div className="h-10 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <Bar dataKey="sales" fill="#4f46e5" radius={[2, 2, 0, 0]} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-[0.70rem] text-muted-foreground">
                        Sales
                      </div>
                      <div className="text-[0.70rem] font-bold">
                        {payload[0].value}
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};