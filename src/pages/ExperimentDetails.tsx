import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

type ExperimentMetric = {
  metric: string;
  control: number | string;
  testA: number | string;
  testB: number | string;
};

const experimentData: ExperimentMetric[] = [
  {
    metric: "Original Price",
    control: "$49.99",
    testA: "$44.99",
    testB: "$54.99",
  },
  {
    metric: "Price",
    control: "$49.99",
    testA: "$44.99",
    testB: "$54.99",
  },
  {
    metric: "Price Change %",
    control: "0%",
    testA: "-10%",
    testB: "+10%",
  },
  {
    metric: "Slash Price",
    control: "$59.99",
    testA: "$54.99",
    testB: "$64.99",
  },
  {
    metric: "Units Sold",
    control: 1200,
    testA: 1450,
    testB: 980,
  },
  {
    metric: "COGS",
    control: "$24.99",
    testA: "$24.99",
    testB: "$24.99",
  },
  {
    metric: "Profit GM$",
    control: "$30,000",
    testA: "$29,000",
    testB: "$29,400",
  },
  {
    metric: "Profit GM%",
    control: "50%",
    testA: "44%",
    testB: "54%",
  },
  {
    metric: "AOV",
    control: "$55",
    testA: "$52",
    testB: "$58",
  },
  {
    metric: "Total Orders",
    control: 1100,
    testA: 1300,
    testB: 900,
  },
  {
    metric: "CTR",
    control: "2.5%",
    testA: "2.8%",
    testB: "2.2%",
  },
  {
    metric: "Impressions",
    control: 50000,
    testA: 50000,
    testB: 50000,
  },
  {
    metric: "% of Traffic",
    control: "33.33%",
    testA: "33.33%",
    testB: "33.33%",
  },
];

export default function ExperimentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const getValueColor = (value: string | number, metric: string) => {
    if (metric === "% of Traffic") return ""; // No color for traffic percentage
    
    if (typeof value === "string") {
      // Check if the value is a percentage
      if (value.includes("%")) {
        const numValue = parseFloat(value.replace("%", "").replace("+", ""));
        if (numValue > 0) return "text-green-600";
        if (numValue < 0) return "text-red-600";
      }
    }
    return "";
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/experiments')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Experiment Details #{id}</h1>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Metric</TableHead>
              <TableHead>Control</TableHead>
              <TableHead>Test A</TableHead>
              <TableHead>Test B</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {experimentData.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{row.metric}</TableCell>
                <TableCell className={getValueColor(row.control, row.metric)}>
                  {row.control}
                </TableCell>
                <TableCell className={getValueColor(row.testA, row.metric)}>
                  {row.testA}
                </TableCell>
                <TableCell className={getValueColor(row.testB, row.metric)}>
                  {row.testB}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
