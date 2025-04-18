'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface ListItem {
  title: string;
  slug: string;
}

export default function FilterList({ list, title }: { list: ListItem[]; title: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeFilter = searchParams.get('sort');

  const handleSortChange = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', slug);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-4">
      <h3 className="font-lora text-lg font-semibold text-[#daa520]">{title}</h3>
      <ul className="flex flex-wrap gap-2">
        {list.map((item) => (
          <li key={item.slug}>
            <button
              onClick={() => handleSortChange(item.slug)}
              className={`inline-block rounded-full px-4 py-2 text-sm transition-colors ${
                activeFilter === item.slug
                  ? 'bg-[#daa520] text-black'
                  : 'text-gray-300 hover:bg-[#daa520]/10'
              }`}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
} 