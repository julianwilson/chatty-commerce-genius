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
import { cn } from "@/lib/utils";

const experimentTypes = [
  "Price Testing",
  "Product Description",
  "Image Testing",
  "Collection Layout",
  "Checkout Flow",
] as const;

const timezones = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "America/Anchorage",
  "Pacific/Honolulu",
] as const;

const getSuccessMetrics = (experimentType: string | undefined) => {
  const baseMetrics = [
    "Gross Sales",
    "Net Sales",
    "Units Sold",
    "Conversion Rate",
  ] as const;

  if (experimentType === "Image Testing") {
    return [...baseMetrics, "Click-Through Rate"] as const;
  }

  return baseMetrics;
};

const createFormSchema = (experimentType: string | undefined) => {
  return z.object({
    name: z.string().min(1, "Experiment name is required"),
    type: z.enum(experimentTypes),
    timezone: z.enum(timezones),
    successMetric: z.enum(getSuccessMetrics(experimentType)),
  });
};

type FormValues = z.infer<ReturnType<typeof createFormSchema>>;

interface SetupStepProps {
  onNext: () => void;
  onTypeChange?: (type: string) => void;
  onSuccessMetricChange?: (metric: string) => void;
}

export function SetupStep({ onNext, onTypeChange, onSuccessMetricChange }: SetupStepProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(createFormSchema(form?.watch("type"))),
    defaultValues: {
      timezone: "America/New_York",
      successMetric: "Gross Sales",
    },
  });

  const experimentType = form.watch("type");
  const successMetrics = getSuccessMetrics(experimentType);

  const onSubmit = (values: FormValues) => {
    console.log("Setup values:", values);
    onNext();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Experiment Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter experiment name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Experiment Type</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  onTypeChange?.(value);
                  // Reset success metric when type changes
                  form.setValue("successMetric", successMetrics[0]);
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select experiment type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {experimentTypes.map((type) => (
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
          name="successMetric"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Success Metric</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  onSuccessMetricChange?.(value);
                }}
                value={field.value}
                disabled={!experimentType}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select success metric" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {successMetrics.map((metric) => (
                    <SelectItem key={metric} value={metric}>
                      {metric}
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
          name="timezone"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Timezone</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {timezones.map((timezone) => (
                    <SelectItem key={timezone} value={timezone}>
                      {timezone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end w-full">
          <Button type="submit">Next</Button>
        </div>
      </form>
    </Form>
  );
}