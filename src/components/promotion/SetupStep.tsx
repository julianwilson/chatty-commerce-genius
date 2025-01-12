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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Bot } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { generatePromotionName } from "@/utils/promotionUtils";
import { useToast } from "@/components/ui/use-toast";

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

const timezones = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Anchorage",
  "America/Honolulu",
  "America/Puerto_Rico",
] as const;

const priceUpdateOptions = [
  "Update Prices Only",
  "Update Prices + Slash Prices",
  "Update Slash Prices Only",
] as const;

const formSchema = z.object({
  name: z.string().min(1, "Promotion name is required"),
  type: z.enum(promotionTypes),
  priceAdjustmentType: z.enum(["Lower by", "Increase By"]),
  priceAdjustmentPercentage: z.number().min(0).max(100),
  priceUpdateOption: z.enum(priceUpdateOptions),
  startDateTime: z.date(),
  endDateTime: z.date(),
  timezone: z.enum(timezones),
});

type FormValues = z.infer<typeof formSchema>;

interface SetupStepProps {
  onNext: () => void;
}

export function SetupStep({ onNext }: SetupStepProps) {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      priceAdjustmentType: "Lower by",
      priceAdjustmentPercentage: 10,
      priceUpdateOption: "Update Prices Only",
      timezone: "America/New_York",
      startDateTime: new Date(),
      endDateTime: new Date(),
    },
  });

  const handleAISuggestion = async () => {
    const formValues = form.getValues();
    if (!formValues.type || !formValues.priceAdjustmentType || !formValues.priceUpdateOption) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before generating a name.",
        variant: "destructive",
      });
      return;
    }

    if (!localStorage.getItem('PERPLEXITY_API_KEY')) {
      const apiKey = prompt('Please enter your Perplexity API key:');
      if (apiKey) {
        localStorage.setItem('PERPLEXITY_API_KEY', apiKey);
      } else {
        toast({
          title: "API Key Required",
          description: "Please provide a Perplexity API key to use the AI suggestion feature.",
          variant: "destructive",
        });
        return;
      }
    }

    const suggestedName = await generatePromotionName({
      type: formValues.type,
      priceAdjustmentType: formValues.priceAdjustmentType,
      priceAdjustmentPercentage: formValues.priceAdjustmentPercentage,
      priceUpdateOption: formValues.priceUpdateOption,
      startDateTime: formValues.startDateTime,
      endDateTime: formValues.endDateTime,
    });

    if (suggestedName) {
      form.setValue('name', suggestedName);
      toast({
        title: "Name Generated",
        description: "AI has suggested a new promotion name.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to generate a promotion name. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = (values: FormValues) => {
    console.log("Setup values:", values);
    onNext();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-end gap-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Promotion Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter promotion name" {...field} className="bg-gray-50" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleAISuggestion}
            className="h-10 w-10"
          >
            <Bot className="h-4 w-4" />
          </Button>
        </div>

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-gray-50">
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
                    <SelectTrigger className="bg-gray-50">
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
                    className="bg-gray-50"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="priceUpdateOption"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price Update Options</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-gray-50">
                    <SelectValue placeholder="Select price update option" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {priceUpdateOptions.map((option) => (
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

        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="startDateTime"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Start Date & Time</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal bg-gray-50",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP p")
                        ) : (
                          <span>Pick a date & time</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() || date > form.getValues("endDateTime")
                      }
                      initialFocus
                    />
                    <div className="p-3 border-t">
                      <Input
                        type="time"
                        className="bg-gray-50"
                        value={format(field.value, "HH:mm")}
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(":");
                          const newDate = new Date(field.value);
                          newDate.setHours(parseInt(hours), parseInt(minutes));
                          field.onChange(newDate);
                        }}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDateTime"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>End Date & Time</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal bg-gray-50",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP p")
                        ) : (
                          <span>Pick a date & time</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < form.getValues("startDateTime")
                      }
                      initialFocus
                    />
                    <div className="p-3 border-t">
                      <Input
                        type="time"
                        className="bg-gray-50"
                        value={format(field.value, "HH:mm")}
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(":");
                          const newDate = new Date(field.value);
                          newDate.setHours(parseInt(hours), parseInt(minutes));
                          field.onChange(newDate);
                        }}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="timezone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timezone</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-gray-50">
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

        <div className="flex justify-end">
          <Button type="submit">Next</Button>
        </div>
      </form>
    </Form>
  );
}