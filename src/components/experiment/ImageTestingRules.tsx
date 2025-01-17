import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UTMControls, utmRulesSchema } from "./UTMControls";

const productImages = [
  "https://www.scentiment.com/cdn/shop/files/Scentiment_Kit_Standard_Diffuser-2_Hotel_Top_3_black.png?v=1728055369",
  "https://www.scentiment.com/cdn/shop/files/Scentiment_Kit_Standard_Diffuser_2_Hotel_Top_3_Silver.png?v=1728055351",
  "https://www.scentiment.com/cdn/shop/files/Scentiment_Kit_Standard_Diffuser_2_Hotel_Top5_Black_1.png?v=1727990513",
  "https://www.scentiment.com/cdn/shop/files/Scentiment_Kit_Standard_Diffuser_2_Hotel_Top5_Silver_1.png?v=1727990493",
];

const products = [
  { id: 1, name: "Hotel Diffuser Black" },
  { id: 2, name: "Hotel Diffuser Silver" },
  { id: 3, name: "Hotel Diffuser Black Top 5" },
  { id: 4, name: "Hotel Diffuser Silver Top 5" },
];

interface ImageTestingRulesProps {
  onNext: () => void;
  onBack: () => void;
}

const formSchema = z.object({
  hideOtherImages: z.boolean(),
  bulkAltTag: z.string(),
  imageRange: z.array(z.number()),
  selectedProduct: z.string(),
  utmControls: z.boolean(),
  utmRules: utmRulesSchema.optional(),
});

export function ImageTestingRules({ onNext, onBack }: ImageTestingRulesProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hideOtherImages: false,
      bulkAltTag: "",
      imageRange: [1, 4],
      selectedProduct: "1",
      utmControls: false,
      utmRules: [{
        action: "Enable",
        source: "",
        medium: "",
        campaign: "",
        term: "",
        content: "",
      }],
    },
  });

  const [successMetric, setSuccessMetric] = useState("conversion-rate");

  const hasAltTagValue = form.watch("bulkAltTag").trim() !== "";

  const getTestGroups = () => {
    const groups = ["Control"];
    const start = form.watch("imageRange")[0] - 1;
    const end = form.watch("imageRange")[1] - 1;

    for (let i = start; i <= end; i++) {
      groups.push(`Test ${String.fromCharCode(65 + (i - start))}`);
    }

    return groups;
  };

  const getImageForGroup = (index: number, isControl: boolean) => {
    if (isControl) {
      return productImages[0];
    }
    const start = form.watch("imageRange")[0] - 1;
    return productImages[index + start - 1];
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="preview-product">Preview Product</Label>
        <Select
          defaultValue={form.watch("selectedProduct")}
          onValueChange={(value) => form.setValue("selectedProduct", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a product to preview" />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id.toString()}>
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="success-metric">Success Metric</Label>
        <Select
          defaultValue={successMetric}
          onValueChange={(value) => setSuccessMetric(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a success metric" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="conversion-rate">Conversion Rate</SelectItem>
            <SelectItem value="revenue-per-visitor">Revenue Per Visitor</SelectItem>
            <SelectItem value="click-through-rate">Click-Through Rate</SelectItem>
            <SelectItem value="gross-margin">Gross Margin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="relative">
        <Carousel className={`w-full max-w-xl ${hasAltTagValue ? 'opacity-50 pointer-events-none' : ''}`}>
          <CarouselContent>
            {productImages.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[300px]">
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-contain rounded-lg"
                    style={{ display: hasAltTagValue ? 'none' : 'block' }}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                {getTestGroups().map((group, index) => (
                  <TableHead key={index} className="text-center">{group}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                {getTestGroups().map((group, index) => (
                  <TableCell key={index} className="text-center">
                    <img
                      src={getImageForGroup(index, group === "Control")}
                      alt={`Product ${index + 1}`}
                      className="w-24 h-24 mx-auto object-contain"
                      style={{ display: hasAltTagValue ? 'none' : 'block' }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <Label>Image Range</Label>
            <Slider
              value={form.watch("imageRange")}
              onValueChange={(value) => form.setValue("imageRange", value)}
              max={4}
              min={1}
              step={1}
              className={`w-full ${hasAltTagValue ? 'opacity-50 pointer-events-none' : ''}`}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Image {form.watch("imageRange")[0]}</span>
              <span>Image {form.watch("imageRange")[1]}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="hide-images">Hide other image(s) in test?</Label>
            <Switch
              id="hide-images"
              checked={form.watch("hideOtherImages")}
              onCheckedChange={(value) => form.setValue("hideOtherImages", value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bulk-alt">Test Via Alt Tag</Label>
            <Input
              id="bulk-alt"
              value={form.watch("bulkAltTag")}
              onChange={(e) => form.setValue("bulkAltTag", e.target.value)}
              placeholder="Enter alt tag for testing"
            />
          </div>
        </div>
      </div>

      <UTMControls form={form} />

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
}
