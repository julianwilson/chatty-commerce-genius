import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function ShippingBreakdownChart() {
  // Mock data for shipping breakdown
  interface CustomDataPoint extends Highcharts.PointOptionsObject {
    percentage?: number;
    aov?: number;
  }

  const shippingData = [
    {
      name: 'Orders',
      data: [
        { name: 'Paid Shipping', y: 2845, percentage: 65, aov: 128.50 },
        { name: 'Free Shipping', y: 1532, percentage: 35, aov: 185.75 }
      ],
      color: 'var(--primary)'
    }
  ];

  const options: Highcharts.Options = {
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
      height: '300px',
      style: {
        fontFamily: 'inherit'
      }
    },
    title: {
      text: undefined
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        colors: ['var(--primary)', 'var(--primary-light, #8ECDF8)'],
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f}%',
          style: {
            color: 'var(--muted-foreground)'
          }
        }
      }
    },
    series: [{
      type: 'pie' as const,
      name: 'Shipping',
      data: [{
        name: 'Paid Shipping',
        y: 65
      }, {
        name: 'Free Shipping',
        y: 35
      }] as CustomDataPoint[]
    }],
    legend: {
      itemStyle: {
        color: 'var(--muted-foreground)'
      }
    },
    credits: {
      enabled: false
    },
    tooltip: {
      backgroundColor: 'var(--background)',
      borderColor: 'var(--border)',
      style: {
        color: 'var(--foreground)'
      },
      formatter: function() {
        const point = this as unknown as { point: CustomDataPoint, percentage: number };
        return `<b>${point.point.name}</b><br/>
                Percentage: ${point.percentage.toFixed(1)}%`;
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </CardContent>
    </Card>
  );
}
