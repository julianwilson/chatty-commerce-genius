import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { Product } from "@/types/product";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, ChevronLeft } from "lucide-react";

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

interface Collection {
  id: number;
  title: string;
}

const formSchema = z.object({
  name: z.string().min(1, "Promotion name is required"),
  type: z.enum(promotionTypes),
  products: z.array(z.number()).min(1, "At least one product must be selected"),
  startDate: z.date(),
  endDate: z.date(),
  collectionId: z.number().optional(),
  adjustmentType: z.enum(["Lower by", "Increase By"]),
  adjustmentValue: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid percentage"),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreatePromotion() {
  const navigate = useNavigate();
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      products: [],
      adjustmentType: "Lower by",
      adjustmentValue: "10.00",
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

  const { data: collections } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const response = await fetch("https://scentiment.com/collections.json");
      const data = await response.json();
      return data.collections as Collection[];
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log("Form submitted:", values);
    navigate("/promotions");
  };

  const selectedType = form.watch("type");
  const showCollectionSelector = selectedType === "Collection Sale";

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Create New Promotion</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
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

          {showCollectionSelector && (
            <FormField
              control={form.control}
              name="collectionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collection</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select collection" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {collections?.map((collection) => (
                        <SelectItem 
                          key={collection.id} 
                          value={collection.id.toString()}
                        >
                          {collection.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="adjustmentType"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Price Adjustment</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
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
              name="adjustmentValue"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Percentage</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input {...field} type="number" step="0.01" min="0" max="100" />
                      <span className="absolute right-3 top-2.5">%</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
                          format(field.value, "PPP")
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
                          format(field.value, "PPP")
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

          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit">Create Promotion</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}