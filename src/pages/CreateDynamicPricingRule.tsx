import React, { useState, useMemo } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, ChevronDown, ChevronRightIcon, Calendar, Clock, PlusIcon, Trash2, X } from "lucide-react";
import { format, set } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";
import { Product } from "@/types/product";

type Step = 'setup' | 'products' | 'launch';

interface Rule {
  id: string;
  condition: string;
  operator: string;
  operatorValue: string;
  operatorEndValue: string | null;
  action: string;
  value: string;
  valueType: 'fixed' | 'percentage';
  roundingType: string;
  roundingValue: string;
}

interface Collection {
  id: number;
  title: string;
}

interface FilterRule {
  id: string;
  field: string;
  operator: string;
  value: string;
}

const FIELD_OPTIONS = [
  { value: "collection", label: "Collection" },
  { value: "productTitle", label: "Product Title" },
  { value: "productPrice", label: "Product Price" },
  { value: "productTags", label: "Product Tags" },
  { value: "inventoryStock", label: "Inventory Stock" },
  { value: "compareAtPrice", label: "Compare At Price" },
  { value: "salesVelocity", label: "Sales Velocity" },
  { value: "weight", label: "Weight" },
  { value: "variantTitle", label: "Variant's Title" },
  { value: "productVendor", label: "Product Vendor" },
  { value: "productType", label: "Product Type" },
  { value: "productCost", label: "Product Cost" },
  { value: "hasMetafields", label: "Product Has Metafields" },
  { value: "handle", label: "Product Handle" },
  { value: "purchaseOption", label: "Product Purchase Option" },
  { value: "requiresShipping", label: "Requires Shipping" },
  { value: "giftCard", label: "Gift Card" },
  { value: "taxable", label: "Taxable" },
];

const OPERATOR_OPTIONS = [
  { value: "contains", label: "Contains" },
  { value: "doesNotContain", label: "Does not contain" },
  { value: "equals", label: "Equals" },
  { value: "notEquals", label: "Does not equal" },
  { value: "greaterThan", label: "Greater than" },
  { value: "lessThan", label: "Less than" },
  { value: "true", label: "Is true" },
  { value: "false", label: "Is false" },
];

export const CreateDynamicPricingRule: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('setup');
  const [formData, setFormData] = useState({
    name: '',
    startDateTime: null as Date | null,
    endDateTime: null as Date | null,
    rules: [{
      id: crypto.randomUUID(),
      condition: 'units',
      operator: 'is',
      operatorValue: '',
      operatorEndValue: null,
      action: 'set-price',
      value: '',
      valueType: 'fixed',
      roundingType: 'none',
      roundingValue: '',
    }] as Rule[],
  });

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch("https://scentiment.com/products.json");
      const data = await response.json();
      return data.products as Product[];
    },
  });

  const sampleProduct = useMemo(() => {
    if (!products || products.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * products.length);
    return products[randomIndex];
  }, [products]);

  const updateDateTime = (type: 'start' | 'end', date: Date | null, hours: number = 0, minutes: number = 0) => {
    if (!date) {
      setFormData(prev => ({
        ...prev,
        [type === 'start' ? 'startDateTime' : 'endDateTime']: null,
      }));
      return;
    }

    const newDateTime = set(date, { hours, minutes });
    setFormData(prev => ({
      ...prev,
      [type === 'start' ? 'startDateTime' : 'endDateTime']: newDateTime,
    }));
  };

  const formatDateTime = (date: Date | null) => {
    if (!date) return "Not set (optional)";
    return format(date, "PPP 'at' HH:mm");
  };

  const addRule = () => {
    const newRule: Rule = {
      id: crypto.randomUUID(),
      condition: 'units',
      operator: 'is',
      operatorValue: '',
      operatorEndValue: null,
      action: 'set-price',
      value: '',
      valueType: 'fixed',
      roundingType: 'none',
      roundingValue: '',
    };
    setFormData(prev => ({
      ...prev,
      rules: [...prev.rules, newRule],
    }));
  };

  const updateRule = (id: string, field: keyof Rule, value: string) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.map(rule => 
        rule.id === id ? { ...rule, [field]: value } : rule
      ),
    }));
  };

  const duplicateRule = (id: string) => {
    const ruleToDuplicate = formData.rules.find(rule => rule.id === id);
    if (ruleToDuplicate) {
      const newRule = {
        ...ruleToDuplicate,
        id: crypto.randomUUID(),
      };
      setFormData(prev => ({
        ...prev,
        rules: [...prev.rules, newRule],
      }));
    }
  };

  const deleteRule = (id: string) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter(rule => rule.id !== id),
    }));
  };

  const steps: { id: Step; title: string }[] = [
    { id: 'setup', title: 'Setup' },
    { id: 'products', title: 'Products' },
    { id: 'launch', title: 'Launch' },
  ];

  const handleNext = () => {
    if (currentStep === 'setup') setCurrentStep('products');
    else if (currentStep === 'products') setCurrentStep('launch');
  };

  const handleBack = () => {
    if (currentStep === 'products') setCurrentStep('setup');
    else if (currentStep === 'launch') setCurrentStep('products');
  };

  const handleFinish = () => {
    // Handle saving the rule
    navigate('/dynamic-pricing');
  };

  const generateRuleName = () => {
    if (formData.rules.length === 0) return "New Pricing Rule";
    
    const rule = formData.rules[0];
    let name = "";

    // Add condition
    switch (rule.condition) {
      case 'units':
        name += "When Units Available ";
        break;
      case 'sales':
        name += "When Sales Velocity ";
        break;
      case 'date':
        name += "When Date ";
        break;
    }

    // Add operator and value
    switch (rule.operator) {
      case 'is':
        name += `Is ${rule.condition === 'date' ? format(new Date(rule.operatorValue), 'PP') : rule.operatorValue}`;
        break;
      case 'between':
        if (rule.condition === 'date') {
          name += `Is Between ${format(new Date(rule.operatorValue), 'PP')} and ${format(new Date(rule.operatorEndValue || ''), 'PP')}`;
        }
        break;
      case 'lte':
        name += `≤ ${rule.operatorValue}`;
        break;
      case 'gte':
        name += `≥ ${rule.operatorValue}`;
        break;
    }

    // Add action
    switch (rule.action) {
      case 'set-price':
        name += `, Set Price to $${rule.value}`;
        break;
      case 'increase':
        name += `, Increase Price by ${rule.value}%`;
        break;
      case 'decrease':
        name += `, Decrease Price by ${rule.value}%`;
        break;
    }

    // Add rounding if present
    if (rule.roundingType !== 'none' && rule.roundingValue) {
      name += ` (${rule.roundingType} to .${rule.roundingValue})`;
    }

    return name;
  };

  const calculateNewPrice = (currentPrice: number, rule: Rule): number => {
    const value = parseFloat(rule.value);
    
    if (rule.valueType === 'percentage') {
      if (rule.action === 'increase') {
        return currentPrice * (1 + value / 100);
      } else if (rule.action === 'decrease') {
        return currentPrice * (1 - value / 100);
      } else if (rule.action === 'set-price') {
        return currentPrice * (value / 100);
      }
    } else {
      if (rule.action === 'increase') {
        return currentPrice + value;
      } else if (rule.action === 'decrease') {
        return currentPrice - value;
      } else if (rule.action === 'set-price') {
        return value;
      }
    }
    return currentPrice;
  };

  const getNewPrice = useMemo(() => {
    if (!sampleProduct || !sampleProduct.variants[0]) return null;
    
    let currentPrice = Number(sampleProduct.variants[0].price);
    formData.rules.forEach(rule => {
      currentPrice = calculateNewPrice(currentPrice, rule);
    });
    
    return currentPrice;
  }, [sampleProduct, formData.rules]);

  const renderSetup = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-4">
          <Label>Rules</Label>
          <Button onClick={addRule} variant="outline" size="sm">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Rule
          </Button>
        </div>
        <div className="space-y-4">
          {formData.rules.map((rule) => (
            <div key={rule.id} className="flex items-center space-x-2 bg-muted/50 p-4 rounded-lg">
              <span className="text-sm font-medium">IF</span>
              <Select
                value={rule.condition}
                onValueChange={(value) => updateRule(rule.id, 'condition', value)}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="units">Units Available</SelectItem>
                  <SelectItem value="sales">Sales Velocity</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={rule.operator}
                onValueChange={(value) => {
                  updateRule(rule.id, 'operator', value);
                  updateRule(rule.id, 'operatorValue', '');
                  updateRule(rule.id, 'operatorEndValue', null);
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {rule.condition === 'date' ? (
                    <>
                      <SelectItem value="is">Is</SelectItem>
                      <SelectItem value="between">Between</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="is">Is</SelectItem>
                      <SelectItem value="lte">Less than or Equal to</SelectItem>
                      <SelectItem value="gte">Greater than or Equal to</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>

              {rule.condition === 'date' ? (
                rule.operator === 'between' ? (
                  <div className="flex items-center space-x-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[180px] justify-start text-left font-normal",
                            !rule.operatorValue && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {rule.operatorValue ? format(new Date(rule.operatorValue), 'PPP') : "Start Date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={rule.operatorValue ? new Date(rule.operatorValue) : undefined}
                          onSelect={(date) => 
                            updateRule(rule.id, 'operatorValue', date ? date.toISOString() : '')
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[180px] justify-start text-left font-normal",
                            !rule.operatorEndValue && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {rule.operatorEndValue ? format(new Date(rule.operatorEndValue), 'PPP') : "End Date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={rule.operatorEndValue ? new Date(rule.operatorEndValue) : undefined}
                          onSelect={(date) => 
                            updateRule(rule.id, 'operatorEndValue', date ? date.toISOString() : null)
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                ) : (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[180px] justify-start text-left font-normal",
                          !rule.operatorValue && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {rule.operatorValue ? format(new Date(rule.operatorValue), 'PPP') : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={rule.operatorValue ? new Date(rule.operatorValue) : undefined}
                        onSelect={(date) => 
                          updateRule(rule.id, 'operatorValue', date ? date.toISOString() : '')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )
              ) : (
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    placeholder="Value"
                    value={rule.operatorValue}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d]/g, '');
                      if (value === '' || /^\d*$/.test(value)) {
                        updateRule(rule.id, 'operatorValue', value);
                      }
                    }}
                    className="w-[80px]"
                  />
                  {rule.condition === 'sales' && (
                    <Select
                      value={rule.operatorValue.split(':')[1] || 'day'}
                      onValueChange={(value) => updateRule(rule.id, 'operatorValue', `${rule.operatorValue.split(':')[0] || ''}:${value}`)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Time Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">Units Per Day</SelectItem>
                        <SelectItem value="week">Units Per Week</SelectItem>
                        <SelectItem value="month">Units Per Month</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              )}

              <Select
                value={rule.action}
                onValueChange={(value) => {
                  updateRule(rule.id, 'action', value);
                  // Reset value when switching actions
                  updateRule(rule.id, 'value', '');
                  // Set appropriate valueType
                  updateRule(
                    rule.id,
                    'valueType',
                    value === 'set-price' ? 'fixed' : 'percentage'
                  );
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="set-price">Set Price</SelectItem>
                  <SelectItem value="increase">Increase Price</SelectItem>
                  <SelectItem value="decrease">Decrease Price</SelectItem>
                </SelectContent>
              </Select>

              {rule.action && (
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    className="w-[80px]"
                    value={rule.value}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^\d*\.?\d*$/.test(value)) {
                        updateRule(rule.id, 'value', value);
                      }
                    }}
                    placeholder="0"
                  />
                  <Select
                    value={rule.valueType}
                    onValueChange={(value) => updateRule(rule.id, 'valueType', value)}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Dollars</SelectItem>
                      <SelectItem value="percentage">Percent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Select
                value={rule.roundingType}
                onValueChange={(value) => {
                  updateRule(rule.id, 'roundingType', value);
                  if (value === 'none') {
                    updateRule(rule.id, 'roundingValue', '');
                  }
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Round..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Rounding</SelectItem>
                  <SelectItem value="nearest">Nearest</SelectItem>
                  <SelectItem value="up">Round Up</SelectItem>
                  <SelectItem value="down">Round Down</SelectItem>
                </SelectContent>
              </Select>

              {rule.roundingType !== 'none' && (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">.</span>
                  <Input
                    type="text"
                    className="pl-6 w-[80px]"
                    value={rule.roundingValue}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d]/g, '');
                      if (value === '' || /^\d{0,2}$/.test(value)) {
                        updateRule(rule.id, 'roundingValue', value);
                      }
                    }}
                    placeholder="00"
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => duplicateRule(rule.id)}
                  className="h-8 w-8"
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteRule(rule.id)}
                  className="h-8 w-8 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {formData.rules.length === 0 && (
            <div className="text-center p-8 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">No rules added yet. Click "Add Rule" to create your first rule.</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Rule Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sampleProduct && (
                <div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Product</p>
                      <p className="text-sm text-muted-foreground">{sampleProduct.title}</p>
                    </div>
                    {sampleProduct.variants[0] && (
                      <div>
                        <p className="text-sm font-medium">Price</p>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Current: ${Number(sampleProduct.variants[0].price).toFixed(2)}
                          </p>
                          {getNewPrice !== null && formData.rules.length > 0 && (
                            <p className={cn(
                              "text-sm",
                              getNewPrice > Number(sampleProduct.variants[0].price) 
                                ? "text-green-600" 
                                : getNewPrice < Number(sampleProduct.variants[0].price)
                                ? "text-red-600"
                                : "text-muted-foreground"
                            )}>
                              After Rules: ${getNewPrice.toFixed(2)}
                            </p>
                          )}
                          {sampleProduct.variants[0].compare_at_price && (
                            <p className="text-sm text-muted-foreground line-through">
                              Compare At: ${Number(sampleProduct.variants[0].compare_at_price).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Rule engine will run once daily at 12:00:00 EST and only apply the rule once.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Schedule (Optional)</Label>
          <span className="text-sm text-muted-foreground">Leave empty for indefinite runtime</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Start Date/Time</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.startDateTime && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {formatDateTime(formData.startDateTime)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4" align="start">
                <div className="space-y-4">
                  <CalendarComponent
                    mode="single"
                    selected={formData.startDateTime}
                    onSelect={(date) => updateDateTime('start', date)}
                    initialFocus
                  />
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <Select
                      value={formData.startDateTime ? format(formData.startDateTime, 'HH') : undefined}
                      onValueChange={(value) => {
                        if (formData.startDateTime) {
                          updateDateTime(
                            'start',
                            formData.startDateTime,
                            parseInt(value),
                            formData.startDateTime.getMinutes()
                          );
                        }
                      }}
                    >
                      <SelectTrigger className="w-[110px]">
                        <SelectValue placeholder="Hour" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => (
                          <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                            {i.toString().padStart(2, '0')}:00
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">End Date/Time</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.endDateTime && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {formatDateTime(formData.endDateTime)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4" align="start">
                <div className="space-y-4">
                  <CalendarComponent
                    mode="single"
                    selected={formData.endDateTime}
                    onSelect={(date) => updateDateTime('end', date)}
                    initialFocus
                  />
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <Select
                      value={formData.endDateTime ? format(formData.endDateTime, 'HH') : undefined}
                      onValueChange={(value) => {
                        if (formData.endDateTime) {
                          updateDateTime(
                            'end',
                            formData.endDateTime,
                            parseInt(value),
                            formData.endDateTime.getMinutes()
                          );
                        }
                      }}
                    >
                      <SelectTrigger className="w-[110px]">
                        <SelectValue placeholder="Hour" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => (
                          <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                            {i.toString().padStart(2, '0')}:00
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );

  const ProductsStep = () => {
    const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
    const [selectedVariants, setSelectedVariants] = useState<number[]>([]);
    const [expandedRows, setExpandedRows] = useState<number[]>([]);
    const [filterRules, setFilterRules] = useState<FilterRule[]>(() => 
      [{ id: "1", field: "", operator: "", value: "" }]
    );

    const { data: products } = useQuery({
      queryKey: ["products"],
      queryFn: async () => {
        const response = await fetch("https://scentiment.com/products.json");
        const data = await response.json();
        return data.products as Product[];
      },
    });

    const { data: collections } = useQuery({
      queryKey: ["collections"],
      queryFn: async () => {
        const response = await fetch("https://scentiment.com/collections.json");
        const data = await response.json();
        return data.collections as Collection[];
      },
    });

    const removeProduct = (productId: number) => {
      setSelectedProducts((current) =>
        current.filter((id) => id !== productId)
      );
      const productVariants = products?.find(p => p.id === productId)?.variants.map(v => v.id) || [];
      setSelectedVariants(current => 
        current.filter(id => !productVariants.includes(id))
      );
    };

    const removeVariant = (variantId: number) => {
      setSelectedVariants(current =>
        current.filter(id => id !== variantId)
      );
    };

    const toggleRow = (productId: number) => {
      setExpandedRows((current) =>
        current.includes(productId)
          ? current.filter((id) => id !== productId)
          : [...current, productId]
      );
    };

    const addFilterRule = () => {
      const newRule: FilterRule = {
        id: Date.now().toString(),
        field: "",
        operator: "",
        value: "",
      };
      setFilterRules([...filterRules, newRule]);
    };

    const removeFilterRule = (id: string) => {
      setFilterRules(filterRules.filter((rule) => rule.id !== id));
    };

    const updateFilterRule = (
      id: string,
      field: keyof FilterRule,
      value: string
    ) => {
      setFilterRules(
        filterRules.map((rule) =>
          rule.id === id ? { ...rule, [field]: value } : rule
        )
      );
    };

    const renderValueInput = (rule: FilterRule) => {
      if (rule.field === "collection" && (rule.operator === "contains" || rule.operator === "doesNotContain")) {
        return (
          <Select
            value={rule.value}
            onValueChange={(value) => updateFilterRule(rule.id, "value", value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select collection" />
            </SelectTrigger>
            <SelectContent>
              {collections?.map((collection) => (
                <SelectItem 
                  key={collection.id} 
                  value={collection.id.toString()}
                >
                  {collection.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }

      if (rule.field === "salesVelocity") {
        return (
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Value"
              value={rule.value.split(':')[0]}
              onChange={(e) => updateFilterRule(rule.id, "value", `${e.target.value}:${rule.value.split(':')[1] || 'day'}`)}
              className="w-[120px]"
            />
            <Select
              value={rule.value.split(':')[1] || 'day'}
              onValueChange={(value) => updateFilterRule(rule.id, "value", `${rule.value.split(':')[0] || ''}:${value}`)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Time Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Units Per Day</SelectItem>
                <SelectItem value="week">Units Per Week</SelectItem>
                <SelectItem value="month">Units Per Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      }

      return (
        <Input
          placeholder="Value"
          value={rule.value}
          onChange={(e) => updateFilterRule(rule.id, "value", e.target.value)}
          className="w-[200px]"
        />
      );
    };

    return (
      <div className="space-y-8 w-full">
        <div className="space-y-4 w-full">
          {filterRules.map((rule) => (
            <div key={rule.id} className="flex gap-4 items-center w-full">
              <Select
                value={rule.field}
                onValueChange={(value) => updateFilterRule(rule.id, "field", value)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Product Rules" />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={rule.operator}
                onValueChange={(value) =>
                  updateFilterRule(rule.id, "operator", value)
                }
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  {OPERATOR_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {renderValueInput(rule)}

              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFilterRule(rule.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={addFilterRule}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" /> Add Filter
          </Button>
        </div>

        <ScrollArea className="h-[500px] w-full rounded-md border">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.map((product) => (
                <React.Fragment key={product.id}>
                  <TableRow>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleRow(product.id)}
                      >
                        {expandedRows.includes(product.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRightIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeProduct(product.id)}
                      >
                        <X className="h-4 w-4 text-destructive hover:text-destructive/90" />
                      </Button>
                    </TableCell>
                    <TableCell>{product.title}</TableCell>
                    <TableCell>{product.product_type}</TableCell>
                  </TableRow>
                  {expandedRows.includes(product.id) && (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <div className="p-4 bg-muted/50">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[50px]"></TableHead>
                                <TableHead>Variant</TableHead>
                                <TableHead>Price</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {product.variants.map((variant) => (
                                <TableRow key={variant.id}>
                                  <TableCell>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeVariant(variant.id)}
                                    >
                                      <X className="h-4 w-4 text-destructive hover:text-destructive/90" />
                                    </Button>
                                  </TableCell>
                                  <TableCell>{variant.title}</TableCell>
                                  <TableCell>
                                    <div className="flex flex-col">
                                      <span>${Number(variant.price).toFixed(2)}</span>
                                      {variant.compare_at_price && (
                                        <span className="text-sm text-muted-foreground line-through">
                                          ${Number(variant.compare_at_price).toFixed(2)}
                                        </span>
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    );
  };

  const renderLaunch = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Rule Name</Label>
        <Input 
          id="name" 
          placeholder="Rule Name"
          value={formData.name || generateRuleName()}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <p className="text-sm text-muted-foreground">
          A name has been automatically generated based on your rule conditions. You can modify it if needed.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Rule Summary</h3>
        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
          <p><strong>Schedule:</strong> {formData.startDateTime && formData.endDateTime ? 
            `${format(formData.startDateTime, 'PPP')} to ${format(formData.endDateTime, 'PPP')}` : 
            'Always active'}
          </p>
          <p><strong>Rules:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            {formData.rules.map((rule, index) => (
              <li key={rule.id}>
                {`IF ${rule.condition} ${rule.operator} ${rule.operatorValue}${rule.operatorEndValue ? ` to ${rule.operatorEndValue}` : ''} 
                THEN ${rule.action} ${rule.valueType === 'fixed' ? '$' : ''}${rule.value}${rule.valueType === 'percentage' ? '%' : ''}`}
                {rule.roundingType !== 'none' && rule.roundingValue && 
                  ` (${rule.roundingType} to .${rule.roundingValue})`}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Create Dynamic Pricing Rule</h1>
        <Button variant="outline" onClick={() => navigate('/dynamic-pricing')}>
          Cancel
        </Button>
      </div>

      <div className="flex justify-center mb-8">
        <div className="flex items-center">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div
                className={`flex items-center ${
                  currentStep === step.id
                    ? 'text-primary'
                    : steps.findIndex(s => s.id === currentStep) > index
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                <div
                  className={`rounded-full p-2 ${
                    currentStep === step.id
                      ? 'bg-primary text-primary-foreground'
                      : steps.findIndex(s => s.id === currentStep) > index
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {steps.findIndex(s => s.id === currentStep) > index ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="h-4 w-4 flex items-center justify-center text-sm">
                      {index + 1}
                    </span>
                  )}
                </div>
                <span className="ml-2">{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <ChevronRightIcon className="mx-4 h-4 w-4 text-muted-foreground" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {currentStep === 'setup'
              ? 'Rule Details'
              : currentStep === 'products'
              ? 'Select Products'
              : 'Review and Launch'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentStep === 'setup' && renderSetup()}
          {currentStep === 'products' && <ProductsStep />}
          {currentStep === 'launch' && renderLaunch()}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 'setup'}
            >
              Back
            </Button>
            <Button
              onClick={currentStep === 'launch' ? handleFinish : handleNext}
            >
              {currentStep === 'launch' ? 'Launch Rule' : 'Continue'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateDynamicPricingRule;
