import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MiniBarChart } from "@/components/MiniBarChart";
import { generateMockSalesData } from "@/lib/mockData";
import { MetricCard } from "@/components/MetricCard";

type ExperimentMetric = {
  metric: string;
  control: number | string;
  testA: number | string;
  testB: number | string;
};

type Product = {
  id: number;
  title: string;
  price: string;
  testWinner: "Control" | "Test A" | "Test B";
  variants: {
    id: number;
    title: string;
    price: string;
    compare_at_price: string | null;
  }[];
};

const mockProducts: Product[] = [
  {
    id: 1,
    title: "Sample Product 1",
    price: "$49.99",
    testWinner: "Control",
    variants: [
      {
        id: 11,
        title: "Small",
        price: "$49.99",
        compare_at_price: "$59.99"
      },
      {
        id: 12,
        title: "Medium",
        price: "$54.99",
        compare_at_price: "$64.99"
      }
    ]
  },
  {
    id: 2,
    title: "Sample Product 2",
    price: "$29.99",
    testWinner: "Test A",
    variants: [
      {
        id: 21,
        title: "Red",
        price: "$29.99",
        compare_at_price: "$39.99"
      },
      {
        id: 22,
        title: "Blue",
        price: "$29.99",
        compare_at_price: "$39.99"
      }
    ]
  }
];

const generateExperimentData = (product: Product): ExperimentMetric[] => [
  {
    metric: "Original Price",
    control: product.price,
    testA: `$${(parseFloat(product.price.replace("$", "")) * 0.9).toFixed(2)}`,
    testB: `$${(parseFloat(product.price.replace("$", "")) * 1.1).toFixed(2)}`,
  },
  {
    metric: "Price",
    control: product.price,
    testA: `$${(parseFloat(product.price.replace("$", "")) * 0.9).toFixed(2)}`,
    testB: `$${(parseFloat(product.price.replace("$", "")) * 1.1).toFixed(2)}`,
  },
  {
    metric: "Price Change %",
    control: "0%",
    testA: "-10%",
    testB: "+10%",
  },
  {
    metric: "Slash Price",
    control: `$${(parseFloat(product.price.replace("$", "")) * 1.2).toFixed(2)}`,
    testA: product.price,
    testB: `$${(parseFloat(product.price.replace("$", "")) * 1.3).toFixed(2)}`,
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
  const [selectedProduct, setSelectedProduct] = useState<Product>(mockProducts[0]);
  const [showPublishDialog, setShowPublishDialog] = useState(false);

  const experimentData = generateExperimentData(selectedProduct);

  const getValueColor = (value: string | number, metric: string) => {
    if (metric === "% of Traffic") return "";
    
    if (typeof value === "string") {
      if (value.includes("%")) {
        const numValue = parseFloat(value.replace("%", "").replace("+", ""));
        if (numValue > 0) return "text-green-600";
        if (numValue < 0) return "text-red-600";
      }
    }
    return "";
  };

  const getHighestProfitColumn = () => {
    const profitRow = experimentData.find(row => row.metric === "Profit GM$");
    if (!profitRow) return { control: false, testA: false, testB: false };

    const values = {
      control: parseFloat(profitRow.control.toString().replace("$", "").replace(",", "")),
      testA: parseFloat(profitRow.testA.toString().replace("$", "").replace(",", "")),
      testB: parseFloat(profitRow.testB.toString().replace("$", "").replace(",", ""))
    };

    const maxValue = Math.max(values.control, values.testA, values.testB);
    
    return {
      control: values.control === maxValue,
      testA: values.testA === maxValue,
      testB: values.testB === maxValue
    };
  };

  const highestProfitColumns = getHighestProfitColumn();

  const handlePublishChanges = () => {
    console.log("Publishing winning changes");
    setShowPublishDialog(false);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/experiments')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Experiment Details #{id}</h1>
        </div>
        <Button onClick={() => setShowPublishDialog(true)}>
          Publish All Winning Changes
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <MetricCard
          title="Overall Change"
          percentage={15.8}
          currentValue={158000}
          previousValue={136000}
          format="number"
        />
        <MetricCard
          title="Incremental Revenue"
          percentage={23.4}
          currentValue={45000}
          previousValue={36000}
          format="currency"
        />
      </div>
      
      <div className="grid grid-cols-[400px,1fr] gap-6">
        <div className="rounded-md border">
          <div className="grid grid-cols-3 w-full text-sm p-3 font-medium bg-muted">
            <div>Product</div>
            <div>Price</div>
            <div>Winner</div>
          </div>
          <Accordion type="single" collapsible>
            {mockProducts.map((product: Product) => (
              <AccordionItem key={product.id} value={product.id.toString()}>
                <AccordionTrigger 
                  className={`px-4 hover:no-underline ${selectedProduct.id === product.id ? 'bg-muted' : ''}`}
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="grid grid-cols-3 w-full text-sm">
                    <div className="font-medium">{product.title}</div>
                    <div>{product.price}</div>
                    <div>{product.testWinner}</div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="px-4 py-2 space-y-2">
                    <div className="grid grid-cols-1 gap-2">
                      {product.variants?.map((variant) => (
                        <div
                          key={variant.id}
                          className="p-3 bg-background rounded-lg border cursor-pointer hover:bg-muted"
                          onClick={() => setSelectedProduct({ ...product, price: variant.price })}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{variant.title}</p>
                              <p className="text-sm text-muted-foreground">
                                Price: {variant.price}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Slash Price: {variant.compare_at_price || "-"}
                              </p>
                            </div>
                            <MiniBarChart data={generateMockSalesData(7)} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Metric</TableHead>
                <TableHead className={highestProfitColumns.control ? "bg-green-100" : ""}>Control</TableHead>
                <TableHead className={highestProfitColumns.testA ? "bg-green-100" : ""}>Test A</TableHead>
                <TableHead className={highestProfitColumns.testB ? "bg-green-100" : ""}>Test B</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {experimentData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{row.metric}</TableCell>
                  <TableCell 
                    className={`${getValueColor(row.control, row.metric)} ${highestProfitColumns.control ? "bg-green-100" : ""}`}
                  >
                    {row.control}
                  </TableCell>
                  <TableCell 
                    className={`${getValueColor(row.testA, row.metric)} ${highestProfitColumns.testA ? "bg-green-100" : ""}`}
                  >
                    {row.testA}
                  </TableCell>
                  <TableCell 
                    className={`${getValueColor(row.testB, row.metric)} ${highestProfitColumns.testB ? "bg-green-100" : ""}`}
                  >
                    {row.testB}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will publish all winning changes from this experiment to your live store. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePublishChanges}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
