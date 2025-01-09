import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Dashboard = () => {
  const [revenueGoal, setRevenueGoal] = useState("25M");
  const [editingGoal, setEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(revenueGoal);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="container mx-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Target Revenue Goal */}
            <Card>
              <CardHeader>
                <CardTitle>Target Revenue Goal</CardTitle>
              </CardHeader>
              <CardContent>
                <Dialog open={editingGoal} onOpenChange={setEditingGoal}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="text-2xl font-bold">
                      ${revenueGoal}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Revenue Goal</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        value={tempGoal}
                        onChange={(e) => setTempGoal(e.target.value)}
                        placeholder="Enter new goal..."
                      />
                      <Button
                        onClick={() => {
                          setRevenueGoal(tempGoal);
                          setEditingGoal(false);
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  I identified these products as good opportunities because they have been
                  selling well and you may be able to increase prices while maintaining
                  the same conversion.
                </p>
                <Button>Create Experiment</Button>
              </CardContent>
            </Card>
          </div>

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
