"use client"

import { useState, useEffect } from "react"
import Image, { type ImageProps } from "next/image"
import { useInView } from "react-intersection-observer"

type OptimizedImageProps = ImageProps & {
  threshold?: number
}

export function OptimizedImage({ threshold = 0.1, ...props }: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const { ref, inView } = useInView({
    threshold,
    triggerOnce: true,
  })

  useEffect(() => {
    if (inView && !isLoaded) {
      setIsLoaded(true)
    }
  }, [inView, isLoaded])

  return (
    <div ref={ref} className={props.className ? props.className : "relative"} style={props.style}>
      {isLoaded ? (
        <Image
          {...props}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFdgJCIiZU4AAAAABJRU5ErkJggg=="
          onLoad={() => setIsLoaded(true)}
        />
      ) : (
        <div
          className="bg-gray-200 animate-pulse"
          style={{
            width: "100%",
            height: "100%",
            position: props.fill ? "absolute" : "relative",
          }}
        />
      )}
    </div>
  )
}
