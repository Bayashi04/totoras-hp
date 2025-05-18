"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Save, Eye, Calendar, Trash2, FileDown, X, Clock, Share2, Check } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ImageUpload } from "@/components/image-upload"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CategorySelector } from "@/components/category-selector"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

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
  category: string
  tags: string[]
  scheduledPublishDate?: string // 予約投稿日時を追加
  authorName?: string // 著者名を追加
  seoDescription?: string // SEO用の説明を追加
  seoKeywords?: string[] // SEO用のキーワードを追加
  allowComments?: boolean // コメント許可設定を追加
  featuredReport?: boolean // 注目レポート設定を追加
  relatedReportIds?: string[] // 関連レポートIDを追加
}

// イベントデータの型定義
interface EventData {
  id: string
  title: string
  date: string
  time: string
  location: string
  image: string
  description: string
  cautions: string
  price: string
  capacity: string
  category: string
  items: string[]
  color: string
}

// サンプルイベントデータ
const eventsData: EventData[] = [
  {
    id: "summer-bbq",
    title: "夏のBBQパーティー",
    date: "2025-07-20",
    time: "12:00 - 16:00",
    location: "東京・代々木公園",
    image: "/placeholder-eduy5.png",
    description:
      "夏の暑い日に、代々木公園で楽しいBBQパーティーを開催します！美味しい食べ物、ドリンク、そして新しい友達との出会いが待っています。初めての方も大歓迎！スタッフが丁寧にサポートするので、お一人での参加も安心です。",
    cautions:
      "雨天の場合は中止となります。中止の場合は前日までにご連絡いたします。\n飲酒される方は公共交通機関をご利用ください。",
    price: "4,500円（食材・ドリンク込み）",
    capacity: "50名",
    category: "サウナ",
    items: ["動きやすい服装", "日焼け止め", "タオル", "雨天時は雨具"],
    color: "#ff6b6b",
  },
  {
    id: "board-game",
    title: "ボードゲーム大会",
    date: "2025-08-05",
    time: "18:30 - 21:30",
    location: "渋谷・カフェスペース",
    image: "/board-game-event.png",
    description:
      "様々なボードゲームを楽しむイベントです。初心者から上級者まで、誰でも参加できます。スタッフがルール説明をするので、ボードゲーム未経験の方も安心してご参加いただけます。",
    cautions: "会場内は飲食可能ですが、アルコールの持ち込みはご遠慮ください。\n貴重品の管理は各自でお願いいたします。",
    price: "3,000円（1ドリンク・軽食付き）",
    capacity: "30名",
    category: "フットサル",
    items: [],
    color: "#4ecdc4",
  },
  {
    id: "halloween-party",
    title: "ハロウィンパーティー",
    date: "2025-10-31",
    time: "19:00 - 23:00",
    location: "六本木・イベントホール",
    image: "/halloween-party.png",
    description:
      "今年のハロウィンは、TOTORASの特別パーティーで盛り上がりましょう！仮装コンテストやゲーム、DJによる音楽など、様々なエンターテイメントをご用意しています。",
    cautions:
      "20歳未満の方は参加できません。当日は身分証明書をご持参ください。\n仮装は任意ですが、仮装コンテストに参加される方は事前にエントリーが必要です。",
    price: "5,500円（2ドリンク・軽食付き）",
    capacity: "100名",
    category: "その他",
    items: ["仮装衣装", "身分証明書（20歳以上）"],
    color: "#ffd93d",
  },
  {
    id: "hanami-event",
    title: "春の花見パーティー",
    date: "2025-04-05",
    time: "11:00 - 15:00",
    location: "東京・代々木公園",
    image: "/placeholder-e0lj7.png",
    description: "桜の季節に代々木公園で花見パーティーを開催します。お花見弁当と飲み物を用意してお待ちしています。",
    cautions: "雨天中止。飲酒される方は公共交通機関をご利用ください。",
    price: "3,500円（食事・ドリンク込み）",
    capacity: "60名",
    category: "その他",
    items: ["レジャーシート", "防寒具"],
    color: "#ff6b6b",
  },
  {
    id: "cooking-class",
    title: "プロに学ぶクッキング教室",
    date: "2025-03-15",
    time: "14:00 - 17:00",
    location: "渋谷・レンタルキッチン",
    image: "/placeholder-x5sne.png",
    description: "プロのシェフを招いて、本格的なイタリア料理を学びます。作った料理はその場で試食できます。",
    cautions: "エプロンをご持参ください。食物アレルギーがある方は事前にお知らせください。",
    price: "5,000円（材料費込み）",
    capacity: "20名",
    category: "ワークショップ",
    items: ["エプロン", "タッパー（持ち帰り用）"],
    color: "#4ecdc4",
  },
]

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
    authorName: "山田太郎",
    seoDescription:
      "TOTORASの春の花見パーティーのレポートです。桜満開の中、50名以上の参加者と共に素敵な時間を過ごしました。",
    seoKeywords: ["花見", "春", "イベント", "TOTORAS", "交流会"],
    allowComments: true,
    featuredReport: true,
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
    authorName: "佐藤花子",
    seoDescription:
      "プロのシェフを招いて行われたクッキング教室のレポート。参加者全員が美味しい料理を作ることができました。",
    seoKeywords: ["料理", "クッキング", "イタリアン", "ワークショップ", "TOTORAS"],
    allowComments: true,
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
    authorName: "鈴木一郎",
    scheduledPublishDate: "2025-03-01T10:00",
    seoDescription:
      "初心者から上級者まで30名が参加したボードゲーム大会の様子をお届けします。人気ゲームのランキングも紹介。",
    seoKeywords: ["ボードゲーム", "大会", "交流会", "TOTORAS", "カタン", "ドミニオン"],
    allowComments: false,
  },
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
    authorName: "田中美咲",
    seoDescription: "東京の桜の名所で開催された花見イベントのレポートです。美しい桜の下で素敵な時間を過ごしました。",
    seoKeywords: ["花見", "春", "桜", "上野公園", "TOTORAS", "イベント"],
    allowComments: true,
    featuredReport: true,
  },
]

export default function EditReportPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const reportId = params.id
  const isNewMode = reportId === "new"
  const markdownEditorRef = useRef<HTMLTextAreaElement>(null)

  // 初期データの設定
  const initialReportData = isNewMode
    ? {
        id: "",
        title: "",
        date: new Date().toISOString().split("T")[0],
        eventId: "",
        eventTitle: "",
        excerpt: "",
        content: `# イベントレポート

## イベントの様子

## 参加者の声

## 次回のイベント予告
`,
        coverImage: "/placeholder.svg",
        images: [],
        published: false,
        lastUpdated: Date.now(),
        category: "イベントレポート", // デフォルトカテゴリ
        tags: [], // 空のタグ配列
        authorName: "",
        seoDescription: "",
        seoKeywords: [],
        allowComments: true,
        featuredReport: false,
      }
    : sampleReports.find((report) => report.id === reportId) || {
        id: "",
        title: "",
        date: new Date().toISOString().split("T")[0],
        eventId: "",
        eventTitle: "",
        excerpt: "",
        content: "",
        coverImage: "/placeholder.svg",
        images: [],
        published: false,
        lastUpdated: Date.now(),
        category: "イベントレポート",
        tags: [],
        authorName: "",
        seoDescription: "",
        seoKeywords: [],
        allowComments: true,
        featuredReport: false,
      }

  const [formData, setFormData] = useState<EventReport>(initialReportData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("content")
  const [imageUploadMode, setImageUploadMode] = useState<"cover" | "gallery">("cover")
  const [imageToRemove, setImageToRemove] = useState<string | null>(null)
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState("")
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(true)
  const [seoKeywordInput, setSeoKeywordInput] = useState("")
  const [isAdvancedSettingsOpen, setIsAdvancedSettingsOpen] = useState(false)
  const [isImageGalleryOpen, setIsImageGalleryOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isUnsavedChanges, setIsUnsavedChanges] = useState(false)

  // 利用可能なカテゴリのリスト
  const availableCategories = [
    "イベントレポート",
    "サウナ",
    "フットサル",
    "その他",
    "ワークショップ",
    "アウトドア",
    "交流会",
    "ゲーム",
    "料理",
    "音楽",
    "アート",
    "勉強会",
    "キャンプ",
    "サイクリング",
    "スポーツ",
    "カフェ",
    "写真",
    "お酒",
    "旅行",
    "読書会",
    "ボランティア",
  ]

  // タグ入力用の状態
  const [tagInput, setTagInput] = useState("")

  // 自動保存タイマー
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)

  // 自動保存の設定
  useEffect(() => {
    if (isAutoSaveEnabled && isUnsavedChanges) {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }

      autoSaveTimerRef.current = setTimeout(() => {
        autoSave()
        setIsUnsavedChanges(false)
      }, 30000) // 30秒ごとに自動保存
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [formData, isAutoSaveEnabled, isUnsavedChanges])

  // 自動保存機能
  const autoSave = async () => {
    if (!formData.title.trim() || !formData.id) return // タイトルが空または新規作成中は保存しない

    try {
      // API送信用のデータを準備
      const draftData = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt || formData.title,
        coverImage: formData.coverImage !== "/placeholder.svg" ? formData.coverImage : "",
        category: formData.category,
        published: formData.published,
        scheduledPublishDate: formData.scheduledPublishDate,
        eventId: formData.eventId,
        eventTitle: formData.eventTitle,
        authorName: formData.authorName || "管理者",
        images: formData.images,
        tags: formData.tags,
        seoDescription: formData.seoDescription,
        seoKeywords: formData.seoKeywords,
        allowComments: formData.allowComments,
        featuredReport: formData.featuredReport,
      }

      // 更新
      const response = await fetch(`/api/reports/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(draftData),
      })

      if (!response.ok) {
        throw new Error("APIリクエストが失敗しました")
      }

      toast({
        title: "自動保存しました",
        description: new Date().toLocaleTimeString(),
        duration: 3000,
      })
    } catch (error) {
      console.error("自動保存エラー:", error)
      // 自動保存のエラーは静かに処理
    }
  }

  // カンマ区切りでタグを一括追加する機能を追加
  // タグを追加
  const addTag = () => {
    if (tagInput.trim()) {
      // カンマで区切られたタグを処理
      const newTags = tagInput
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag && !formData.tags.includes(tag))

      if (newTags.length > 0) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, ...newTags],
        }))
        setTagInput("")
        setIsUnsavedChanges(true)
      }
    }
  }

  // SEOキーワードを追加
  const addSeoKeyword = () => {
    if (seoKeywordInput.trim()) {
      // カンマで区切られたキーワードを処理
      const newKeywords = seoKeywordInput
        .split(",")
        .map((keyword) => keyword.trim())
        .filter((keyword) => keyword && !formData.seoKeywords?.includes(keyword))

      if (newKeywords.length > 0) {
        setFormData((prev) => ({
          ...prev,
          seoKeywords: [...(prev.seoKeywords || []), ...newKeywords],
        }))
        setSeoKeywordInput("")
        setIsUnsavedChanges(true)
      }
    }
  }

  // SEOキーワードを削除
  const removeSeoKeyword = (keywordToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      seoKeywords: prev.seoKeywords?.filter((keyword) => keyword !== keywordToRemove) || [],
    }))
    setIsUnsavedChanges(true)
  }

  // タグを削除
  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
    setIsUnsavedChanges(true)
  }

  // ページ読み込み時に画面上部にスクロール
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // ローカルストレージからレポートデータを読み込む
  useEffect(() => {
    if (!isNewMode) {
      const fetchReportData = async () => {
        setIsLoading(true)
        setError(null)
        try {
          const response = await fetch(`/api/reports/${reportId}`)
          if (!response.ok) {
            throw new Error("レポートの取得に失敗しました")
          }
          const reportData = await response.json()

          // APIから取得したデータをフォーマット
          setFormData({
            id: reportData.id,
            title: reportData.title,
            date: new Date(reportData.createdAt).toISOString().split("T")[0],
            eventId: reportData.eventId || "",
            eventTitle: reportData.eventTitle || "",
            excerpt: reportData.excerpt,
            content: reportData.content,
            coverImage: reportData.coverImage || "/placeholder.svg",
            images: reportData.images || [],
            published: reportData.published,
            lastUpdated: new Date(reportData.updatedAt).getTime(),
            category: reportData.category,
            tags: reportData.tags || [],
            authorName: reportData.authorName || "",
            seoDescription: reportData.seoDescription || "",
            seoKeywords: reportData.seoKeywords || [],
            allowComments: reportData.allowComments !== false,
            featuredReport: reportData.featuredReport || false,
            scheduledPublishDate: reportData.publishDate
              ? new Date(reportData.publishDate).toISOString().slice(0, 16)
              : undefined,
          })
        } catch (err) {
          console.error("レポートデータの取得エラー:", err)
          setError("レポートデータの取得に失敗しました")

          // エラー時にはサンプルデータを使用
          const sampleReport = sampleReports.find((r) => r.id === reportId)
          if (sampleReport) {
            setFormData(sampleReport)
          }
        } finally {
          setIsLoading(false)
        }
      }

      fetchReportData()
    }
  }, [reportId, isNewMode])

  // プレビューURLの生成
  useEffect(() => {
    if (formData.id) {
      setPreviewUrl(`${window.location.origin}/reports/${formData.id}?preview=true`)
    } else {
      setPreviewUrl("")
    }
  }, [formData.id])

  // フォームの入力値を更新
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setIsUnsavedChanges(true)

    // エラーをクリア
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // イベント選択時の処理
  const handleEventSelect = (eventId: string) => {
    const selectedEvent = eventsData.find((event) => event.id === eventId)
    if (selectedEvent) {
      setFormData((prev) => ({
        ...prev,
        eventId,
        eventTitle: selectedEvent.title,
        // イベント画像をカバー画像として設定（まだ設定されていない場合）
        coverImage: prev.coverImage === "/placeholder.svg" ? selectedEvent.image : prev.coverImage,
      }))
      setIsUnsavedChanges(true)
    }
  }

  // 公開状態の切り替え
  const handlePublishedChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, published: checked }))
    setIsUnsavedChanges(true)
  }

  // 注目レポート設定の切り替え
  const handleFeaturedReportChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, featuredReport: checked }))
    setIsUnsavedChanges(true)
  }

  // コメント許可設定の切り替え
  const handleAllowCommentsChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, allowComments: checked }))
    setIsUnsavedChanges(true)
  }

  // カバー画像の更新
  const handleCoverImageChange = (imageData: string) => {
    setFormData((prev) => ({ ...prev, coverImage: imageData || "/placeholder.svg" }))
    setIsUnsavedChanges(true)
  }

  // ギャラリー画像の追加
  const handleAddGalleryImage = (imageData: string) => {
    if (imageData) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageData],
      }))
      setIsUnsavedChanges(true)
    }
  }

  // ギャラリー画像の削除
  const handleRemoveGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
    setImageToRemove(null)
    setIsUnsavedChanges(true)
  }

  // 予約投稿日時の設定
  const handleScheduledPublishDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      scheduledPublishDate: e.target.value,
      published: false, // 予約投稿を設定する場合は公開状態をオフにする
    }))
    setIsUnsavedChanges(true)
  }

  // 予約投稿の設定を保存
  const saveScheduledPublish = () => {
    setIsScheduleDialogOpen(false)
    toast({
      title: "予約投稿を設定しました",
      description: `${new Date(formData.scheduledPublishDate || "").toLocaleString()}に公開されます`,
      duration: 3000,
    })
  }

  // 予約投稿の設定をキャンセル
  const cancelScheduledPublish = () => {
    setFormData((prev) => ({
      ...prev,
      scheduledPublishDate: undefined,
    }))
    setIsScheduleDialogOpen(false)
    toast({
      title: "予約投稿をキャンセルしました",
      duration: 3000,
    })
  }

  // プレビューリンクをコピー
  const copyPreviewLink = () => {
    navigator.clipboard.writeText(previewUrl)
    toast({
      title: "プレビューリンクをコピーしました",
      duration: 3000,
    })
  }

  // マークダウンエディタにテキストを挿入
  const insertTextAtCursor = (text: string) => {
    if (markdownEditorRef.current) {
      const editor = markdownEditorRef.current
      const start = editor.selectionStart
      const end = editor.selectionEnd
      const content = editor.value
      const newContent = content.substring(0, start) + text + content.substring(end)

      setFormData((prev) => ({ ...prev, content: newContent }))
      setIsUnsavedChanges(true)

      // カーソル位置を更新
      setTimeout(() => {
        editor.focus()
        editor.setSelectionRange(start + text.length, start + text.length)
      }, 0)
    }
  }

  // マークダウンエディタのヘルパー関数
  const addHeading = (level: number) => {
    const prefix = "#".repeat(level) + " "
    insertTextAtCursor(prefix)
  }

  const addBold = () => {
    insertTextAtCursor("**太字テキスト**")
  }

  const addItalic = () => {
    insertTextAtCursor("*斜体テキスト*")
  }

  const addList = () => {
    insertTextAtCursor("\n- リストアイテム\n- リストアイテム\n- リストアイテム\n")
  }

  const addNumberedList = () => {
    insertTextAtCursor("\n1. 番号付きアイテム\n2. 番号付きアイテム\n3. 番号付きアイテム\n")
  }

  const addQuote = () => {
    insertTextAtCursor("\n> 引用テキスト\n")
  }

  const addLink = () => {
    insertTextAtCursor("[リンクテキスト](https://example.com)")
  }

  const addImage = () => {
    if (formData.images.length > 0) {
      const imageUrl = formData.images[0]
      insertTextAtCursor(`![画像の説明](${imageUrl})`)
    } else {
      insertTextAtCursor("![画像の説明](画像のURL)")
    }
  }

  // 画像ギャラリーから画像を選択して挿入
  const insertSelectedImage = () => {
    if (selectedImage) {
      insertTextAtCursor(`![画像の説明](${selectedImage})`)
      setIsImageGalleryOpen(false)
      setSelectedImage(null)
    }
  }

  // 下書き保存
  const saveDraft = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "タイトルが必要です",
        description: "下書き保存するにはタイトルを入力してください",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    try {
      // API送信用のデータを準備
      const draftData = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt || formData.title,
        coverImage: formData.coverImage !== "/placeholder.svg" ? formData.coverImage : "",
        category: formData.category,
        published: false, // 下書きは常に非公開
        eventId: formData.eventId,
        eventTitle: formData.eventTitle,
        authorName: formData.authorName || "管理者",
        images: formData.images,
        tags: formData.tags,
        seoDescription: formData.seoDescription,
        seoKeywords: formData.seoKeywords,
        allowComments: formData.allowComments,
        featuredReport: formData.featuredReport,
      }

      let response

      if (isNewMode) {
        // 新規作成
        response = await fetch("/api/reports", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(draftData),
        })
      } else {
        // 更新
        response = await fetch(`/api/reports/${reportId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(draftData),
        })
      }

      if (!response.ok) {
        throw new Error("APIリクエストが失敗しました")
      }

      const result = await response.json()

      // 成功メッセージ
      toast({
        title: "下書きとして保存しました",
        description: "レポートが下書きとして保存されました",
        duration: 3000,
      })

      // 新規作成の場合は、IDを更新して編集モードに切り替え
      if (isNewMode && result.id) {
        router.replace(`/admin/reports/edit/${result.id}`)
      }

      setIsUnsavedChanges(false)
    } catch (error) {
      console.error("下書き保存エラー:", error)
      toast({
        title: "エラーが発生しました",
        description: "下書きの保存に失敗しました。もう一度お試しください。",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  // フォームの検証
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = "タイトルを入力してください"
    if (!formData.date) newErrors.date = "日付を入力してください"
    if (!formData.eventId) newErrors.eventId = "関連イベントを選択してください"
    if (!formData.excerpt.trim()) newErrors.excerpt = "抜粋を入力してください"
    if (!formData.content.trim()) newErrors.content = "内容を入力してください"
    if (!formData.authorName?.trim()) newErrors.authorName = "著者名を入力してください"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // フォームの送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      try {
        // API送信用のデータを準備
        const submitData = {
          title: formData.title,
          content: formData.content,
          excerpt: formData.excerpt,
          coverImage: formData.coverImage !== "/placeholder.svg" ? formData.coverImage : "",
          category: formData.category,
          published: formData.published,
          scheduledPublishDate: formData.scheduledPublishDate,
          eventId: formData.eventId,
          eventTitle: formData.eventTitle,
          authorName: formData.authorName,
          images: formData.images,
          tags: formData.tags,
          seoDescription: formData.seoDescription,
          seoKeywords: formData.seoKeywords,
          allowComments: formData.allowComments,
          featuredReport: formData.featuredReport,
        }

        let response

        if (isNewMode) {
          // 新規作成
          response = await fetch("/api/reports", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(submitData),
          })
        } else {
          // 更新
          response = await fetch(`/api/reports/${reportId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(submitData),
          })
        }

        if (!response.ok) {
          throw new Error("APIリクエストが失敗しました")
        }

        const result = await response.json()

        // 成功したら一覧ページに戻る
        toast({
          title: isNewMode ? "レポートを作成しました" : "レポートを更新しました",
          description: formData.scheduledPublishDate
            ? `${new Date(formData.scheduledPublishDate).toLocaleString()}に公開されます`
            : formData.published
              ? "レポートが公開されました"
              : "レポートが下書きとして保存されました",
          duration: 3000,
        })
        setIsUnsavedChanges(false)
        router.push("/admin/reports")
      } catch (error) {
        console.error("レポート保存エラー:", error)
        toast({
          title: "エラーが発生しました",
          description: "レポートの保存に失敗しました。もう一度お試しください。",
          variant: "destructive",
          duration: 3000,
        })
      }
    } else {
      // エラーがある場合はトーストで通知
      toast({
        title: "入力エラーがあります",
        description: "必須項目を入力してください",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="container px-4 mx-auto py-8 md:py-12">
          <div className="flex justify-center items-center h-[60vh]">
            <div className="flex flex-col items-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
              <p className="mt-4 text-gray-600">レポートデータを読み込み中...</p>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="container px-4 mx-auto py-8 md:py-12">
          <div className="flex justify-center items-center h-[60vh]">
            <div className="flex flex-col items-center">
              <div className="text-red-500 text-xl mb-4">エラーが発生しました</div>
              <p className="text-gray-600">{error}</p>
              <Button className="mt-4" onClick={() => router.push("/admin/reports")}>
                レポート一覧に戻る
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Toaster />

      <div className="container px-4 mx-auto py-8 md:py-12">
        <Link
          href="/admin/reports"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          レポート一覧に戻る
        </Link>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{isNewMode ? "新規レポート作成" : "レポート編集"}</h1>
          <div className="flex items-center gap-2">
            {isAutoSaveEnabled && (
              <span className="text-xs text-gray-500">
                {isUnsavedChanges ? "変更あり - 自動保存待機中..." : "すべての変更が保存されました"}
              </span>
            )}
            <div className="flex items-center gap-1">
              <Checkbox
                id="autoSave"
                checked={isAutoSaveEnabled}
                onCheckedChange={(checked) => setIsAutoSaveEnabled(checked as boolean)}
              />
              <Label htmlFor="autoSave" className="text-xs">
                自動保存
              </Label>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div>
                <Label htmlFor="title" className="text-base">
                  レポートタイトル <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`mt-1 ${errors.title ? "border-red-500" : ""}`}
                  placeholder="例: 春の花見イベントレポート"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <Label htmlFor="authorName" className="text-base">
                  著者名 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="authorName"
                  name="authorName"
                  value={formData.authorName || ""}
                  onChange={handleChange}
                  className={`mt-1 ${errors.authorName ? "border-red-500" : ""}`}
                  placeholder="例: 山田太郎"
                />
                {errors.authorName && <p className="text-red-500 text-sm mt-1">{errors.authorName}</p>}
              </div>

              <div>
                <Label htmlFor="excerpt" className="text-base">
                  抜粋 <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  className={`mt-1 ${errors.excerpt ? "border-red-500" : ""}`}
                  placeholder="レポートの簡単な要約を入力してください（一覧ページに表示されます）"
                />
                {errors.excerpt && <p className="text-red-500 text-sm mt-1">{errors.excerpt}</p>}
              </div>

              <div>
                <Label htmlFor="eventId" className="text-base">
                  関連イベント <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.eventId} onValueChange={handleEventSelect}>
                  <SelectTrigger className={`mt-1 ${errors.eventId ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="イベントを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventsData.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.title} ({new Date(event.date).toLocaleDateString("ja-JP")})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.eventId && <p className="text-red-500 text-sm mt-1">{errors.eventId}</p>}
              </div>

              <div>
                <Label htmlFor="date" className="text-base">
                  レポート日付 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`mt-1 ${errors.date ? "border-red-500" : ""}`}
                />
                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="content" className="text-base">
                    レポート内容 <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList>
                        <TabsTrigger value="content">編集</TabsTrigger>
                        <TabsTrigger value="preview">プレビュー</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>

                <div className="border rounded-md">
                  <div className="bg-gray-50 p-2 border-b flex flex-wrap gap-2">
                    <Button type="button" variant="ghost" size="sm" onClick={() => addHeading(1)}>
                      H1
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => addHeading(2)}>
                      H2
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => addHeading(3)}>
                      H3
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={addBold}>
                      B
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={addItalic}>
                      I
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={addList}>
                      • リスト
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={addNumberedList}>
                      1. 番号
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={addQuote}>
                      " 引用
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={addLink}>
                      🔗 リンク
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setIsImageGalleryOpen(true)}>
                      🖼️ 画像
                    </Button>
                  </div>

                  <TabsContent value="content" className="mt-0">
                    <Textarea
                      id="content"
                      name="content"
                      ref={markdownEditorRef}
                      value={formData.content}
                      onChange={handleChange}
                      className={`min-h-[400px] border-0 rounded-none ${errors.content ? "border-red-500" : ""}`}
                    />
                  </TabsContent>

                  <TabsContent value="preview" className="mt-0 p-4 min-h-[400px] prose max-w-none">
                    <div
                      className="markdown-preview"
                      dangerouslySetInnerHTML={{ __html: formData.content.replace(/\n/g, "<br>") }}
                    />
                  </TabsContent>
                </div>
                {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                <p className="text-gray-500 text-xs mt-1">
                  マークダウン形式で入力できます。見出し、リスト、太字などの書式を使用できます。
                </p>
              </div>

              {/* SEO設定 */}
              <div>
                <h3 className="font-bold text-lg mb-4">SEO設定</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="seoDescription" className="text-base">
                      SEO説明文
                    </Label>
                    <Textarea
                      id="seoDescription"
                      name="seoDescription"
                      value={formData.seoDescription || ""}
                      onChange={handleChange}
                      className="mt-1"
                      placeholder="検索エンジン用の説明文を入力してください（120〜160文字推奨）"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      文字数: {formData.seoDescription?.length || 0}/160
                      {(formData.seoDescription?.length || 0) > 160 && (
                        <span className="text-red-500 ml-2">推奨文字数を超えています</span>
                      )}
                    </p>
                  </div>

                  <div>
                    <Label className="text-base mb-2 block">SEOキーワード</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        value={seoKeywordInput}
                        onChange={(e) => setSeoKeywordInput(e.target.value)}
                        placeholder="キーワードを入力"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addSeoKeyword()
                          }
                        }}
                      />
                      <Button type="button" onClick={addSeoKeyword} variant="outline">
                        追加
                      </Button>
                    </div>
                    {formData.seoKeywords && formData.seoKeywords.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.seoKeywords.map((keyword) => (
                          <Badge key={keyword} variant="secondary" className="flex items-center gap-1">
                            {keyword}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSeoKeyword(keyword)}
                              className="h-4 w-4 p-0 ml-1 text-gray-500 hover:text-red-500 hover:bg-transparent"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    )}
                    <p className="text-gray-500 text-xs mt-2">
                      キーワードはカンマで区切って複数入力できます。Enterキーまたは「追加」ボタンで確定します。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4">レポート設定</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="published" className="text-base">
                        公開状態
                      </Label>
                      <div className="flex items-center gap-2">
                        <Switch
                          id="published"
                          checked={formData.published}
                          onCheckedChange={handlePublishedChange}
                          disabled={!!formData.scheduledPublishDate}
                        />
                        <span className="text-sm">
                          {formData.scheduledPublishDate ? "予約投稿" : formData.published ? "公開" : "下書き"}
                        </span>
                      </div>
                    </div>

                    {/* 予約投稿ボタン */}
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => setIsScheduleDialogOpen(true)}
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        {formData.scheduledPublishDate ? "予約投稿を編集" : "予約投稿を設定"}
                      </Button>
                    </div>

                    {/* 予約投稿が設定されている場合に表示 */}
                    {formData.scheduledPublishDate && (
                      <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm">
                        <p className="text-amber-800 flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>
                            {new Date(formData.scheduledPublishDate).toLocaleDateString("ja-JP", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            に公開予定
                          </span>
                        </p>
                      </div>
                    )}

                    <div>
                      <Label className="text-base mb-2 block">カバー画像</Label>
                      <ImageUpload
                        initialImage={formData.coverImage !== "/placeholder.svg" ? formData.coverImage : ""}
                        onImageChange={handleCoverImageChange}
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        推奨サイズ: 1200 x 800px (16:9)、最大ファイルサイズ: 5MB
                      </p>
                    </div>

                    <div>
                      <Label className="text-base mb-2 block">ギャラリー画像</Label>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-video relative rounded-md overflow-hidden">
                              <Image
                                src={image || "/placeholder.svg"}
                                alt={`ギャラリー画像 ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="h-8"
                                onClick={() => setImageToRemove(image)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-2 border-dashed rounded-lg p-4 text-center">
                        <ImageUpload initialImage="" onImageChange={handleAddGalleryImage} className="min-h-0" />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">レポート内で使用する画像をアップロードしてください。</p>
                    </div>

                    {/* 詳細設定 */}
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full text-sm"
                        onClick={() => setIsAdvancedSettingsOpen(!isAdvancedSettingsOpen)}
                      >
                        {isAdvancedSettingsOpen ? "詳細設定を閉じる" : "詳細設定を開く"}
                      </Button>

                      {isAdvancedSettingsOpen && (
                        <div className="mt-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="featuredReport" className="text-sm">
                              注目レポートとして表示
                            </Label>
                            <Switch
                              id="featuredReport"
                              checked={formData.featuredReport || false}
                              onCheckedChange={handleFeaturedReportChange}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Label htmlFor="allowComments" className="text-sm">
                              コメントを許可
                            </Label>
                            <Switch
                              id="allowComments"
                              checked={formData.allowComments !== false}
                              onCheckedChange={handleAllowCommentsChange}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* カテゴリとタグの編集フォームを追加 */}
              <div>
                <Label htmlFor="category" className="text-base">
                  カテゴリ
                </Label>
                <CategorySelector
                  value={formData.category}
                  onValueChange={(value) => {
                    setFormData((prev) => ({ ...prev, category: value }))
                    setIsUnsavedChanges(true)
                  }}
                  categories={availableCategories}
                />
              </div>

              <div>
                <Label className="text-base mb-2 block">タグ</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="タグを入力"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    追加
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTag(tag)}
                          className="h-4 w-4 p-0 ml-1 text-gray-500 hover:text-red-500 hover:bg-transparent"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-gray-500 text-xs mt-2">
                  タグはカンマで区切って複数入力できます。Enterキーまたは「追加」ボタンで確定します。
                </p>
              </div>

              <div className="flex justify-end space-x-4">
                <Link href="/admin/reports">
                  <Button type="button" variant="outline">
                    キャンセル
                  </Button>
                </Link>
                <Button
                  type="button"
                  variant="outline"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  onClick={() => setIsPreviewOpen(true)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  プレビュー
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  onClick={() => setIsShareDialogOpen(true)}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  共有
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-amber-200 text-amber-600 hover:bg-amber-50"
                  onClick={saveDraft}
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  下書き保存
                </Button>
                <Button type="submit" className="bg-[#4ecdc4] hover:bg-[#4ecdc4]/90 flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {formData.scheduledPublishDate ? "予約投稿として保存" : formData.published ? "公開する" : "保存する"}
                </Button>
              </div>
            </div>
          </div>
        </form>

        {/* レポートプレビューダイアログ */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>レポートプレビュー</DialogTitle>
              <DialogDescription>実際の表示イメージを確認できます</DialogDescription>
            </DialogHeader>

            <div className="mt-4 border rounded-lg p-6 bg-white">
              <div className="relative h-64 rounded-lg overflow-hidden mb-6">
                <Image
                  src={formData.coverImage || "/placeholder.svg"}
                  alt={formData.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black opacity-20" />
              </div>

              {/* プレビューダイアログにカテゴリとタグを表示 */}
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(formData.date).toLocaleDateString("ja-JP", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <Badge variant="outline">{formData.eventTitle}</Badge>
                <Badge className="bg-[#ff6b6b]/10 text-[#ff6b6b] border-[#ff6b6b]/20">{formData.category}</Badge>
              </div>

              <h1 className="text-3xl font-bold mb-6">{formData.title || "（タイトルなし）"}</h1>

              <div className="prose max-w-none mb-8">
                <div dangerouslySetInnerHTML={{ __html: formData.content.replace(/\n/g, "<br>") }} />
              </div>

              {/* タグを表示 */}
              {formData.tags.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-2">タグ</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-gray-100">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {formData.images.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl font-bold mb-4">イベント写真</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="aspect-video relative rounded-md overflow-hidden">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`イベント写真 ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button onClick={() => setIsPreviewOpen(false)}>閉じる</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 画像削除確認ダイアログ */}
        <Dialog open={!!imageToRemove} onOpenChange={(open) => !open && setImageToRemove(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>画像を削除しますか？</DialogTitle>
              <DialogDescription>この操作は元に戻せません。画像を削除してもよろしいですか？</DialogDescription>
            </DialogHeader>
            <div className="aspect-video relative rounded-md overflow-hidden my-4">
              {imageToRemove && (
                <Image src={imageToRemove || "/placeholder.svg"} alt="削除する画像" fill className="object-cover" />
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setImageToRemove(null)}>
                キャンセル
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (imageToRemove) {
                    const index = formData.images.findIndex((img) => img === imageToRemove)
                    if (index !== -1) {
                      handleRemoveGalleryImage(index)
                    }
                  }
                }}
              >
                削除する
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 予約投稿設定ダイアログ */}
        <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>予約投稿の設定</DialogTitle>
              <DialogDescription>レポートを指定した日時に自動的に公開します</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="scheduledPublishDate">公開日時</Label>
                <Input
                  id="scheduledPublishDate"
                  type="datetime-local"
                  value={formData.scheduledPublishDate || ""}
                  onChange={handleScheduledPublishDateChange}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
              <p className="text-sm text-gray-500">
                設定した日時になると、レポートは自動的に公開状態になります。それまでは下書き状態として保存されます。
              </p>
            </div>
            <DialogFooter>
              {formData.scheduledPublishDate && (
                <Button variant="outline" className="mr-auto" onClick={cancelScheduledPublish}>
                  予約をキャンセル
                </Button>
              )}
              <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
                閉じる
              </Button>
              <Button onClick={saveScheduledPublish} disabled={!formData.scheduledPublishDate}>
                <Check className="h-4 w-4 mr-2" />
                設定を保存
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 共有ダイアログ */}
        <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>レポートの共有</DialogTitle>
              <DialogDescription>プレビューリンクを共有して、公開前にレポートを確認できます</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="previewUrl">プレビューURL</Label>
                <div className="flex gap-2">
                  <Input id="previewUrl" value={previewUrl} readOnly />
                  <Button type="button" variant="outline" onClick={copyPreviewLink}>
                    コピー
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                このURLは一時的なものです。レポートを保存するまでは機能しない場合があります。
              </p>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsShareDialogOpen(false)}>閉じる</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 画像ギャラリーダイアログ */}
        <Dialog open={isImageGalleryOpen} onOpenChange={setIsImageGalleryOpen}>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>画像ギャラリー</DialogTitle>
              <DialogDescription>挿入する画像を選択してください</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4">
              {formData.images.length > 0 ? (
                formData.images.map((image, index) => (
                  <div
                    key={index}
                    className={`aspect-video relative rounded-md overflow-hidden cursor-pointer border-2 ${
                      selectedImage === image ? "border-[#4ecdc4]" : "border-transparent"
                    }`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`ギャラリー画像 ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  <p>ギャラリーに画像がありません</p>
                  <p className="text-sm mt-2">先にギャラリー画像をアップロードしてください</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsImageGalleryOpen(false)}>
                キャンセル
              </Button>
              <Button onClick={insertSelectedImage} disabled={!selectedImage}>
                選択した画像を挿入
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Footer />
    </main>
  )
}
