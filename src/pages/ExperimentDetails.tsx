import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
import { useToast } from "@/components/ui/use-toast";
import { ExperimentHeader } from "@/components/experiment/ExperimentHeader";
import { ExperimentMetrics } from "@/components/experiment/ExperimentMetrics";
import { ExperimentSummary } from "@/components/experiment/ExperimentSummary";
import { ExperimentTable } from "@/components/experiment/ExperimentTable";
import { generateExperimentData } from "@/utils/experimentUtils";
import { Product } from "@/types/experiment";

export default function ExperimentDetails() {
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
      <ExperimentHeader
        experimentName={experimentName}
        onBack={() => navigate('/experiments')}
        selectedProducts={selectedProducts}
        selectedVariants={selectedVariants}
        onPublish={(mode) => {
          setPublishMode(mode);
          setShowPublishDialog(true);
        }}
      />

      <ExperimentMetrics />
      
      <ExperimentSummary />
      
      <ExperimentTable
        mockProducts={mockProducts}
        selectedProducts={selectedProducts}
        selectedVariants={selectedVariants}
        experimentData={experimentData}
        onProductSelect={handleProductSelect}
        onVariantSelect={handleVariantSelect}
        onSelectProduct={setSelectedProduct}
        getTestSalesPercentages={getTestSalesPercentages}
        getHighestProfitColumn={getHighestProfitColumn}
        getValueColor={getValueColor}
      />

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