import LogoNew from '@/components/layout/LogoNew';
import { getMenu } from '@/lib/shopify';


// next

// components

const Header = async () => {
  const menu = await getMenu('main-menu');
  return (
    <header className="flex w-full items-center justify-center border-b border-purple bg-black h-28">
      <h1 className="sr-only">KabirClub</h1>
      <LogoNew size="sm" className="mx-auto" />
    </header>
  );
};

export default Header;
