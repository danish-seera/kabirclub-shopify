'use client';

import { useAdminAuth } from '@/hooks/useAdminAuth';
import { deleteCollection } from '@/lib/supabase/admin-api';
import { getCollections } from '@/lib/supabase/api';
import { Collection } from '@/lib/supabase/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminCollectionsPage() {
  const { requireAdmin } = useAdminAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setIsLoading(true);
      const data = await getCollections();
      setCollections(data);
    } catch (error) {
      console.error('Error fetching collections:', error);
      setMessage({
        type: 'error',
        text: 'Failed to fetch collections'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCollection = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      requireAdmin();
      await deleteCollection(id);
      setCollections(collections.filter(c => c.id !== id));
      setMessage({
        type: 'success',
        text: `Collection "${title}" deleted successfully`
      });
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to delete collection'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Collections</h1>
          <p className="text-gray-400">Manage your product collections</p>
        </div>
        <Link
          href="/admin/collections/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add New Collection
        </Link>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Collections Grid */}
      <div className="bg-gray-900 rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="text-white">Loading collections...</div>
          </div>
        ) : collections.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400">No collections found</div>
            <Link
              href="/admin/collections/new"
              className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Your First Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {collections.map((collection) => (
              <div key={collection.id} className="bg-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white">{collection.title}</h3>
                  <div className="flex space-x-2">
                    <Link
                      href={`/admin/collections/${collection.id}/edit`}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteCollection(collection.id, collection.title)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-400 mb-4">
                  {collection.description || 'No description'}
                </p>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">
                    Handle: {collection.handle}
                  </span>
                  <Link
                    href={`/search/${collection.handle}`}
                    target="_blank"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    View →
                  </Link>
                </div>
                
                <div className="text-xs text-gray-500 mt-2">
                  Created: {new Date(collection.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
