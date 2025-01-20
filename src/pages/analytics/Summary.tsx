import { useState, useEffect } from "react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ExperimentSummary } from "@/components/experiment/ExperimentSummary";
import { ExperimentTable } from "@/components/experiment/ExperimentTable";
import { ExperimentMetricsGraphs } from "@/components/experiment/ExperimentMetricsGraphs";
import { generateExperimentData } from "@/utils/experimentUtils";
import { Product } from "@/types/experiment";

export default function AnalyticsSummary() {
  const { toast } = useToast();
  const [mockProducts, setMockProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [experiments, setExperiments] = useState([
    { id: "1", name: "Price Testing - Spring Collection" },
    { id: "2", name: "Shipping Test - Free Shipping" },
    { id: "3", name: "Image Test - Product Photos" },
  ]);
  const [selectedExperiment, setSelectedExperiment] = useState<string>("");

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

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Analytics Summary</h1>
        <Select
          value={selectedExperiment}
          onValueChange={setSelectedExperiment}
        >
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select an experiment" />
          </SelectTrigger>
          <SelectContent>
            {experiments.map((experiment) => (
              <SelectItem key={experiment.id} value={experiment.id}>
                {experiment.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedExperiment && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Experiment Overview</h2>
            <ExperimentSummary />
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Metrics</h2>
            <ExperimentMetricsGraphs />
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Product Performance</h2>
            <ExperimentTable
              mockProducts={mockProducts}
              selectedProducts={selectedProducts}
              selectedVariants={selectedVariants}
              experimentData={experimentData}
              onProductSelect={() => {}}
              onVariantSelect={() => {}}
              getGrossSales={() => ({ control: 0, testA: 0, testB: 0 })}
              getTestSalesPercentages={() => ({ control: 0, testA: 0, testB: 0 })}
              getHighestProfitColumn={() => ({ control: false, testA: false, testB: false })}
              getValueColor={() => ""}
            />
          </Card>
        </div>
      )}
    </div>
  );
}
