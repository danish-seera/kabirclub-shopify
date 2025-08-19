'use client';

import clsx from 'clsx';
import { useRef, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import { A11y, Navigation } from 'swiper/modules';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { Product } from '../../../lib/supabase/types';
import ProductCard from '../../product/ProductCard';

interface ProductListProps {
  products?: Product[];
}

const ProductList = ({ products = [] }: ProductListProps) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isStart, setIsStart] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const swiper = useRef<SwiperClass | null>(null);

  // If no products, show empty state
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg text-gray-500 mb-4">No products available</p>
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#daa520] to-transparent" />
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {isMobile ? (
        <div className="grid grid-cols-2 gap-1">
          {products.slice(0, 4).map((product) => (
            <div key={product.id} className="p-2">
              {product && product.id ? (
                <ProductCard product={product} />
              ) : (
                <div className="flex flex-col gap-4 p-4 bg-gray-100 rounded-lg">
                  <div className="aspect-square bg-gray-200 rounded-lg" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <Swiper
          modules={[Navigation, A11y]}
          slidesPerView={1.1}
          spaceBetween={16}
          slidesOffsetBefore={16}
          slidesOffsetAfter={16}
          freeMode={false}
          grabCursor={false}
          watchSlidesProgress={true}
          preventInteractionOnTransition={true}
          breakpoints={{
            0: {
              slidesPerView: 1.1,
              spaceBetween: 16,
              slidesOffsetBefore: 16,
              slidesOffsetAfter: 16,
              watchSlidesProgress: true,
              preventInteractionOnTransition: true
            },
            480: {
              slidesPerView: 1.5,
              spaceBetween: 16,
              slidesOffsetBefore: 16,
              slidesOffsetAfter: 16
            },
            768: {
              slidesPerView: 2.5,
              spaceBetween: 32,
              slidesOffsetBefore: 32,
              slidesOffsetAfter: 32
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 32,
              slidesOffsetBefore: 0,
              slidesOffsetAfter: 0
            }
          }}
          navigation={{ nextEl: 'swiper-button-next', prevEl: 'swiper-button-prev' }}
          onSwiper={(s) => {
            swiper.current = s;
          }}
          onSlidesUpdated={(s) => {
            setIsEnd(s.isEnd);
            setIsStart(s.isBeginning);
          }}
          onSlideChange={(s) => {
            setIsEnd(s.isEnd);
            setIsStart(s.isBeginning);
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id} className="!w-[180px] sm:!w-[280px]">
              <div key={product.id}>
                {product && product.id ? (
                  <ProductCard product={product} />
                ) : (
                  <div className="flex flex-col gap-4 p-4 bg-gray-100 rounded-lg">
                    <div className="aspect-square bg-gray-200 rounded-lg" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded" />
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                    </div>
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      {/* Swiper navigation buttons only for non-mobile */}
      {!isMobile && (
        <>
          <button
            className={clsx(
              'absolute -right-[5%] top-[180px] hidden font-[swiper-icons] text-[40px] transition-all duration-300 will-change-transform lg:block',
              {
                'text-purple hover:text-darkPurple hover:drop-shadow-lg hover:scale-110': !isEnd,
                'text-purple/30': isEnd
              }
            )}
            onClick={() => swiper.current?.slideNext()}
            disabled={isEnd}
          >
            next
          </button>
          <button
            className={clsx(
              'absolute -left-[5%] top-[180px] hidden font-[swiper-icons] text-[40px] transition-all duration-300 will-change-transform lg:block',
              {
                'text-purple hover:text-darkPurple hover:drop-shadow-lg hover:scale-110': !isStart,
                'text-purple/30': isStart
              }
            )}
            onClick={() => swiper.current?.slidePrev()}
            disabled={isStart}
          >
            prev
          </button>
        </>
      )}
    </div>
  );
};

export default ProductList;
