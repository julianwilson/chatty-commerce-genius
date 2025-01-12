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

const promotionTypes = [
  "Sitewide Markdown Sale",
  "Sitewide Discount Code Sale",
  "Collection Sale",
  "Bogo Sale",
  "Free Shipping Sale",
  "Shipping Update",
  "Influencer",
  "Event",
  "Loyalty Bonus",
] as const;

const formSchema = z.object({
  name: z.string().min(1, "Promotion name is required"),
  type: z.enum(promotionTypes),
  priceAdjustmentType: z.enum(["Lower by", "Increase By"]),
  priceAdjustmentPercentage: z.number().min(0).max(100),
  changeSlashPriceOnly: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface SetupStepProps {
  onNext: () => void;
}

export function SetupStep({ onNext }: SetupStepProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      priceAdjustmentType: "Lower by",
      priceAdjustmentPercentage: 10,
      changeSlashPriceOnly: false,
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log("Setup values:", values);
    onNext();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Promotion Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter promotion name" {...field} />
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
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select promotion type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {promotionTypes.map((type) => (
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

        <div className="flex gap-4 items-end">
          <FormField
            control={form.control}
            name="priceAdjustmentType"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Price Adjustment</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select adjustment type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Lower by">Lower by</SelectItem>
                    <SelectItem value="Increase By">Increase By</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priceAdjustmentPercentage"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Percentage</FormLabel>
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

        <div className="flex justify-end">
          <Button type="submit">Next</Button>
        </div>
      </form>
    </Form>
  );
}