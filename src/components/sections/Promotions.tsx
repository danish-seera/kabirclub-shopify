'use client';

// next
import Image from 'next/image';

// react-scroll-parallax
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';

const Promotions = () => {
  return (
    <ParallaxProvider>
      <div className="relative h-[570px] overflow-hidden sm:h-screen">
        <h2 className="sr-only">Promotions</h2>
        <Parallax speed={-50} className="relative hidden h-full w-full sm:block">
          <Image
            src="/images/promotions/winter.jpg"
            alt="winter collection"
            fill
            sizes="(min-width: 768px) 100vw, 867px"
            className="object-cover brightness-[0.85]"
          />
        </Parallax>
        <div className="relative block h-full w-full sm:hidden">
          <Image
            src="/images/promotions/winter.jpg"
            alt="winter collection"
            fill
            sizes="(min-width: 768px) 100vw, 867px"
            className="object-cover brightness-[0.85]"
          />
        </div>
        <div className="absolute right-[5%] top-[50%] flex w-[65%] max-w-[610px] flex-col items-center justify-center gap-[16px] rounded-[16px] bg-black/40 p-[16px] text-center -translate-y-1/2 md:gap-[32px] md:p-[32px] border border-[#daa520]">
          <h3 className="font-lora text-[clamp(24px,14px_+_2vw,60px)] font-bold leading-[1.5] text-[#daa520] drop-shadow-md">
            Summer Elegance
            <br />
            Golden Style
          </h3>
          <p className="text-[clamp(18px,10px_+_2vw,32px)] font-semibold text-white drop-shadow-md">
            Experience luxury with our premium summer collection!
          </p>
          <a className="btn bg-[#daa520] hover:bg-[#b38a1d] text-black text-[clamp(16px,8px_+_2vw,22px)] border-0" href="/search/winter-2024">
            View Collection
          </a>
          <a 
            href="https://www.instagram.com/kabirclub50" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="mt-2 text-[#daa520] hover:text-white transition-colors duration-300 flex items-center gap-2"
          >
            <span className="font-medium">Follow us @kabirclub50</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
          </a>
        </div>
      </div>
    </ParallaxProvider>
  );
};

export default Promotions;
