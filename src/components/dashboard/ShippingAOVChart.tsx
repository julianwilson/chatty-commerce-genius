import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function ShippingAOVChart() {
  // Mock data for AOV comparison
  interface CustomDataPoint extends Highcharts.PointOptionsObject {
    orders?: number;
  }

  const aovData: Highcharts.SeriesOptionsType[] = [
    {
      type: 'bar',
      name: 'Average Order Value',
      data: [
        { name: 'Paid Shipping', y: 128.50, orders: 2845 } as CustomDataPoint,
        { name: 'Free Shipping', y: 185.75, orders: 1532 } as CustomDataPoint
      ],
      color: 'var(--primary)'
    }
  ];

  const options: Highcharts.Options = {
    chart: {
      type: 'bar',
      height: '300px',
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'inherit'
      }
    },
    title: {
      text: undefined
    },
    xAxis: {
      type: 'category',
      labels: {
        style: {
          color: 'var(--muted-foreground)'
        }
      },
      lineColor: 'var(--border)',
      tickColor: 'var(--border)'
    },
    yAxis: {
      title: {
        text: 'Average Order Value ($)',
        style: {
          fontSize: '12px',
          color: 'var(--muted-foreground)'
        }
      },
      labels: {
        formatter: function() {
          return '$' + this.value;
        },
        style: {
          color: 'var(--muted-foreground)'
        }
      },
      gridLineColor: 'var(--border)'
    },
    legend: {
      enabled: false,
      itemStyle: {
        color: 'var(--muted-foreground)'
      }
    },
    tooltip: {
      formatter: function(this: Highcharts.PointerEventObject) {
        const point = this.point as unknown as CustomDataPoint;
        if (!point) return '';
        return `<b>${point.name}</b><br/>
                AOV: $${point.y?.toFixed(2)}<br/>
                Orders: ${point?.orders?.toLocaleString() ?? 0}`;
      },
      backgroundColor: 'var(--background)',
      borderColor: 'var(--border)',
      style: {
        color: 'var(--foreground)'
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 5,
        dataLabels: {
          enabled: true,
          formatter: function() {
            return '$' + this.y.toFixed(2);
          },
          style: {
            fontSize: '12px'
          }
        }
      }
    },
    series: aovData,
    credits: {
      enabled: false
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping AOV Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </CardContent>
    </Card>
  );
}
