"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Calendar, Instagram, ArrowLeft, Loader2, AlertCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getCategoryColorClasses } from "@/lib/category-colors"
import { getCategoryIcon } from "@/lib/category-icons"

// 必要なインポートを追加
import { AnalyticsTracker } from "@/components/analytics-tracker"

// イベントリポートの型定義
interface EventReport {
  id: string
  title: string
  date?: string
  publishDate?: string
  eventId?: string
  eventTitle?: string
  excerpt: string
  content: string
  coverImage?: string
  images?: string[]
  published: boolean
  lastUpdated?: number
  category: string
  tags?: string[]
  updatedAt?: string
  createdAt?: string
}

export default function ReportDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const reportId = params.id
  const [report, setReport] = useState<EventReport | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ページ読み込み時に画面上部にスクロール
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // レポートデータをAPIから読み込む
  useEffect(() => {
    const loadReport = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // APIからレポートを取得
        const response = await fetch(`/api/reports/${reportId}`)

        if (!response.ok) {
          if (response.status === 404) {
            return notFound()
          }
          throw new Error("レポートデータの取得に失敗しました")
        }

        const data = await response.json()

        // 公開されていないレポートの場合は404
        if (!data.published) {
          return notFound()
        }

        setReport(data)
      } catch (error) {
        console.error("レポート取得エラー:", error)
        setError("レポートの読み込みに失敗しました")

        // フォールバックとしてローカルストレージから試す
        try {
          const savedReports = localStorage.getItem("eventReports")
          if (savedReports) {
            const parsedReports = JSON.parse(savedReports) as EventReport[]
            const foundReport = parsedReports.find((r) => r.id === reportId && r.published)

            if (foundReport) {
              setReport(foundReport)
              setError(null) // エラーをクリア
            }
          }
        } catch (e) {
          console.error("ローカルストレージからの読み込みに失敗しました", e)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadReport()
  }, [reportId])

  // 日付をフォーマット
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-"

    const date = new Date(dateString)
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // レポートが読み込まれていない場合はローディング表示
  if (isLoading) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="container px-4 mx-auto py-12 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#4ecdc4]" />
        </div>
        <Footer />
      </main>
    )
  }

  // エラーの場合はエラー表示
  if (error && !report) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="container px-4 mx-auto py-12">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>エラー</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="flex justify-center mt-6">
            <Button onClick={() => router.push("/reports")}>レポート一覧に戻る</Button>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  // レポートが存在しない場合は notFound() を呼び出したのでここには到達しないはず

  // レポートが取得できた場合
  if (!report) {
    return notFound()
  }

  // カテゴリーの色を取得
  const categoryColors = getCategoryColorClasses(report.category)
  const CategoryIcon = getCategoryIcon(report.category)
  const categoryColor = categoryColors.text.includes("[#")
    ? categoryColors.text.replace("text-[", "").replace("]", "")
    : "#4ecdc4"

  // コンポーネントの return 文
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <AnalyticsTracker type="report" id={params.id} />

        <div className="container px-4 mx-auto py-8 md:py-12">
          <Link
            href="/reports"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-1" />
            すべてのレポートに戻る
          </Link>

          <article className="max-w-4xl mx-auto">
            <div
              className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-6"
              style={{ borderLeft: `6px solid ${categoryColor}` }}
            >
              <Image
                src={report.coverImage || "/placeholder.svg"}
                alt={report.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 800px"
              />
              <div className="absolute inset-0 bg-black opacity-20" />

              {/* カテゴリーバッジをアイコン付きで表示 */}
              <Badge
                className={`absolute top-4 left-4 flex items-center gap-1 px-2 py-1 ${categoryColors.bg} ${categoryColors.text}`}
              >
                <CategoryIcon className="h-4 w-4 mr-0.5" />
                <span>{report.category}</span>
              </Badge>
            </div>

            {/* カテゴリとタグを表示する部分 */}
            <div className="flex flex-wrap items-center gap-3 text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(report.publishDate || report.date || report.updatedAt || report.createdAt)}</span>
              </div>
            </div>

            {/* レポートの内容を表示 */}
            <div className="prose prose-lg max-w-4xl mx-auto">
              <h1>{report.title}</h1>
              <p>{report.excerpt}</p>
              <div dangerouslySetInnerHTML={{ __html: report.content }} />
            </div>

            {/* 画像ギャラリー */}
            {report.images && report.images.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                {report.images.map((image, index) => (
                  <div key={index} className="relative h-64 rounded-lg overflow-hidden">
                    <Image src={image || "/placeholder.svg"} alt={`Image ${index}`} fill className="object-cover" />
                    <button
                      className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow"
                      onClick={() => setSelectedImage(image)}
                    >
                      <Instagram className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* ダイアログで選択した画像を表示 */}
            {selectedImage && (
              <Dialog open={true}>
                <DialogContent className="max-w-5xl">
                  <Image
                    src={selectedImage || "/placeholder.svg"}
                    alt="Selected Image"
                    width={800}
                    height={600}
                    className="object-contain"
                  />
                </DialogContent>
                <DialogFooter>
                  <Button onClick={() => setSelectedImage(null)}>閉じる</Button>
                </DialogFooter>
              </Dialog>
            )}
          </article>
        </div>
      </div>
      <Footer />
    </main>
  )
}
