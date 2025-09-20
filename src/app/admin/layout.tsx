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
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-white text-lg sm:text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated() || !isAdmin()) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-white text-lg sm:text-xl text-center">Access Denied</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Admin Navigation */}
      <nav className="bg-gray-900 border-b border-gray-700 px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 md:gap-8">
            <Link href="/" className="text-white font-bold text-lg sm:text-xl">
              KabirClub Admin
            </Link>
            <div className="flex flex-wrap gap-2 sm:gap-4 md:gap-6">
              <Link 
                href="/admin" 
                className="text-gray-300 hover:text-white px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link 
                href="/admin/products" 
                className="text-gray-300 hover:text-white px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium"
              >
                Products
              </Link>
              <Link 
                href="/admin/collections" 
                className="text-gray-300 hover:text-white px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium"
              >
                Collections
              </Link>
              <Link 
                href="/admin/catalog-upload" 
                className="text-gray-300 hover:text-white px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium whitespace-nowrap"
              >
                Catalog Upload
              </Link>
            </div>
          </div>
          <Link 
            href="/" 
            className="text-gray-300 hover:text-white px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium self-start sm:self-auto"
          >
            Back to Store
          </Link>
        </div>
      </nav>

      {/* Admin Content */}
      <main className="p-3 sm:p-4 md:p-6">
        {children}
      </main>
    </div>
  );
}
