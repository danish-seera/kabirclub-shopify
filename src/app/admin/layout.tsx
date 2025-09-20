'use client';

import { useAdminAuth } from '@/hooks/useAdminAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isAdmin, isLoading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated()) {
        router.push('/login?redirect=/admin');
        return;
      }
      if (!isAdmin()) {
        router.push('/');
        return;
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated() || !isAdmin()) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Access Denied</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Admin Navigation */}
      <nav className="bg-gray-900 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-white font-bold text-xl">
              KabirClub Admin
            </Link>
            <div className="flex space-x-6">
              <Link 
                href="/admin" 
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link 
                href="/admin/products" 
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Products
              </Link>
              <Link 
                href="/admin/collections" 
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Collections
              </Link>
              <Link 
                href="/admin/catalog-upload" 
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Catalog Upload
              </Link>
            </div>
          </div>
          <Link 
            href="/" 
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            Back to Store
          </Link>
        </div>
      </nav>

      {/* Admin Content */}
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}
