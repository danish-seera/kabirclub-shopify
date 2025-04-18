export interface ProductImage {
  id: string;
  productVariantId: string;
  imageUrl: string;
  isPrimary: boolean;
  createdAt: number;
}

export interface ProductVariant {
  id: string;
  images: ProductImage[];
  name: string;
  price: number;
  stock: number;
  color: string;
  size: string;
}

export interface ProductTag {
  id: string;
  tag: string;
  createdAt: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  variants: ProductVariant[];
  tags: ProductTag[];
  createdAt: number;
}

export interface ProductListResponse {
  total: number;
  limit: number;
  page: number;
  products: Product[];
} 