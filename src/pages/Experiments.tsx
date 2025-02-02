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
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MetricTooltip } from "@/components/MetricTooltip";
import { Badge } from "@/components/ui/badge"; // Import Badge component

const experimentStatuses = ["Draft", "Running", "Paused", "Completed"] as const;
const experimentTypes = ["Price Testing", "Image Testing"] as const;
const successMetrics = ["conversion-rate", "revenue-per-visitor", "click-through-rate", "gross-margin"] as const;

const experimentsData = [
  {
    id: 1,
    name: "Dresses price test",
    status: "Running",
    type: experimentTypes[Math.floor(Math.random() * experimentTypes.length)],
    startDate: "Dec 26 2024",
    endDate: "Jan 08 2025",
    sessions: 2451,
    successMetric: successMetrics[Math.floor(Math.random() * successMetrics.length)],
    incrementalChange: (Math.random() * 30 - 5).toFixed(1), // Random between -5 and +25
  },
  {
    id: 2,
    name: "Free shipping threshold",
    status: experimentStatuses[Math.floor(Math.random() * experimentStatuses.length)],
    type: experimentTypes[Math.floor(Math.random() * experimentTypes.length)],
    startDate: "Jan 15 2025",
    endDate: "Feb 01 2025",
    sessions: 1832,
    successMetric: successMetrics[Math.floor(Math.random() * successMetrics.length)],
    incrementalChange: (Math.random() * 30 - 5).toFixed(1),
  },
  {
    id: 3,
    name: "Product description length",
    status: experimentStatuses[Math.floor(Math.random() * experimentStatuses.length)],
    type: experimentTypes[Math.floor(Math.random() * experimentTypes.length)],
    startDate: "Feb 07 2025",
    endDate: "Feb 14 2025",
    sessions: 3102,
    successMetric: successMetrics[Math.floor(Math.random() * successMetrics.length)],
    incrementalChange: (Math.random() * 30 - 5).toFixed(1),
  },
  {
    id: 4,
    name: "Collection page layout",
    status: experimentStatuses[Math.floor(Math.random() * experimentStatuses.length)],
    type: experimentTypes[Math.floor(Math.random() * experimentTypes.length)],
    startDate: "Mar 01 2025",
    endDate: "Mar 15 2025",
    sessions: 2789,
    successMetric: successMetrics[Math.floor(Math.random() * successMetrics.length)],
    incrementalChange: (Math.random() * 30 - 5).toFixed(1),
  },
  {
    id: 5,
    name: "Cart abandonment email",
    status: experimentStatuses[Math.floor(Math.random() * experimentStatuses.length)],
    type: experimentTypes[Math.floor(Math.random() * experimentTypes.length)],
    startDate: "Mar 29 2025",
    endDate: "Apr 01 2025",
    sessions: 1945,
    successMetric: successMetrics[Math.floor(Math.random() * successMetrics.length)],
    incrementalChange: (Math.random() * 30 - 5).toFixed(1),
  }
];

type Column = {
  id: string;
  label: string;
};

const columns: Column[] = [
  { id: "status", label: "Status" },
  { id: "name", label: "Experiment Name" },
  { id: "type", label: "Type" },
  { id: "startDate", label: "Start Date" },
  { id: "endDate", label: "End Date" },
  { id: "sessions", label: "Impressions" },
  { id: "successMetric", label: "Success Metric" },
  { id: "incrementalChange", label: "Avg. Variant Change" },
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

  const formatSuccessMetric = (metric: string) => {
    return metric.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Experiments</h1>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/experiments/create')}>
            <Plus className="mr-2 h-4 w-4" /> New Experiment
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings2 className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background">
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
        </div>
      </div>

      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  visibleColumns.includes(column.id) && (
                    <TableHead key={column.id}><MetricTooltip metric={column.label}>{column.label}</MetricTooltip></TableHead>
                  )
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {experimentsData.map((experiment) => (
                <TableRow 
                  key={experiment.id}
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => handleRowClick(experiment.id)}
                >
                  {visibleColumns.includes('status') && (
                    <TableCell>
                      <Badge variant={
                        experiment.status === 'Running' ? 'default' : 'secondary'
                      }>
                        {experiment.status}
                      </Badge>
                    </TableCell>
                  )}
                  {visibleColumns.includes('name') && (
                    <TableCell className="font-medium">
                      {experiment.name}
                    </TableCell>
                  )}
                  {visibleColumns.includes('type') && (
                    <TableCell>
                      <Badge variant="secondary">
                        {experiment.type}
                      </Badge>
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
                  {visibleColumns.includes('successMetric') && (
                    <TableCell>
                      {formatSuccessMetric(experiment.successMetric)}
                    </TableCell>
                  )}
                  {visibleColumns.includes('incrementalChange') && (
                    <TableCell>
                      <span className={
                        experiment.incrementalChange >= 0 
                          ? 'text-[#1D9BF0]'
                          : 'text-black'
                      }>
                        {experiment.incrementalChange > 0 && '+'}
                        {experiment.incrementalChange}%
                      </span>
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
