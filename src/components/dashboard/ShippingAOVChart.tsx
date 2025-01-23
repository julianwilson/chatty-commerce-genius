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
      color: '#1D9BF0' // updated color
    }
  ];

  const options: Highcharts.Options = {
    chart: {
      type: 'bar',
      height: '300px',
      backgroundColor: 'transparent', // updated background color
      style: {
        fontFamily: 'inherit' // updated font family
      }
    },
    title: {
      text: undefined
    },
    xAxis: {
      type: 'category',
      labels: {
        style: { 
          color: '#71767B' // updated label color
        }
      },
      lineColor: '#2F3336', // updated line color
      tickColor: '#2F3336' // updated tick color
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
        style: { 
          color: '#71767B' // updated label color
        }
      },
      gridLineColor: '#2F3336' // updated grid line color
    },
    legend: {
      enabled: false,
      itemStyle: {
        color: '#71767B' // updated legend item color
      }
    },
    tooltip: {
      formatter: function() {
        const point = this.point as any;
        return `<b>${point.name}</b><br/>
                AOV: $${point.y.toFixed(2)}<br/>
                Orders: ${point.orders.toLocaleString()}`;
      },
      backgroundColor: '#000000', // updated background color
      borderColor: '#2F3336', // updated border color
      style: {
        color: '#FFFFFF' // updated text color
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
