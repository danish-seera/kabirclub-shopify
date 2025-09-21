'use client';

import ImageUpload from '@/components/admin/ImageUpload';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { createProduct } from '@/lib/supabase/admin-api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewProductPage() {
  const { requireAdmin } = useAdminAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    handle: '',
    sizes: [] as string[],
    images: [] as string[],
    is_active: true
  });
  
  const [uploadError, setUploadError] = useState<string | null>(null);

  const categories = ['Topwear', 'Bottomwear', 'Accessories', 'Footwear'];
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'title') {
      // Auto-generate handle from title with random number
      const randomNumber = Math.floor(Math.random() * 90000) + 10000; // 5-digit random number
      const autoHandle = value.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim() + '-' + randomNumber;
      
      setFormData(prev => ({
        ...prev,
        [name]: value,
        handle: autoHandle
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    }
  };

  const handleImageUploaded = (url: string) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, url]
    }));
    setUploadError(null);
  };

  const handleImageError = (error: string) => {
    setUploadError(error);
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSizeToggle = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      requireAdmin();
      setIsLoading(true);
      setMessage(null);

      // Validation
      if (!formData.title || !formData.price || !formData.category || !formData.handle || formData.sizes.length === 0) {
        throw new Error('Please fill in all required fields and select at least one size');
      }

      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        throw new Error('Please enter a valid price');
      }

      // Use uploaded images
      const images = formData.images;

      const productData = {
        title: formData.title,
        description: formData.description,
        price: price,
        category: formData.category,
        handle: formData.handle,
        sizes: formData.sizes,
        images: images,
        is_active: formData.is_active
      };

      await createProduct(productData);
      
      setMessage({
        type: 'success',
        text: 'Product created successfully!'
      });

      // Redirect after a brief delay
      setTimeout(() => {
        router.push('/admin/products');
      }, 1500);

    } catch (error: any) {
      console.error('Error creating product:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Failed to create product'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Add New Product</h1>
          <p className="text-gray-400">Create a new product for your catalog</p>
        </div>
        <Link
          href="/admin/products"
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
        >
          Back to Products
        </Link>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gray-900 rounded-lg p-6 space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Product Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="Enter product title"
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Price (₹) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Available Sizes *
            </label>
            <div className="grid grid-cols-5 gap-2">
              {sizes.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  className={`px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
                    formData.sizes.includes(size)
                      ? 'border-blue-500 bg-blue-600 text-white'
                      : 'border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <p className="text-gray-400 text-xs mt-1">
              Select all available sizes for this product
            </p>
            {formData.sizes.length > 0 && (
              <p className="text-blue-400 text-xs mt-1">
                Selected: {formData.sizes.join(', ')}
              </p>
            )}
          </div>
        </div>

        {/* Handle field is auto-generated and hidden from user */}

        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            placeholder="Enter product description"
          />
        </div>

        {/* Product Status */}
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor="is_active" className="text-white text-sm font-medium">
              Product is active (visible to customers)
            </label>
          </div>
          <p className="text-gray-400 text-xs mt-1">
            Uncheck to create this product as disabled (not visible to customers)
          </p>
        </div>

        {/* Product Images */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Product Images
          </label>
          
          {uploadError && (
            <div className="mb-4 p-3 bg-red-900 text-red-200 rounded-lg">
              {uploadError}
            </div>
          )}

          <ImageUpload
            onImageUploaded={handleImageUploaded}
            onError={handleImageError}
            maxImages={5}
            currentImages={formData.images}
          />

          {/* Current Images with Remove Option */}
          {formData.images.length > 0 && (
            <div className="mt-4">
              <p className="text-gray-400 text-sm mb-2">Uploaded Images:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {formData.images.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-600"
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder.png';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove image"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? 'Creating...' : 'Create Product'}
          </button>
          
          <Link
            href="/admin/products"
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 font-medium"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
