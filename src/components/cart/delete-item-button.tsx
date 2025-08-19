'use client';

import type { CartLine } from '@/lib/supabase/types';
import { removeItem } from './actions';

export function DeleteItemButton({ item }: { item: CartLine }) {
  async function handleRemove() {
    await removeItem(null, item.id);
  }

  return (
    <form action={handleRemove}>
      <button
        className="ease flex h-[17px] w-[17px] items-center justify-center rounded-full border border-purple bg-white transition-all duration-200 hover:bg-purple hover:text-white"
        type="submit"
        aria-label="Remove cart item"
      >
        <span className="text-[10px] font-bold text-purple hover:text-white">×</span>
      </button>
    </form>
  );
}
