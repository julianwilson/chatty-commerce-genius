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

const generateExperimentData = (product: Product): ExperimentMetric[] => {
  const price = parseFloat(product.price.replace("$", ""));
  const controlCOGS = price * 0.5;
  const testAPrice = price * 0.9;
  const testBPrice = price * 1.1;

  const COGS = controlCOGS;

  const controlUnits = 1200;
  const testAUnits = 1450;
  const testBUnits = 980;

  const controlGrossSales = controlUnits * price;
  const testAGrossSales = testAUnits * testAPrice;
  const testBGrossSales = testBUnits * testBPrice;

  const controlNetSales = controlGrossSales - (COGS * controlUnits);
  const testANetSales = testAGrossSales - (COGS * testAUnits);
  const testBNetSales = testBGrossSales - (COGS * testBUnits);

  const controlGrossMargin = (controlNetSales / controlGrossSales * 100).toFixed(1);
  const testAGrossMargin = (testANetSales / testAGrossSales * 100).toFixed(1);
  const testBGrossMargin = (testBNetSales / testBGrossSales * 100).toFixed(1);

  return [
    {
      metric: "Price",
      control: `$${price.toFixed(2)}`,
      testA: `$${testAPrice.toFixed(2)}`,
      testB: `$${testBPrice.toFixed(2)}`,
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
  ];
};

const generateCartEconomicsData = (product: Product): ExperimentMetric[] => {
  const price = parseFloat(product.price.replace("$", ""));
  const controlUnits = 1200;
  const testAUnits = 1450;
  const testBUnits = 980;
  
  const controlGrossSales = controlUnits * price;
  const testAGrossSales = testAUnits * (price * 0.9);
  const testBGrossSales = testBUnits * (price * 1.1);

  return [
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
  ];
};

const getTestSalesPercentages = (product: Product) => {
  const basePercentage = 65;
  const winningPercentage = 100;
  
  return {
    control: product.testWinner === "Control" ? winningPercentage : basePercentage,
    testA: product.testWinner === "Test A" ? winningPercentage : basePercentage,
    testB: product.testWinner === "Test B" ? winningPercentage : basePercentage,
  };
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
  const cartEconomicsData = selectedProduct ? generateCartEconomicsData(selectedProduct) : [];

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
        setSelectedVariants(prev => prev.filter(id => !variantIds.includes(id)));
        return prev.filter(id => id !== productId);
      } else {
        setSelectedVariants(prev => [...new Set([...prev, ...variantIds])]);
        return [...prev, productId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === mockProducts.length) {
      setSelectedProducts([]);
      setSelectedVariants([]);
    } else {
      const allProductIds = mockProducts.map(p => p.id);
      const allVariantIds = mockProducts.flatMap(p => p.variants.map(v => v.id));
      setSelectedProducts(allProductIds);
      setSelectedVariants(allVariantIds);
    }
  };

  const handleVariantSelect = (variantId: number, productId: number) => {
    const product = mockProducts.find(p => p.id === productId);
    
    setSelectedVariants(prev => {
      if (prev.includes(variantId)) {
        const remainingVariants = prev.filter(id => id !== variantId);
        const productVariants = product?.variants.map(v => v.id) || [];
        const hasRemainingProductVariants = productVariants.some(id => remainingVariants.includes(id));
        
        if (!hasRemainingProductVariants) {
          setSelectedProducts(prev => prev.filter(id => id !== productId));
        }
        
        return remainingVariants;
      } else {
        if (!selectedProducts.includes(productId)) {
          setSelectedProducts(prev => [...prev, productId]);
        }
        return [...prev, variantId];
      }
    });
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

      <div className="grid grid-cols-[400px,1fr] gap-6 mb-6">
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

        <div className="space-y-6">
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

          <div className="rounded-md border">
            <div className="p-4 bg-muted/50 border-b">
              <h3 className="font-semibold">Cart Economics</h3>
            </div>
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
                {cartEconomicsData.map((row, index) => (
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
