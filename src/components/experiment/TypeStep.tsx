import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Add Badge import
import { cn } from "@/lib/utils";
import { ArrowRight, Percent, Type, Layout, Image, Truck } from "lucide-react";

const experimentTypes = [
  {
    id: "Price Testing",
    label: "Price Testing",
    description: "Test different price points to optimize revenue and conversion",
    icon: Percent
  },
  {
    id: "Shipping Testing",
    label: "Shipping Testing",
    description: "Test different shipping options and costs to improve cart conversion",
    icon: Truck
  },
  {
    id: "Product Description",
    label: "Product Description",
    description: "Test different product descriptions to improve engagement",
    icon: Type
  },
  {
    id: "Image Testing",
    label: "Image Testing",
    description: "Test different product images to increase conversion",
    icon: Image
  },
  {
    id: "Collection Layout",
    label: "Collection Layout",
    description: "Test different collection layouts to enhance user experience",
    icon: Layout
  }
] as const;

const formSchema = z.object({
  type: z.enum(experimentTypes.map(t => t.id) as [string, ...string[]])
});

type FormValues = z.infer<typeof formSchema>;

interface TypeStepProps {
  onNext: (type: string) => void;
}

export function TypeStep({ onNext }: TypeStepProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = (values: FormValues) => {
    onNext(values.type);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid gap-4">
        {experimentTypes.map((type) => {
          const Icon = type.icon;
          return (
            <Card
              key={type.id}
              className={cn(
                "p-4 cursor-pointer hover:bg-muted/50 transition-colors",
                "border-2",
                form.watch("type") === type.id ? "border-primary" : "border-transparent"
              )}
              onClick={() => {
                form.setValue("type", type.id);
                form.trigger("type");
              }}
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{type.label}</div>
                  <div className="text-sm text-muted-foreground">{type.description}</div>
                </div>
                {form.watch("type") === type.id && (
                  <ArrowRight className="w-5 h-5 text-primary" />
                )}
                <Badge variant="secondary" className="ml-2">
                  {type.label}
                </Badge>
              </div>
            </Card>
          );
        })}
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={!form.watch("type")}
      >
        Continue
      </Button>
    </form>
  );
}
