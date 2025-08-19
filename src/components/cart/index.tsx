import { getCart } from '@/lib/supabase/api';
import { cookies } from 'next/headers';
import CartModal from './modal';

export default async function Cart() {
  const sessionId = cookies().get('sessionId')?.value;
  let cart;

  if (sessionId) {
    cart = await getCart(sessionId);
  }

  return <CartModal cart={cart} />;
}
