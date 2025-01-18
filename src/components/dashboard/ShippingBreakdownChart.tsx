import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function ShippingBreakdownChart() {
  // Mock data for shipping breakdown
  const shippingData = [
    {
      name: 'Orders',
      data: [
        { name: 'Paid Shipping', y: 2845, percentage: 65, aov: 128.50 },
        { name: 'Free Shipping', y: 1532, percentage: 35, aov: 185.75 }
      ],
      color: '#2563eb'
    }
  ];

  const options: Highcharts.Options = {
    chart: {
      type: 'column',
      height: '300px',
      style: {
        fontFamily: 'Inter, sans-serif'
      }
    },
    title: {
      text: undefined
    },
    xAxis: {
      type: 'category',
      labels: {
        style: { fontSize: '12px' }
      }
    },
    yAxis: {
      title: {
        text: 'Number of Orders',
        style: {
          fontSize: '12px'
        }
      },
      labels: {
        style: { fontSize: '12px' }
      }
    },
    legend: {
      enabled: false
    },
    tooltip: {
      formatter: function() {
        const point = this.point as any;
        return `<b>${point.name}</b><br/>
                Orders: ${point.y.toLocaleString()}<br/>
                Percentage: ${point.percentage}%<br/>
                AOV: $${point.aov.toFixed(2)}`;
      }
    },
    plotOptions: {
      column: {
        borderRadius: 5,
        dataLabels: {
          enabled: true,
          formatter: function() {
            const point = this.point as any;
            return `${point.percentage}%`;
          },
          style: {
            fontSize: '12px'
          }
        }
      }
    },
    series: shippingData,
    credits: {
      enabled: false
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
