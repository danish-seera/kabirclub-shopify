'use client';

import ProductCard from '@/components/layout/ProductCard';
import { getBestSellers } from '@/lib/shopify';
import { Product } from '@/lib/shopify/types';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

const categories = ['All', 'Shirts', 'Jeans', 'Perfumes'] as const;

export default function BestSellers() {
  const [activeCategory, setActiveCategory] = useState<typeof categories[number]>('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const fetchProducts = async (category: typeof categories[number]) => {
    try {
      setLoading(true);
      const data = await getBestSellers(category, 6);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching best sellers:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(activeCategory);
  }, [activeCategory]);

  const handleCategoryChange = (category: typeof categories[number]) => {
    setActiveCategory(category);
  };

  return (
    <section className="mx-auto flex w-full max-w-[904px] flex-col items-center justify-center gap-[48px] px-4 py-[48px]">
      <div className="flex w-full flex-col items-center gap-8">
        <div className="flex w-full max-w-[800px] flex-col gap-8">
          <div className="flex flex-col items-center gap-4">
            <h1 className="font-lora text-3xl font-bold text-[#daa520]">Best Sellers</h1>
            <p className="mt-2 text-lg text-gray-300">
              Discover our most popular products
            </p>
          </div>

          <div className="flex justify-center">
            <div className="flex items-center gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`relative px-4 py-2 text-lg font-medium transition-colors ${
                    activeCategory === category
                      ? 'text-[#daa520]'
                      : 'text-gray-300 hover:text-[#daa520]'
                  }`}
                >
                  {category}
                  {activeCategory === category && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#daa520]"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#daa520] border-t-transparent" />
        </div>
      ) : products.length > 0 ? (
        <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p className="text-center text-lg text-gray-300">No products found</p>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#daa520] to-transparent" />
        </div>
      )}
    </section>
  );
} 