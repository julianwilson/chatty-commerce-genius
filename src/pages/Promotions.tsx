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
import { useNavigate } from "react-router-dom";

const promotionsData = [
  {
    id: 1,
    name: "Summer dresses sale",
    type: "Sitewide Markdown Sale",
    startDate: "Dec 26 2024",
    endDate: "Jan 08 2025",
    totalSales: "$53,478",
    lyComp: 15.2,
  },
  {
    id: 2,
    name: "Winter clearance",
    type: "Sitewide Discount Code Sale",
    startDate: "Jan 15 2025",
    endDate: "Feb 01 2025",
    totalSales: "$42,890",
    lyComp: -8.5,
  },
  {
    id: 3,
    name: "Valentine's special",
    type: "Collection Sale",
    startDate: "Feb 07 2025",
    endDate: "Feb 14 2025",
    totalSales: "$38,654",
    lyComp: 22.3,
  },
  {
    id: 4,
    name: "Spring collection launch",
    type: "Bogo Sale",
    startDate: "Mar 01 2025",
    endDate: "Mar 15 2025",
    totalSales: "$67,234",
    lyComp: -4.7,
  },
  {
    id: 5,
    name: "Easter weekend deals",
    type: "Free Shipping Sale",
    startDate: "Mar 29 2025",
    endDate: "Apr 01 2025",
    totalSales: "$28,976",
    lyComp: 18.9,
  },
  {
    id: 6,
    name: "Mother's day special",
    type: "Shipping Update",
    startDate: "May 08 2025",
    endDate: "May 12 2025",
    totalSales: "$45,321",
    lyComp: -12.4,
  },
  {
    id: 7,
    name: "Summer swimwear",
    type: "Influencer",
    startDate: "Jun 01 2025",
    endDate: "Jun 30 2025",
    totalSales: "$58,432",
    lyComp: 25.6,
  },
  {
    id: 8,
    name: "Back to school",
    type: "Event",
    startDate: "Aug 15 2025",
    endDate: "Sep 05 2025",
    totalSales: "$72,154",
    lyComp: 9.8,
  },
  {
    id: 9,
    name: "Fall fashion fest",
    type: "Loyalty Bonus",
    startDate: "Sep 20 2025",
    endDate: "Oct 05 2025",
    totalSales: "$49,876",
    lyComp: -6.3,
  },
  {
    id: 10,
    name: "Black Friday deals",
    type: "Sitewide Markdown Sale",
    startDate: "Nov 29 2025",
    endDate: "Dec 02 2025",
    totalSales: "$98,765",
    lyComp: 32.1,
  },
  {
    id: 11,
    name: "Cyber Monday special",
    type: "Sitewide Discount Code Sale",
    startDate: "Dec 02 2025",
    endDate: "Dec 03 2025",
    totalSales: "$87,654",
    lyComp: 28.4,
  }
];

export default function Promotions() {
  const navigate = useNavigate();

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
                    <TableHead>LY % Comp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promotionsData.map((promotion) => (
                    <TableRow key={promotion.id}>
                      <TableCell 
                        className="font-medium cursor-pointer hover:text-blue-600 hover:underline"
                        onClick={() => navigate(`/promotions/${promotion.id}`)}
                      >
                        {promotion.name}
                      </TableCell>
                      <TableCell>{promotion.type}</TableCell>
                      <TableCell>{promotion.startDate}</TableCell>
                      <TableCell>{promotion.endDate}</TableCell>
                      <TableCell>{promotion.totalSales}</TableCell>
                      <TableCell 
                        className={`font-medium ${
                          promotion.lyComp >= 0 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}
                      >
                        {promotion.lyComp > 0 ? '+' : ''}{promotion.lyComp}%
                      </TableCell>
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