'use client';

import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function UserProfile() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const { isAdmin } = useAdminAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  // Close dropdown when user logs out
  useEffect(() => {
    if (!isAuthenticated()) {
      setShowDropdown(false);
    }
  }, [isAuthenticated]);

  // Handle escape key to close dropdown
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showDropdown]);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-800 animate-pulse"></div>
      </div>
    );
  }

  // Show login button for non-authenticated users
  if (!isAuthenticated()) {
    return (
      <div className="flex items-center">
        <Link
          href="/login"
          className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-800 hover:bg-[#daa520] transition-all duration-300 group"
          title="Login"
        >
          <svg 
            className="w-4 h-4 md:w-5 md:h-5 text-gray-300 group-hover:text-black transition-colors duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
            />
          </svg>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 text-white hover:text-[#daa520] transition-colors duration-200"
        title={`${user?.name || 'User'} - Click to open menu`}
      >
        <div className="w-6 h-6 bg-[#daa520] rounded-full flex items-center justify-center text-black font-bold text-xs">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        {/* Optional: Show user name on larger screens */}
        <span className="text-sm font-medium hidden lg:block text-gray-300 group-hover:text-[#daa520] transition-colors duration-200">
          {user?.name || 'User'}
        </span>
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-2xl z-50">
          <div className="py-2">
            <div className="px-4 py-2 border-b border-gray-800">
              <p className="text-white text-sm font-medium">{user?.name}</p>
              <p className="text-gray-400 text-xs">{user?.email}</p>
            </div>
            
            <Link
              href="/profile"
              className="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-[#daa520] transition-colors duration-200 flex items-center space-x-2"
              onClick={() => setShowDropdown(false)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>My Profile</span>
            </Link>
            
            <Link
              href="/orders"
              className="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-[#daa520] transition-colors duration-200 flex items-center space-x-2"
              onClick={() => setShowDropdown(false)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>My Orders</span>
            </Link>
            
            {/* Admin Panel Link - Only show for admin users */}
            {isAdmin() && (
              <Link
                href="/admin"
                className="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-[#daa520] transition-colors duration-200 flex items-center space-x-2"
                onClick={() => setShowDropdown(false)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Admin Panel</span>
              </Link>
            )}
            
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors duration-200 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}
