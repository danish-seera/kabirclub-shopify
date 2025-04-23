import { ProductListResponse } from '../types/product';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-909b.up.railway.app';

export async function getProducts(params: {
  query?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  category?: string;
}): Promise<ProductListResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.query) searchParams.append('query', params.query);
  if (params.sortBy) searchParams.append('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);
  if (params.page !== undefined) searchParams.append('page', params.page.toString());
  if (params.limit) searchParams.append('limit', params.limit.toString());
  if (params.category) searchParams.append('category', params.category);

  const url = `https://backend-production-909b.up.railway.app/api/products?${searchParams.toString()}`;
  console.log('API URL:', url);

  try {
    const response = await fetch(url);
    console.log('API Response Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Failed to fetch products: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('API Response Data:', data);
    return data;
  } catch (error) {
    console.error('API Call Error:', error);
    throw error;
  }
} 