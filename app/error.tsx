"use client"

import { useEffect } from "react"
import Link from "next/link"
import { RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container px-4 mx-auto py-16 md:py-24 flex flex-col items-center justify-center text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-4">エラーが発生しました</h2>
      <p className="text-gray-600 max-w-md mb-8">申し訳ありませんが、ページの読み込み中にエラーが発生しました。</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={reset} className="flex items-center gap-2">
          <RefreshCcw className="h-4 w-4" />
          再試行する
        </Button>
        <Link href="/">
          <Button variant="outline">トップページに戻る</Button>
        </Link>
      </div>
    </div>
  )
}
