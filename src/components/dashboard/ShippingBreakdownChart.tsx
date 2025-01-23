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
        colors: ['#1D9BF0', '#8ECDF8'],
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f}%',
          style: {
            color: '#71767B'
          }
        }
      }
    },
    series: [{
      name: 'Shipping',
      colorByPoint: true,
      data: [{
        name: 'Paid Shipping',
        y: 65
      }, {
        name: 'Free Shipping',
        y: 35
      }]
    }],
    legend: {
      itemStyle: {
        color: '#71767B'
      }
    },
    credits: {
      enabled: false
    },
    tooltip: {
      backgroundColor: '#000000',
      borderColor: '#2F3336',
      style: {
        color: '#FFFFFF'
      },
      formatter: function() {
        const point = this.point as any;
        return `<b>${point.name}</b><br/>
                Percentage: ${point.percentage}%`;
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
