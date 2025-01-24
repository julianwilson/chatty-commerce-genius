import { useState, useMemo } from "react";
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
import { Label } from "@/components/ui/label";
import { PlusCircle, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { UTMControls, utmRulesSchema } from "./UTMControls";

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
    controlTrafficAllocation: z.number().min(0).max(100),
    utmControls: z.boolean(),
    utmRules: utmRulesSchema.optional(),
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
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      controlTrafficAllocation: 33.33,
      utmControls: false,
      utmRules: [],
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

    const removedAllocation = form.getValues(`test${letterToRemove}TrafficAllocation` as any);
    const redistributedShare = removedAllocation / (remainingGroups.length + 1);

    const newControlAllocation = form.getValues('controlTrafficAllocation') + redistributedShare;
    form.setValue('controlTrafficAllocation', newControlAllocation);

    remainingGroups.forEach(letter => {
      const currentValue = form.getValues(`test${letter}TrafficAllocation` as any);
      form.setValue(`test${letter}TrafficAllocation` as any, currentValue + redistributedShare);
    });
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            <div key={letter} className="space-y-4 p-4 border rounded-lg relative">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Test {letter} Price Adjustment</h3>
                {testGroups.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTestGroup(letter)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name={`test${letter}PriceAdjustmentType` as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adjustment Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  name={`test${letter}PriceAdjustmentPercentage`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adjustment Percentage</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter percentage"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`test${letter}PriceRounding`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price Rounding</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select rounding type" />
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

                {form.watch(`test${letter}PriceRounding`) !== "No Rounding" && (
                  <FormField
                    control={form.control}
                    name={`test${letter}PriceRoundingValue`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rounding Value</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="e.g. 0.99"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name={`test${letter}TrafficAllocation`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Traffic Allocation (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter percentage"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="controlTrafficAllocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Control Group Traffic Allocation (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Enter percentage"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <div className="text-base font-medium">UTM Controls</div>
              <div className="text-sm text-muted-foreground">
                Control experiment activation based on UTM parameters
              </div>
            </div>
            <FormField
              control={form.control}
              name="utmControls"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {form.watch("utmControls") && (
            <UTMControls
              rules={form.watch("utmRules") || []}
              onChange={(rules) => form.setValue("utmRules", rules)}
            />
          )}
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit">Next</Button>
        </div>
      </form>
    </Form>
  );
}
