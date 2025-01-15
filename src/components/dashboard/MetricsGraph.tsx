import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data - in a real app this would come from an API
const generateMockData = () => {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  for (let i = 0; i < 30; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i);
    
    data.push({
      date: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      promotionalAmount: Math.random() * 10000 + 5000,
      newRevenue: Math.random() * 15000 + 8000,
      aur: Math.random() * 20 + 40,
      aov: Math.random() * 30 + 70,
      unitsPerTransaction: Math.random() * 1 + 2,
    });
  }
  return data;
};

const metrics = [
  { id: 'promotionalAmount', name: 'Promotional $', value: '$12,345', change: '+43%' },
  { id: 'newRevenue', name: 'New $ Generated', value: '$23,456', change: '+60%' },
  { id: 'aur', name: 'AUR', value: '$45.67', change: '+49%' },
  { id: 'aov', name: 'AOV', value: '$89.12', change: '+32%' },
  { id: 'unitsPerTransaction', name: 'Units Per Transaction', value: '2.5', change: '+25%' }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border rounded shadow">
        <p className="text-sm font-bold mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {
              entry.dataKey === 'unitsPerTransaction' 
                ? entry.value.toFixed(2)
                : `$${entry.value.toFixed(2)}`
            }
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const MetricsGraph = () => {
  const data = generateMockData();

  return (
    <Card className="col-span-4">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-4">
          {metrics.map((metric) => (
            <div key={metric.id} className="flex flex-col">
              <p className="text-xs font-medium text-muted-foreground">
                {metric.name}
              </p>
              <div className="flex items-center gap-1">
                <p className="text-lg font-bold">{metric.value}</p>
                <span className="text-xs text-green-500">{metric.change}</span>
              </div>
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
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
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="promotionalAmount" stroke="#8884d8" name="Promotional $" />
              <Line type="monotone" dataKey="newRevenue" stroke="#82ca9d" name="New $ Generated" />
              <Line type="monotone" dataKey="aur" stroke="#ffc658" name="AUR" />
              <Line type="monotone" dataKey="aov" stroke="#ff7300" name="AOV" />
              <Line type="monotone" dataKey="unitsPerTransaction" stroke="#00C49F" name="Units Per Transaction" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};