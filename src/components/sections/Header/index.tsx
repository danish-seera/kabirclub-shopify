import Cart from '@/components/cart';
import LogoNew from '@/components/layout/LogoNew';
import Link from 'next/link';
import UserProfile from './UserProfile';

// next

// components

const Header = async () => {
  return (
    <header className="flex w-full items-center justify-between border-b border-gray-800 bg-black h-20 md:h-28 px-4 md:px-6 relative">
      <h1 className="sr-only">KabirClub</h1>
      
      {/* Logo - Left on mobile, Center on desktop */}
      <div className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
        <Link href="/" title="Home" className="block">
          <LogoNew size="sm" className="h-8 md:h-10" />
        </Link>
      </div>
      
      {/* Right Side - User Profile & Cart */}
      <div className="flex items-center gap-3 md:gap-1 ml-auto">
        <Cart />
        <UserProfile />
      </div>
    </header>
  );
};

export default Header;
