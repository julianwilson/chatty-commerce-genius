import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExperimentHeaderProps {
  experimentName: string;
  onBack: () => void;
  selectedProducts: number[];
  selectedVariants: number[];
  onPublish: (mode: 'all' | 'selected') => void;
}

export const ExperimentHeader = ({
  experimentName,
  onBack,
  selectedProducts,
  selectedVariants,
  onPublish,
}: ExperimentHeaderProps) => {
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{experimentName}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Export
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              Publish
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              disabled={selectedProducts.length === 0 && selectedVariants.length === 0}
              onClick={() => onPublish('selected')}
            >
              Selected
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onPublish('all')}
            >
              All Winners
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};