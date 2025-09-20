'use client';

import Cart from '@/components/cart';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import UserProfile from './UserProfile';

export default function Header() {
  const { isLoading } = useAuth();

  // Show loading state until auth is initialized
  if (isLoading) {
    return (
      <header className="flex w-full items-center justify-between border-b border-gray-800 bg-black h-16 md:h-20 lg:h-28 px-3 md:px-6 relative">
        <h1 className="sr-only">KabirClub</h1>
        <div className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
          <a title="Home" className="block" href="/">
            <Image 
              alt="logo" 
              src="/images/logo2.png" 
              width={150}
              height={52}
              className="w-auto h-6 sm:h-8 md:h-10 lg:h-12 xl:h-[52px] max-w-none"
              priority
            />
          </a>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3 ml-auto">
          <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-6 md:h-6 bg-gray-800 rounded animate-pulse"></div>
          <div className="flex items-center">
            <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gray-800 animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="flex w-full items-center justify-between border-b border-gray-800 bg-black h-16 md:h-20 lg:h-28 px-3 md:px-6 relative">
      <h1 className="sr-only">KabirClub</h1>
      <div className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
        <a title="Home" className="block" href="/">
          <Image 
            alt="logo" 
            src="/images/logo2.png" 
            width={150}
            height={52}
            className="w-auto h-6 sm:h-8 md:h-10 lg:h-12 xl:h-[52px] max-w-none"
            priority
          />
        </a>
      </div>
      <div className="flex items-center gap-1 sm:gap-2 md:gap-3 ml-auto">
        <Cart />
        <UserProfile />
      </div>
    </header>
  );
}
