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
import { Plus, Settings2 } from "lucide-react";
import { useState } from "react"; // Added this import
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const experimentStatuses = ["Draft", "Running", "Paused", "Completed"] as const;

const experimentsData = [
  {
    id: 1,
    name: "Dresses price test",
    status: "Running",
    startDate: "Dec 26 2024",
    endDate: "Jan 08 2025",
    uplift: 15.2,
    sessions: 2451,
  },
  {
    id: 2,
    name: "Free shipping threshold",
    status: experimentStatuses[Math.floor(Math.random() * experimentStatuses.length)],
    startDate: "Jan 15 2025",
    endDate: "Feb 01 2025",
    uplift: -8.5,
    sessions: 1832,
  },
  {
    id: 3,
    name: "Product description length",
    status: experimentStatuses[Math.floor(Math.random() * experimentStatuses.length)],
    startDate: "Feb 07 2025",
    endDate: "Feb 14 2025",
    uplift: 22.3,
    sessions: 3102,
  },
  {
    id: 4,
    name: "Collection page layout",
    status: experimentStatuses[Math.floor(Math.random() * experimentStatuses.length)],
    startDate: "Mar 01 2025",
    endDate: "Mar 15 2025",
    uplift: -4.7,
    sessions: 2789,
  },
  {
    id: 5,
    name: "Cart abandonment email",
    status: experimentStatuses[Math.floor(Math.random() * experimentStatuses.length)],
    startDate: "Mar 29 2025",
    endDate: "Apr 01 2025",
    uplift: 18.9,
    sessions: 1945,
  }
];

type Column = {
  id: string;
  label: string;
};

const columns: Column[] = [
  { id: "status", label: "Status" },
  { id: "name", label: "Experiment Name" },
  { id: "startDate", label: "Start Date" },
  { id: "endDate", label: "End Date" },
  { id: "sessions", label: "Sessions" },
  { id: "uplift", label: "Uplift %" },
];

export default function Experiments() {
  const navigate = useNavigate();
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    columns.map(col => col.id)
  );

  const handleRowClick = (id: number) => {
    navigate(`/experiments/${id}`);
  };

  const toggleColumn = (columnId: string) => {
    setVisibleColumns(current =>
      current.includes(columnId)
        ? current.filter(id => id !== columnId)
        : [...current, columnId]
    );
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Experiments</h1>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings2 className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              {columns.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={visibleColumns.includes(column.id)}
                  onCheckedChange={() => toggleColumn(column.id)}
                >
                  {column.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={() => navigate('/experiments/create')}>
            <Plus className="mr-2 h-4 w-4" /> New Experiment
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  visibleColumns.includes(column.id) && (
                    <TableHead key={column.id}>{column.label}</TableHead>
                  )
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {experimentsData.map((experiment) => (
                <TableRow 
                  key={experiment.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleRowClick(experiment.id)}
                >
                  {visibleColumns.includes('status') && (
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
                  )}
                  {visibleColumns.includes('name') && (
                    <TableCell className="font-medium">
                      {experiment.name}
                    </TableCell>
                  )}
                  {visibleColumns.includes('startDate') && (
                    <TableCell>{experiment.startDate}</TableCell>
                  )}
                  {visibleColumns.includes('endDate') && (
                    <TableCell>{experiment.endDate}</TableCell>
                  )}
                  {visibleColumns.includes('sessions') && (
                    <TableCell>{experiment.sessions.toLocaleString()}</TableCell>
                  )}
                  {visibleColumns.includes('uplift') && (
                    <TableCell 
                      className={`font-medium ${
                        experiment.uplift >= 0 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}
                    >
                      {experiment.uplift > 0 ? '+' : ''}{experiment.uplift}%
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
