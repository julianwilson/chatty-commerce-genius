import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreatePromotionModal } from "@/components/CreatePromotionModal";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// Weekly data for the last 12 weeks
const weeklyData = Array.from({ length: 12 }, (_, i) => {
  const week = 12 - i;
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() - (week * 7));
  
  return {
    week: `Week ${week}`,
    date: baseDate.toLocaleDateString(),
    grossSales: 50000 + Math.random() * 30000,
    adSpend: 5000 + Math.random() * 3000,
    unitsSold: 1000 + Math.random() * 500,
    aur: 45 + Math.random() * 10,
    aov: 120 + Math.random() * 30,
    avgMarkdown: 15 + Math.random() * 10,
  };
}).reverse();

const promotionsData = [
  {
    id: 1,
    name: "Summer dresses sale",
    type: "Sitewide Markdown Sale",
    status: ["Draft", "Scheduled", "Running", "Ended"][Math.floor(Math.random() * 4)],
    startDate: "Dec 26 2024",
    endDate: "Jan 08 2025",
    totalSales: "$53,478",
    lyComp: 15.2,
    avgMarkdown: 25
  },
  {
    id: 2,
    name: "Winter clearance",
    type: "Sitewide Discount Code Sale",
    status: ["Draft", "Scheduled", "Running", "Ended"][Math.floor(Math.random() * 4)],
    startDate: "Jan 15 2025",
    endDate: "Feb 01 2025",
    totalSales: "$42,890",
    lyComp: -8.5,
    avgMarkdown: 30
  },
  {
    id: 3,
    name: "Valentine's special",
    type: "Collection Sale",
    status: ["Draft", "Scheduled", "Running", "Ended"][Math.floor(Math.random() * 4)],
    startDate: "Feb 07 2025",
    endDate: "Feb 14 2025",
    totalSales: "$38,654",
    lyComp: 22.3,
    avgMarkdown: 15
  },
  {
    id: 4,
    name: "Spring collection launch",
    type: "Bogo Sale",
    status: ["Draft", "Scheduled", "Running", "Ended"][Math.floor(Math.random() * 4)],
    startDate: "Mar 01 2025",
    endDate: "Mar 15 2025",
    totalSales: "$67,234",
    lyComp: -4.7,
    avgMarkdown: 20
  },
  {
    id: 5,
    name: "Easter weekend deals",
    type: "Free Shipping Sale",
    status: ["Draft", "Scheduled", "Running", "Ended"][Math.floor(Math.random() * 4)],
    startDate: "Mar 29 2025",
    endDate: "Apr 01 2025",
    totalSales: "$28,976",
    lyComp: 18.9,
    avgMarkdown: 10
  },
  {
    id: 6,
    name: "Mother's day special",
    type: "Shipping Update",
    status: ["Draft", "Scheduled", "Running", "Ended"][Math.floor(Math.random() * 4)],
    startDate: "May 08 2025",
    endDate: "May 12 2025",
    totalSales: "$45,321",
    lyComp: -12.4,
    avgMarkdown: 35
  },
  {
    id: 7,
    name: "Summer swimwear",
    type: "Influencer",
    status: ["Draft", "Scheduled", "Running", "Ended"][Math.floor(Math.random() * 4)],
    startDate: "Jun 01 2025",
    endDate: "Jun 30 2025",
    totalSales: "$58,432",
    lyComp: 25.6,
    avgMarkdown: 40
  },
  {
    id: 8,
    name: "Back to school",
    type: "Event",
    status: ["Draft", "Scheduled", "Running", "Ended"][Math.floor(Math.random() * 4)],
    startDate: "Aug 15 2025",
    endDate: "Sep 05 2025",
    totalSales: "$72,154",
    lyComp: 9.8,
    avgMarkdown: 15
  },
  {
    id: 9,
    name: "Fall fashion fest",
    type: "Loyalty Bonus",
    status: ["Draft", "Scheduled", "Running", "Ended"][Math.floor(Math.random() * 4)],
    startDate: "Sep 20 2025",
    endDate: "Oct 05 2025",
    totalSales: "$49,876",
    lyComp: -6.3,
    avgMarkdown: 25
  },
  {
    id: 10,
    name: "Black Friday deals",
    type: "Sitewide Markdown Sale",
    status: ["Draft", "Scheduled", "Running", "Ended"][Math.floor(Math.random() * 4)],
    startDate: "Nov 29 2025",
    endDate: "Dec 02 2025",
    totalSales: "$98,765",
    lyComp: 32.1,
    avgMarkdown: 50
  },
  {
    id: 11,
    name: "Cyber Monday special",
    type: "Sitewide Discount Code Sale",
    status: ["Draft", "Scheduled", "Running", "Ended"][Math.floor(Math.random() * 4)],
    startDate: "Dec 02 2025",
    endDate: "Dec 03 2025",
    totalSales: "$87,654",
    lyComp: 28.4,
    avgMarkdown: 45
  }
];

const PromotionTrendsGraph = () => {
  const chartOptions = {
    chart: {
      type: 'line',
      height: 300,
      style: {
        fontFamily: 'inherit'
      }
    },
    title: {
      text: 'Performance Metrics',
      style: {
        fontSize: '16px',
        fontWeight: 'bold'
      }
    },
    xAxis: {
      categories: weeklyData.map(d => d.week),
      labels: {
        style: { fontSize: '12px' }
      }
    },
    yAxis: [{
      title: {
        text: 'Amount ($)',
        style: { fontSize: '12px' }
      },
      labels: {
        format: '${value:,.0f}',
        style: { fontSize: '12px' }
      }
    }, {
      opposite: true,
      title: {
        text: 'Percentage',
        style: { fontSize: '12px' }
      },
      labels: {
        format: '{value}%',
        style: { fontSize: '12px' }
      }
    }],
    tooltip: {
      shared: true,
      headerFormat: '<b>{point.x}</b><br/>',
      pointFormatter: function() {
        if (this.series.name === 'Avg. Markdown') {
          return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: ${Highcharts.numberFormat(this.y, 1)}%<br/>`;
        }
        return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: $${Highcharts.numberFormat(this.y, this.series.name === 'Gross Sales' ? 0 : 2)}<br/>`;
      }
    },
    plotOptions: {
      line: {
        marker: {
          enabled: true,
          radius: 4
        }
      }
    },
    series: [
      {
        name: 'Gross Sales',
        data: weeklyData.map(d => d.grossSales),
        color: '#1E3A8A',
        yAxis: 0,
        zIndex: 5
      },
      {
        name: 'Ad Spend',
        data: weeklyData.map(d => d.adSpend),
        color: '#047857',
        yAxis: 0
      },
      {
        name: 'AOV',
        data: weeklyData.map(d => d.aov),
        color: '#EA580C',
        yAxis: 0
      },
      {
        name: 'AUR',
        data: weeklyData.map(d => d.aur),
        color: '#DB2777',
        yAxis: 0
      },
      {
        name: 'Avg. Markdown',
        data: weeklyData.map(d => d.avgMarkdown),
        color: '#2563EB',
        yAxis: 1
      }
    ],
    credits: {
      enabled: false
    },
    legend: {
      enabled: true,
      align: 'center',
      verticalAlign: 'bottom'
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-8">
      <div className="flex items-center gap-4 mb-4">
        <div className="text-sm text-gray-500">
          Tracking key performance metrics over time
        </div>
      </div>
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
      />
    </div>
  );
};

export default function Promotions() {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Promotions</h1>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Promotion
        </Button>
      </div>

      <PromotionTrendsGraph />

      <div className="bg-white rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Total Sales</TableHead>
              <TableHead>LY Comp %</TableHead>
              <TableHead>Avg. Markdown %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promotionsData.map((promotion) => (
              <TableRow
                key={promotion.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => navigate(`/promotions/${promotion.id}`)}
              >
                <TableCell className="font-medium">{promotion.name}</TableCell>
                <TableCell>{promotion.type}</TableCell>
                <TableCell>{promotion.status}</TableCell>
                <TableCell>{promotion.startDate}</TableCell>
                <TableCell>{promotion.endDate}</TableCell>
                <TableCell>{promotion.totalSales}</TableCell>
                <TableCell className={promotion.lyComp >= 0 ? "text-green-600" : "text-red-600"}>
                  {promotion.lyComp > 0 ? "+" : ""}{promotion.lyComp}%
                </TableCell>
                <TableCell>{promotion.avgMarkdown}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CreatePromotionModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </div>
  );
}