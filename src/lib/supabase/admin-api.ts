import { isSupabaseConfigured, supabase } from '../supabase';
import { Collection, Product } from './types';

// Admin-only functions for catalog management

export async function createProduct(productData: {
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  handle: string;
}): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase!
    .from('products')
    .insert(productData)
    .select()
    .single();

  if (error) {
    console.error('Error creating product:', error);
    throw new Error(`Failed to create product: ${error.message}`);
  }

  return data;
}

export async function updateProduct(
  id: string, 
  updates: Partial<{
    title: string;
    description: string;
    price: number;
    images: string[];
    category: string;
    handle: string;
  }>
): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase!
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating product:', error);
    throw new Error(`Failed to update product: ${error.message}`);
  }

  return data;
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }

  const { error } = await supabase!
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    throw new Error(`Failed to delete product: ${error.message}`);
  }

  return true;
}

export async function createCollection(collectionData: {
  title: string;
  description: string;
  handle: string;
  image?: string;
}): Promise<Collection | null> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase!
    .from('collections')
    .insert(collectionData)
    .select()
    .single();

  if (error) {
    console.error('Error creating collection:', error);
    throw new Error(`Failed to create collection: ${error.message}`);
  }

  return data;
}

export async function updateCollection(
  id: string,
  updates: Partial<{
    title: string;
    description: string;
    handle: string;
    image: string;
  }>
): Promise<Collection | null> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase!
    .from('collections')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating collection:', error);
    throw new Error(`Failed to update collection: ${error.message}`);
  }

  return data;
}

export async function deleteCollection(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }

  const { error } = await supabase!
    .from('collections')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting collection:', error);
    throw new Error(`Failed to delete collection: ${error.message}`);
  }

  return true;
}

// Bulk operations for catalog management
export async function bulkCreateProducts(products: Array<{
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  handle: string;
}>): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase!
    .from('products')
    .insert(products)
    .select();

  if (error) {
    console.error('Error bulk creating products:', error);
    throw new Error(`Failed to bulk create products: ${error.message}`);
  }

  return data || [];
}

export async function uploadImage(file: File): Promise<string> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { error } = await supabase!.storage
    .from('product-images')
    .upload(filePath, file);

  if (error) {
    console.error('Error uploading image:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase!.storage
    .from('product-images')
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}
