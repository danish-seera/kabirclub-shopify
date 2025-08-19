import { CartItem, Collection, Product, isSupabaseConfigured, supabase } from '../supabase';
import type { Cart, CartLine, Page } from './types';

// Fallback data when Supabase is not configured
const fallbackProducts: Product[] = [
  {
    id: '1',
    title: 'Classic White T-Shirt',
    description: 'Premium cotton t-shirt in classic white',
    price: 999.00,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=60'],
    category: 'Topwear',
    handle: 'classic-white-tshirt',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Denim Jeans',
    description: 'Comfortable denim jeans with perfect fit',
    price: 1999.00,
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop&q=60'],
    category: 'Bottomwear',
    handle: 'denim-jeans',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Casual Shirt',
    description: 'Elegant casual shirt for any occasion',
    price: 1499.00,
    images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=60'],
    category: 'Topwear',
    handle: 'casual-shirt',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const fallbackCollections: Collection[] = [
  {
    id: '1',
    title: 'Topwear',
    description: 'All top clothing items',
    handle: 'topwear',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Bottomwear',
    description: 'All bottom clothing items',
    handle: 'bottomwear',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Helper function to check Supabase availability
const checkSupabase = () => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured. Using fallback data.');
    return false;
  }
  return true;
};

// Helper function to convert Supabase cart items to Cart format
const convertCartItemsToCart = (cartItems: CartItem[], sessionId: string): Cart => {
  const lines: CartLine[] = cartItems.map(item => ({
    id: item.id,
    quantity: item.quantity,
    merchandise: {
      id: item.product_id,
      title: item.products?.title || 'Unknown Product',
      product: item.products || fallbackProducts[0],
      selectedOptions: []
    },
    cost: {
      totalAmount: {
        amount: (item.products?.price || 0).toString(),
        currencyCode: 'INR'
      }
    }
  }));

  const totalQuantity = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotalAmount = lines.reduce((sum, line) => sum + (line.merchandise.product.price * line.quantity), 0);
  const totalTaxAmount = subtotalAmount * 0.18; // 18% GST
  const totalAmount = subtotalAmount + totalTaxAmount;

  return {
    id: sessionId,
    lines,
    totalQuantity,
    cost: {
      totalAmount: { amount: totalAmount.toString(), currencyCode: 'INR' },
      subtotalAmount: { amount: subtotalAmount.toString(), currencyCode: 'INR' },
      totalTaxAmount: { amount: totalTaxAmount.toString(), currencyCode: 'INR' }
    },
    checkoutUrl: '/checkout' // Placeholder checkout URL
  };
};

// Products API
export async function getProducts({
  query,
  category,
  sortBy = 'created_at',
  sortOrder = 'desc',
  page = 0,
  limit = 20
}: {
  query?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}) {
  if (!checkSupabase()) {
    // Return fallback data
    let filteredProducts = fallbackProducts;
    
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    
    if (query) {
      filteredProducts = filteredProducts.filter(p => 
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    return {
      products: filteredProducts.slice(page * limit, (page + 1) * limit),
      total: filteredProducts.length
    };
  }

  // Check if Supabase is configured but return fallback if database has invalid URLs
  let queryBuilder = supabase!
    .from('products')
    .select('*')
    .order(sortBy, { ascending: sortOrder === 'asc' });

  if (query) {
    queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
  }

  if (category) {
    queryBuilder = queryBuilder.eq('category', category);
  }

  const offset = page * limit;
  const { data, error, count } = await queryBuilder
    .range(offset, offset + limit - 1)
    .select('*', { count: 'exact' });

  if (error) {
    console.error('Error fetching products:', error);
    throw new Error(`Failed to fetch products: ${error.message}`);
  }

  // Check if database has invalid URLs and fallback to local data
  const hasInvalidUrls = data?.some(product => 
    product.images?.some(img => img.includes('example.com'))
  );

  if (hasInvalidUrls) {
    console.warn('Database contains invalid URLs, using fallback data');
    let filteredProducts = fallbackProducts;
    
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    
    if (query) {
      filteredProducts = filteredProducts.filter(p => 
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    return {
      products: filteredProducts.slice(page * limit, (page + 1) * limit),
      total: filteredProducts.length
    };
  }

  return {
    products: data || [],
    total: count || 0
  };
}

export async function getProduct(handle: string): Promise<Product | null> {
  if (!checkSupabase()) {
    // Return fallback product
    return fallbackProducts.find(p => p.handle === handle) || null;
  }

  const { data, error } = await supabase!
    .from('products')
    .select('*')
    .eq('handle', handle)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data;
}

export async function getProductRecommendations(productId: string, limit = 3): Promise<Product[]> {
  if (!checkSupabase()) {
    // Return fallback recommendations
    return fallbackProducts.filter(p => p.id !== productId).slice(0, limit);
  }

  const { data, error } = await supabase!
    .from('products')
    .select('*')
    .neq('id', productId)
    .limit(limit)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }

  return data || [];
}

// Collections API
export async function getCollections(): Promise<Collection[]> {
  if (!checkSupabase()) {
    return fallbackCollections;
  }

  const { data, error } = await supabase!
    .from('collections')
    .select('*')
    .order('title', { ascending: true });

  if (error) {
    console.error('Error fetching collections:', error);
    return [];
  }

  return data || [];
}

export async function getCollection(handle: string): Promise<Collection | null> {
  if (!checkSupabase()) {
    return fallbackCollections.find(c => c.handle === handle) || null;
  }

  const { data, error } = await supabase!
    .from('collections')
    .select('*')
    .eq('handle', handle)
    .single();

  if (error) {
    console.error('Error fetching collection:', error);
    return null;
  }

  return data || null;
}

export async function getCollectionProducts({
  collection,
  sortBy = 'created_at',
  sortOrder = 'desc',
  limit = 100
}: {
  collection: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}): Promise<Product[]> {
  if (!checkSupabase()) {
    return fallbackProducts.filter(p => p.category === collection).slice(0, limit);
  }

  const { data, error } = await supabase!
    .from('products')
    .select('*')
    .eq('category', collection)
    .order(sortBy, { ascending: sortOrder === 'asc' })
    .limit(limit);

  if (error) {
    console.error('Error fetching collection products:', error);
    return [];
  }

  return data || [];
}

// Cart API
export async function getCart(sessionId: string): Promise<Cart | null> {
  if (!checkSupabase()) {
    return null; // Return null when Supabase not configured
  }

  const { data, error } = await supabase!
    .from('cart_items')
    .select(`
      *,
      products (*)
    `)
    .eq('session_id', sessionId);

  if (error) {
    console.error('Error fetching cart:', error);
    return null;
  }

  if (!data || data.length === 0) {
    return null;
  }

  return convertCartItemsToCart(data, sessionId);
}

export async function addToCart({
  productId,
  quantity,
  sessionId,
  userId
}: {
  productId: string;
  quantity: number;
  sessionId: string;
  userId?: string;
}): Promise<CartItem | null> {
  if (!checkSupabase()) {
    console.warn('Cart operations not available without Supabase configuration');
    return null;
  }

  // Check if item already exists in cart
  const { data: existingItem } = await supabase!
    .from('cart_items')
    .select('*')
    .eq('product_id', productId)
    .eq('session_id', sessionId)
    .single();

  if (existingItem) {
    // Update quantity
    const { data, error } = await supabase!
      .from('cart_items')
      .update({ quantity: existingItem.quantity + quantity })
      .eq('id', existingItem.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating cart item:', error);
      return null;
    }

    return data;
  } else {
    // Add new item
    const { data, error } = await supabase!
      .from('cart_items')
      .insert({
        product_id: productId,
        quantity,
        session_id: sessionId,
        user_id: userId
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding to cart:', error);
      return null;
    }

    return data;
  }
}

export async function updateCartItem({
  itemId,
  quantity
}: {
  itemId: string;
  quantity: number;
}): Promise<CartItem | null> {
  if (!checkSupabase()) {
    console.warn('Cart operations not available without Supabase configuration');
    return null;
  }

  const { data, error } = await supabase!
    .from('cart_items')
    .update({ quantity })
    .eq('id', itemId)
    .select()
    .single();

  if (error) {
    console.error('Error updating cart item:', error);
    return null;
  }

  return data;
}

export async function removeFromCart(itemId: string): Promise<boolean> {
  if (!checkSupabase()) {
    console.warn('Cart operations not available without Supabase configuration');
    return false;
  }

  const { error } = await supabase!
    .from('cart_items')
    .delete()
    .eq('id', itemId);

  if (error) {
    console.error('Error removing cart item:', error);
    return false;
  }

  return true;
}

export async function clearCart(sessionId: string): Promise<boolean> {
  if (!checkSupabase()) {
    console.warn('Cart operations not available without Supabase configuration');
    return false;
  }

  const { error } = await supabase!
    .from('cart_items')
    .delete()
    .eq('session_id', sessionId);

  if (error) {
    console.error('Error clearing cart:', error);
    return false;
  }

  return true;
}

// Pages API (for dynamic pages)
export async function getPage(_handle: string): Promise<Page | null> {
  if (!checkSupabase()) {
    // Return fallback page data
    return {
      id: '1',
      title: 'Sample Page',
      body: '<p>This is a sample page content.</p>',
      bodySummary: 'Sample page content',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  // For now, return fallback data since we don't have a pages table
  // You can create a pages table in Supabase if needed
  return {
    id: '1',
    title: 'Sample Page',
    body: '<p>This is a sample page content.</p>',
    bodySummary: 'Sample page content',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

// Menu API (for navigation)
export async function getMenu(_handle: string): Promise<any[]> {
  if (!checkSupabase()) {
    // Return fallback menu data
    return [
      { title: 'Home', path: '/' },
      { title: 'Products', path: '/products' },
      { title: 'About', path: '/about-us' },
      { title: 'Contact', path: '/contact' }
    ];
  }

  // For now, return fallback data since we don't have a menu table
  // You can create a menu table in Supabase if needed
  return [
    { title: 'Home', path: '/' },
    { title: 'Products', path: '/products' },
    { title: 'About', path: '/about-us' },
    { title: 'Contact', path: '/contact' }
  ];
}
