'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedSearch = useCallback((value: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set('q', value);
      } else {
        params.delete('q');
      }
      router.push(`/search?${params.toString()}`);
    }, 300);
  }, [searchParams, router]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search products..."
        className="w-full rounded-full border border-[#daa520]/20 bg-black px-6 py-3 text-gray-300 placeholder-gray-500 focus:border-[#daa520] focus:outline-none"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#daa520]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
} 