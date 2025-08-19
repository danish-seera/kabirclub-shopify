'use client';

import { updateItemQuantity } from './actions';
import type { CartLine } from '@/lib/supabase/types';

export function EditItemQuantityButton({
  item,
  type
}: {
  item: CartLine;
  type: 'plus' | 'minus';
}) {
  const handleSubmit = async () => {
    const newQuantity = type === 'plus' ? item.quantity + 1 : item.quantity - 1;
    
    if (newQuantity < 0) return;
    
    await updateItemQuantity(null, {
      lineId: item.id,
      variantId: item.merchandise.id,
      quantity: newQuantity
    });
  };

  return (
    <button
      onClick={handleSubmit}
      className="ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-none px-2 transition-all duration-200 hover:border-purple hover:bg-purple hover:text-white"
      type="button"
      aria-label={type === 'plus' ? 'Increase item quantity' : 'Decrease item quantity'}
    >
      <span className="text-lg font-bold text-purple hover:text-white">
        {type === 'plus' ? '+' : '−'}
      </span>
    </button>
  );
}
