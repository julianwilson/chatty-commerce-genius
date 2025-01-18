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
import { addDays } from "date-fns";
import { MetricTooltip } from "../../MetricTooltip";
import { UTMControls, utmRulesSchema } from "../UTMControls";

const shippingRateTypes = [
  "Flat Rate",
  "Flat Rate with Threshold",
  "Threshold Only",
  "Tiered Price or Weight",
  "Custom"
] as const;

const getTestGroupLetter = (index: number) => {
  return String.fromCharCode(65 + index);
};

const createFormSchema = (testGroups: string[]) => {
  const testGroupFields: Record<string, any> = {};
  
  testGroups.forEach(letter => {
    testGroupFields[`test${letter}RateType`] = z.enum(shippingRateTypes);
    testGroupFields[`test${letter}FlatRateName`] = z.string().min(1, "Flat rate name is required");
    testGroupFields[`test${letter}ShippingAdjustmentAmount`] = z.number().min(0);
    testGroupFields[`test${letter}FreeShippingName`] = z.string().min(1, "Free shipping name is required");
    testGroupFields[`test${letter}Threshold`] = z.number().min(0);
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

export function RulesStep({ onNext, onBack }: RulesStepProps) {
  const [testGroups, setTestGroups] = useState<string[]>(["A", "B"]);
  const formSchema = createFormSchema(testGroups);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      controlTrafficAllocation: 33.33,
      utmControls: false,
      utmRules: [{
        action: "Enable",
        source: "",
        medium: "",
        campaign: "",
        term: "",
        content: "",
      }],
      testARateType: "Flat Rate with Threshold",
      testAFlatRateName: "Standard",
      testAShippingAdjustmentAmount: 5.95,
      testAFreeShippingName: "Free Standard",
      testAThreshold: 75,
      testATrafficAllocation: 33.33,
      testBRateType: "Flat Rate with Threshold",
      testBFlatRateName: "Standard",
      testBShippingAdjustmentAmount: 5.95,
      testBFreeShippingName: "Free Standard",
      testBThreshold: 100,
      testBTrafficAllocation: 33.34,
    },
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
    
    form.setValue(`test${nextLetter}RateType` as any, "Flat Rate with Threshold");
    form.setValue(`test${nextLetter}FlatRateName` as any, "Standard");
    form.setValue(`test${nextLetter}ShippingAdjustmentAmount` as any, 5.95);
    form.setValue(`test${nextLetter}FreeShippingName` as any, "Free Standard");
    form.setValue(`test${nextLetter}Threshold` as any, 75);
    form.setValue(`test${nextLetter}TrafficAllocation` as any, remainingShare * 2);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Shipping Rate Adjustments</h3>
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
                <h3 className="font-medium">Test {letter} Shipping Adjustment</h3>
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

              <FormField
                control={form.control}
                name={`test${letter}RateType` as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rate Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select rate type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {shippingRateTypes.map((type) => (
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
                name={`test${letter}FlatRateName` as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flat Rate Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`test${letter}ShippingAdjustmentAmount` as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                        <Input
                          type="number"
                          step="0.01"
                          className="pl-6"
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`test${letter}FreeShippingName` as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Free Shipping Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`test${letter}Threshold` as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Threshold</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                        <Input
                          type="number"
                          step="0.01"
                          className="pl-6"
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Traffic Allocation</h3>
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Control</label>
                <FormField
                  control={form.control}
                  name="controlTrafficAllocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                          />
                          <span className="text-sm">%</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {testGroups.map((letter) => (
                <div key={letter} className="space-y-2">
                  <label className="text-sm font-medium">Test {letter}</label>
                  <FormField
                    control={form.control}
                    name={`test${letter}TrafficAllocation` as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={e => field.onChange(parseFloat(e.target.value))}
                            />
                            <span className="text-sm">%</span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <FormField
          control={form.control}
          name="utmControls"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  UTM Controls
                </FormLabel>
                <div className="text-sm text-muted-foreground">
                  Enable UTM parameter controls for this experiment
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

        {form.watch("utmControls") && (
          <UTMControls
            control={form.control}
            rules={form.watch("utmRules") || []}
            onChange={(rules) => form.setValue("utmRules", rules)}
          />
        )}

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
          >
            Back
          </Button>
          <Button type="submit">
            Continue
          </Button>
        </div>
      </form>
    </Form>
  );
}
