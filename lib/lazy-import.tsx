"use client"

import React, { Suspense } from "react"

interface LoadingProps {
  className?: string
}

export function LazyLoading({ className = "" }: LoadingProps) {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
  )
}

export function lazyImport<T extends React.ComponentType<any>, I extends { [K in N]: T }, N extends string>(
  factory: () => Promise<I>,
  name: N,
  LoadingComponent: React.ComponentType<any> = LazyLoading,
) {
  const LazyComponent = React.lazy(async () => {
    const module = await factory()
    return { default: module[name] }
  })

  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={<LoadingComponent />}>
      <LazyComponent {...props} />
    </Suspense>
  )
}
