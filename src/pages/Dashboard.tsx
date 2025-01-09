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
import { ScrollArea } from "@/components/ui/scroll-area";

const Dashboard = () => {
  const [revenueGoal, setRevenueGoal] = useState("25M");
  const [editingGoal, setEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(revenueGoal);

  const collections = [
    { name: "Dresses", salesPercentage: 35, products: 120 },
    { name: "Jeans", salesPercentage: 25, products: 80 },
    { name: "Tops", salesPercentage: 20, products: 150 },
    { name: "Accessories", salesPercentage: 15, products: 200 },
    { name: "Shoes", salesPercentage: 5, products: 50 },
  ];

  const activities = [
    { type: "collection", text: "Created New Collections (Summer Dresses, Going out dresses)" },
    { type: "experiment", text: "Started Experiment (Dresses +- 5%)" },
    { type: "experiment", text: "Ended Experiment (Dresses +- 5%)" },
    { type: "experiment", text: "Started Experiment (George Foreman Grill +- 10%)" },
    { type: "experiment", text: "Started Experiment (Lower Ground Shipping to $5)" },
    { type: "promotion", text: "Started Promotion (20% off site wide)" },
  ];

  return (
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
                <TableHead>% of Overall Sales $</TableHead>
                <TableHead># of Products</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {collections.map((collection) => (
                <TableRow key={collection.name}>
                  <TableCell>{collection.name}</TableCell>
                  <TableCell>{collection.salesPercentage}%</TableCell>
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
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {activities.map((activity, index) => (
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
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;