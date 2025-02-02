import React from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { MoneyDisplay } from "./MoneyDisplay";

interface MiniBarChartProps {
  data?: { date: string; sales: number }[];
  testData?: {
    control: number;
    testA: number;
    testB: number;
  };
  winner?: "Control" | "Test A" | "Test B";
}

export const MiniBarChart = ({ data, testData, winner }: MiniBarChartProps) => {
  if (testData) {
    const transformedData = [
      { name: "Control", value: testData.control },
      { name: "Test A", value: testData.testA },
      { name: "Test B", value: testData.testB },
    ];

    return (
      <div className="h-16 w-32">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={transformedData} margin={{ top: 0, right: 0, bottom: 16, left: 0 }}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10 }}
              axisLine={false}
            />
            <Bar dataKey="value" fill="#1D9BF0" radius={[2, 2, 0, 0]} />
            <Tooltip
              wrapperStyle={{ overflow: 'visible', backgroundColor: '#000000', borderColor: '#2F3336' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const value = payload[0].value as number;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm" style={{ color: '#FFFFFF' }}>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-[0.70rem] text-muted-foreground">
                          Gross Sales
                        </div>
                        <div className="text-[0.70rem] font-bold">
                          <MoneyDisplay value={value} />
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
  }

  return (
    <div className="h-16 w-32">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <Bar dataKey="sales" fill="#1D9BF0" radius={[2, 2, 0, 0]} />
          <Tooltip
            wrapperStyle={{ overflow: 'visible', backgroundColor: '#000000', borderColor: '#2F3336' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const value = Number(payload[0].value);
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm" style={{ color: '#FFFFFF' }}>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-[0.70rem] text-muted-foreground">
                        Sales
                      </div>
                      <div className="text-[0.70rem] font-bold">
                        <MoneyDisplay value={value} showPrefix={false} />
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