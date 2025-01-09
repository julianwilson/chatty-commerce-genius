import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
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
  {
    id: 2,
    name: "Winter clearance",
    type: "Seasonal Sale",
    startDate: "01/15/25",
    endDate: "02/01/25",
    totalSales: "$42,890",
  },
  {
    id: 3,
    name: "Valentine's special",
    type: "Holiday Sale",
    startDate: "02/07/25",
    endDate: "02/14/25",
    totalSales: "$38,654",
  },
  {
    id: 4,
    name: "Spring collection launch",
    type: "New Collection",
    startDate: "03/01/25",
    endDate: "03/15/25",
    totalSales: "$67,234",
  },
  {
    id: 5,
    name: "Easter weekend deals",
    type: "Holiday Sale",
    startDate: "03/29/25",
    endDate: "04/01/25",
    totalSales: "$28,976",
  },
  {
    id: 6,
    name: "Mother's day special",
    type: "Holiday Sale",
    startDate: "05/08/25",
    endDate: "05/12/25",
    totalSales: "$45,321",
  },
  {
    id: 7,
    name: "Summer swimwear",
    type: "Collection Sale",
    startDate: "06/01/25",
    endDate: "06/30/25",
    totalSales: "$58,432",
  },
  {
    id: 8,
    name: "Back to school",
    type: "Seasonal Sale",
    startDate: "08/15/25",
    endDate: "09/05/25",
    totalSales: "$72,154",
  },
  {
    id: 9,
    name: "Fall fashion fest",
    type: "Collection Sale",
    startDate: "09/20/25",
    endDate: "10/05/25",
    totalSales: "$49,876",
  },
  {
    id: 10,
    name: "Black Friday deals",
    type: "Holiday Sale",
    startDate: "11/29/25",
    endDate: "12/02/25",
    totalSales: "$98,765",
  },
  {
    id: 11,
    name: "Cyber Monday special",
    type: "Holiday Sale",
    startDate: "12/02/25",
    endDate: "12/03/25",
    totalSales: "$87,654",
  }
];

export default function Promotions() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 bg-white">
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
        </main>
      </div>
    </SidebarProvider>
  );
}