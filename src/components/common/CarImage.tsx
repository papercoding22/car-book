import { useState } from 'react'

type CarImageProps = {
  src?: string
  alt: string
  className?: string
  fallbackText?: string
}

export function CarImage({ src, alt, className, fallbackText = 'Chưa có ảnh xe' }: CarImageProps) {
  const [hasError, setHasError] = useState(false)

  if (!src || hasError) {
    return (
      <div
        className={[
          'flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-xs text-slate-300',
          className,
        ].join(' ')}
      >
        {fallbackText}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={className}
      onError={() => setHasError(true)}
    />
  )
}
