import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricTooltip } from "@/components/MetricTooltip";

interface MetricData {
  name: string;
  control: number;
  winner: number;
  unit: string;
  improvement: number;
  monthlyOrdersImpact?: number;
  monthlyRevenueImpact?: number;
}

const mockData: MetricData[] = [
  {
    name: "Conversion Rate",
    control: 2.8,
    winner: 3.2,
    unit: "%",
    improvement: 14.3,
    monthlyOrdersImpact: 60
  },
  {
    name: "Revenue Per Visitor",
    control: 4.25,
    winner: 4.85,
    unit: "$",
    improvement: 14.1,
    monthlyRevenueImpact: 15000
  },
  {
    name: "AOV",
    control: 145.50,
    winner: 158.75,
    unit: "$",
    improvement: 9.1
  },
  {
    name: "Total Orders",
    control: 432,
    winner: 492,
    unit: "",
    improvement: 13.9
  },
  {
    name: "Unit Sales",
    control: 864,
    winner: 1082,
    unit: "",
    improvement: 25.2
  },
  {
    name: "Visitors",
    control: 15420,
    winner: 15380,
    unit: "",
    improvement: -0.3
  }
];

export function ExperimentMetricsGraphs() {
  const createChartOptions = (metric: MetricData): Highcharts.Options => ({
    chart: {
      type: 'bar',
      height: '120px',
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'Inter, sans-serif'
      }
    },
    title: {
      text: undefined
    },
    xAxis: {
      categories: ['Control', 'Winner'],
      labels: {
        style: {
          fontSize: '12px',
          color: '#71767B',
          fontWeight: '500'
        }
      }
    },
    yAxis: {
      title: {
        text: undefined
      },
      labels: {
        formatter: function() {
          const value = Number(this.value);
          if (!isNaN(value) && value >= 1000) {
            return metric.unit + (value / 1000).toFixed(1) + 'k';
          }
          return metric.unit + this.value;
        },
        style: {
          fontSize: '12px',
          color: '#71767B',
          fontWeight: '500'
        }
      },
      gridLineColor: '#2F3336'
    },
    legend: {
      enabled: false
    },
    tooltip: {
      formatter: function() {
        const value = Number(this.y);
        const formattedValue = !isNaN(value) ? value.toLocaleString() : '0';
        return `<b>${this.x}</b><br/>
                ${metric.name}: ${metric.unit}${formattedValue}`;
      },
      backgroundColor: '#000000',
      borderColor: '#2F3336',
      style: {
        color: '#FFFFFF',
        fontWeight: '500'
      }
    },
    plotOptions: {
      series: {
        color: '#6C63FF'
      },
      bar: {
        borderRadius: 3,
        dataLabels: {
          enabled: true,
          formatter: function() {
            const value = Number(this.y);
            if (!isNaN(value) && value >= 1000) {
              return metric.unit + (value / 1000).toFixed(1) + 'k';
            }
            return metric.unit + (this.y ?? 0);
          },
          style: {
            fontSize: '11px',
            fontWeight: '600',
            textOutline: 'none',
            color: '#71767B'
          }
        }
      }
    },
    series: [{
      type: 'bar',
      name: metric.name,
      data: [metric.control, metric.winner]
    }],
    credits: {
      enabled: false
    }
  });

  const formatCurrency = (value: number) => {
    if (value >= 1000) {
      return "$" + (value / 1000).toFixed(1) + "k";
    }
    return "$" + value.toFixed(2);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {mockData.map((metric) => (
        <Card key={metric.name} className="w-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <MetricTooltip metric={metric.name}>
                {metric.name}
              </MetricTooltip>
              <span className={`ml-2 text-xs ${metric.improvement > 0 ? 'text-primary' : 'text-foreground dark:text-gray-400'}`}>
                {metric.improvement > 0 ? '+' : ''}{metric.improvement}%
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <HighchartsReact 
              highcharts={Highcharts} 
              options={createChartOptions(metric)} 
            />
            {(metric.monthlyOrdersImpact || metric.monthlyRevenueImpact) && (
              <div className="mt-2 pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Estimated Monthly Impact</span>
                  <span className="text-sm font-medium text-primary">
                    {metric.monthlyOrdersImpact && `+${metric.monthlyOrdersImpact} orders`}
                    {metric.monthlyRevenueImpact && `+${formatCurrency(metric.monthlyRevenueImpact)}`}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
