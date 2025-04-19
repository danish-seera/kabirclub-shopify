'use client';

import { Product } from '@/lib/shopify/types';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.handle}`}>
      <div className="group relative flex flex-col gap-4">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText}
            width={800}
            height={800}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-medium text-gray-900">{product.title}</h3>
          <p className="text-sm text-gray-500">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-[#daa520]">
              ₹{product.priceRange.minVariantPrice.amount}
            </span>
            <span className="text-sm text-gray-500">
              {product.variants.length} variants
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
} 