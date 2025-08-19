'use client';

import { Product } from '@/lib/supabase/types';
import Image from 'next/image';
import Link from 'next/link';
import Price from '../common/price';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Ensure product has required properties
  const safeProduct = {
    id: product.id || 'unknown',
    title: product.title || 'Product',
    description: product.description || 'No description available',
    price: product.price || 0,
    images: Array.isArray(product.images) ? product.images : [],
    category: product.category || 'Uncategorized',
    handle: product.handle || 'product'
  };

  let imageSrc = safeProduct.images[0] || '/images/placeholder.png';

  // Validate image source
  if (!imageSrc || imageSrc === 'undefined' || imageSrc === 'null' || imageSrc.includes('example.com')) {
    imageSrc = '/images/placeholder.png';
  }

  return (
    <div className="group relative overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
      <Link href={`/product/${safeProduct.handle}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={imageSrc}
            alt={safeProduct.title}
            width={800}
            height={800}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.src = '/images/placeholder.png';
            }}
            unoptimized={imageSrc.startsWith('/images/placeholder.png')}
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
    </div>
  );
}
