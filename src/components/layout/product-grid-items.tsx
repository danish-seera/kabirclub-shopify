'use client';

import { Product } from '@/lib/supabase/types';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Price from '../common/price';

interface ProductGridItemsProps {
  products: Product[];
  title?: string;
  delay?: number;
  duration?: number;
}

export default function ProductGridItems({ products, title, delay = 0, duration }: ProductGridItemsProps) {
  return (
    <div className="space-y-8">
      {title && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration || 0.5, delay: delay + (index * 0.1) }}
            className="group relative overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
          >
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
                <h3 className="mb-2 text-lg font-semibold text-gray-800 line-clamp-1">
                  {product.title}
                </h3>
                <div className="mb-3 flex items-center justify-between">
                  <Price
                    amount={product.price.toString()}
                    currencyCode="INR"
                    className="text-xl font-bold text-[#daa520]"
                  />
                  <span className="text-sm text-gray-500 capitalize">
                    {product.category}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
