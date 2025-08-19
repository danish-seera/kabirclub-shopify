import LogoNew from '@/components/layout/LogoNew';
import Link from 'next/link';

// next

// components

const Header = async () => {
  return (
    <header className="flex w-full items-center justify-center border-b border-purple bg-black h-28">
      <h1 className="sr-only">KabirClub</h1>
      <Link href="/" title="Home">
        <LogoNew size="sm" className="h-10 mx-auto" />
      </Link>
    </header>
  );
};

export default Header;
