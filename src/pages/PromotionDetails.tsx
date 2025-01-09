import { useParams } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
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

// Mock data - in a real app this would come from an API
const dailyData = [
  {
    date: "2025-01-01",
    sales: 5200,
    unitsSold: 104,
    averageUnitRetail: 50,
    averageMarkdown: 15,
    sessions: 1200,
    impressions: 3600,
    aov: 150,
  },
  {
    date: "2025-01-02",
    sales: 6100,
    unitsSold: 122,
    averageUnitRetail: 50,
    averageMarkdown: 15,
    sessions: 1300,
    impressions: 3900,
    aov: 160,
  },
  {
    date: "2025-01-03",
    sales: 5800,
    unitsSold: 116,
    averageUnitRetail: 50,
    averageMarkdown: 15,
    sessions: 1250,
    impressions: 3750,
    aov: 155,
  },
  {
    date: "2025-01-04",
    sales: 7200,
    unitsSold: 144,
    averageUnitRetail: 50,
    averageMarkdown: 15,
    sessions: 1400,
    impressions: 4200,
    aov: 170,
  },
  {
    date: "2025-01-05",
    sales: 6500,
    unitsSold: 130,
    averageUnitRetail: 50,
    averageMarkdown: 15,
    sessions: 1350,
    impressions: 4050,
    aov: 165,
  },
];

const PromotionDetails = () => {
  const { id } = useParams();

  const chartOptions = {
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
    series: [{
      name: 'Sales',
      data: dailyData.map(day => day.sales),
      color: '#1E3A8A'
    }],
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
              this.units = dailyData[this.index].unitsSold;
              this.aur = dailyData[this.index].averageUnitRetail;
              this.markdown = dailyData[this.index].averageMarkdown;
            }
          }
        }
      }
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
            <h1 className="text-2xl font-bold mb-6">Promotion Details</h1>
            
            {/* Sales Chart */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-8">
              <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions}
              />
            </div>

            {/* Metrics Table */}
            <div className="bg-white rounded-lg shadow-sm border">
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
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default PromotionDetails;