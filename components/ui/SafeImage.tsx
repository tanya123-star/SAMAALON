"use client"

import { useState } from "react"

type Props = {
  src: string
  alt: string
  className?: string
  fallbackSrc?: string
}

const FALLBACK =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"

export function SafeImage({
  src,
  alt,
  className,
  fallbackSrc = FALLBACK,
}: Props) {
  const [failed, setFailed] = useState(false)
  const [imgSrc, setImgSrc] = useState(src)

  if (failed) {
    return (
      <div
        className={`text-muted-foreground flex items-center justify-center bg-slate-100 text-xs ${className ?? ""}`}
      >
        Image unavailable
      </div>
    )
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc)
        } else {
          setFailed(true)
        }
      }}
    />
  )
}
