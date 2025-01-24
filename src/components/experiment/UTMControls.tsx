import { Plus, X } from "lucide-react";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const utmActions = ["Enable", "Disable"] as const;

export const utmRulesSchema = z.array(z.object({
  action: z.enum(utmActions),
  source: z.string().optional(),
  medium: z.string().optional(),
  campaign: z.string().optional(),
  term: z.string().optional(),
  content: z.string().optional(),
}));

type UTMRule = z.infer<typeof utmRulesSchema>[0];

interface UTMControlsProps {
  rules: UTMRule[];
  onChange: (rules: UTMRule[]) => void;
}

export function UTMControls({ rules, onChange }: UTMControlsProps) {
  return (
    <div className="space-y-4 rounded-lg border p-4">
      {rules.map((rule, index) => (
        <div key={index} className="space-y-4">
          {index > 0 && <Separator className="my-4" />}
          <div className="flex justify-between items-center">
            <h4 className="font-medium">UTM Rule {index + 1}</h4>
            {rules.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onChange(rules.filter((_, i) => i !== index));
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Action</Label>
              <Select
                value={rule.action}
                onValueChange={(value) => {
                  const newRules = [...rules];
                  newRules[index] = { ...rule, action: value as UTMRule["action"] };
                  onChange(newRules);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Enable">Enable</SelectItem>
                  <SelectItem value="Disable">Disable</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Source</Label>
              <Input
                placeholder="e.g. google, facebook"
                value={rule.source || ""}
                onChange={(e) => {
                  const newRules = [...rules];
                  newRules[index] = { ...rule, source: e.target.value };
                  onChange(newRules);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>Medium</Label>
              <Input
                placeholder="e.g. cpc, email"
                value={rule.medium || ""}
                onChange={(e) => {
                  const newRules = [...rules];
                  newRules[index] = { ...rule, medium: e.target.value };
                  onChange(newRules);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>Campaign</Label>
              <Input
                placeholder="e.g. summer_sale"
                value={rule.campaign || ""}
                onChange={(e) => {
                  const newRules = [...rules];
                  newRules[index] = { ...rule, campaign: e.target.value };
                  onChange(newRules);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>Term</Label>
              <Input
                placeholder="e.g. running+shoes"
                value={rule.term || ""}
                onChange={(e) => {
                  const newRules = [...rules];
                  newRules[index] = { ...rule, term: e.target.value };
                  onChange(newRules);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>Content</Label>
              <Input
                placeholder="e.g. textlink"
                value={rule.content || ""}
                onChange={(e) => {
                  const newRules = [...rules];
                  newRules[index] = { ...rule, content: e.target.value };
                  onChange(newRules);
                }}
              />
            </div>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() => {
          onChange([
            ...rules,
            {
              action: "Enable",
              source: "",
              medium: "",
              campaign: "",
              term: "",
              content: "",
            },
          ]);
        }}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add UTM Rule
      </Button>
    </div>
  );
}
