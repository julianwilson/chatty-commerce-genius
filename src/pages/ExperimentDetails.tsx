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
import { generateMockSalesData } from "@/lib/mockData";
import { MetricCard } from "@/components/MetricCard";
import { useToast } from "@/components/ui/use-toast";

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
    metric: "Compare At Price",
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
    metric: "Gross Sales $",
    control: "$30,000",
    testA: "$29,000",
    testB: "$29,400",
  },
  {
    metric: "Net Sales $",
    control: "$15,000",
    testA: "$14,500",
    testB: "$14,700",
  },
  {
    metric: "Gross Margin %",
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
    metric: "Conversion Rate",
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
    metric: "Revenue Per Visitor",
    control: "$1.25",
    testA: "$1.45",
    testB: "$1.15",
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
  const { toast } = useToast();
  const [mockProducts, setMockProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [publishMode, setPublishMode] = useState<'all' | 'selected'>('all');
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalTests] = useState("25");

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
          <h1 className="text-2xl font-bold">Experiment Details #{id}</h1>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => {
              setPublishMode('selected');
              setShowPublishDialog(true);
            }}
            disabled={selectedProducts.length === 0 && selectedVariants.length === 0}
          >
            Publish Selected
          </Button>
          <Button onClick={() => {
            setPublishMode('all');
            setShowPublishDialog(true);
          }}>
            Publish All Winning Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>New Revenue Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">$1.25M</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Tests Run</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalTests}</div>
            <div className="text-sm text-muted-foreground mt-2">5 of 25 tests completed</div>
          </CardContent>
        </Card>
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

      <div className="bg-muted/50 rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-2">AI Summary</h2>
        <p className="text-sm text-muted-foreground">
          The experiment has demonstrated significant positive impact with a 15.8% overall improvement in performance metrics. This has translated to an impressive 23.4% increase in incremental revenue, generating an additional $45,000 compared to the control period. The successful variations across multiple products suggest a strong market response to the optimized pricing strategy. Recommended action: Roll out the winning variations across the product catalog to maximize revenue potential while maintaining competitive market positioning.
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
