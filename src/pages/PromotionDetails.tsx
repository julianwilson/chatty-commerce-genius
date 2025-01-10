import { useParams, useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { TopProductsCard } from "@/components/TopProductsCard";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types/product";

const dailyData = [
  {
    date: "2025-01-01",
    sales: 5200,
    unitsSold: 104,
    averageUnitRetail: 47.5, // 5% lower than price
    price: 50,
    averageMarkdown: 15,
    sessions: 1200,
    impressions: 3600,
    aov: 150,
  },
  {
    date: "2025-01-02",
    sales: 6100,
    unitsSold: 122,
    averageUnitRetail: 47.5,
    price: 50,
    averageMarkdown: 15,
    sessions: 1300,
    impressions: 3900,
    aov: 160,
  },
  {
    date: "2025-01-03",
    sales: 5800,
    unitsSold: 116,
    averageUnitRetail: 47.5,
    price: 50,
    averageMarkdown: 15,
    sessions: 1250,
    impressions: 3750,
    aov: 155,
  },
  {
    date: "2025-01-04",
    sales: 7200,
    unitsSold: 144,
    averageUnitRetail: 47.5,
    price: 50,
    averageMarkdown: 15,
    sessions: 1400,
    impressions: 4200,
    aov: 170,
  },
  {
    date: "2025-01-05",
    sales: 6500,
    unitsSold: 130,
    averageUnitRetail: 47.5,
    price: 50,
    averageMarkdown: 15,
    sessions: 1350,
    impressions: 4050,
    aov: 165,
  },
];

const previousPeriodData = [
  {
    date: "2025-01-01",
    sales: 4100,
    unitsSold: 82,
    averageUnitRetail: 47.5,
    price: 50,
    averageMarkdown: 15,
    sessions: 1000,
    impressions: 3000,
    aov: 140,
  },
  {
    date: "2025-01-02",
    sales: 4800,
    unitsSold: 96,
    averageUnitRetail: 47.5,
    price: 50,
    averageMarkdown: 15,
    sessions: 1100,
    impressions: 3300,
    aov: 145,
  },
  {
    date: "2025-01-03",
    sales: 4600,
    unitsSold: 92,
    averageUnitRetail: 47.5,
    price: 50,
    averageMarkdown: 15,
    sessions: 1050,
    impressions: 3150,
    aov: 142,
  },
  {
    date: "2025-01-04",
    sales: 5700,
    unitsSold: 114,
    averageUnitRetail: 47.5,
    price: 50,
    averageMarkdown: 15,
    sessions: 1200,
    impressions: 3600,
    aov: 155,
  },
  {
    date: "2025-01-05",
    sales: 5200,
    unitsSold: 104,
    averageUnitRetail: 47.5,
    price: 50,
    averageMarkdown: 15,
    sessions: 1150,
    impressions: 3450,
    aov: 150,
  },
];

const PromotionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch("https://scentiment.com/products.json");
      const data = await response.json();
      return data.products as Product[];
    },
  });

  const salesChartOptions = {
    chart: {
      type: 'line',
      style: {
        fontFamily: 'inherit'
      }
    },
    title: {
      text: 'Daily Sales',
      style: {
        fontSize: '16px',
        fontWeight: 'bold'
      }
    },
    xAxis: {
      categories: dailyData.map(day => new Date(day.date).toLocaleDateString()),
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    },
    yAxis: {
      title: {
        text: 'Sales ($)',
        style: {
          fontSize: '12px'
        }
      }
    },
    series: [
      {
        name: 'Current Period',
        data: dailyData.map(day => day.sales),
        color: '#1E3A8A'
      },
      {
        name: 'Same Period LY',
        data: previousPeriodData.map(day => day.sales),
        color: '#9CA3AF',
        dashStyle: 'ShortDash'
      }
    ],
    tooltip: {
      headerFormat: '<b>{point.x}</b><br/>',
      pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>${point.y:,.2f}</b><br/>' +
        'Units Sold: <b>{point.units}</b><br/>' +
        'Average Unit Retail: <b>${point.aur}</b><br/>' +
        'Average Markdown: <b>{point.markdown}%</b>',
      shared: true,
      useHTML: true
    },
    plotOptions: {
      series: {
        point: {
          events: {
            mouseOver: function() {
              const data = this.series.name === 'Current Period' ? dailyData : previousPeriodData;
              this.units = data[this.index].unitsSold;
              this.aur = data[this.index].averageUnitRetail;
              this.markdown = data[this.index].averageMarkdown;
            }
          }
        }
      }
    },
    credits: {
      enabled: false
    }
  };

  const aurUnitsChartOptions = {
    chart: {
      type: 'line',
      style: {
        fontFamily: 'inherit'
      }
    },
    title: {
      text: 'Average Unit Retail & Units Sold',
      style: {
        fontSize: '16px',
        fontWeight: 'bold'
      }
    },
    xAxis: {
      categories: dailyData.map(day => new Date(day.date).toLocaleDateString()),
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    },
    yAxis: [{
      title: {
        text: 'Price ($)',
        style: {
          color: '#047857',
          fontSize: '12px'
        }
      },
      labels: {
        style: {
          color: '#047857'
        }
      }
    }, {
      title: {
        text: 'Units Sold',
        style: {
          color: '#7C3AED',
          fontSize: '12px'
        }
      },
      opposite: true,
      labels: {
        style: {
          color: '#7C3AED'
        }
      }
    }],
    series: [
      {
        name: 'Average Unit Retail',
        data: dailyData.map(day => day.averageUnitRetail),
        color: '#047857',
        yAxis: 0
      },
      {
        name: 'Units Sold',
        data: dailyData.map(day => day.unitsSold),
        color: '#7C3AED',
        yAxis: 1
      }
    ],
    tooltip: {
      shared: true,
      useHTML: true
    },
    credits: {
      enabled: false
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 bg-white p-8">
          <div className="container mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/promotions')}
              >
                ← Back
              </Button>
              <h1 className="text-2xl font-bold">Promotion Details</h1>
            </div>
            
            {/* Sales Chart */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-8">
              <HighchartsReact
                highcharts={Highcharts}
                options={salesChartOptions}
              />
            </div>

            {/* AUR and Units Chart */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-8">
              <HighchartsReact
                highcharts={Highcharts}
                options={aurUnitsChartOptions}
              />
            </div>

            {/* Metrics Table */}
            <div className="bg-white rounded-lg shadow-sm border mb-8">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Units Sold</TableHead>
                    <TableHead>Sales ($)</TableHead>
                    <TableHead>Avg Unit Retail</TableHead>
                    <TableHead>Avg Markdown %</TableHead>
                    <TableHead>Sessions</TableHead>
                    <TableHead>Impressions</TableHead>
                    <TableHead>AOV</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailyData.map((day) => (
                    <TableRow key={day.date}>
                      <TableCell>{new Date(day.date).toLocaleDateString()}</TableCell>
                      <TableCell>{day.unitsSold}</TableCell>
                      <TableCell>${day.sales.toLocaleString()}</TableCell>
                      <TableCell>${day.averageUnitRetail}</TableCell>
                      <TableCell>{day.averageMarkdown}%</TableCell>
                      <TableCell>{day.sessions.toLocaleString()}</TableCell>
                      <TableCell>{day.impressions.toLocaleString()}</TableCell>
                      <TableCell>${day.aov}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Top Products Card */}
            <div className="max-w-xl mx-auto">
              <TopProductsCard products={products || []} />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default PromotionDetails;