import React from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

interface MiniBarChartProps {
  data?: { date: string; sales: number }[];
  testData?: {
    control: number;
    testA: number;
    testB: number;
  };
}

export const MiniBarChart = ({ data, testData }: MiniBarChartProps) => {
  if (testData) {
    const transformedData = [
      { name: "Control", value: testData.control },
      { name: "Test A", value: testData.testA },
      { name: "Test B", value: testData.testB },
    ];

    return (
      <div className="h-10 w-24">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={transformedData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <XAxis
              dataKey="name"
              tick={false}
              axisLine={false}
            />
            <Bar dataKey="value" fill="#4f46e5" radius={[2, 2, 0, 0]} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const value = payload[0].value as number;
                  const formattedValue = value >= 0 ? `+${value}%` : `${value}%`;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-[0.70rem] text-muted-foreground">
                          {payload[0].payload.name}
                        </div>
                        <div className={`text-[0.70rem] font-bold ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formattedValue}
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

  // Fallback to original sales data chart if no test data is provided
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