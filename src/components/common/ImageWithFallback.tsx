'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function ImageWithFallback({ src, fallbackSrc, alt, ...props }) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
      placeholder="blur"
      blurDataURL={fallbackSrc}
    />
  );
} 