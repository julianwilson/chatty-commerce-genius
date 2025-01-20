import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function ShippingAOVChart() {
  // Mock data for AOV comparison
  const aovData = [
    {
      name: 'Average Order Value',
      data: [
        { name: 'Paid Shipping', y: 128.50, orders: 2845 },
        { name: 'Free Shipping', y: 185.75, orders: 1532 }
      ],
      color: '#10b981' // emerald-500
    }
  ];

  const options: Highcharts.Options = {
    chart: {
      type: 'bar',
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
        text: 'Average Order Value ($)',
        style: {
          fontSize: '12px'
        }
      },
      labels: {
        formatter: function() {
          return '$' + this.value;
        },
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
                AOV: $${point.y.toFixed(2)}<br/>
                Orders: ${point.orders.toLocaleString()}`;
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
