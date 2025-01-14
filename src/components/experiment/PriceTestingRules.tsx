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
import { Switch } from "@/components/ui/switch";
import { PlusCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

const priceRoundingOptions = [
  "No Rounding",
  "Round Up",
  "Round Nearest",
  "Round Down",
] as const;

const priceAdjustmentTypes = ["Lower by", "Increase By"] as const;

// Helper function to get test group letter
const getTestGroupLetter = (index: number) => {
  return String.fromCharCode(65 + index); // A = 65 in ASCII
};

// Create a dynamic schema based on test groups
const createFormSchema = (testGroups: string[]) => {
  const testGroupFields: Record<string, any> = {};
  
  testGroups.forEach(letter => {
    testGroupFields[`test${letter}PriceAdjustmentType`] = z.enum(priceAdjustmentTypes);
    testGroupFields[`test${letter}PriceAdjustmentPercentage`] = z.number().min(0).max(100);
  });

  return z.object({
    priceRounding: z.enum(priceRoundingOptions),
    priceRoundingValue: z.number().optional(),
    activateViaUtm: z.boolean(),
    successMetric: z.enum(["conversion-rate", "revenue-per-visitor", "click-through-rate", "gross-margin"]),
    ...testGroupFields,
  });
};

type FormValues = z.infer<ReturnType<typeof createFormSchema>>;

interface RulesStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function PriceTestingRules({ onNext, onBack }: RulesStepProps) {
  const [testGroups, setTestGroups] = useState<string[]>(["A", "B"]);
  const formSchema = createFormSchema(testGroups);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      priceRounding: "No Rounding",
      priceRoundingValue: 0.99,
      activateViaUtm: false,
      successMetric: "conversion-rate",
      testAPriceAdjustmentType: "Increase By",
      testAPriceAdjustmentPercentage: 20,
      testBPriceAdjustmentType: "Lower by",
      testBPriceAdjustmentPercentage: 20,
    } as FormValues,
  });

  const selectedPriceRounding = form.watch("priceRounding");

  const onSubmit = (values: FormValues) => {
    console.log("Rules values:", values);
    onNext();
  };

  const addTestGroup = () => {
    const nextLetter = getTestGroupLetter(testGroups.length);
    setTestGroups([...testGroups, nextLetter]);
    
    // Set default values for the new test group
    form.setValue(`test${nextLetter}PriceAdjustmentType` as any, "Increase By");
    form.setValue(`test${nextLetter}PriceAdjustmentPercentage` as any, 20);
  };

  const equalShare = (100 / (testGroups.length + 1)).toFixed(2);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="successMetric"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Success Metric</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a success metric" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="conversion-rate">Conversion Rate</SelectItem>
                    <SelectItem value="revenue-per-visitor">Revenue Per Visitor</SelectItem>
                    <SelectItem value="click-through-rate">Click-Through Rate</SelectItem>
                    <SelectItem value="gross-margin">Gross Margin</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between items-center">
            <h3 className="font-medium">Price Adjustments</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addTestGroup}
              className="gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              New Test Group
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {testGroups.map((letter) => (
              <div key={letter} className="space-y-4">
                <h3 className="font-medium">Test {letter} Price Adjustment</h3>
                <FormField
                  control={form.control}
                  name={`test${letter}PriceAdjustmentType` as any}
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
                  name={`test${letter}PriceAdjustmentPercentage` as any}
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
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <FormLabel>Traffic Allocation</FormLabel>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Control</TableHead>
                {testGroups.map((letter) => (
                  <TableHead key={letter}>Test {letter}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-center">{equalShare}%</TableCell>
                {testGroups.map((letter) => (
                  <TableCell key={letter} className="text-center">
                    {equalShare}%
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="space-y-4">
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

          {selectedPriceRounding !== "No Rounding" && (
            <FormField
              control={form.control}
              name="priceRoundingValue"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <FormField
          control={form.control}
          name="activateViaUtm"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Activate Via UTM Only</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Only activate experiment for traffic from UTM sources
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
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
