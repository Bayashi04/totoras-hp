"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // クライアントサイドでの認証チェック
    const checkAuth = () => {
      const isAuth = localStorage.getItem("admin_authenticated") === "true"
      setIsAuthenticated(isAuth)
      setIsLoading(false)

      if (!isAuth) {
        router.push("/admin/login")
      }
    }

    checkAuth()
  }, [router])

  // ローディング中はコンテンツを表示しない
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4ecdc4]"></div>
      </div>
    )
  }

  // 認証されていない場合は何も表示しない（リダイレクト中）
  if (!isAuthenticated) {
    return null
  }

  // 認証されている場合は子コンポーネントを表示
  return <>{children}</>
}
