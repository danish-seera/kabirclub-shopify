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
    <Link href={`/product/${safeProduct.handle}`} className="group">
      <div className="flex flex-col gap-4">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
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
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-medium text-gray-900">{safeProduct.title}</h3>
          <p className="text-sm text-gray-500">{safeProduct.description}</p>
          <div className="flex items-center justify-between">
            <Price
              amount={safeProduct.price.toString()}
              currencyCode="INR"
              className="text-lg font-bold text-[#daa520]"
            />
            <span className="text-sm text-gray-500 capitalize">
              {safeProduct.category}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
