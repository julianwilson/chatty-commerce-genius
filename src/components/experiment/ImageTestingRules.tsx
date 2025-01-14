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

export function ImageTestingRules() {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [hideOtherImages, setHideOtherImages] = useState(false);
  const [bulkAltTag, setBulkAltTag] = useState("");
  const [activateViaUtm, setActivateViaUtm] = useState(false);
  const [imageRange, setImageRange] = useState([1, 4]);
  const [firstImageAsControl, setFirstImageAsControl] = useState(false);
  const [controlAltTag, setControlAltTag] = useState("test-image-control");

  const equalShare = (100 / (selectedImages.length + 1)).toFixed(2);

  return (
    <div className="space-y-8">
      <div className="relative">
        <Carousel className="w-full max-w-xl">
          <CarouselContent>
            {productImages.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative">
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-full h-auto rounded-lg"
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

        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <Label>Image Range</Label>
            <Slider
              value={imageRange}
              onValueChange={setImageRange}
              max={4}
              min={1}
              step={1}
              className="w-full"
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