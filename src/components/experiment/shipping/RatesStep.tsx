import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RatesStepProps {
  onNext: () => void;
  onBack: () => void;
}

interface ShippingRate {
  id: string;
  name: string;
  condition: string;
  price: string;
}

const shippingRates: ShippingRate[] = [
  {
    id: "standard",
    name: "Standard Shipping",
    condition: "3-5 business days",
    price: "$5.99"
  },
  {
    id: "express",
    name: "Express Shipping",
    condition: "2-3 business days",
    price: "$12.99"
  },
  {
    id: "overnight",
    name: "Overnight Shipping",
    condition: "Next business day",
    price: "$24.99"
  },
  {
    id: "free",
    name: "Free Shipping",
    condition: "Orders over $100",
    price: "Free"
  }
];

export function RatesStep({ onNext, onBack }: RatesStepProps) {
  const [selectedRates, setSelectedRates] = useState<string[]>([]);

  const toggleRate = (rateId: string) => {
    setSelectedRates(prev => 
      prev.includes(rateId)
        ? prev.filter(id => id !== rateId)
        : [...prev, rateId]
    );
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Select Shipping Rates</h2>
        <p className="text-muted-foreground">
          Choose the shipping rates you want to include in your experiment
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Profile</CardTitle>
          <CardDescription>DOMESTIC</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Rate Name</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shippingRates.map((rate) => (
                <TableRow key={rate.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRates.includes(rate.id)}
                      onCheckedChange={() => toggleRate(rate.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{rate.name}</TableCell>
                  <TableCell>{rate.condition}</TableCell>
                  <TableCell>{rate.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={selectedRates.length === 0}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
