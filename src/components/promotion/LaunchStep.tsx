import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  notificationEmails: z.string().refine((emails) => {
    if (!emails) return true;
    const emailArray = emails.split(',').map(e => e.trim());
    return emailArray.every(email => 
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    );
  }, {
    message: "Please enter valid email addresses separated by commas",
  }),
});

interface LaunchStepProps {
  onBack: () => void;
  setupData?: {
    name: string;
    type: string;
    priceAdjustmentType: string;
    priceAdjustmentPercentage: number;
    startDateTime: Date;
    endDateTime: Date;
    timezone: string;
  };
}

export function LaunchStep({ onBack, setupData }: LaunchStepProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notificationEmails: "",
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Here you would implement the actual promotion creation
      // and email notification logic
      console.log("Creating promotion with notification emails:", values.notificationEmails);
      
      toast({
        title: "Promotion created successfully",
        description: "The promotion has been created and notifications have been sent.",
      });
      
      navigate("/promotions");
    } catch (error) {
      toast({
        title: "Error creating promotion",
        description: "There was an error creating the promotion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Promotion Preview</h2>
        
        <div className="rounded-lg border p-4 space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Basic Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>
                <p>{setupData?.name}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Type:</span>
                <p>{setupData?.type}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="font-medium">Price Adjustment</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Adjustment Type:</span>
                <p>{setupData?.priceAdjustmentType}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Percentage:</span>
                <p>{setupData?.priceAdjustmentPercentage}%</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="font-medium">Schedule</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Start Date:</span>
                <p>{setupData?.startDateTime ? format(setupData.startDateTime, 'PPP p') : 'Not set'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">End Date:</span>
                <p>{setupData?.endDateTime ? format(setupData.endDateTime, 'PPP p') : 'Not set'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Timezone:</span>
                <p>{setupData?.timezone}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="font-medium">Products Affected</h3>
            <p className="text-sm">
              This promotion will affect <span className="font-medium">{products?.length || 0}</span> products
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="notificationEmails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notification Emails</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="email1@example.com, email2@example.com" 
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter email addresses separated by commas to notify about this promotion
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between">
              <Button variant="outline" onClick={onBack} type="button">
                Back
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Promotion"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}