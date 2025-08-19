import Cart from '@/components/cart';
import LogoNew from '@/components/layout/LogoNew';
import Link from 'next/link';
import UserProfile from './UserProfile';

// next

// components

const Header = async () => {
  return (
    <header className="flex w-full items-center justify-between border-b border-purple bg-black h-28 px-6 relative">
      <h1 className="sr-only">KabirClub</h1>
      
      {/* Empty div for left side balance */}
      <div className="w-12"></div>
      
      {/* Logo - Center */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <Link href="/" title="Home">
          <LogoNew size="sm" className="h-10" />
        </Link>
      </div>
      
      {/* Right Side - Cart & User Profile */}
      <div className="flex items-center gap-4">
        <UserProfile />
        <Cart />
      </div>
    </header>
  );
};

export default Header;
