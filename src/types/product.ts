export interface Variant {
  id: number;
  title: string;
  price: string;
  compare_at_price: string | null;
  inventory_quantity: number;
  src?: string;
}

export interface Product {
  id: number;
  title: string;
  product_type: string;
  created_at: string;
  variants: Variant[];
  images: { src: string }[];
  collections?: string[];
}