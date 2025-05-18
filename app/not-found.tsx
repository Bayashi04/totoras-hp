"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useEffect } from "react"

export default function NotFound() {
  // ページ読み込み時に画面上部にスクロール
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center py-20">
        <div className="container px-4 mx-auto text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">404</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">ページが見つかりません</h2>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            お探しのページは存在しないか、移動または削除された可能性があります。
          </p>
          <Link href="/" passHref>
            <Button size="lg" className="bg-[#4ecdc4] hover:bg-[#3dbdb5]">
              トップページへ戻る
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
