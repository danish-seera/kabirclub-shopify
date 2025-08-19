'use client';

import { Product } from '@/lib/supabase/types';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Price from '../common/price';

interface ProductCardProps {
  product: Product;
  delay?: number;
  duration?: number;
  rank?: number;
}

export default function ProductCard({ product, delay = 0, duration, rank }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration || 0.5, delay }}
      className="group relative overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
    >
      {/* {rank && (
        <div className="absolute left-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#daa520] text-sm font-bold text-white">
          {rank}
        </div>
      )} */}
      
      <Link href={`/product/${product.handle}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.images[0] || '/images/placeholder.png'}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        
        <div className="p-4">
          <h3 className="mb-2 text-m font-semibold text-gray-800 line-clamp-1">
            {product.title}
          </h3>
          {/* <p className="mb-3 text-xs text-gray-600 line-clamp-2">
            {product.description}
          </p> */}
          <div className="mb-3 flex items-center justify-between">
            <Price
              amount={product.price.toString()}
              currencyCode="INR"
              className="text-l font-bold text-[#daa520]"
            />
            {/* <span className="text-sm text-gray-500 capitalize">
              {product.category}
            </span> */}
          </div>
        </div>
      </Link>
    </motion.div>
  );
} 