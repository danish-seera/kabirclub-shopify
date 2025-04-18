'use client';

import Link from 'next/link';

interface MenuProps {
  menu: {
    items: Array<{
      title: string;
      url: string;
      items: any[];
    }>;
  };
}

export default function Menu({ menu }: MenuProps) {
  return (
    <ul className="hidden md:flex md:items-center md:space-x-8">
      {menu.items.map((item) => (
        <li key={item.title}>
          <Link
            href={item.url}
            className="group relative text-xl font-medium text-white transition-all duration-300 hover:text-[#daa520]"
          >
            {item.title}
            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#daa520] transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
