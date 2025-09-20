'use client';

import { useAdminAuth } from '@/hooks/useAdminAuth';
import { deleteProduct } from '@/lib/supabase/admin-api';
import { getProducts } from '@/lib/supabase/api';
import { Product } from '@/lib/supabase/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminProductsPage() {
  const { requireAdmin } = useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = ['Topwear', 'Bottomwear', 'Accessories', 'Footwear'];

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await getProducts({
        query: searchQuery,
        category: selectedCategory || undefined,
        limit: 100
      });
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
      setMessage({
        type: 'error',
        text: 'Failed to fetch products'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      requireAdmin();
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
      setMessage({
        type: 'success',
        text: `Product "${title}" deleted successfully`
      });
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to delete product'
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Products</h1>
          <p className="text-gray-400">Manage your product catalog</p>
        </div>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add New Product
        </Link>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Filters */}
      <div className="bg-gray-900 rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-gray-900 rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="text-white">Loading products...</div>
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400">No products found</div>
            <Link
              href="/admin/products/new"
              className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Your First Product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {product.images?.[0] && (
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="h-10 w-10 rounded-lg object-cover mr-4"
                            onError={(e) => {
                              e.currentTarget.src = '/images/placeholder.png';
                            }}
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-white">
                            {product.title}
                          </div>
                          <div className="text-sm text-gray-400">
                            {product.handle}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-700 text-gray-300 rounded-full">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(product.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(product.id, product.title)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                        <Link
                          href={`/product/${product.handle}`}
                          target="_blank"
                          className="text-gray-400 hover:text-gray-300"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
