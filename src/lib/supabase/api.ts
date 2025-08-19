import { CartItem, Collection, Product, isSupabaseConfigured, supabase } from '../supabase';

// Fallback data when Supabase is not configured
const fallbackProducts: Product[] = [
  {
    id: '1',
    title: 'Classic White T-Shirt',
    description: 'Premium cotton t-shirt in classic white',
    price: 999.00,
    images: ['/images/placeholder.png'],
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
    images: ['/images/placeholder.png'],
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
    images: ['/images/placeholder.png'],
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

  return data;
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
export async function getCart(sessionId: string): Promise<CartItem[]> {
  if (!checkSupabase()) {
    return []; // Return empty cart when Supabase not configured
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
    return [];
  }

  return data || [];
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
