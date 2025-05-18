"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Calendar, ChevronLeft, Edit, Trash2, Plus, Search, FileText, ImageIcon } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { getCategoryColorClasses } from "@/lib/category-colors"
import { getCategoryIcon } from "@/lib/category-icons"
import { toast } from "@/components/ui/use-toast"

// イベントリポートの型定義
interface EventReport {
  id: string
  title: string
  date: string
  eventId: string
  eventTitle: string
  excerpt: string
  content: string
  coverImage: string
  images: string[]
  published: boolean
  lastUpdated: number
  category: string // カテゴリを追加
  tags: string[] // タグを追加
}

// サンプルデータ
const sampleReports: EventReport[] = [
  {
    id: "report-1",
    title: "春の花見イベントレポート",
    date: "2025-04-10",
    eventId: "hanami-event",
    eventTitle: "春の花見パーティー",
    excerpt: "桜満開の中、50名以上の参加者と共に素敵な時間を過ごしました。写真と共にイベントの様子をお届けします。",
    content: `# 春の花見パーティー 開催レポート

桜満開の季節、代々木公園にて春の花見パーティーを開催しました。当日は天候にも恵まれ、50名以上の参加者にお集まりいただきました。

## イベントの様子

参加者の皆さんは思い思いのスタイルで花見を楽しまれていました。用意したゲームやアクティビティも大盛況で、初対面の方々同士も自然と会話が弾んでいました。

## 参加者の声

「初めて参加しましたが、とても楽しかったです！」
「桜の下でのピクニックは最高でした」
「新しい友達ができて嬉しいです」

## 次回のイベント予告

次回は夏のBBQパーティーを予定しています。詳細は後日発表しますので、お楽しみに！`,
    coverImage: "/placeholder-e0lj7.png",
    images: ["/placeholder-e0lj7.png", "/placeholder-x5sne.png", "/placeholder-i7cfn.png"],
    published: true,
    lastUpdated: 1714500000000,
    category: "サウナ",
    tags: ["花見", "春", "アウトドア", "交流会"],
  },
  {
    id: "report-2",
    title: "クッキング教室イベント大成功！",
    date: "2025-03-15",
    eventId: "cooking-class",
    eventTitle: "プロに学ぶクッキング教室",
    excerpt: "プロのシェフを招いて行われたクッキング教室。参加者全員が美味しい料理を作ることができました。",
    content: `# プロに学ぶクッキング教室 開催レポート

渋谷のレンタルキッチンにて、プロのシェフを招いたクッキング教室を開催しました。今回は「簡単イタリアン」をテーマに、パスタとピザの作り方を学びました。

## イベントの様子

参加者は5つのグループに分かれ、それぞれ異なるパスタソースとピザトッピングに挑戦しました。シェフからの丁寧な指導もあり、初心者の方も素晴らしい料理を完成させることができました。

## 参加者の声

「自分で作ったパスタがこんなに美味しいとは思いませんでした！」
「家でも作れそうなレシピで嬉しいです」
「グループでの料理は思った以上に楽しかったです」

## 次回のイベント予告

好評につき、次回は「和食の基本」をテーマにしたクッキング教室を企画中です。`,
    coverImage: "/placeholder-x5sne.png",
    images: ["/placeholder-x5sne.png", "/placeholder-i7cfn.png"],
    published: true,
    lastUpdated: 1710500000000,
    category: "フットサル",
    tags: ["料理", "イタリアン", "ワークショップ", "グループ活動"],
  },
  {
    id: "report-3",
    title: "ボードゲーム大会レポート",
    date: "2025-02-20",
    eventId: "board-game",
    eventTitle: "ボードゲーム大会",
    excerpt: "初心者から上級者まで30名が参加したボードゲーム大会の様子をお届けします。",
    content: `# ボードゲーム大会 開催レポート

渋谷のカフェスペースにて、ボードゲーム大会を開催しました。初心者から上級者まで30名の参加者が集まり、様々なゲームを楽しみました。

## イベントの様子

会場には10種類以上のボードゲームを用意し、参加者は自由に選んでプレイしました。スタッフによるルール説明もあり、初めてのゲームにも気軽に挑戦できる雰囲気でした。

## 人気だったゲーム

1. カタン
2. ドミニオン
3. コードネーム
4. ラブレター

## 参加者の声

「初めてのボードゲームでしたが、すぐに楽しめました」
「普段出会わない人たちと一緒にゲームができて楽しかったです」

## 次回のイベント予告

次回は「ボードゲーム交流会」として、より交流を重視したイベントを企画しています。`,
    coverImage: "/board-game-event.png",
    images: ["/board-game-event.png"],
    published: false,
    lastUpdated: 1708500000000,
    category: "その他",
    tags: ["ボードゲーム", "室内", "交流会", "ゲーム"],
  },
  // spring-hanamiのレポートを追加
  {
    id: "spring-hanami",
    title: "春の花見イベント2025",
    date: "2025-04-05",
    eventId: "spring-hanami-event",
    eventTitle: "春の花見2025",
    excerpt: "東京の桜の名所で開催された花見イベントのレポートです。美しい桜の下で素敵な時間を過ごしました。",
    content: `# 春の花見イベント2025 レポート

今年も桜の季節がやってきました。東京の代表的な桜の名所、上野公園で花見イベントを開催しました。

## イベント概要

日時：2025年4月5日（土）12:00〜16:00
場所：上野公園
参加者：約40名

## イベントの様子

今年は例年より少し早く桜が満開となり、絶好の花見日和となりました。参加者の皆さんは思い思いに桜を楽しみ、新しい出会いや会話を楽しんでいました。

## アクティビティ

- 桜にちなんだクイズ大会
- お花見ビンゴ
- 写真コンテスト

## 参加者の声

「初めて参加しましたが、とても楽しかったです！」
「桜の下でのピクニックは最高でした」
「来年もぜひ参加したいです」

## 次回のイベント予告

夏には浴衣イベントを予定しています。詳細は後日発表しますので、お楽しみに！`,
    coverImage: "/placeholder-e0lj7.png",
    images: ["/placeholder-e0lj7.png", "/placeholder-x5sne.png"],
    published: true,
    lastUpdated: 1712300000000,
    category: "アウトドア",
    tags: ["花見", "春", "アウトドア", "交流会", "桜"],
  },
]

export default function EventReportsPage() {
  const [reports, setReports] = useState<EventReport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [reportToDelete, setReportToDelete] = useState<string | null>(null)

  // ページ読み込み時に画面上部にスクロール
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // APIからレポートデータを取得
  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/reports")
        if (!response.ok) {
          throw new Error("レポートの取得に失敗しました")
        }

        const data = await response.json()

        // APIレスポンスをフォーマット
        const formattedReports = data.map((report: any) => {
          const metadata = report.metadata || {}
          return {
            id: report.id,
            title: report.title,
            date: new Date(report.createdAt).toISOString().split("T")[0],
            excerpt: report.excerpt,
            content: report.content,
            coverImage: report.coverImage || "/placeholder.svg",
            published: report.published,
            category: report.category,
            lastUpdated: new Date(report.updatedAt).getTime(),
            eventId: metadata.eventId || "",
            eventTitle: metadata.eventTitle || "",
            images: metadata.images || [],
            tags: metadata.tags || [],
            authorName: metadata.authorName || "",
            scheduledPublishDate: report.publishDate ? new Date(report.publishDate).toISOString() : undefined,
            featuredReport: metadata.featuredReport || false,
          }
        })

        setReports(formattedReports)
      } catch (err) {
        console.error("レポート取得エラー:", err)
        setError("レポートの取得に失敗しました")

        // エラー時にはサンプルデータを使用
        setReports(sampleReports)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReports()
  }, [])

  // レポート削除処理
  const deleteReport = (id: string) => {
    const updatedReports = reports.filter((report) => report.id !== id)
    setReports(updatedReports)
    localStorage.setItem("eventReports", JSON.stringify(updatedReports))
    setReportToDelete(null)
  }

  // 削除ハンドラーを修正
  const handleDeleteReport = async (id: string) => {
    if (confirm("このレポートを削除してもよろしいですか？")) {
      try {
        const response = await fetch(`/api/reports/${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("レポートの削除に失敗しました")
        }

        // 成功したら一覧から削除
        setReports(reports.filter((report) => report.id !== id))

        toast({
          title: "レポートを削除しました",
          duration: 3000,
        })
      } catch (error) {
        console.error("レポート削除エラー:", error)
        toast({
          title: "エラーが発生しました",
          description: "レポートの削除に失敗しました",
          variant: "destructive",
          duration: 3000,
        })
      }
    }
  }

  // 検索フィルタリング
  const filteredReports = reports.filter(
    (report) =>
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // 日付をフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // ローディング状態の表示
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">レポート管理</h1>
        <div className="flex justify-center items-center h-[60vh]">
          <div className="flex flex-col items-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
            <p className="mt-4 text-gray-600">レポートデータを読み込み中...</p>
          </div>
        </div>
      </div>
    )
  }

  // エラー状態の表示
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">レポート管理</h1>
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-700">{error}</p>
          <p className="text-sm text-red-600 mt-2">サンプルデータを表示しています</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="bg-gray-50 py-8 md:py-12 border-b">
        <div className="container px-4 mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">イベントレポート管理</h1>
          <p className="text-gray-600 max-w-2xl">
            過去のイベントのレポートを作成・管理します。イベントの様子や参加者の声を記録しましょう。
          </p>
        </div>
      </div>

      <div className="container px-4 mx-auto py-8 md:py-12">
        <div className="flex flex-wrap gap-4 mb-6">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            ダッシュボードに戻る
          </Link>
          <Link
            href="/admin/events"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            イベント管理に戻る
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="レポートを検索..."
                className="pl-10 max-w-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Link href="/admin/reports/edit/new">
            <Button className="bg-[#4ecdc4] hover:bg-[#4ecdc4]/90 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              新規レポート作成
            </Button>
          </Link>
        </div>

        {filteredReports.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FileText className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-bold mb-2">レポートが見つかりませんでした</h3>
            <p className="text-gray-600 mb-6">検索条件を変更するか、新しいレポートを作成してください。</p>
            <Link href="/admin/reports/edit/new">
              <Button className="bg-[#4ecdc4] hover:bg-[#4ecdc4]/90">新規レポート作成</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => {
              // カテゴリーの色を取得
              const categoryColors = getCategoryColorClasses(report.category)
              const CategoryIcon = getCategoryIcon(report.category)
              const categoryColor = categoryColors.text.includes("[#")
                ? categoryColors.text.replace("text-[", "").replace("]", "")
                : "#4ecdc4"

              return (
                <Card
                  key={report.id}
                  className="overflow-hidden h-full flex flex-col border-t-4"
                  style={{ borderTopColor: categoryColor }}
                >
                  <div className="relative h-48">
                    <Image
                      src={report.coverImage || "/placeholder.svg"}
                      alt={report.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black opacity-20" />
                    {!report.published && (
                      <Badge className="absolute top-3 left-3" variant="outline">
                        下書き
                      </Badge>
                    )}
                    <Badge
                      className="absolute top-3 right-3 flex items-center gap-1"
                      variant={report.images.length > 0 ? "secondary" : "outline"}
                    >
                      <ImageIcon className="h-3 w-3" />
                      {report.images.length}枚の写真
                    </Badge>

                    {/* カテゴリーバッジをアイコン付きで表示 */}
                    {report.published && (
                      <Badge
                        className={`absolute top-3 left-3 flex items-center gap-1 ${categoryColors.bg} ${categoryColors.text}`}
                      >
                        <CategoryIcon className="h-3.5 w-3.5" />
                        <span>{report.category}</span>
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-5 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold mb-3">{report.title}</h3>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(report.date)}</span>
                    </div>
                    <p className="text-gray-800 mb-4">{report.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <Link href={`/admin/reports/edit/${report.id}`}>
                        <Button className="bg-[#4ecdc4] hover:bg-[#4ecdc4]/90 flex items-center gap-2">
                          <Edit className="h-4 w-4" />
                          編集
                        </Button>
                      </Link>
                      <AlertDialog open={reportToDelete === report.id}>
                        <AlertDialogTrigger asChild>
                          <Button className="bg-red-500 hover:bg-red-600 flex items-center gap-2">
                            <Trash2 className="h-4 w-4" />
                            削除
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>レポートを削除しますか？</AlertDialogTitle>
                            <AlertDialogDescription>
                              このレポートを削除すると復元できません。本当に削除しますか？
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>キャンセル</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteReport(report.id)}>
                              削除する
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
