'use client';

import ProductCard from '@/components/layout/ProductCard';
import { getProducts } from '@/lib/supabase/api';
import { Product } from '@/lib/supabase/types';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const categories = ['All', 'Topwear', 'Bottomwear', 'Accessories'] as const;

export default function BestSellers() {
  const [activeCategory, setActiveCategory] = useState<typeof categories[number]>('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async (category: typeof categories[number]) => {
    try {
      setLoading(true);
      const data = await getProducts({
        category: category === 'All' ? undefined : category,
        limit: 6,
        sortBy: 'created_at',
        sortOrder: 'desc'
      });
      setProducts(data.products);
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
    <section className="mx-auto flex w-full max-w-[95%] lg:max-w-[904px] flex-col items-center justify-center gap-6 sm:gap-8 md:gap-12 px-3 sm:px-4 py-8 sm:py-12 md:py-16">
      <div className="flex w-full flex-col items-center gap-6 sm:gap-8">
        <div className="flex w-full max-w-[800px] flex-col gap-4 sm:gap-6 md:gap-8">
          <div className="flex flex-col items-center gap-2 sm:gap-3 md:gap-4 text-center">
            <h1 className="font-lora text-2xl sm:text-3xl md:text-4xl font-bold text-[#daa520]">Best Sellers</h1>
            <p className="mt-1 sm:mt-2 text-base sm:text-lg text-gray-300 px-4">
              Discover our most popular products
            </p>
          </div>

          <div className="flex justify-center overflow-x-auto">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-max px-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`relative px-3 sm:px-4 py-2 text-sm sm:text-base md:text-lg font-medium transition-colors whitespace-nowrap ${
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
        <div className="flex h-48 sm:h-64 items-center justify-center">
          <div className="h-6 w-6 sm:h-8 sm:w-8 animate-spin rounded-full border-2 sm:border-4 border-[#daa520] border-t-transparent" />
        </div>
      ) : products.length > 0 ? (
        <div className="grid w-full grid-cols-1 gap-4 sm:gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex justify-center"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 sm:gap-4 px-4">
          <p className="text-center text-base sm:text-lg text-gray-300">No products found</p>
          <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-[#daa520] to-transparent" />
        </div>
      )}
    </section>
  );
} 