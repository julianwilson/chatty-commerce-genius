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
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings2, Pencil } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SalesPlan = () => {
  const navigate = useNavigate();
  const [targetRevenue, setTargetRevenue] = useState("25M");
  
  const collections = [
    { 
      id: 288699203767,
      name: "Dresses", 
      salesPercentage: 35, 
      totalSales: 8750000,
      percentToGoal: 85,
      totalUnits: 25000,
      avgUnitRetail: 350,
      markdownPercentage: 25,
      weeksOfSupply: 8.5,
      revenueInPromo: 2187500,
      products: 120,
      sessions: 145000
    },
    { 
      id: 288699236535,
      name: "Jeans", 
      salesPercentage: 25, 
      totalSales: 6250000,
      percentToGoal: 75,
      totalUnits: 15000,
      avgUnitRetail: 416,
      markdownPercentage: 20,
      weeksOfSupply: 6.2,
      revenueInPromo: 1875000,
      products: 80,
      sessions: 98000
    },
    { 
      id: 288699269303,
      name: "Tops", 
      salesPercentage: 20, 
      totalSales: 5000000,
      percentToGoal: 65,
      totalUnits: 20000,
      avgUnitRetail: 250,
      markdownPercentage: 30,
      weeksOfSupply: 4.8,
      revenueInPromo: 1500000,
      products: 150,
      sessions: 125000
    },
    { 
      id: 288699269304,
      name: "Accessories", 
      salesPercentage: 15, 
      totalSales: 3750000,
      percentToGoal: 55,
      totalUnits: 12500,
      avgUnitRetail: 300,
      markdownPercentage: 15,
      weeksOfSupply: 10.5,
      revenueInPromo: 937500,
      products: 200,
      sessions: 85000
    },
    { 
      id: 288699269305,
      name: "Shoes", 
      salesPercentage: 5, 
      totalSales: 1250000,
      percentToGoal: 45,
      totalUnits: 2500,
      avgUnitRetail: 500,
      markdownPercentage: 22,
      weeksOfSupply: 7.3,
      revenueInPromo: 312500,
      products: 50,
      sessions: 45000
    },
  ];

  const [visibleCollections, setVisibleCollections] = useState<string[]>(
    collections.map(c => c.name)
  );

  const toggleCollection = (collectionName: string) => {
    setVisibleCollections(current =>
      current.includes(collectionName)
        ? current.filter(name => name !== collectionName)
        : [...current, collectionName]
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Target Revenue Goal Card */}
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
                  onChange={(e) => setTargetRevenue(e.target.value)}
                  className="mt-4"
                />
              </DialogContent>
            </Dialog>
          </div>
          <div className="text-sm text-muted-foreground mt-2">$5,235,982 of $25,000,000</div>
        </CardContent>
      </Card>

      {/* Collection Performance Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Collection Performance</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="ml-auto">
                <Settings2 className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white">
              {collections.map((collection) => (
                <DropdownMenuCheckboxItem
                  key={collection.name}
                  checked={visibleCollections.includes(collection.name)}
                  onCheckedChange={() => toggleCollection(collection.name)}
                >
                  {collection.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
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
                <TableHead>Markdown %</TableHead>
                <TableHead>Weeks of Supply</TableHead>
                <TableHead>Revenue During Promotions</TableHead>
                <TableHead># of Products</TableHead>
                <TableHead>Sessions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {collections
                .filter(collection => visibleCollections.includes(collection.name))
                .map((collection) => (
                <TableRow key={collection.name}>
                  <TableCell>
                    <button 
                      onClick={() => navigate(`/collections/${collection.id}`)}
                      className="text-primary hover:underline focus:outline-none"
                    >
                      {collection.name}
                    </button>
                  </TableCell>
                  <TableCell>{collection.salesPercentage}%</TableCell>
                  <TableCell>${(collection.totalSales).toLocaleString()}</TableCell>
                  <TableCell>{collection.percentToGoal}%</TableCell>
                  <TableCell>{collection.totalUnits.toLocaleString()}</TableCell>
                  <TableCell>${collection.avgUnitRetail}</TableCell>
                  <TableCell>{collection.markdownPercentage}%</TableCell>
                  <TableCell>{collection.weeksOfSupply}</TableCell>
                  <TableCell>${collection.revenueInPromo.toLocaleString()}</TableCell>
                  <TableCell>{collection.products}</TableCell>
                  <TableCell>{collection.sessions.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesPlan;
