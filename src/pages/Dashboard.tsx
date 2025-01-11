import { useState } from "react";
import { Pencil } from "lucide-react";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";

const monthlySalesData = [
  { month: 'Jan', salesPercentage: 8.5 },
  { month: 'Feb', salesPercentage: 7.2 },
  { month: 'Mar', salesPercentage: 9.1 },
  { month: 'Apr', salesPercentage: 8.8 },
  { month: 'May', salesPercentage: 7.9 },
  { month: 'Jun', salesPercentage: 8.3 },
  { month: 'Jul', salesPercentage: 9.5 },
  { month: 'Aug', salesPercentage: 8.7 },
  { month: 'Sep', salesPercentage: 8.2 },
  { month: 'Oct', salesPercentage: 7.8 },
  { month: 'Nov', salesPercentage: 12.5 },
  { month: 'Dec', salesPercentage: 8.5 }
];

const chartOptions: Highcharts.Options = {
  chart: {
    type: 'line',
    height: 300,
    style: {
      fontFamily: 'inherit'
    }
  },
  title: {
    text: ''
  },
  xAxis: {
    categories: monthlySalesData.map(data => data.month),
    labels: {
      style: {
        color: 'var(--foreground)'
      }
    }
  },
  yAxis: {
    title: {
      text: 'Sales Percentage',
      style: {
        color: 'var(--foreground)'
      }
    },
    labels: {
      format: '{value}%',
      style: {
        color: 'var(--foreground)'
      }
    }
  },
  series: [{
    type: 'line',
    name: '% of Sales',
    data: monthlySalesData.map(data => data.salesPercentage),
    color: '#10B981'
  }],
  credits: {
    enabled: false
  },
  tooltip: {
    formatter: function(this: Highcharts.Point): string {
      return `<b>${this.x}</b><br/>${this.y}%`;
    }
  },
  legend: {
    itemStyle: {
      color: 'var(--foreground)'
    }
  }
};

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [targetRevenue, setTargetRevenue] = useState("25M");
  const itemsPerPage = 25;

  const activities = [
    { type: "collection", text: "Created New Collections (Summer Dresses, Going out dresses)" },
    { type: "experiment", text: "Started Experiment (Dresses +- 5%)" },
    { type: "experiment", text: "Ended Experiment (Dresses +- 5%)" },
    { type: "experiment", text: "Started Experiment (George Foreman Grill +- 10%)" },
    { type: "experiment", text: "Started Experiment (Lower Ground Shipping to $5)" },
    { type: "promotion", text: "Started Promotion (20% off site wide)" },
  ];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentActivities = activities.slice(startIndex, endIndex);
  const totalPages = Math.ceil(activities.length / itemsPerPage);

  const handleRevenueChange = (value: string) => {
    setTargetRevenue(value);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Target Revenue Goal and Incremental Revenue */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Target Revenue Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-3xl font-bold">${targetRevenue}</div>
              <Dialog>
                <DialogTrigger>
                  <Pencil className="h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700" />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Target Revenue</DialogTitle>
                  </DialogHeader>
                  <Input
                    type="text"
                    value={targetRevenue}
                    onChange={(e) => handleRevenueChange(e.target.value)}
                    className="mt-4"
                  />
                </DialogContent>
              </Dialog>
            </div>
            <div className="text-sm text-muted-foreground mt-2">85% to goal</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>New Revenue from Jeff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">$1.25M</div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Sales Chart */}
      <Card>
        <CardHeader>
          <CardTitle>% of Sales by Month LY</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[300px] w-full">
            <HighchartsReact
              highcharts={Highcharts}
              options={chartOptions}
            />
          </div>
        </CardContent>
      </Card>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-4 rounded-lg bg-muted/50"
              >
                <div
                  className={`w-3 h-3 rounded-full mt-1.5 ${
                    activity.type === "collection"
                      ? "bg-blue-500"
                      : activity.type === "experiment"
                      ? "bg-green-500"
                      : "bg-orange-500"
                  }`}
                />
                <p className="text-sm">{activity.text}</p>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
