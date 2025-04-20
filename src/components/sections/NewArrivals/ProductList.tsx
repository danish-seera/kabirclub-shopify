'use client';

import { useMediaQuery } from '../../../hooks/useMediaQuery';
import ProductCard from '../../product/ProductCard';

interface ProductListProps {
  products: Array<{
    id: string;
    title: string;
    description: string;
    price: number;
    variants: Array<{
      id: string;
      name: string;
      price: number;
      images: Array<{
        id: string;
        imageUrl: string;
        isPrimary: boolean;
      }>;
    }>;
  }>;
}

const ProductList = ({ products }: ProductListProps) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  const getItemWidth = () => {
    if (isMobile) return 'w-[280px]';
    if (isTablet) return 'w-[300px]';
    return 'w-[320px]';
  };

  const transformedProducts = products.map(product => ({
    id: product.id,
    handle: product.id,
    title: product.title,
    description: product.description,
    descriptionHtml: `<p>${product.description}</p>`,
    priceRange: {
      minVariantPrice: {
        amount: product.price.toString(),
        currencyCode: 'INR'
      },
      maxVariantPrice: {
        amount: product.price.toString(),
        currencyCode: 'INR'
      }
    },
    variants: product.variants.map(variant => ({
      id: variant.id,
      title: variant.name,
      price: {
        amount: variant.price.toString(),
        currencyCode: 'INR'
      },
      availableForSale: true,
      selectedOptions: [],
      image: {
        originalSrc: variant.images.find(img => img.isPrimary)?.imageUrl || variant.images[0]?.imageUrl || ''
      }
    })),
    images: product.variants.flatMap(variant => 
      variant.images.map(image => ({
        url: image.imageUrl,
        altText: product.title,
        width: 900,
        height: 900
      }))
    ),
    featuredImage: {
      url: product.variants[0]?.images.find(img => img.isPrimary)?.imageUrl || product.variants[0]?.images[0]?.imageUrl || '',
      altText: product.title,
      width: 900,
      height: 900
    },
    availableForSale: true,
    options: [
      {
        id: 'size',
        name: 'Size',
        values: product.variants.map(v => v.name)
      }
    ],
    seo: {
      title: product.title,
      description: product.description
    },
    tags: [],
    updatedAt: new Date().toISOString()
  }));

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-[24px] pb-4">
        {transformedProducts.map((product) => (
          <div key={product.id} className={`flex-none ${getItemWidth()}`}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
