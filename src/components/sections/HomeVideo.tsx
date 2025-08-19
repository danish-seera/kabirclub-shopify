'use client';

import Logo from '@/components/layout/Logo';
import { useEffect, useRef } from 'react';

const HomeVideo = () => {
  const videoRefMobile = useRef<HTMLVideoElement>(null);
  const videoRefDesktop = useRef<HTMLVideoElement>(null);
  
  // Play videos when component mounts
  useEffect(() => {
    if (videoRefMobile.current) {
      videoRefMobile.current.play().catch(error => {
        console.error("Mobile video autoplay failed:", error);
      });
    }
    
    if (videoRefDesktop.current) {
      videoRefDesktop.current.play().catch(error => {
        console.error("Desktop video autoplay failed:", error);
      });
    }
  }, []);

  return (
    <div className="relative h-[570px] w-full overflow-hidden sm:h-screen">
      <h2 className="sr-only">Home Video</h2>
      
      {/* Desktop Video */}
      <div className="absolute hidden h-full w-full sm:block">
        <video
          ref={videoRefDesktop}
          className="h-full w-full object-cover"
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/videos/clothing-2.mp4" type="video/mp4" />
          Your browser does not support video tag
        </video>
      </div>
      
      {/* Mobile Video */}
      <div className="absolute block h-full w-full sm:hidden">
        <video
          ref={videoRefMobile}
          className="h-full w-full object-cover"
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/videos/clothing-1.mp4" type="video/mp4" />
          Your browser does not support video tag
        </video>
      </div>
      
      {/* Content Box with Text - Compact version with subtitle */}
      <div className="absolute left-[50%] top-[50%] w-[70%] max-w-[400px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg text-center">
        {/* Very transparent background */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
        
        {/* Subtle border */}
        <div className="absolute inset-0 rounded-lg border border-[#daa520]/30"></div>
        
        {/* Content with text in the middle - Compact spacing */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-1 py-4 px-4 md:py-5 md:px-6">
          {/* Top decorative line */}
          <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-[#daa520]/50 to-transparent"></div>
          
          {/* Main text */}
          <h3 className="font-lora text-[clamp(20px,12px_+_2vw,28px)] font-bold leading-tight text-[#daa520] drop-shadow-md">
            The Man Company
          </h3>
          
          {/* Subtitle - smaller and closer to main heading */}
          <p className="text-[clamp(12px,8px_+_1vw,16px)] font-medium text-white/90 drop-shadow-md">
            Elevate Your Style
          </p>
          
          {/* Bottom decorative line */}
          <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-[#daa520]/50 to-transparent"></div>
        </div>
      </div>
      
      <Logo size="lg" className="absolute bottom-4 right-4 md:bottom-8 md:right-8" />
    </div>
  );
};

export default HomeVideo;
