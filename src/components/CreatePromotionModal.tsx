import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface CreatePromotionModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreatePromotionModal({ open, onClose }: CreatePromotionModalProps) {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [adjustmentType, setAdjustmentType] = useState("lower");
  const [adjustmentPercentage, setAdjustmentPercentage] = useState("10");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Promotion</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Summer Sale 2024"
            />
          </div>

          <div className="grid grid-cols-[1fr,120px] gap-2 items-end">
            <div>
              <Label htmlFor="adjustment-type">Price Adjustment</Label>
              <Select
                value={adjustmentType}
                onValueChange={setAdjustmentType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select adjustment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lower">Lower by</SelectItem>
                  <SelectItem value="increase">Increase By</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Input
                type="number"
                min="0"
                max="100"
                value={adjustmentPercentage}
                onChange={(e) => setAdjustmentPercentage(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="start-date">Start Date</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="end-date">End Date</Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}