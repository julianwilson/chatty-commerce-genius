import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Treemap, ResponsiveContainer } from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface MenuItem {
  name: string;
  clickPercentage: number;
}

interface RelatedCollection {
  name: string;
  keywordPopularity: number;
  id: string;
}

interface LongtailCollection {
  name: string;
  keywordPopularity: number;
  relatedCollections: RelatedCollection[];
  disabled?: boolean;
}

const menuItems: MenuItem[] = [
  { name: 'Shop Now', clickPercentage: 25 },
  { name: 'New Arrivals', clickPercentage: 18 },
  { name: 'Shop All', clickPercentage: 15 },
  { name: 'Diffusers', clickPercentage: 12 },
  { name: 'Winter Collection', clickPercentage: 8 },
  { name: 'Hotel Collection', clickPercentage: 7 },
  { name: 'Designer Collection', clickPercentage: 6 },
  { name: 'Fragrances', clickPercentage: 5 },
  { name: 'Samples', clickPercentage: 4 },
];

const longtailCollections: LongtailCollection[] = [
  {
    name: 'Shop Now',
    keywordPopularity: 0,
    disabled: true,
    relatedCollections: [
      { name: 'Best Sellers This Week', keywordPopularity: 85, id: 'best-sellers' },
      { name: 'Top Rated Products', keywordPopularity: 82, id: 'top-rated' },
      { name: 'New Customer Favorites', keywordPopularity: 78, id: 'new-customer-favorites' },
      { name: 'Trending Now In Fragrances', keywordPopularity: 75, id: 'trending-now' },
      { name: 'Most Popular Gifts', keywordPopularity: 72, id: 'popular-gifts' },
    ]
  },
  {
    name: 'New Arrivals',
    keywordPopularity: 92,
    relatedCollections: [
      { name: 'Latest Women\'s Fragrances 2025', keywordPopularity: 88, id: 'latest-womens-fragrances' },
      { name: 'Spring Collection For Her', keywordPopularity: 85, id: 'spring-collection-for-her' },
      { name: 'Exclusive New Releases', keywordPopularity: 82, id: 'exclusive-new-releases' },
      { name: 'New Luxury Perfumes', keywordPopularity: 80, id: 'new-luxury-perfumes' },
      { name: 'Trending Scents This Month', keywordPopularity: 78, id: 'trending-scents-this-month' },
    ]
  },
  {
    name: 'Shop All',
    keywordPopularity: 0,
    disabled: true,
    relatedCollections: [
      { name: 'Complete Fragrance Collection', keywordPopularity: 82, id: 'complete-fragrance-collection' },
      { name: 'All Products A-Z', keywordPopularity: 78, id: 'all-products-a-z' },
      { name: 'Browse By Category', keywordPopularity: 75, id: 'browse-by-category' },
      { name: 'Full Catalog 2025', keywordPopularity: 72, id: 'full-catalog-2025' },
      { name: 'All Brands Directory', keywordPopularity: 70, id: 'all-brands-directory' },
    ]
  },
  {
    name: 'Diffusers',
    keywordPopularity: 85,
    relatedCollections: [
      { name: 'Premium Reed Diffusers', keywordPopularity: 82, id: 'premium-reed-diffusers' },
      { name: 'Long-Lasting Home Fragrances', keywordPopularity: 78, id: 'long-lasting-home-fragrances' },
      { name: 'Luxury Room Scents', keywordPopularity: 75, id: 'luxury-room-scents' },
      { name: 'Designer Home Diffusers', keywordPopularity: 72, id: 'designer-home-diffusers' },
      { name: 'Natural Essential Oil Diffusers', keywordPopularity: 70, id: 'natural-essential-oil-diffusers' },
    ]
  },
  {
    name: 'Winter Collection',
    keywordPopularity: 82,
    relatedCollections: [
      { name: 'Winter Scents Collection For Christmas', keywordPopularity: 85, id: 'winter-scents-collection-for-christmas' },
      { name: 'Scents Like Fireplace', keywordPopularity: 82, id: 'scents-like-fireplace' },
      { name: 'Scents Like Holiday', keywordPopularity: 80, id: 'scents-like-holiday' },
      { name: 'Top Christmas Scents 2025', keywordPopularity: 78, id: 'top-christmas-scents-2025' },
      { name: 'Home Gift Ideas This Holiday Season', keywordPopularity: 75, id: 'home-gift-ideas-this-holiday-season' },
    ]
  },
  {
    name: 'Hotel Collection',
    keywordPopularity: 78,
    relatedCollections: [
      { name: 'Five Star Hotel Scents', keywordPopularity: 75, id: 'five-star-hotel-scents' },
      { name: 'Boutique Hotel Collection', keywordPopularity: 72, id: 'boutique-hotel-collection' },
      { name: 'Spa-Inspired Fragrances', keywordPopularity: 70, id: 'spa-inspired-fragrances' },
      { name: 'Resort Collection Scents', keywordPopularity: 68, id: 'resort-collection-scents' },
      { name: 'Luxury Hospitality Fragrances', keywordPopularity: 65, id: 'luxury-hospitality-fragrances' },
    ]
  },
  {
    name: 'Designer Collection',
    keywordPopularity: 75,
    relatedCollections: [
      { name: 'Luxury Designer Fragrances', keywordPopularity: 72, id: 'luxury-designer-fragrances' },
      { name: 'Limited Edition Collections', keywordPopularity: 70, id: 'limited-edition-collections' },
      { name: 'Exclusive Designer Sets', keywordPopularity: 68, id: 'exclusive-designer-sets' },
      { name: 'Premium Brand Perfumes', keywordPopularity: 65, id: 'premium-brand-perfumes' },
      { name: 'Designer Gift Collections', keywordPopularity: 62, id: 'designer-gift-collections' },
    ]
  },
  {
    name: 'Fragrances',
    keywordPopularity: 72,
    relatedCollections: [
      { name: 'Signature Scent Collection', keywordPopularity: 70, id: 'signature-scent-collection' },
      { name: 'Popular Fragrance Types', keywordPopularity: 68, id: 'popular-fragrance-types' },
      { name: 'Best-Selling Perfumes', keywordPopularity: 65, id: 'best-selling-perfumes' },
      { name: 'Seasonal Fragrance Guide', keywordPopularity: 62, id: 'seasonal-fragrance-guide' },
      { name: 'Fragrance Gift Ideas', keywordPopularity: 60, id: 'fragrance-gift-ideas' },
    ]
  },
  {
    name: 'Samples',
    keywordPopularity: 68,
    relatedCollections: [
      { name: 'Luxury Sample Sets', keywordPopularity: 65, id: 'luxury-sample-sets' },
      { name: 'Try Before You Buy', keywordPopularity: 62, id: 'try-before-you-buy' },
      { name: 'Discovery Sample Kits', keywordPopularity: 60, id: 'discovery-sample-kits' },
      { name: 'Popular Fragrance Samples', keywordPopularity: 58, id: 'popular-fragrance-samples' },
      { name: 'New Release Samples', keywordPopularity: 55, id: 'new-release-samples' },
    ]
  },
];

const treeMapData = {
  name: 'Menu',
  children: menuItems.map(item => ({
    name: item.name,
    size: item.clickPercentage,
  })),
};

const CustomizedContent = (props: any) => {
  const { root, depth, x, y, width, height, name, size } = props;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: '#7c3aed',
          stroke: '#fff',
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10),
          opacity: size / 30,
        }}
      />
      {width > 50 && height > 30 && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fill: '#fff', fontSize: 12 }}
        >
          {name}
          <tspan x={x + width / 2} y={y + height / 2 + 14}>
            {size}%
          </tspan>
        </text>
      )}
    </g>
  );
};

export const Navigation: React.FC = () => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const toggleRow = (name: string) => {
    const collection = longtailCollections.find(c => c.name === name);
    if (collection?.disabled) return;
    
    const newExpandedRows = new Set(expandedRows);
    if (expandedRows.has(name)) {
      newExpandedRows.delete(name);
    } else {
      newExpandedRows.add(name);
    }
    setExpandedRows(newExpandedRows);
  };

  const toggleSelection = (id: string) => {
    const newSelectedItems = new Set(selectedItems);
    if (selectedItems.has(id)) {
      newSelectedItems.delete(id);
    } else {
      newSelectedItems.add(id);
    }
    setSelectedItems(newSelectedItems);
  };

  const handleCreate = () => {
    console.log('Creating collections:', Array.from(selectedItems));
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Click Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <Treemap
                data={[treeMapData]}
                dataKey="size"
                aspectRatio={4 / 3}
                stroke="#fff"
                content={CustomizedContent}
              />
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Suggested Longtail Collections</CardTitle>
          <Button 
            onClick={handleCreate}
            disabled={selectedItems.size === 0}
          >
            Create Collection
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Collection Name</TableHead>
                <TableHead className="text-right">Keyword Popularity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {longtailCollections.map((collection) => (
                <React.Fragment key={collection.name}>
                  <TableRow 
                    className={`${collection.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-muted/50'}`}
                    onClick={() => toggleRow(collection.name)}
                  >
                    <TableCell className="w-4">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        disabled={collection.disabled}
                      >
                        <ChevronRight 
                          className={`h-4 w-4 transition-transform ${
                            expandedRows.has(collection.name) ? 'transform rotate-90' : ''
                          }`}
                        />
                      </Button>
                    </TableCell>
                    <TableCell>{collection.name}</TableCell>
                    <TableCell className="text-right">{collection.disabled ? '-' : collection.keywordPopularity}</TableCell>
                  </TableRow>
                  {expandedRows.has(collection.name) && collection.relatedCollections.map((related) => (
                    <TableRow key={related.id} className="bg-muted/50">
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.has(related.id)}
                          onCheckedChange={() => toggleSelection(related.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                      <TableCell className="pl-10">{related.name}</TableCell>
                      <TableCell className="text-right">{related.keywordPopularity}</TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Navigation;
