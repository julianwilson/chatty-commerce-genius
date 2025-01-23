import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
        style: { fontSize: '12px' }
      }
    },
    yAxis: {
      title: {
        text: undefined
      },
      labels: {
        formatter: function() {
          const value = this.value;
          // Format large numbers with k suffix
          if (value >= 1000) {
            return metric.unit + (value / 1000).toFixed(1) + 'k';
          }
          return metric.unit + value;
        },
        style: { fontSize: '12px' }
      }
    },
    legend: {
      enabled: false
    },
    tooltip: {
      formatter: function() {
        const value = this.y;
        // Format large numbers with comma separator
        const formattedValue = value?.toLocaleString();
        return `<b>${this.x}</b><br/>
                ${metric.name}: ${metric.unit}${formattedValue}`;
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 3,
        dataLabels: {
          enabled: true,
          formatter: function() {
            const value = this.y;
            // Format large numbers with k suffix in labels
            if (value && value >= 1000) {
              return metric.unit + (value / 1000).toFixed(1) + 'k';
            }
            return metric.unit + value;
          },
          style: {
            fontSize: '11px'
          }
        }
      }
    },
    series: [{
      name: metric.name,
      data: [metric.control, metric.winner],
      color: '#1D9BF0'
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
            <CardTitle className="text-sm font-medium">
              {metric.name}
              <span className={`ml-2 text-xs ${metric.improvement > 0 ? 'text-[#1D9BF0]' : 'text-black'}`}>
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
                  <span className="text-sm font-medium text-[#1D9BF0]">
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
