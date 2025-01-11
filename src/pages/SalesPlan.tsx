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
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import { useState } from "react";

const SalesPlan = () => {
  const collections = [
    { 
      name: "Dresses", 
      salesPercentage: 35, 
      totalSales: 8750000,
      percentToGoal: 85,
      totalUnits: 25000,
      avgUnitRetail: 350,
      products: 120,
      sessions: 145000
    },
    { 
      name: "Jeans", 
      salesPercentage: 25, 
      totalSales: 6250000,
      percentToGoal: 75,
      totalUnits: 15000,
      avgUnitRetail: 416,
      products: 80,
      sessions: 98000
    },
    { 
      name: "Tops", 
      salesPercentage: 20, 
      totalSales: 5000000,
      percentToGoal: 65,
      totalUnits: 20000,
      avgUnitRetail: 250,
      products: 150,
      sessions: 125000
    },
    { 
      name: "Accessories", 
      salesPercentage: 15, 
      totalSales: 3750000,
      percentToGoal: 55,
      totalUnits: 12500,
      avgUnitRetail: 300,
      products: 200,
      sessions: 85000
    },
    { 
      name: "Shoes", 
      salesPercentage: 5, 
      totalSales: 1250000,
      percentToGoal: 45,
      totalUnits: 2500,
      avgUnitRetail: 500,
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
                <TableHead># of Products</TableHead>
                <TableHead>Sessions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {collections
                .filter(collection => visibleCollections.includes(collection.name))
                .map((collection) => (
                <TableRow key={collection.name}>
                  <TableCell>{collection.name}</TableCell>
                  <TableCell>{collection.salesPercentage}%</TableCell>
                  <TableCell>${(collection.totalSales).toLocaleString()}</TableCell>
                  <TableCell>{collection.percentToGoal}%</TableCell>
                  <TableCell>{collection.totalUnits.toLocaleString()}</TableCell>
                  <TableCell>${collection.avgUnitRetail}</TableCell>
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