import { MiniBarChart } from "@/components/MiniBarChart";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MetricTooltip } from "@/components/MetricTooltip";
import { MoneyDisplay } from "@/components/MoneyDisplay";
import { Product, ExperimentMetric } from "@/types/experiment";

interface ExperimentTableProps {
  mockProducts: Product[];
  selectedProducts: number[];
  selectedVariants: number[];
  experimentData: ExperimentMetric[];
  onProductSelect: (productId: number) => void;
  onVariantSelect: (variantId: number, productId: number) => void;
  onSelectProduct: (product: Product) => void;
  getTestSalesPercentages: (product: Product) => { control: number; testA: number; testB: number };
  getHighestProfitColumn: () => { control: boolean; testA: boolean; testB: boolean };
  getValueColor: (value: string | number, metric: string) => string;
}

export const ExperimentTable = ({
  mockProducts,
  selectedProducts,
  selectedVariants,
  experimentData,
  onProductSelect,
  onVariantSelect,
  onSelectProduct,
  getTestSalesPercentages,
  getHighestProfitColumn,
  getValueColor,
}: ExperimentTableProps) => {
  const highestProfitColumns = getHighestProfitColumn();

  return (
    <div className="grid grid-cols-[400px,1fr] gap-6">
      <div className="rounded-md border">
        <div className="grid grid-cols-3 w-full text-sm p-3 font-medium bg-muted">
          <div className="flex items-center gap-2">
            <Checkbox 
              checked={selectedProducts.length === mockProducts.length}
              onCheckedChange={() => {
                if (selectedProducts.length === mockProducts.length) {
                  onProductSelect(-1); // Deselect all
                } else {
                  mockProducts.forEach(p => onProductSelect(p.id)); // Select all
                }
              }}
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
                    onSelectProduct(product);
                  }}
                >
                  <div className="font-medium flex items-center gap-2">
                    <Checkbox 
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={() => onProductSelect(product.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    {product.title}
                  </div>
                  <div><MoneyDisplay value={product.price} /></div>
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
                        onClick={() => onSelectProduct({ ...product, price: variant.price })}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <Checkbox 
                                checked={selectedVariants.includes(variant.id)}
                                onCheckedChange={() => onVariantSelect(variant.id, product.id)}
                                onClick={(e) => e.stopPropagation()}
                              />
                              <p className="font-medium">{variant.title}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Price: <MoneyDisplay value={variant.price} />
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
              <TableHead className={highestProfitColumns.control ? "bg-green-100" : ""}>
                <MetricTooltip metric="Control">Control</MetricTooltip>
              </TableHead>
              <TableHead className={highestProfitColumns.testA ? "bg-green-100" : ""}>
                <MetricTooltip metric="Test Group">Test A</MetricTooltip>
              </TableHead>
              <TableHead className={highestProfitColumns.testB ? "bg-green-100" : ""}>
                <MetricTooltip metric="Test Group">Test B</MetricTooltip>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {experimentData.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  <MetricTooltip metric={row.metric}>{row.metric}</MetricTooltip>
                </TableCell>
                <TableCell 
                  className={`${getValueColor(row.control, row.metric)} ${highestProfitColumns.control ? "bg-green-100" : ""}`}
                >
                  <MoneyDisplay value={row.control} format={row.format} />
                </TableCell>
                <TableCell 
                  className={`${getValueColor(row.testA, row.metric)} ${highestProfitColumns.testA ? "bg-green-100" : ""}`}
                >
                  <MoneyDisplay value={row.testA} format={row.format} />
                </TableCell>
                <TableCell 
                  className={`${getValueColor(row.testB, row.metric)} ${highestProfitColumns.testB ? "bg-green-100" : ""}`}
                >
                  <MoneyDisplay value={row.testB} format={row.format} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};