import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SalesPlan = () => {
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Collection Performance</CardTitle>
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
    </div>
  );
};

export default SalesPlan;