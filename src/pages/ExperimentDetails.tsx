import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
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
import { Checkbox } from "@/components/ui/checkbox";
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
import { MetricCard } from "@/components/MetricCard";
import { MetricTooltip } from "@/components/MetricTooltip";
import { generateMockSalesData } from "@/lib/mockData";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

const generateExperimentData = (product: Product): ExperimentMetric[] => {
  const price = parseFloat(product.price.replace("$", ""));
  const controlCOGS = price * 0.5;
  const testAPrice = price * 0.9;
  const testBPrice = price * 1.1;

  // Use the same COGS for all variants
  const COGS = controlCOGS;

  // Define units sold for each variant
  const controlUnits = 1200;
  const testAUnits = 1450;
  const testBUnits = 980;

  // Calculate gross sales
  const controlGrossSales = controlUnits * price;
  const testAGrossSales = testAUnits * testAPrice;
  const testBGrossSales = testBUnits * testBPrice;

  // Calculate net sales (gross sales - (COGS * units))
  const controlNetSales = controlGrossSales - (COGS * controlUnits);
  const testANetSales = testAGrossSales - (COGS * testAUnits);
  const testBNetSales = testBGrossSales - (COGS * testBUnits);

  // Generate random impressions between 25000-26500
  const controlImpressions = Math.floor(Math.random() * (26500 - 25000 + 1)) + 25000;
  const testAImpressions = Math.floor(Math.random() * (26500 - 25000 + 1)) + 25000;
  const testBImpressions = Math.floor(Math.random() * (26500 - 25000 + 1)) + 25000;

  // Calculate revenue per view (Gross Sales / Impressions)
  const controlRPV = controlGrossSales / controlImpressions;
  const testARPV = testAGrossSales / testAImpressions;
  const testBRPV = testBGrossSales / testBImpressions;

  // Calculate conversion rate (Total Orders / Impressions * 100)
  const controlConvRate = (controlUnits / controlImpressions) * 100;
  const testAConvRate = (testAUnits / testAImpressions) * 100;
  const testBConvRate = (testBUnits / testBImpressions) * 100;

  // Calculate gross margin percentage (net sales / gross sales * 100)
  const controlGrossMargin = (controlNetSales / controlGrossSales * 100).toFixed(1);
  const testAGrossMargin = (testANetSales / testAGrossSales * 100).toFixed(1);
  const testBGrossMargin = (testBNetSales / testBGrossSales * 100).toFixed(1);

  const compareAtPrice = (price * 1.2).toFixed(2); // Single compare at price for all variants

  return [
    {
      metric: "Price",
      control: `$${price.toFixed(2)}`,
      testA: `$${testAPrice.toFixed(2)}`,
      testB: `$${testBPrice.toFixed(2)}`,
    },
    {
      metric: "Price Change %",
      control: "0%",
      testA: "-10%",
      testB: "+10%",
    },
    {
      metric: "Compare At Price",
      control: `$${compareAtPrice}`,
      testA: `$${compareAtPrice}`,
      testB: `$${compareAtPrice}`,
    },
    {
      metric: "Units Sold",
      control: controlUnits,
      testA: testAUnits,
      testB: testBUnits,
    },
    {
      metric: "COGS",
      control: `$${COGS.toFixed(2)}`,
      testA: `$${COGS.toFixed(2)}`,
      testB: `$${COGS.toFixed(2)}`,
    },
    {
      metric: "Contribution Margin",
      control: `$${(price - COGS).toFixed(2)}`,
      testA: `$${(testAPrice - COGS).toFixed(2)}`,
      testB: `$${(testBPrice - COGS).toFixed(2)}`,
    },
    {
      metric: "Gross Sales $",
      control: `$${controlGrossSales.toFixed(2)}`,
      testA: `$${testAGrossSales.toFixed(2)}`,
      testB: `$${testBGrossSales.toFixed(2)}`,
    },
    {
      metric: "Net Sales $",
      control: `$${controlNetSales.toFixed(2)}`,
      testA: `$${testANetSales.toFixed(2)}`,
      testB: `$${testBNetSales.toFixed(2)}`,
    },
    {
      metric: "Gross Margin %",
      control: `${controlGrossMargin}%`,
      testA: `${testAGrossMargin}%`,
      testB: `${testBGrossMargin}%`,
    },
    {
      metric: "AOV",
      control: `$${(controlGrossSales / controlUnits).toFixed(2)}`,
      testA: `$${(testAGrossSales / testAUnits).toFixed(2)}`,
      testB: `$${(testBGrossSales / testBUnits).toFixed(2)}`,
    },
    {
      metric: "Total Cart Sales $",
      control: `$${(controlGrossSales * 1.15).toFixed(2)}`,
      testA: `$${(testAGrossSales * 1.15).toFixed(2)}`,
      testB: `$${(testBGrossSales * 1.15).toFixed(2)}`,
    },
    {
      metric: "Units Per Transaction",
      control: (controlUnits / (controlUnits * 0.85)).toFixed(2),
      testA: (testAUnits / (testAUnits * 0.85)).toFixed(2),
      testB: (testBUnits / (testBUnits * 0.85)).toFixed(2),
    },
    {
      metric: "Total Orders",
      control: controlUnits,
      testA: testAUnits,
      testB: testBUnits,
    },
    {
      metric: "Conversion Rate",
      control: `${controlConvRate.toFixed(1)}%`,
      testA: `${testAConvRate.toFixed(1)}%`,
      testB: `${testBConvRate.toFixed(1)}%`,
    },
    {
      metric: "Impressions",
      control: controlImpressions,
      testA: testAImpressions,
      testB: testBImpressions,
    },
    {
      metric: "Revenue Per View",
      control: `$${controlRPV.toFixed(2)}`,
      testA: `$${testARPV.toFixed(2)}`,
      testB: `$${testBRPV.toFixed(2)}`,
    },
    {
      metric: "% of Traffic",
      control: "33.33%",
      testA: "33.33%",
      testB: "33.33%",
    },
  ];
};

export default function ExperimentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mockProducts, setMockProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [publishMode, setPublishMode] = useState<'all' | 'selected'>('all');
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [experimentName, setExperimentName] = useState("Price Testing - Spring Collection");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://scentiment.com/products.json');
        const scentimentProducts = response.data.products.slice(0, 5).map((product: any) => ({
          id: product.id,
          title: product.title,
          price: `$${product.variants[0]?.price || '0.00'}`,
          testWinner: ["Control", "Test A", "Test B"][Math.floor(Math.random() * 3)] as "Control" | "Test A" | "Test B",
          variants: product.variants.map((variant: any) => ({
            id: variant.id,
            title: variant.title,
            price: `$${variant.price}`,
            compare_at_price: variant.compare_at_price ? `$${variant.compare_at_price}` : null
          }))
        }));
        
        setMockProducts(scentimentProducts);
        setSelectedProduct(scentimentProducts[0]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error",
          description: "Failed to fetch products. Using fallback data.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  const experimentData = selectedProduct ? generateExperimentData(selectedProduct) : [];

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
    console.log("Publishing changes:", {
      mode: publishMode,
      selectedProducts: selectedProducts,
      selectedVariants: selectedVariants
    });
    setShowPublishDialog(false);
  };

  const handleProductSelect = (productId: number) => {
    const product = mockProducts.find(p => p.id === productId);
    const variantIds = product?.variants.map(v => v.id) || [];
    
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        // Unselect product and its variants
        setSelectedVariants(prev => prev.filter(id => !variantIds.includes(id)));
        return prev.filter(id => id !== productId);
      } else {
        // Select product and its variants
        setSelectedVariants(prev => [...new Set([...prev, ...variantIds])]);
        return [...prev, productId];
      }
    });
  };

  const handleVariantSelect = (variantId: number, productId: number) => {
    setSelectedVariants(prev => {
      if (prev.includes(variantId)) {
        const newVariants = prev.filter(id => id !== variantId);
        // If all variants of a product are unselected, unselect the product too
        const product = mockProducts.find(p => p.id === productId);
        if (product && !product.variants.some(v => newVariants.includes(v.id))) {
          setSelectedProducts(prev => prev.filter(id => id !== productId));
        }
        return newVariants;
      } else {
        return [...prev, variantId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === mockProducts.length) {
      // Unselect all
      setSelectedProducts([]);
      setSelectedVariants([]);
    } else {
      // Select all products and their variants
      const allProductIds = mockProducts.map(p => p.id);
      const allVariantIds = mockProducts.flatMap(p => p.variants.map(v => v.id));
      setSelectedProducts(allProductIds);
      setSelectedVariants(allVariantIds);
    }
  };

  const getTestSalesPercentages = (product: Product) => {
    const salesRow = experimentData.find(row => row.metric === "Units Sold");
    if (!salesRow) return { control: 0, testA: 0, testB: 0 };

    const controlSales = Number(salesRow.control);
    const testASales = Number(salesRow.testA);
    const testBSales = Number(salesRow.testB);
    const totalSales = controlSales + testASales + testBSales;

    return {
      control: (controlSales / totalSales) * 100,
      testA: (testASales / totalSales) * 100,
      testB: (testBSales / totalSales) * 100
    };
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold">{experimentName}</h1>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              Publish
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              disabled={selectedProducts.length === 0 && selectedVariants.length === 0}
              onClick={() => {
                setPublishMode('selected');
                setShowPublishDialog(true);
              }}
            >
              Selected
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setPublishMode('all');
                setShowPublishDialog(true);
              }}
            >
              All Winners
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <MetricCard
          title={<MetricTooltip metric="Revenue Per View">Revenue Per View</MetricTooltip>}
          percentage={21}
          currentValue={1.03}
          previousValue={0.83}
          format="currency"
        />
        <MetricCard
          title={<MetricTooltip metric="Incremental Revenue">Incremental Revenue</MetricTooltip>}
          percentage={23.4}
          currentValue={45000}
          previousValue={36000}
          format="currency"
        />
      </div>

      <div className="bg-muted/50 rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-2">AI Summary</h2>
        <p className="text-sm text-muted-foreground">
          The experiment revealed several standout winners, with Test A's 10% price reduction showing exceptional performance on the Lavender Dreams collection, achieving a 28% increase in conversion rate. The Rose Petals fragrance test variation also demonstrated strong results with a 15% uplift in average order value. However, Test B's 10% price increase notably underperformed, particularly on seasonal items, showing a 20% decrease in units sold. Overall, the winning variations contributed to a 15.8% improvement in performance metrics and generated an additional $45,000 in incremental revenue. Recommended action: Roll out the successful price optimizations across similar product categories while avoiding aggressive price increases on seasonal items.
        </p>
      </div>
      
      <div className="grid grid-cols-[400px,1fr] gap-6">
        <div className="rounded-md border">
          <div className="grid grid-cols-3 w-full text-sm p-3 font-medium bg-muted">
            <div className="flex items-center gap-2">
              <Checkbox 
                checked={selectedProducts.length === mockProducts.length}
                onCheckedChange={handleSelectAll}
              />
              Product
            </div>
            <div>Price</div>
            <div>Winner</div>
          </div>
          <Accordion type="single" collapsible>
            {mockProducts.map((product: Product) => (
              <AccordionItem key={product.id} value={product.id.toString()}>
                <AccordionTrigger className="px-4 hover:no-underline">
                  <div 
                    className="grid grid-cols-3 w-full text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(product);
                    }}
                  >
                    <div className="font-medium flex items-center gap-2">
                      <Checkbox 
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={() => handleProductSelect(product.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      {product.title}
                    </div>
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
                              <div className="flex items-center gap-2">
                                <Checkbox 
                                  checked={selectedVariants.includes(variant.id)}
                                  onCheckedChange={() => handleVariantSelect(variant.id, product.id)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <p className="font-medium">{variant.title}</p>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Price: {variant.price}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Slash Price: {variant.compare_at_price || "-"}
                              </p>
                            </div>
                            <MiniBarChart testData={getTestSalesPercentages(product)} winner={product.testWinner} />
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
                <TableHead className={highestProfitColumns.control ? "bg-green-100" : ""}><MetricTooltip metric="Control">Control</MetricTooltip></TableHead>
                <TableHead className={highestProfitColumns.testA ? "bg-green-100" : ""}><MetricTooltip metric="Test Group">Test A</MetricTooltip></TableHead>
                <TableHead className={highestProfitColumns.testB ? "bg-green-100" : ""}><MetricTooltip metric="Test Group">Test B</MetricTooltip></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {experimentData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium"><MetricTooltip metric={row.metric}>{row.metric}</MetricTooltip></TableCell>
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
              {publishMode === 'all' 
                ? "This action will publish all winning changes from this experiment to your live store."
                : `This action will publish ${selectedProducts.length} selected products and ${selectedVariants.length} variants to your live store.`
              } This action cannot be undone.
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