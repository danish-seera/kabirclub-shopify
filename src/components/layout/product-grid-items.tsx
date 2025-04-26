'use client';

// components
import Link from 'next/link';

// types
import { Product } from '@/lib/types/product';

export default function ProductGridItems({ products }: { products: Product[] }) {
  return (
    <>
      {products.map((product) => {
        // Get primary image from first variant's primary image
        const primaryImage = product.variants[0]?.images.find(img => img.isPrimary)?.imageUrl;
        
        return (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="group relative overflow-hidden rounded-lg"
          >
            <div className="aspect-[4/5] w-full overflow-hidden">
              <img
                src={primaryImage || '/images/placeholder.png'}
                alt={product.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-6">
              <h3 className="text-xl font-semibold text-[#daa520]">{product.title}</h3>
              <p className="mt-1 text-sm text-gray-300">₹{product.price}</p>
              {/* <div className="mt-2 flex flex-wrap gap-1">
                {product.tags.map(tag => (
                  <span key={tag.id} className="rounded-full bg-[#daa520]/20 px-2 py-1 text-xs text-[#daa520]">
                    {tag.tag}
                  </span>
                ))}
              </div> */}
            </div>
          </Link>
        );
      })}
    </>
  );
}
