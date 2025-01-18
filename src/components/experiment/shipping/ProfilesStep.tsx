import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Package, MapPin } from "lucide-react";

interface ProfilesStepProps {
  onNext: () => void;
  onBack: () => void;
  onProfileSelect: (zones: string[]) => void;
}

interface ZoneRow {
  id: string;
  name: string;
  region: string;
}

interface Profile {
  id: string;
  title: string;
  products: number;
  locations: number;
  zones: number;
  zoneRows: ZoneRow[];
}

const profiles: Profile[] = [
  {
    id: "general",
    title: "General Profile",
    products: 30,
    locations: 3,
    zones: 3,
    zoneRows: [
      { id: "domestic", name: "DOMESTIC", region: "United States" },
      { id: "row", name: "REST OF THE WORLD", region: "Rest of World" },
      { id: "paris", name: "PARIS DOMESTIC", region: "France" }
    ]
  },
  {
    id: "special",
    title: "Special Products",
    products: 1,
    locations: 2,
    zones: 2,
    zoneRows: [
      { id: "row", name: "REST OF WORLD", region: "Rest of World" },
      { id: "us", name: "UNITED STATES", region: "United States" }
    ]
  }
];

export function ProfilesStep({ onNext, onBack, onProfileSelect }: ProfilesStepProps) {
  const [selectedZones, setSelectedZones] = useState<string[]>([]);

  const handleZoneToggle = (zoneId: string) => {
    setSelectedZones(prev => 
      prev.includes(zoneId)
        ? prev.filter(id => id !== zoneId)
        : [...prev, zoneId]
    );
  };

  const handleContinue = () => {
    if (selectedZones.length > 0) {
      onProfileSelect(selectedZones);
      onNext();
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Select Shipping Zones</h2>
        <p className="text-muted-foreground">
          Choose one or more shipping zones to test different rates and rules
        </p>
      </div>

      <div className="grid gap-6">
        {profiles.map((profile) => (
          <Card
            key={profile.id}
            className="p-6"
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">{profile.title}</h3>
                <div className="flex items-center gap-6 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    {profile.products} products
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {profile.locations} Ship-from Locations in {profile.zones} Zones
                  </div>
                </div>
              </div>

              <div className="border rounded-lg">
                <table className="w-full">
                  <tbody>
                    {profile.zoneRows.map((row) => (
                      <tr 
                        key={row.id}
                        className="border-b last:border-b-0"
                      >
                        <td className="px-4 py-3 w-[40px]">
                          <Checkbox
                            checked={selectedZones.includes(row.id)}
                            onCheckedChange={() => handleZoneToggle(row.id)}
                          />
                        </td>
                        <td className="px-4 py-3 font-medium">{row.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{row.region}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={selectedZones.length === 0}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
