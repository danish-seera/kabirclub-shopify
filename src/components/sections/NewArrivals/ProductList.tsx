'use client';

import clsx from 'clsx';
import { useRef, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import { A11y, Navigation } from 'swiper/modules';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
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
  const [isStart, setIsStart] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const swiper = useRef<SwiperClass | null>(null);

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
    <div className="relative w-full">
      {isMobile ? (
        <div className="grid grid-cols-2 gap-5">
          {transformedProducts.slice(0, 4).map((product) => (
            <div key={product.id} className="p-2">
              <ProductCard product={product} />
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
          {transformedProducts.map((product) => (
            <SwiperSlide key={product.id} className="!w-[180px] sm:!w-[280px]">
              <ProductCard product={product} />
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
