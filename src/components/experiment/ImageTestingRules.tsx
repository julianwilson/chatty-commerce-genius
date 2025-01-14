import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
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

export function ImageTestingRules() {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [hideOtherImages, setHideOtherImages] = useState(false);
  const [bulkAltTag, setBulkAltTag] = useState("");
  const [activateViaUtm, setActivateViaUtm] = useState(false);
  const [imageRange, setImageRange] = useState([1, 4]);
  const [firstImageAsControl, setFirstImageAsControl] = useState(false);
  const [controlAltTag, setControlAltTag] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("1"); // Default to first product

  const equalShare = (100 / (selectedImages.length + 1)).toFixed(2);
  const hasAltTagValue = bulkAltTag.trim() !== "" || controlAltTag.trim() !== "";

  const getTestGroups = () => {
    const start = imageRange[0] - 1; // Convert to 0-based index
    const end = imageRange[1] - 1;
    const groups = [];

    for (let i = start; i <= end; i++) {
      if (firstImageAsControl && i === start) {
        groups.push("Control");
      } else {
        const offset = firstImageAsControl ? i - start - 1 : i - start;
        groups.push(`Test ${String.fromCharCode(65 + offset)}`);
      }
    }

    return groups;
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
                <div className="relative">
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-full h-auto rounded-lg"
                    style={{ display: hasAltTagValue ? 'none' : 'block' }}
                  />
                  <div className="absolute top-4 right-4">
                    <Checkbox
                      checked={selectedImages.includes(image)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedImages([...selectedImages, image]);
                        } else {
                          setSelectedImages(selectedImages.filter(img => img !== image));
                        }
                      }}
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        {/* Test Groups Table */}
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
                      src={firstImageAsControl && index === 0 ? productImages[0] : productImages[index + imageRange[0] - 1]}
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
            <Label htmlFor="first-image-control">Set first image as control?</Label>
            <Switch
              id="first-image-control"
              checked={firstImageAsControl}
              onCheckedChange={setFirstImageAsControl}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="control-alt">Set control via alt tag</Label>
            <Input
              id="control-alt"
              value={controlAltTag}
              onChange={(e) => setControlAltTag(e.target.value)}
              placeholder="Enter control alt tag"
            />
          </div>

          <Button
            onClick={() => console.log("Add selected to test groups")}
            disabled={selectedImages.length === 0}
          >
            Add Selected to Test Groups
          </Button>

          <div className="flex items-center justify-between">
            <Label htmlFor="hide-images">Hide other image(s) in test?</Label>
            <Switch
              id="hide-images"
              checked={hideOtherImages}
              onCheckedChange={setHideOtherImages}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bulk-alt">Bulk Test via Alt Tag</Label>
            <Input
              id="bulk-alt"
              value={bulkAltTag}
              onChange={(e) => setBulkAltTag(e.target.value)}
              placeholder="Enter alt tag for testing"
            />
          </div>
        </div>
      </div>

      {selectedImages.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium">Traffic Allocation</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Control</TableHead>
                {selectedImages.map((_, index) => (
                  <TableHead key={index}>Test {String.fromCharCode(65 + index)}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-center">{equalShare}%</TableCell>
                {selectedImages.map((_, index) => (
                  <TableCell key={index} className="text-center">
                    {equalShare}%
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}

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
    </div>
  );
}
