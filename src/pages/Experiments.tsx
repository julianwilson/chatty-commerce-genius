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

const experimentStatuses = ["Draft", "Running", "Paused", "Completed"] as const;

const experimentsData = [
  {
    id: 1,
    name: "Dresses price test",
    status: experimentStatuses[Math.floor(Math.random() * experimentStatuses.length)],
    startDate: "Dec 26 2024",
    endDate: "Jan 08 2025",
    uplift: 15.2,
  },
  {
    id: 2,
    name: "Free shipping threshold",
    status: experimentStatuses[Math.floor(Math.random() * experimentStatuses.length)],
    startDate: "Jan 15 2025",
    endDate: "Feb 01 2025",
    uplift: -8.5,
  },
  {
    id: 3,
    name: "Product description length",
    status: experimentStatuses[Math.floor(Math.random() * experimentStatuses.length)],
    startDate: "Feb 07 2025",
    endDate: "Feb 14 2025",
    uplift: 22.3,
  },
  {
    id: 4,
    name: "Collection page layout",
    status: experimentStatuses[Math.floor(Math.random() * experimentStatuses.length)],
    startDate: "Mar 01 2025",
    endDate: "Mar 15 2025",
    uplift: -4.7,
  },
  {
    id: 5,
    name: "Cart abandonment email",
    status: experimentStatuses[Math.floor(Math.random() * experimentStatuses.length)],
    startDate: "Mar 29 2025",
    endDate: "Apr 01 2025",
    uplift: 18.9,
  }
];

export default function Experiments() {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Experiments</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Experiment
        </Button>
      </div>
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Experiment Name</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Uplift %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {experimentsData.map((experiment) => (
                <TableRow key={experiment.id}>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      experiment.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                      experiment.status === 'Running' ? 'bg-green-100 text-green-800' :
                      experiment.status === 'Paused' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {experiment.status}
                    </span>
                  </TableCell>
                  <TableCell 
                    className="font-medium cursor-pointer hover:text-blue-600 hover:underline"
                    onClick={() => navigate(`/experiments/${experiment.id}`)}
                  >
                    {experiment.name}
                  </TableCell>
                  <TableCell>{experiment.startDate}</TableCell>
                  <TableCell>{experiment.endDate}</TableCell>
                  <TableCell 
                    className={`font-medium ${
                      experiment.uplift >= 0 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}
                  >
                    {experiment.uplift > 0 ? '+' : ''}{experiment.uplift}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}