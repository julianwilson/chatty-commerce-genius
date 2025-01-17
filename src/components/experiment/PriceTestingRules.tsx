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
import { PlusCircle, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { MetricTooltip } from "../MetricTooltip";

const priceRoundingOptions = [
  "No Rounding",
  "Round Up",
  "Round Nearest",
  "Round Down",
] as const;

const priceAdjustmentTypes = ["Lower by", "Increase By"] as const;

const getTestGroupLetter = (index: number) => {
  return String.fromCharCode(65 + index);
};

const createFormSchema = (testGroups: string[]) => {
  const testGroupFields: Record<string, any> = {};
  
  testGroups.forEach(letter => {
    testGroupFields[`test${letter}PriceAdjustmentType`] = z.enum(priceAdjustmentTypes);
    testGroupFields[`test${letter}PriceAdjustmentPercentage`] = z.number().min(0).max(100);
    testGroupFields[`test${letter}PriceRounding`] = z.enum(priceRoundingOptions);
    testGroupFields[`test${letter}PriceRoundingValue`] = z.number().optional();
    testGroupFields[`test${letter}TrafficAllocation`] = z.number().min(0).max(100);
  });

  return z.object({
    activateViaUtm: z.boolean(),
    controlTrafficAllocation: z.number().min(0).max(100),
    ...testGroupFields,
  });
};

type FormValues = z.infer<ReturnType<typeof createFormSchema>>;

interface RulesStepProps {
  onNext: () => void;
  onBack: () => void;
  successMetric?: string;
}

export function PriceTestingRules({ onNext, onBack, successMetric }: RulesStepProps) {
  const [testGroups, setTestGroups] = useState<string[]>(["A", "B"]);
  const formSchema = createFormSchema(testGroups);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      activateViaUtm: false,
      controlTrafficAllocation: 33.33,
      testAPriceAdjustmentType: "Increase By",
      testAPriceAdjustmentPercentage: 20,
      testAPriceRounding: "No Rounding",
      testAPriceRoundingValue: 0.99,
      testATrafficAllocation: 33.33,
      testBPriceAdjustmentType: "Lower by",
      testBPriceAdjustmentPercentage: 20,
      testBPriceRounding: "No Rounding",
      testBPriceRoundingValue: 0.99,
      testBTrafficAllocation: 33.34,
    } as FormValues,
  });

  const removeTestGroup = (letterToRemove: string) => {
    const remainingGroups = testGroups.filter(letter => letter !== letterToRemove);
    setTestGroups(remainingGroups);

    // Redistribute traffic allocation
    const removedAllocation = form.getValues(`test${letterToRemove}TrafficAllocation` as any);
    const redistributedShare = removedAllocation / (remainingGroups.length + 1); // +1 for control

    // Update control allocation
    const newControlAllocation = form.getValues('controlTrafficAllocation') + redistributedShare;
    form.setValue('controlTrafficAllocation', newControlAllocation);

    // Update remaining test groups allocation
    remainingGroups.forEach(letter => {
      const currentValue = form.getValues(`test${letter}TrafficAllocation` as any);
      form.setValue(`test${letter}TrafficAllocation` as any, currentValue + redistributedShare);
    });
  };

  const onSubmit = (values: FormValues) => {
    const totalAllocation = [values.controlTrafficAllocation]
      .concat(testGroups.map(letter => values[`test${letter}TrafficAllocation` as keyof FormValues] as number))
      .reduce((sum, value) => sum + value, 0);

    if (Math.abs(totalAllocation - 100) > 0.01) {
      toast({
        title: "Invalid Traffic Allocation",
        description: "Traffic allocation must sum to 100%",
        variant: "destructive",
      });
      return;
    }

    console.log("Rules values:", values);
    onNext();
  };

  const addTestGroup = () => {
    const nextLetter = getTestGroupLetter(testGroups.length);
    setTestGroups([...testGroups, nextLetter]);
    
    const currentTotal = form.getValues('controlTrafficAllocation') +
      testGroups.reduce((sum, letter) => 
        sum + (form.getValues(`test${letter}TrafficAllocation` as any) || 0), 0
      );
    
    const remainingShare = (100 - currentTotal) / 2;
    
    form.setValue('controlTrafficAllocation', form.getValues('controlTrafficAllocation') - remainingShare);
    testGroups.forEach(letter => {
      const currentValue = form.getValues(`test${letter}TrafficAllocation` as any);
      form.setValue(`test${letter}TrafficAllocation` as any, currentValue - (remainingShare / testGroups.length));
    });
    
    form.setValue(`test${nextLetter}PriceAdjustmentType` as any, "Increase By");
    form.setValue(`test${nextLetter}PriceAdjustmentPercentage` as any, 20);
    form.setValue(`test${nextLetter}PriceRounding` as any, "No Rounding");
    form.setValue(`test${nextLetter}PriceRoundingValue` as any, 0.99);
    form.setValue(`test${nextLetter}TrafficAllocation` as any, remainingShare * 2);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="successMetric"
          render={({ field }) => (
            <FormItem>
              <FormLabel><MetricTooltip metric="Success Metric">Success Metric</MetricTooltip></FormLabel>
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
            <MetricTooltip metric="New Test Group">New Test Group</MetricTooltip>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {testGroups.map((letter) => (
            <div key={letter} className="space-y-4 p-4 border rounded-lg relative">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Test {letter} Price Adjustment</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTestGroup(letter)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <FormField
                control={form.control}
                name={`test${letter}PriceAdjustmentType` as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adjustment Type</FormLabel>
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
                    <FormLabel>Adjustment Percentage</FormLabel>
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
              <FormField
                control={form.control}
                name={`test${letter}PriceRounding` as any}
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
              {form.watch(`test${letter}PriceRounding` as any) !== "No Rounding" && (
                <FormField
                  control={form.control}
                  name={`test${letter}PriceRoundingValue` as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rounding Value</FormLabel>
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
          ))}
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
                <TableCell>
                  <FormField
                    control={form.control}
                    name="controlTrafficAllocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="w-24"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TableCell>
                {testGroups.map((letter) => (
                  <TableCell key={letter}>
                    <FormField
                      control={form.control}
                      name={`test${letter}TrafficAllocation` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              className="w-24"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
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
