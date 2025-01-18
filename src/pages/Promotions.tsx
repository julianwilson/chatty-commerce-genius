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
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { MetricTooltip } from "@/components/MetricTooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useEffect } from "react";

type DateRange = "Last 12 Weeks" | "Last 30 Days" | "Last 90 Days" | "Last 6 Months" | "Last 12 Months";
type GroupBy = "Day" | "Week" | "Month";

interface PromotionDataPoint {
  period: string;
  date: string;
  grossSales: number;
  adSpend: number;
  unitsSold: number;
  aur: number;
  aov: number;
  avgMarkdown: number;
}

const generateData = (dateRange: DateRange, groupBy: GroupBy): PromotionDataPoint[] => {
  const now = new Date();
  let days: number;
  let interval: number;
  let format: string;
  
  switch (dateRange) {
    case "Last 30 Days":
      days = 30;
      break;
    case "Last 90 Days":
      days = 90;
      break;
    case "Last 6 Months":
      days = 180;
      break;
    case "Last 12 Months":
      days = 365;
      break;
    default: // Last 12 Weeks
      days = 84; // 12 weeks
  }

  switch (groupBy) {
    case "Day":
      interval = 1;
      format = "MMM D";
      break;
    case "Month":
      interval = 30;
      format = "MMM YYYY";
      break;
    default: // Week
      interval = 7;
      format = "Week";
  }

  const periods = Math.ceil(days / interval);
  
  return Array.from({ length: periods }, (_, i) => {
    const daysAgo = days - (i * interval);
    const baseDate = new Date(now);
    baseDate.setDate(baseDate.getDate() - daysAgo);
    
    return {
      period: groupBy === "Week" ? `Week ${periods - i}` : baseDate.toLocaleDateString(),
      date: baseDate.toLocaleDateString(),
      grossSales: 50000 + Math.random() * 30000,
      adSpend: 5000 + Math.random() * 3000,
      unitsSold: 1000 + Math.random() * 500,
      aur: 45 + Math.random() * 10,
      aov: 120 + Math.random() * 30,
      avgMarkdown: 15 + Math.random() * 10,
    };
  }).reverse();
};

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

const PromotionTrendsGraph = ({ data }: { data: PromotionDataPoint[] }) => {
  const options: Highcharts.Options = {
    chart: {
      type: 'line',
      height: '400px',
      style: {
        fontFamily: 'Inter, sans-serif'
      }
    },
    title: {
      text: 'Promotion Performance Trends',
      style: {
        fontSize: '16px',
        fontWeight: 'bold'
      }
    },
    xAxis: {
      categories: data.map(d => d.period),
      labels: {
        style: { fontSize: '12px' }
      }
    },
    yAxis: [{
      title: {
        text: 'Amount ($)',
        style: {
          fontSize: '12px'
        }
      },
      labels: {
        style: { fontSize: '12px' },
        formatter: function () {
          return '$' + (this.value as number).toLocaleString();
        }
      }
    }, {
      title: {
        text: 'Units',
        style: {
          fontSize: '12px'
        }
      },
      opposite: true,
      labels: {
        style: { fontSize: '12px' }
      }
    }, {
      title: {
        text: 'Percentage (%)',
        style: {
          fontSize: '12px'
        }
      },
      opposite: true,
      labels: {
        style: { fontSize: '12px' },
        formatter: function () {
          return this.value + '%';
        }
      }
    }],
    series: [{
      name: 'Gross Sales',
      type: 'line',
      data: data.map(d => Math.round(d.grossSales)),
      color: '#2563eb',
      tooltip: {
        valuePrefix: '$'
      }
    }, {
      name: 'Ad Spend',
      type: 'line',
      data: data.map(d => Math.round(d.adSpend)),
      color: '#dc2626',
      tooltip: {
        valuePrefix: '$'
      }
    }, {
      name: 'Units Sold',
      type: 'line',
      data: data.map(d => Math.round(d.unitsSold)),
      yAxis: 1,
      color: '#16a34a'
    }, {
      name: 'AOV',
      type: 'line',
      data: data.map(d => Math.round(d.aov)),
      color: '#ea580c',
      tooltip: {
        valuePrefix: '$'
      }
    }, {
      name: 'AUR',
      type: 'line',
      data: data.map(d => Math.round(d.aur)),
      color: '#db2777',
      tooltip: {
        valuePrefix: '$'
      }
    }, {
      name: 'Avg. Markdown %',
      type: 'line',
      data: data.map(d => Math.round(d.avgMarkdown)),
      yAxis: 2,
      color: '#9333ea',
      tooltip: {
        valueSuffix: '%'
      }
    }],
    credits: {
      enabled: false
    },
    legend: {
      align: 'center',
      verticalAlign: 'bottom',
      itemStyle: {
        fontSize: '12px'
      }
    },
    tooltip: {
      shared: true,
      crosshairs: true
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

const Filter = ({ onFilterChange }: { onFilterChange: (data: PromotionDataPoint[]) => void }) => {
  const [dateRange, setDateRange] = useState<DateRange>("Last 12 Weeks");
  const [groupBy, setGroupBy] = useState<GroupBy>("Week");

  useEffect(() => {
    const newData = generateData(dateRange, groupBy);
    onFilterChange(newData);
  }, [dateRange, groupBy, onFilterChange]);

  return (
    <div className="flex gap-4 items-center mb-6">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Date Range:</span>
        <Select value={dateRange} onValueChange={(value) => setDateRange(value as DateRange)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Last 12 Weeks">Last 12 Weeks</SelectItem>
            <SelectItem value="Last 30 Days">Last 30 Days</SelectItem>
            <SelectItem value="Last 90 Days">Last 90 Days</SelectItem>
            <SelectItem value="Last 6 Months">Last 6 Months</SelectItem>
            <SelectItem value="Last 12 Months">Last 12 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Grouped By:</span>
        <Select value={groupBy} onValueChange={(value) => setGroupBy(value as GroupBy)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Day">Day</SelectItem>
            <SelectItem value="Week">Week</SelectItem>
            <SelectItem value="Month">Month</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default function Promotions() {
  const navigate = useNavigate();
  const [graphData, setGraphData] = useState(generateData("Last 12 Weeks", "Week"));

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Promotions</h1>
        <Button onClick={() => navigate('/promotions/create')}>
          <Plus className="w-4 h-4 mr-2" />
          Create Promotion
        </Button>
      </div>

      <Filter onFilterChange={setGraphData} />
      <PromotionTrendsGraph data={graphData} />

      <div className="bg-white rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Total Sales</TableHead>
              <TableHead><MetricTooltip metric="Last Year Comp">Last Year Comp</MetricTooltip></TableHead>
              <TableHead><MetricTooltip metric="Avg. Markdown %">Avg. Markdown %</MetricTooltip></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promotionsData.map((promotion) => (
              <TableRow
                key={promotion.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => navigate(`/promotions/${promotion.id}`)}
              >
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    promotion.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                    promotion.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' :
                    promotion.status === 'Running' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {promotion.status}
                  </span>
                </TableCell>
                <TableCell className="font-medium">{promotion.name}</TableCell>
                <TableCell>{promotion.type}</TableCell>
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
    </div>
  );
}