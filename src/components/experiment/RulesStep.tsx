import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const priceRoundingOptions = [
  "No Rounding",
  "Round up to .99",
  "Round up to .00",
  "Round to nearest .99",
  "Round to nearest .00",
] as const;

const priceAdjustmentTypes = ["Lower by", "Increase By"] as const;

const formSchema = z.object({
  priceRounding: z.enum(priceRoundingOptions),
  testAPriceAdjustmentType: z.enum(priceAdjustmentTypes),
  testAPriceAdjustmentPercentage: z.number().min(0).max(100),
  testBPriceAdjustmentType: z.enum(priceAdjustmentTypes),
  testBPriceAdjustmentPercentage: z.number().min(0).max(100),
});

type FormValues = z.infer<typeof formSchema>;

interface RulesStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function RulesStep({ onNext, onBack }: RulesStepProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      priceRounding: "No Rounding",
      testAPriceAdjustmentType: "Increase By",
      testAPriceAdjustmentPercentage: 20,
      testBPriceAdjustmentType: "Lower by",
      testBPriceAdjustmentPercentage: 20,
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log("Rules values:", values);
    onNext();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="font-medium">Test A Price Adjustment</h3>
              <FormField
                control={form.control}
                name="testAPriceAdjustmentType"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select adjustment type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {priceAdjustmentTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="testAPriceAdjustmentPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-4">
              <h3 className="font-medium">Test B Price Adjustment</h3>
              <FormField
                control={form.control}
                name="testBPriceAdjustmentType"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select adjustment type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {priceAdjustmentTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="testBPriceAdjustmentPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <FormLabel>Traffic Allocation</FormLabel>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Control</TableHead>
                <TableHead>Test A</TableHead>
                <TableHead>Test B</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-center">33.33%</TableCell>
                <TableCell className="text-center">33.33%</TableCell>
                <TableCell className="text-center">33.33%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <FormField
          control={form.control}
          name="priceRounding"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price Rounding</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select price rounding" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {priceRoundingOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit">Next</Button>
        </div>
      </form>
    </Form>
  );
}