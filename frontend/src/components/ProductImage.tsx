import Image from 'next/image';
import { useState } from 'react';

interface ProductImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}

export function ProductImage({
  src,
  alt,
  width = 400,
  height = 400,
  priority = false,
  className = '',
}: ProductImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Ensure the src starts with / for local images
  const imageSrc = src.startsWith('http') ? src : src.startsWith('/') ? src : `/${src}`;

  return (
    <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        quality={75}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onLoadingComplete={() => setIsLoading(false)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
      )}
    </div>
  );
}
