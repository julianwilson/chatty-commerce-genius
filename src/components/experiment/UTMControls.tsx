import { Plus, X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export const utmActions = ["Enable", "Disable"] as const;

export const utmRulesSchema = z.array(z.object({
  action: z.enum(utmActions),
  source: z.string().optional(),
  medium: z.string().optional(),
  campaign: z.string().optional(),
  term: z.string().optional(),
  content: z.string().optional(),
}));

interface UTMControlsProps {
  form: UseFormReturn<any>;
}

export function UTMControls({ form }: UTMControlsProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label className="text-base">UTM Controls</Label>
          <div className="text-sm text-muted-foreground">
            Control experiment activation based on UTM parameters
          </div>
        </div>
        <FormField
          control={form.control}
          name="utmControls"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {form.watch("utmControls") && (
        <div className="space-y-4 rounded-lg border p-4">
          {form.watch("utmRules")?.map((_, index) => (
            <div key={index} className="space-y-4">
              {index > 0 && <Separator className="my-4" />}
              <div className="flex justify-between items-center">
                <h4 className="font-medium">UTM Rule {index + 1}</h4>
                {(form.watch("utmRules")?.length || 0) > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const currentRules = form.getValues("utmRules") || [];
                      form.setValue(
                        "utmRules",
                        currentRules.filter((_, i) => i !== index)
                      );
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <FormField
                control={form.control}
                name={`utmRules.${index}.action`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Action</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select action" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Enable">Enable</SelectItem>
                        <SelectItem value="Disable">Disable</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`utmRules.${index}.source`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. google, facebook" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`utmRules.${index}.medium`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medium</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. cpc, email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`utmRules.${index}.campaign`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Campaign</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. summer_sale" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`utmRules.${index}.term`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Term</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. running+shoes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`utmRules.${index}.content`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. textlink" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const currentRules = form.getValues("utmRules") || [];
              form.setValue("utmRules", [
                ...currentRules,
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
            <Plus className="h-4 w-4 mr-2" />
            Add Control
          </Button>
        </div>
      )}
    </div>
  );
}
