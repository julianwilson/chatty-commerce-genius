import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const promotionsData = [
  {
    id: 1,
    name: "Summer dresses sale",
    type: "Collection Sale",
    startDate: "12/26/24",
    endDate: "01/08/25",
    totalSales: "$53,478",
  },
];

export default function Promotions() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Promotions</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Promotion Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Total Sales $</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promotionsData.map((promotion) => (
              <TableRow key={promotion.id}>
                <TableCell className="font-medium">{promotion.name}</TableCell>
                <TableCell>{promotion.type}</TableCell>
                <TableCell>{promotion.startDate}</TableCell>
                <TableCell>{promotion.endDate}</TableCell>
                <TableCell>{promotion.totalSales}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}