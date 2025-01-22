import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PriceRule {
  id: string;
  name: string;
  type: "velocity" | "conversion" | "seasonality";
  metric: string;
  condition: "greater" | "less" | "between";
  value1: string;
  value2?: string;
  adjustment: "price" | "compare_at";
  adjustmentType: "percentage" | "fixed";
  adjustmentValue: string;
  active: boolean;
}

const initialRules: PriceRule[] = [
  {
    id: "1",
    name: "High Velocity Discount",
    type: "velocity",
    metric: "units_per_day",
    condition: "greater",
    value1: "10",
    adjustment: "price",
    adjustmentType: "percentage",
    adjustmentValue: "10",
    active: true,
  },
  {
    id: "2",
    name: "Low Conversion Markup",
    type: "conversion",
    metric: "conversion_rate",
    condition: "less",
    value1: "2",
    adjustment: "compare_at",
    adjustmentType: "percentage",
    adjustmentValue: "15",
    active: true,
  },
];

export default function DynamicPricing() {
  const navigate = useNavigate();
  const [rules, setRules] = useState<PriceRule[]>(initialRules);
  const [showNewRule, setShowNewRule] = useState(false);
  const [newRule, setNewRule] = useState<Partial<PriceRule>>({
    type: "velocity",
    condition: "greater",
    adjustment: "price",
    adjustmentType: "percentage",
    active: true,
  });

  const handleAddRule = () => {
    if (newRule.name && newRule.value1 && newRule.adjustmentValue) {
      setRules([
        ...rules,
        {
          ...newRule,
          id: Math.random().toString(36).substr(2, 9),
        } as PriceRule,
      ]);
      setShowNewRule(false);
      setNewRule({
        type: "velocity",
        condition: "greater",
        adjustment: "price",
        adjustmentType: "percentage",
        active: true,
      });
    }
  };

  const handleDeleteRule = (id: string) => {
    setRules(rules.filter((rule) => rule.id !== id));
  };

  const handleToggleRule = (id: string) => {
    setRules(
      rules.map((rule) =>
        rule.id === id ? { ...rule, active: !rule.active } : rule
      )
    );
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Dynamic Pricing</h1>
        <Button onClick={() => navigate('/dynamic-pricing/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Rule
        </Button>
      </div>

      {showNewRule && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>New Price Rule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Rule Name</Label>
                <Input
                  placeholder="Enter rule name"
                  value={newRule.name || ""}
                  onChange={(e) =>
                    setNewRule({ ...newRule, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={newRule.type}
                  onValueChange={(value: PriceRule["type"]) =>
                    setNewRule({ ...newRule, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="velocity">Sales Velocity</SelectItem>
                    <SelectItem value="conversion">Conversion Rate</SelectItem>
                    <SelectItem value="seasonality">Seasonality</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Condition</Label>
                <Select
                  value={newRule.condition}
                  onValueChange={(value: PriceRule["condition"]) =>
                    setNewRule({ ...newRule, condition: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="greater">Greater Than</SelectItem>
                    <SelectItem value="less">Less Than</SelectItem>
                    <SelectItem value="between">Between</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Value</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Enter value"
                    value={newRule.value1 || ""}
                    onChange={(e) =>
                      setNewRule({ ...newRule, value1: e.target.value })
                    }
                  />
                  {newRule.condition === "between" && (
                    <Input
                      type="number"
                      placeholder="Enter second value"
                      value={newRule.value2 || ""}
                      onChange={(e) =>
                        setNewRule({ ...newRule, value2: e.target.value })
                      }
                    />
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Adjustment Type</Label>
                <Select
                  value={newRule.adjustment}
                  onValueChange={(value: PriceRule["adjustment"]) =>
                    setNewRule({ ...newRule, adjustment: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="compare_at">Compare at Price</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Adjustment Value</Label>
                <div className="flex gap-2">
                  <Select
                    value={newRule.adjustmentType}
                    onValueChange={(value: PriceRule["adjustmentType"]) =>
                      setNewRule({ ...newRule, adjustmentType: value })
                    }
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Enter adjustment"
                    value={newRule.adjustmentValue || ""}
                    onChange={(e) =>
                      setNewRule({ ...newRule, adjustmentValue: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewRule(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddRule}>Save Rule</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rule Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Adjustment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{rule.name}</TableCell>
                  <TableCell>
                    {rule.type.charAt(0).toUpperCase() + rule.type.slice(1)}
                  </TableCell>
                  <TableCell>
                    {rule.condition === "between"
                      ? `Between ${rule.value1} and ${rule.value2}`
                      : `${
                          rule.condition === "greater" ? ">" : "<"
                        } ${rule.value1}`}
                  </TableCell>
                  <TableCell>
                    {rule.adjustmentType === "percentage"
                      ? `${rule.adjustmentValue}%`
                      : `$${rule.adjustmentValue}`}{" "}
                    {rule.adjustment === "price" ? "price" : "compare at"}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={rule.active}
                      onCheckedChange={() => handleToggleRule(rule.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteRule(rule.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
