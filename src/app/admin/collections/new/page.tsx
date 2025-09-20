'use client';

import { useAdminAuth } from '@/hooks/useAdminAuth';
import { createCollection } from '@/lib/supabase/admin-api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewCollectionPage() {
  const { requireAdmin } = useAdminAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    handle: '',
    image: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'title' && !formData.handle) {
      // Auto-generate handle from title
      const autoHandle = value.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      setFormData(prev => ({
        ...prev,
        [name]: value,
        handle: autoHandle
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      requireAdmin();
      setIsLoading(true);
      setMessage(null);

      // Validation
      if (!formData.title || !formData.handle) {
        throw new Error('Please fill in all required fields');
      }

      const collectionData = {
        title: formData.title,
        description: formData.description,
        handle: formData.handle,
        image: formData.image || undefined
      };

      await createCollection(collectionData);
      
      setMessage({
        type: 'success',
        text: 'Collection created successfully!'
      });

      // Redirect after a brief delay
      setTimeout(() => {
        router.push('/admin/collections');
      }, 1500);

    } catch (error: any) {
      console.error('Error creating collection:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Failed to create collection'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Add New Collection</h1>
          <p className="text-gray-400">Create a new product collection</p>
        </div>
        <Link
          href="/admin/collections"
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
        >
          Back to Collections
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Collection Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="Enter collection title"
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Handle (URL) *
            </label>
            <input
              type="text"
              name="handle"
              value={formData.handle}
              onChange={handleInputChange}
              required
              className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="collection-url-handle"
            />
            <p className="text-gray-400 text-xs mt-1">
              URL-friendly identifier (auto-generated from title)
            </p>
          </div>
        </div>

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
            placeholder="Enter collection description"
          />
        </div>

        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Collection Image (Optional)
          </label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            placeholder="https://example.com/collection-image.jpg"
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? 'Creating...' : 'Create Collection'}
          </button>
          
          <Link
            href="/admin/collections"
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 font-medium"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
