import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useState } from "react";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [targetRevenue, setTargetRevenue] = useState("25M");
  const itemsPerPage = 25;

  // Monthly sales data for last year
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

  const recommendations = [
    {
      id: 1,
      text: "I identified these products as good opportunities because they have been selling well and you may be able to increase prices while maintaining the same conversion.",
      products: [
        { 
          id: 1, 
          name: "Summer Floral Dress", 
          price: "$129.99",
          image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901"
        },
        { 
          id: 2, 
          name: "Evening Cocktail Dress", 
          price: "$299.99",
          image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"
        },
        { 
          id: 3, 
          name: "Casual Maxi Dress", 
          price: "$179.99",
          image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1"
        }
      ],
      details: "Based on historical data analysis, these dresses have shown consistent demand and positive customer feedback. The price elasticity study suggests room for a 10-15% price increase without significant impact on conversion rates."
    },
    {
      id: 2,
      text: "Based on historical data, increasing prices by 5% on these items could result in a 3% increase in overall revenue.",
      products: [
        {
          id: 4,
          name: "Classic White Shirt",
          price: "$89.99",
          image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901"
        },
        {
          id: 5,
          name: "Silk Blouse",
          price: "$149.99",
          image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"
        },
        {
          id: 6,
          name: "Linen Button-Down",
          price: "$119.99",
          image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1"
        }
      ],
      details: "Detailed analysis shows stable demand patterns across seasons, with particularly strong performance in business casual categories."
    },
    {
      id: 3,
      text: "Consider bundling these complementary products to increase average order value.",
      products: [
        {
          id: 7,
          name: "Leather Boots",
          price: "$199.99",
          image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901"
        },
        {
          id: 8,
          name: "Running Shoes",
          price: "$159.99",
          image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"
        },
        {
          id: 9,
          name: "Canvas Sneakers",
          price: "$79.99",
          image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1"
        }
      ],
      details: "Customer purchase history indicates strong correlation between these items. Bundle pricing could drive higher cart values and improve overall revenue."
    }
  ];

  const collections = [
    { 
      name: "Dresses", 
      salesPercentage: 35, 
      totalSales: 8750000,
      percentToGoal: 85,
      totalUnits: 25000,
      avgUnitRetail: 350,
      products: 120 
    },
    { 
      name: "Jeans", 
      salesPercentage: 25, 
      totalSales: 6250000,
      percentToGoal: 75,
      totalUnits: 15000,
      avgUnitRetail: 416,
      products: 80 
    },
    { 
      name: "Tops", 
      salesPercentage: 20, 
      totalSales: 5000000,
      percentToGoal: 65,
      totalUnits: 20000,
      avgUnitRetail: 250,
      products: 150 
    },
    { 
      name: "Accessories", 
      salesPercentage: 15, 
      totalSales: 3750000,
      percentToGoal: 55,
      totalUnits: 12500,
      avgUnitRetail: 300,
      products: 200 
    },
    { 
      name: "Shoes", 
      salesPercentage: 5, 
      totalSales: 1250000,
      percentToGoal: 45,
      totalUnits: 2500,
      avgUnitRetail: 500,
      products: 50 
    },
  ];

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
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
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

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((recommendation) => (
                  <div
                    key={recommendation.id}
                    className="flex items-start space-x-4 p-4 rounded-lg bg-muted/50"
                  >
                    <div className="w-3 h-3 rounded-full mt-1.5 bg-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm">
                        {recommendation.text}
                        <Dialog>
                          <DialogTrigger className="text-blue-500 hover:text-blue-700 ml-2 text-sm">
                            See More
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Detailed Recommendation</DialogTitle>
                            </DialogHeader>
                            <p className="mt-4 text-sm text-muted-foreground">
                              {recommendation.details}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                              {recommendation.products.map((product) => (
                                <div key={product.id} className="space-y-2">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-32 object-cover rounded-lg"
                                  />
                                  <h3 className="font-medium">{product.name}</h3>
                                  <p className="text-sm text-muted-foreground">{product.price}</p>
                                </div>
                              ))}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Sales Chart */}
          <Card>
            <CardHeader>
              <CardTitle>% of Sales by Month LY</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ChartContainer
                  config={{
                    sales: {
                      theme: {
                        light: "#10B981",
                        dark: "#10B981"
                      }
                    }
                  }}
                >
                  <LineChart data={monthlySalesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month"
                      tick={{ fill: 'currentColor' }}
                    />
                    <YAxis
                      tick={{ fill: 'currentColor' }}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <ChartTooltip />
                    <Line
                      type="monotone"
                      dataKey="salesPercentage"
                      name="% of Sales"
                      stroke="var(--color-sales)"
                      strokeWidth={2}
                      dot={{ fill: "var(--color-sales)" }}
                    />
                  </LineChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top Down Collection Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Top Down Collection Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>LY % of Overall Sales $</TableHead>
                    <TableHead>YTD Total Sales $</TableHead>
                    <TableHead>% to Goal</TableHead>
                    <TableHead>Total Units</TableHead>
                    <TableHead>Avg. Unit Retail</TableHead>
                    <TableHead># of Products</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {collections.map((collection) => (
                    <TableRow key={collection.name}>
                      <TableCell>{collection.name}</TableCell>
                      <TableCell>{collection.salesPercentage}%</TableCell>
                      <TableCell>${(collection.totalSales).toLocaleString()}</TableCell>
                      <TableCell>{collection.percentToGoal}%</TableCell>
                      <TableCell>{collection.totalUnits.toLocaleString()}</TableCell>
                      <TableCell>${collection.avgUnitRetail}</TableCell>
                      <TableCell>{collection.products}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
