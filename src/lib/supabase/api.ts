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
  const lines: CartLine[] = cartItems
    .filter(item => item.products) // Only include items with valid products
    .map(item => ({
      id: item.id,
      quantity: item.quantity,
      merchandise: {
        id: item.product_id,
        title: item.products!.title,
        product: item.products!,
        selectedOptions: []
      },
      cost: {
        totalAmount: {
          amount: item.products!.price.toString(),
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
  const { data, error } = await queryBuilder
    .range(offset, offset + limit - 1)
    .select('*');

  if (error) {
    console.error('Error fetching products:', error);
    throw new Error(`Failed to fetch products: ${error.message}`);
  }

  // Check if database has invalid URLs and fallback to local data
  const hasInvalidUrls = data?.some(product => 
    product.images?.some((img: string) => img.includes('example.com'))
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
    total: data?.length || 0
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
  console.log('addToCart called with:', { productId, quantity, sessionId, userId });
  
  if (!checkSupabase()) {
    console.warn('Cart operations not available without Supabase configuration');
    return null;
  }

  try {
    // Check if item already exists in cart
    console.log('Checking for existing cart item...');
    const { data: existingItem, error: selectError } = await supabase!
      .from('cart_items')
      .select('*')
      .eq('product_id', productId)
      .eq('session_id', sessionId)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      console.error('Error checking existing cart item:', selectError);
      return null;
    }

    if (existingItem) {
      console.log('Updating existing cart item:', existingItem);
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

      console.log('Cart item updated successfully:', data);
      return data;
    } else {
      console.log('Adding new cart item...');
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

      console.log('Cart item added successfully:', data);
      return data;
    }
  } catch (error) {
    console.error('Unexpected error in addToCart:', error);
    return null;
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
export async function getPage(): Promise<Page | null> {
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
export async function getMenu(): Promise<any[]> {
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

export async function placeOrder(orderData: {
  sessionId: string;
  items: any[]; // Ideally OrderItem[]
  shippingAddress: any; // Ideally ShippingAddress
  paymentMethod: string;
  upiId?: string;
}) {
  try {
    if (!checkSupabase()) {
      throw new Error('Supabase not configured');
    }

    const { sessionId, items, shippingAddress, paymentMethod, upiId } = orderData;
    
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const shippingCost = 0;
    const totalAmount = subtotal + shippingCost;

    const { data: order, error: orderError } = await supabase!
      .from('orders')
      .insert({
        session_id: sessionId,
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        upi_id: upiId,
        payment_status: 'pending',
        order_status: 'pending',
        subtotal,
        shipping_cost: shippingCost,
        total_amount: totalAmount
      })
      .select()
      .single();

    if (orderError) {
      throw new Error(`Error creating order: ${orderError.message}`);
    }

    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.product.id,
      quantity: item.quantity,
      size: item.size,
      price: item.product.price,
      total_price: item.totalPrice
    }));

    const { error: itemsError } = await supabase!
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      throw new Error(`Error creating order items: ${itemsError.message}`);
    }

    const { error: clearCartError } = await supabase!
      .from('cart_items')
      .delete()
      .eq('session_id', sessionId);

    if (clearCartError) {
      console.warn('Warning: Could not clear cart after order:', clearCartError.message);
    }

    return order;
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
}

export async function getOrders(sessionId: string) {
  try {
    if (!checkSupabase()) {
      throw new Error('Supabase not configured');
    }

    // Get orders for the session
    const { data: orders, error: ordersError } = await supabase!
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (*)
        )
      `)
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false });

    if (ordersError) {
      throw new Error(`Error fetching orders: ${ordersError.message}`);
    }

    // Transform the data to match our Order type
    const transformedOrders = orders?.map(order => ({
      id: order.id,
      userId: order.user_id,
      sessionId: order.session_id,
      items: order.order_items?.map((item: any) => ({
        id: item.id,
        productId: item.product_id,
        product: item.product,
        quantity: item.quantity,
        size: item.size,
        price: item.price,
        totalPrice: item.total_price
      })) || [],
      shippingAddress: order.shipping_address,
      paymentMethod: order.payment_method,
      upiId: order.upi_id,
      paymentStatus: order.payment_status,
      orderStatus: order.order_status,
      subtotal: order.subtotal,
      shippingCost: order.shipping_cost,
      totalAmount: order.total_amount,
      createdAt: order.created_at,
      updatedAt: order.updated_at
    })) || [];

    return transformedOrders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}
