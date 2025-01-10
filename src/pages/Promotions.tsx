import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreatePromotionModal } from "@/components/CreatePromotionModal";

const promotionStatuses = ["Draft", "Scheduled", "Running", "Ended"] as const;

const promotionsData = [
  {
    id: 1,
    name: "Summer dresses sale",
    type: "Sitewide Markdown Sale",
    status: promotionStatuses[Math.floor(Math.random() * promotionStatuses.length)],
    startDate: "Dec 26 2024",
    endDate: "Jan 08 2025",
    totalSales: "$53,478",
    lyComp: 15.2,
  },
  {
    id: 2,
    name: "Winter clearance",
    type: "Sitewide Discount Code Sale",
    status: promotionStatuses[Math.floor(Math.random() * promotionStatuses.length)],
    startDate: "Jan 15 2025",
    endDate: "Feb 01 2025",
    totalSales: "$42,890",
    lyComp: -8.5,
  },
  {
    id: 3,
    name: "Valentine's special",
    type: "Collection Sale",
    status: promotionStatuses[Math.floor(Math.random() * promotionStatuses.length)],
    startDate: "Feb 07 2025",
    endDate: "Feb 14 2025",
    totalSales: "$38,654",
    lyComp: 22.3,
  },
  {
    id: 4,
    name: "Spring collection launch",
    type: "Bogo Sale",
    status: promotionStatuses[Math.floor(Math.random() * promotionStatuses.length)],
    startDate: "Mar 01 2025",
    endDate: "Mar 15 2025",
    totalSales: "$67,234",
    lyComp: -4.7,
  },
  {
    id: 5,
    name: "Easter weekend deals",
    type: "Free Shipping Sale",
    status: promotionStatuses[Math.floor(Math.random() * promotionStatuses.length)],
    startDate: "Mar 29 2025",
    endDate: "Apr 01 2025",
    totalSales: "$28,976",
    lyComp: 18.9,
  },
  {
    id: 6,
    name: "Mother's day special",
    type: "Shipping Update",
    status: promotionStatuses[Math.floor(Math.random() * promotionStatuses.length)],
    startDate: "May 08 2025",
    endDate: "May 12 2025",
    totalSales: "$45,321",
    lyComp: -12.4,
  },
  {
    id: 7,
    name: "Summer swimwear",
    type: "Influencer",
    status: promotionStatuses[Math.floor(Math.random() * promotionStatuses.length)],
    startDate: "Jun 01 2025",
    endDate: "Jun 30 2025",
    totalSales: "$58,432",
    lyComp: 25.6,
  },
  {
    id: 8,
    name: "Back to school",
    type: "Event",
    status: promotionStatuses[Math.floor(Math.random() * promotionStatuses.length)],
    startDate: "Aug 15 2025",
    endDate: "Sep 05 2025",
    totalSales: "$72,154",
    lyComp: 9.8,
  },
  {
    id: 9,
    name: "Fall fashion fest",
    type: "Loyalty Bonus",
    status: promotionStatuses[Math.floor(Math.random() * promotionStatuses.length)],
    startDate: "Sep 20 2025",
    endDate: "Oct 05 2025",
    totalSales: "$49,876",
    lyComp: -6.3,
  },
  {
    id: 10,
    name: "Black Friday deals",
    type: "Sitewide Markdown Sale",
    status: promotionStatuses[Math.floor(Math.random() * promotionStatuses.length)],
    startDate: "Nov 29 2025",
    endDate: "Dec 02 2025",
    totalSales: "$98,765",
    lyComp: 32.1,
  },
  {
    id: 11,
    name: "Cyber Monday special",
    type: "Sitewide Discount Code Sale",
    status: promotionStatuses[Math.floor(Math.random() * promotionStatuses.length)],
    startDate: "Dec 02 2025",
    endDate: "Dec 03 2025",
    totalSales: "$87,654",
    lyComp: 28.4,
  }
];

export default function Promotions() {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Promotions</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Promotion
        </Button>
      </div>
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
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
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      promotion.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                      promotion.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                      promotion.status === 'Running' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {promotion.status}
                    </span>
                  </TableCell>
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

      <CreatePromotionModal 
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}