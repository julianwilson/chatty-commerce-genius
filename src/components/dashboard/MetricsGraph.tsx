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
import { MetricTooltip } from '../MetricTooltip';

// Generate mock data for the last 12 weeks
const generateMockData = () => {
  const data = [];
  const currentDate = new Date();
  
  // Adjust to the last Saturday (week ending)
  const daysUntilSaturday = (6 - currentDate.getDay() + 7) % 7;
  currentDate.setDate(currentDate.getDate() + daysUntilSaturday);
  
  // Start from 12 weeks ago
  for (let i = 11; i >= 0; i--) {
    const weekEndingDate = new Date(currentDate);
    weekEndingDate.setDate(weekEndingDate.getDate() - (i * 7));
    
    data.push({
      week: weekEndingDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
      promotionalAmount: Math.random() * 10000 + 5000,
      newRevenue: Math.random() * 15000 + 8000,
      aur: Math.random() * 20 + 40,
      aov: Math.random() * 30 + 70,
      unitsPerTransaction: Math.random() * 1 + 2,
      avgMarkdown: Math.random() * 20 + 5, // Random value between 5-25%
    });
  }
  return data;
};

const metrics = [
  { id: 'newRevenue', name: 'App Attributed Sales Generated', value: '$23,456', change: '+60%' },
  { id: 'aur', name: 'AUR', value: '$45.67', change: '+49%' },
  { id: 'aov', name: 'AOV', value: '$89.12', change: '+32%' },
  { id: 'unitsPerTransaction', name: 'UPT', value: '2.5', change: '+25%' },
  { id: 'avgMarkdown', name: 'Avg. Markdown %', value: '15%', change: '-10%' }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background dark:bg-gray-950 p-4 border dark:border-gray-800 rounded shadow dark:shadow-2xl dark:shadow-black/20">
        <p className="text-sm font-bold mb-2 text-foreground">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm text-foreground">
            {entry.name}:{' '}
            <span className="font-bold">
              {entry.dataKey === 'unitsPerTransaction' 
                ? entry.value.toFixed(2)
                : entry.dataKey === 'avgMarkdown'
                  ? `${entry.value.toFixed(1)}%`
                  : `$${entry.value.toFixed(2)}`
              }
            </span>
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
                <MetricTooltip metric={metric.name}>{metric.name}</MetricTooltip>
              </p>
              <div className="flex items-center gap-1">
                <p className="text-lg font-bold">{metric.value}</p>
                <span className={`text-xs ${metric.change.startsWith('+') ? 'text-primary' : 'text-muted-foreground'}`}>
                  {metric.change}
                </span>
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
              <CartesianGrid horizontal={true} vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="newRevenue" stroke="#6C63FF" strokeWidth={2} name="App Attributed Sales Generated" />
              <Line type="monotone" dataKey="aur" stroke="#6C63FF" strokeWidth={2} name="AUR" />
              <Line type="monotone" dataKey="aov" stroke="#6C63FF" strokeWidth={2} name="AOV" />
              <Line type="monotone" dataKey="unitsPerTransaction" stroke="#6C63FF" strokeWidth={2} name="UPT" />
              <Line type="monotone" dataKey="avgMarkdown" stroke="currentColor" className="text-foreground dark:text-gray-400" strokeWidth={2} name="Avg. Markdown %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};