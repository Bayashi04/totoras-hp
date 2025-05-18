"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Calendar, Facebook, Twitter, Instagram, ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog"
import { getCategoryColorClasses } from "@/lib/category-colors"
import { getCategoryIcon } from "@/lib/category-icons"

// 必要なインポートを追加
import { AnalyticsTracker } from "@/components/analytics-tracker"

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

// サンプルレポートデータ
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
    published: true,
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
  // cooking-classのレポートを追加
  {
    id: "cooking-class",
    title: "クッキング教室イベント大成功！",
    date: "2025-03-15",
    eventId: "cooking-class-event",
    eventTitle: "プロに学ぶクッキング教室",
    excerpt: "プロのシェフを招いて行われたクッキング教室。参加者全員が美味しい料理を作ることができました。",
    content: `# プロに学ぶクッキング教室 開催レポート

渋谷のレンタルキッチンにて、プロのシェフを招いたクッキング教室を開催しました。今回は「簡単イタリアン」をテーマに、パスタとピザの作り方を学びました。

## イベント概要

日時：2025年3月15日（土）13:00〜16:00
場所：渋谷レンタルキッチンスペース
参加者：20名

## イベントの様子

参加者は5つのグループに分かれ、それぞれ異なるパスタソースとピザトッピングに挑戦しました。シェフからの丁寧な指導もあり、初心者の方も素晴らしい料理を完成させることができました。

## 作った料理

1. トマトとバジルのシンプルパスタ
2. クリームソースのキノコパスタ
3. マルゲリータピザ
4. 季節の野菜たっぷりピザ

## 参加者の声

「自分で作ったパスタがこんなに美味しいとは思いませんでした！」
「家でも作れそうなレシピで嬉しいです」
「グループでの料理は思った以上に楽しかったです」

## 次回のイベント予告

好評につき、次回は「和食の基本」をテーマにしたクッキング教室を企画中です。詳細は後日発表しますので、お楽しみに！`,
    coverImage: "/placeholder-x5sne.png",
    images: ["/placeholder-x5sne.png", "/placeholder-i7cfn.png"],
    published: true,
    lastUpdated: 1710500000000,
    category: "料理",
    tags: ["料理", "イタリアン", "ワークショップ", "グループ活動"],
  },
]

export default function ReportDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const reportId = params.id
  const [report, setReport] = useState<EventReport | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // ページ読み込み時に画面上部にスクロール
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // レポートデータを読み込む
  useEffect(() => {
    const loadReport = () => {
      // ローカルストレージから読み込み
      const savedReports = localStorage.getItem("eventReports")
      if (savedReports) {
        try {
          const parsedReports = JSON.parse(savedReports) as EventReport[]
          const foundReport = parsedReports.find((r) => r.id === reportId && r.published)

          if (foundReport) {
            setReport(foundReport)
            return
          }
        } catch (e) {
          console.error("レポートデータの読み込みに失敗しました", e)
        }
      }

      // サンプルデータから検索
      const sampleReport = sampleReports.find((r) => r.id === reportId && r.published)
      if (sampleReport) {
        setReport(sampleReport)
      } else {
        // 公開されていないか存在しないレポートの場合は404
        notFound()
      }
    }

    loadReport()
  }, [reportId])

  // 日付をフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // レポートが読み込まれていない場合はローディング表示
  if (!report) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="container px-4 mx-auto py-12 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4ecdc4]"></div>
        </div>
        <Footer />
      </main>
    )
  }

  // カテゴリーの色を取得
  const categoryColors = getCategoryColorClasses(report.category)
  const CategoryIcon = getCategoryIcon(report.category)
  const categoryColor = categoryColors.text.includes("[#")
    ? categoryColors.text.replace("text-[", "").replace("]", "")
    : "#4ecdc4"

  // コンポーネントの return 文の先頭に以下を追加
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <AnalyticsTracker type="report" id={params.id} />
        {/* 既存のコード */}

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

            {/* カテゴリとタグを表示する部分を追加 */}
            <div className="flex flex-wrap items-center gap-3 text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(report.date)}</span>
              </div>
              <Badge variant="outline">{report.eventTitle}</Badge>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-6">{report.title}</h1>

            <div className="prose max-w-none mb-12">
              <div dangerouslySetInnerHTML={{ __html: report.content.replace(/\n/g, "<br>") }} />
            </div>

            {/* タグを表示 */}
            {report.tags && report.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">タグ</h3>
                <div className="flex flex-wrap gap-2">
                  {report.tags.map((tag) => (
                    <Link href={`/reports?tag=${tag}`} key={tag}>
                      <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                        #{tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {report.images.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">イベント写真</h2>
                <div
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4"
                  role="list"
                  aria-label="イベント写真ギャラリー"
                >
                  {report.images.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square relative rounded-md overflow-hidden cursor-pointer"
                      onClick={() => setSelectedImage(image)}
                      role="listitem"
                      aria-label={`イベント写真 ${index + 1}`}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          setSelectedImage(image)
                        }
                      }}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`イベント写真 ${index + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-12 pt-6 border-t">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                <h3 className="font-bold">このレポートをシェア</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Instagram className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </article>
        </div>

        {/* 画像拡大表示ダイアログ */}
        <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)} aria-label="拡大画像">
          <DialogContent className="sm:max-w-4xl max-h-[90vh] p-0 overflow-hidden w-[95vw] sm:w-auto">
            <div className="relative h-[80vh]">
              {selectedImage && (
                <Image
                  src={selectedImage || "/placeholder.svg"}
                  alt="拡大画像"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1536px) 100vw, 1536px"
                  priority
                />
              )}
            </div>
            <DialogFooter className="p-4">
              <Button onClick={() => setSelectedImage(null)}>閉じる</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Footer />
    </main>
  )
}
