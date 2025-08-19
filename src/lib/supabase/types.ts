// Supabase Database Types

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  handle: string;
  created_at: string;
  updated_at: string;
}

export interface Collection {
  id: string;
  title: string;
  description: string;
  handle: string;
  image?: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  user_id?: string;
  session_id?: string;
  created_at: string;
  // Joined with products table
  products?: Product;
}

export interface Cart {
  id: string;
  lines: CartLine[];
  totalQuantity: number;
  cost: CartCost;
  checkoutUrl: string;
}

export interface CartLine {
  id: string;
  quantity: number;
  merchandise: CartMerchandise;
  cost: CartLineCost;
}

export interface CartMerchandise {
  id: string;
  title: string;
  product: Product;
  selectedOptions: CartOption[];
}

export interface CartOption {
  name: string;
  value: string;
}

export interface CartCost {
  totalAmount: Money;
  subtotalAmount: Money;
  totalTaxAmount: Money;
}

export interface CartLineCost {
  totalAmount: Money;
}

export interface Money {
  amount: string;
  currencyCode: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Page {
  id: string;
  title: string;
  body: string;
  bodySummary: string;
  seo?: PageSEO;
  createdAt: string;
  updatedAt: string;
}

export interface PageSEO {
  title?: string;
  description?: string;
}

// Helper types for API responses
export interface ProductsResponse {
  products: Product[];
  total: number;
}

export interface CollectionsResponse {
  collections: Collection[];
  total: number;
}
