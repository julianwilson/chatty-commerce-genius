import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { Product } from "@/types/product";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

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

const formSchema = z.object({
  name: z.string().min(1, "Experiment name is required"),
  type: z.enum(experimentTypes),
  products: z.array(z.number()).min(1, "At least one product must be selected"),
  startDate: z.date(),
  endDate: z.date(),
  timezone: z.enum(timezones),
  activateViaUtm: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateExperimentModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateExperimentModal({ open, onClose }: CreateExperimentModalProps) {
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      products: [],
      timezone: "America/New_York",
      activateViaUtm: false,
    },
  });

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch("https://scentiment.com/products.json");
      const data = await response.json();
      return data.products as Product[];
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log("Form submitted:", values);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Create New Experiment</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full max-h-[calc(90vh-80px)] pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
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
                name="products"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Products</FormLabel>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-md p-2">
                      {products?.map((product) => (
                        <div key={product.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`product-${product.id}`}
                            checked={selectedProducts.includes(product.id)}
                            onChange={(e) => {
                              const newSelected = e.target.checked
                                ? [...selectedProducts, product.id]
                                : selectedProducts.filter((id) => id !== product.id);
                              setSelectedProducts(newSelected);
                              field.onChange(newSelected);
                            }}
                            className="rounded border-gray-300"
                          />
                          <label htmlFor={`product-${product.id}`} className="text-sm">
                            {product.title}
                          </label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
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

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              formatInTimeZone(
                                field.value,
                                form.watch("timezone"),
                                "PPP p"
                              )
                            ) : (
                              <span>Pick a date</span>
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
                            date < new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              formatInTimeZone(
                                field.value,
                                form.watch("timezone"),
                                "PPP p"
                              )
                            ) : (
                              <span>Pick a date</span>
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
                            date < new Date() || (form.watch("startDate") && date < form.watch("startDate"))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              <div className="flex justify-end space-x-2">
                <Button variant="outline" type="button" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">Create Experiment</Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}