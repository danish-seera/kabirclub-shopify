'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ListItem {
  title: string;
  slug: string;
}

export default function FilterList({ list }: { list: ListItem[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState('');

  useEffect(() => {
    const sort = searchParams.get('sort');
    if (sort) {
      setActiveFilter(sort);
    }
  }, [searchParams]);

  const handleSortChange = (slug: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('sort', slug);
    router.push(`${pathname}?${newParams.toString()}`);
  };

  return (
    <div className="flex items-center gap-4">
      <ul className="flex flex-wrap gap-3">
        {list.map((item) => (
          <li key={item.slug}>
            <button
              onClick={() => handleSortChange(item.slug)}
              className={`group relative inline-block rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                activeFilter === item.slug
                  ? 'bg-[#daa520] text-black shadow-lg shadow-[#daa520]/20'
                  : 'text-gray-300 hover:bg-[#daa520]/10 hover:text-[#daa520]'
              }`}
            >
              {item.title}
              {activeFilter === item.slug && (
                <span className="absolute inset-0 animate-ping rounded-full border-2 border-[#daa520] opacity-20"></span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}


