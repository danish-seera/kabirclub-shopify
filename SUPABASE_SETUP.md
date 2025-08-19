# Supabase Integration Setup Guide

## Overview
This project has been successfully integrated with Supabase to replace the external Shopify API calls. Supabase provides a PostgreSQL database with real-time capabilities and authentication.

## Setup Steps

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Note down your project URL and anon key

### 2. Environment Variables
Add these to your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8081
```

### 3. Database Setup
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the SQL to create tables and sample data

### 4. Row Level Security (RLS)
The schema includes RLS policies for security:
- Products and collections are publicly readable
- Cart items are managed by session ID
- Users can only access their own data

## Database Schema

### Tables
- **products**: Product information with images, price, category
- **collections**: Product categories/collections
- **cart_items**: Shopping cart items linked to sessions
- **users**: User profiles (for future authentication)

### Key Features
- UUID primary keys for security
- Automatic timestamp updates
- Proper indexing for performance
- Foreign key relationships

## API Functions

### Products
- `getProducts()` - Fetch products with filtering, sorting, pagination
- `getProduct(handle)` - Get single product by handle
- `getProductRecommendations()` - Get related products

### Collections
- `getCollections()` - Fetch all collections
- `getCollection(handle)` - Get single collection
- `getCollectionProducts()` - Get products in collection

### Cart
- `getCart(sessionId)` - Get user's cart
- `addToCart()` - Add/update cart items
- `updateCartItem()` - Update item quantity
- `removeFromCart()` - Remove items
- `clearCart()` - Clear entire cart

## Migration from Shopify

### What Changed
- ✅ Replaced Shopify API calls with Supabase
- ✅ Updated all components to use new data structure
- ✅ Simplified cart management with session-based approach
- ✅ Removed external API dependencies

### Benefits
- 🚀 Faster local development
- 🔒 Better security with RLS
- 💾 Real-time database capabilities
- 🆓 Free tier available
- 🔧 Full control over data structure

## Testing

### Local Development
1. Set up environment variables
2. Run database schema
3. Start development server: `npm run dev`
4. Test product listing, search, and cart functionality

### Sample Data
The schema includes sample products and collections to test with:
- Classic White T-Shirt (₹999)
- Denim Jeans (₹1999)
- Casual Shirt (₹1499)

## Future Enhancements

### Authentication
- User registration/login
- Profile management
- Order history

### Real-time Features
- Live inventory updates
- Real-time cart synchronization
- Live chat support

### Advanced Features
- Product reviews/ratings
- Wishlist functionality
- Advanced search filters
- Analytics dashboard

## Troubleshooting

### Common Issues
1. **Environment variables not set**: Check `.env.local` file
2. **Database connection failed**: Verify Supabase URL and key
3. **RLS policies blocking access**: Check table policies in Supabase dashboard
4. **Missing tables**: Run the schema SQL again

### Support
- Check Supabase documentation
- Review console errors in browser
- Verify database permissions

## Performance Tips

1. **Indexing**: All major queries are properly indexed
2. **Pagination**: Use limit/offset for large datasets
3. **Caching**: Implement client-side caching for static data
4. **Optimization**: Monitor query performance in Supabase dashboard
