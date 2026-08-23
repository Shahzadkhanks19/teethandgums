"use client";

import Image from "next/image";
import { useState } from "react";

type BlogImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

const fallbackImage = "/images/logo/logo.webp";

export default function BlogImage({
  src,
  alt,
  fill = false,
  width,
  height,
  sizes,
  priority = false,
  className,
}: BlogImageProps) {
  const [imageSrc, setImageSrc] = useState(src || fallbackImage);

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => setImageSrc(fallbackImage)}
    />
  );
}
