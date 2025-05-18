"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BlogPost } from "@/components/blog-post"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter } from "lucide-react"
import { getCategoryColor } from "@/lib/category-colors"

// イベントレポートの型定義
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
  category: string
  tags: string[]
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
    content: "...",
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
    content: "...",
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
    content: "...",
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
    content: "...",
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
    content: "...",
    coverImage: "/placeholder-x5sne.png",
    images: ["/placeholder-x5sne.png", "/placeholder-i7cfn.png"],
    published: true,
    lastUpdated: 1710500000000,
    category: "料理",
    tags: ["料理", "イタリアン", "ワークショップ", "グループ活動"],
  },
]

// カテゴリーに応じた色を取得する関数
const getCategoryColorByName = (category: string): string => {
  switch (category) {
    case "サウナ":
      return "#ff6b6b" // レッド
    case "フットサル":
      return "#4ecdc4" // ティール
    case "その他":
      return "#ffd93d" // イエロー
    default:
      // その他のカテゴリーの場合はlib/category-colorsから取得
      return getCategoryColor(category)
  }
}

export default function ReportsPage() {
  const [reports, setReports] = useState<EventReport[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // ページ読み込み時に画面上部にスクロール
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // レポートデータを読み込む
  useEffect(() => {
    const loadReports = () => {
      // ローカルストレージから読み込み
      const savedReports = localStorage.getItem("eventReports")
      let loadedReports: EventReport[] = []

      if (savedReports) {
        try {
          const parsedReports = JSON.parse(savedReports) as EventReport[]
          loadedReports = parsedReports.filter((r) => r.published)
        } catch (e) {
          console.error("レポートデータの読み込みに失敗しました", e)
        }
      }

      // サンプルデータを追加（重複を避ける）
      const allReportIds = new Set(loadedReports.map((r) => r.id))
      const filteredSampleReports = sampleReports.filter((r) => r.published && !allReportIds.has(r.id))

      const combinedReports = [...loadedReports, ...filteredSampleReports]

      // 日付の新しい順にソート
      combinedReports.sort((a, b) => {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        return dateB - dateA
      })

      setReports(combinedReports)

      // すべてのタグを収集
      const tags = new Set<string>()
      combinedReports.forEach((report) => {
        report.tags?.forEach((tag) => tags.add(tag))
      })
      setAllTags(Array.from(tags))

      setLoading(false)
    }

    loadReports()
  }, [])

  // 検索とフィルタリングされたレポート
  const filteredReports = reports.filter((report) => {
    // 検索語句でフィルタリング
    const matchesSearch =
      searchTerm === "" ||
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.category.toLowerCase().includes(searchTerm.toLowerCase())

    // タグでフィルタリング
    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => report.tags?.includes(tag))

    return matchesSearch && matchesTags
  })

  // タグの選択/解除を切り替える
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="container px-4 mx-auto py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">イベントレポート</h1>
          <p className="text-gray-600 text-center mb-10">
            過去のイベントの様子をご紹介します。TOTORASのイベントがどんな雰囲気か知りたい方はぜひチェックしてください！
          </p>

          {/* 検索とフィルター */}
          <div className="mb-8">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="レポートを検索..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {allTags.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Filter size={16} className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">タグでフィルター:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className={`cursor-pointer ${
                        selectedTags.includes(tag) ? "bg-[#4ecdc4] hover:bg-[#3dbdb5]" : "hover:bg-gray-100"
                      }`}
                      onClick={() => toggleTag(tag)}
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4ecdc4]"></div>
            </div>
          ) : filteredReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredReports.map((report) => (
                <BlogPost
                  key={report.id}
                  title={report.title}
                  date={new Date(report.date).toLocaleDateString("ja-JP", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  excerpt={report.excerpt}
                  image={report.coverImage}
                  color={getCategoryColorByName(report.category)} // カテゴリーに応じた色を設定
                  id={report.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">該当するレポートが見つかりませんでした。</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
