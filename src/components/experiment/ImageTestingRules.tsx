import { useState } from "react";
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

export function ImageTestingRules({ onNext, onBack }: ImageTestingRulesProps) {
  const [hideOtherImages, setHideOtherImages] = useState(false);
  const [bulkAltTag, setBulkAltTag] = useState("");
  const [activateViaUtm, setActivateViaUtm] = useState(false);
  const [imageRange, setImageRange] = useState([1, 4]);
  const [selectedProduct, setSelectedProduct] = useState("1");

  const hasAltTagValue = bulkAltTag.trim() !== "";

  const getTestGroups = () => {
    const groups = ["Control"];
    const start = imageRange[0] - 1;
    const end = imageRange[1] - 1;

    for (let i = start; i <= end; i++) {
      groups.push(`Test ${String.fromCharCode(65 + (i - start))}`);
    }

    return groups;
  };

  const getImageForGroup = (index: number, isControl: boolean) => {
    if (isControl) {
      return productImages[0];
    }
    const start = imageRange[0] - 1;
    return productImages[index + start - 1];
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="preview-product">Preview Product</Label>
        <Select defaultValue={selectedProduct} onValueChange={setSelectedProduct}>
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
              value={imageRange}
              onValueChange={setImageRange}
              max={4}
              min={1}
              step={1}
              className={`w-full ${hasAltTagValue ? 'opacity-50 pointer-events-none' : ''}`}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Image {imageRange[0]}</span>
              <span>Image {imageRange[1]}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="hide-images">Hide other image(s) in test?</Label>
            <Switch
              id="hide-images"
              checked={hideOtherImages}
              onCheckedChange={setHideOtherImages}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bulk-alt">Test Via Alt Tag</Label>
            <Input
              id="bulk-alt"
              value={bulkAltTag}
              onChange={(e) => setBulkAltTag(e.target.value)}
              placeholder="Enter alt tag for testing"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label className="text-base">Activate Via UTM Only</Label>
          <div className="text-sm text-muted-foreground">
            Only activate experiment for traffic from UTM sources
          </div>
        </div>
        <Switch
          checked={activateViaUtm}
          onCheckedChange={setActivateViaUtm}
        />
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
}
