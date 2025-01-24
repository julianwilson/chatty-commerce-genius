import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, Percent, Tag, Gift, Truck, ShoppingBag } from "lucide-react";

const types = [
  {
    id: "sitewide",
    label: "Sitewide Discount",
    description: "Apply a discount across all products in your store",
    icon: Tag
  },
  {
    id: "collection",
    label: "Collection Sale",
    description: "Target specific collections with tailored discounts",
    icon: ShoppingBag
  },
  {
    id: "bogo",
    label: "Buy One Get One",
    description: "Encourage larger cart sizes with BOGO offers",
    icon: Gift
  },
  {
    id: "shipping",
    label: "Shipping Promotion",
    description: "Offer free or discounted shipping based on order value",
    icon: Truck
  },
  {
    id: "threshold",
    label: "Spend & Save",
    description: "Offer tiered discounts based on order value",
    icon: Percent
  }
] as const;

const formSchema = z.object({
  type: z.enum(types.map(t => t.id) as [string, ...string[]])
});

type FormData = z.infer<typeof formSchema>;

interface TypeStepProps {
  onNext: (data: FormData) => void;
}

export function TypeStep({ onNext }: TypeStepProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "sitewide"
    }
  });

  return (
    <form onSubmit={form.handleSubmit(onNext)} className="space-y-6">
      <div className="space-y-4">
        {types.map((type) => {
          const Icon = type.icon;
          return (
            <Card
              key={type.id}
              className={cn(
                "relative flex items-center space-x-4 p-6 cursor-pointer hover:bg-muted/50",
                form.watch("type") === type.id && "border-primary"
              )}
              onClick={() => form.setValue("type", type.id)}
            >
              <Icon className="w-8 h-8 text-muted-foreground" />
              <div className="flex-1">
                <div className="font-medium">{type.label}</div>
                <div className="text-sm text-muted-foreground">{type.description}</div>
              </div>
              {form.watch("type") === type.id && (
                <ArrowRight className="w-5 h-5 text-primary" />
              )}
            </Card>
          );
        })}
      </div>

      <div className="flex justify-end">
        <Button type="submit">Continue</Button>
      </div>
    </form>
  );
}
