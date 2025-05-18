"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ChevronLeft,
  Save,
  Trash2,
  FileText,
  Settings,
  FileDown,
  Eye,
  Calendar,
  MapPin,
  Clock,
  AlertTriangle,
  Tag,
  Users,
  CheckCircle2,
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ImageUpload } from "@/components/image-upload"
import { CategorySelector } from "@/components/category-selector"

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
  status?: "published" | "draft"
  lastUpdated?: number // 最終更新日時
}

// 注意事項テンプレートの型定義
interface CautionTemplate {
  id: string
  name: string
  content: string
  category: string
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
]

// 利用可能なカテゴリ
const categories = [
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

// 利用可能なカラー
const colors = [
  { name: "レッド", value: "#ff6b6b" },
  { name: "ティール", value: "#4ecdc4" },
  { name: "イエロー", value: "#ffd93d" },
  { name: "パープル", value: "#9b59b6" },
  { name: "グリーン", value: "#2ecc71" },
]

// デフォルトのテンプレート（ローカルストレージに保存されていない場合に使用）
const defaultTemplates: CautionTemplate[] = [
  {
    id: "weather",
    name: "雨天中止ポリシー",
    content: "雨天の場合は中止となります。中止の場合は前日までにLINEでご連絡いたします。\n参加費は全額返金いたします。",
    category: "一般",
  },
  {
    id: "alcohol",
    name: "アルコール注意事項",
    content:
      "アルコールを提供するイベントのため、20歳未満の方は参加できません。\n当日は身分証明書をご持参ください。\n飲酒される方は公共交通機関をご利用ください。",
    category: "一般",
  },
  {
    id: "cancel",
    name: "キャンセルポリシー",
    content:
      "キャンセルは開催日の3日前まで受け付けております。\n3日前〜前日のキャンセル：参加費の50%\n当日のキャンセル：参加費の100%\nキャンセルの際は必ずLINEでご連絡ください。",
    category: "一般",
  },
  {
    id: "valuables",
    name: "貴重品管理",
    content: "貴重品の管理は各自でお願いいたします。\n紛失・盗難等について、主催者側は一切の責任を負いかねます。",
    category: "一般",
  },
  {
    id: "photo",
    name: "写真撮影について",
    content:
      "イベント中に撮影した写真は、TOTORASのSNSやウェブサイトで使用させていただく場合があります。\n写真掲載を希望されない方は、事前にスタッフにお申し出ください。",
    category: "一般",
  },
  {
    id: "sauna",
    name: "サウナイベント注意事項",
    content:
      "サウナ初心者の方も参加可能ですが、持病をお持ちの方は事前に医師にご相談ください。\n水分補給はこまめに行ってください。\n体調が優れない場合は無理をせず、スタッフにお声がけください。",
    category: "サウナ",
  },
  {
    id: "futsal",
    name: "フットサル注意事項",
    content:
      "運動に適した服装と室内シューズをご持参ください。\nケガ防止のため、アクセサリー類は外してご参加ください。\n水分補給用の飲み物をご持参ください。",
    category: "フットサル",
  },
  {
    id: "workshop",
    name: "ワークショップ注意事項",
    content:
      "材料費は参加費に含まれています。\n汚れても良い服装でお越しください。\n作品のお持ち帰り用の袋をご持参いただくことをおすすめします。",
    category: "ワークショップ",
  },
]

export default function EditEventPage({ params }: { params: { id: string } }) {
  // ページ読み込み時に画面上部にスクロール
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const router = useRouter()
  const eventId = params.id

  // 新規作成モードかどうか
  const isNewMode = eventId === "new"

  // 初期データの設定
  const initialEventData = isNewMode
    ? {
        id: "",
        title: "",
        date: "",
        time: "",
        location: "",
        image: "/placeholder.svg",
        description: "",
        cautions: "",
        price: "",
        capacity: "",
        category: "その他",
        items: [],
        color: "#4ecdc4",
        status: "draft",
      }
    : eventsData.find((event) => event.id === eventId) || {
        id: "",
        title: "",
        date: "",
        time: "",
        location: "",
        image: "/placeholder.svg",
        description: "",
        cautions: "",
        price: "",
        capacity: "",
        category: "その他",
        items: [],
        color: "#4ecdc4",
        status: "draft",
      }

  const [formData, setFormData] = useState<EventData>(initialEventData)
  const [itemInput, setItemInput] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [templates, setTemplates] = useState<CautionTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<CautionTemplate | null>(null)
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [showChecklist, setShowChecklist] = useState(false)
  const [checklist, setChecklist] = useState({
    title: false,
    description: false,
    date: false,
    location: false,
    price: false,
    capacity: false,
    cautions: false,
    category: false,
    image: false,
  })

  // URL検索パラメータから下書きを読み込む
  useEffect(() => {
    const loadDraftData = () => {
      const searchParams = new URLSearchParams(window.location.search)
      const source = searchParams.get("source")

      if (source === "draft" && eventId && eventId !== "new") {
        const draftData = loadDraft(eventId)
        if (draftData) {
          setFormData(draftData)
        }
      }
    }

    loadDraftData()
  }, [eventId])

  // テンプレートをローカルストレージから読み込む
  useEffect(() => {
    const storedTemplates = localStorage.getItem("cautionTemplates")
    if (storedTemplates) {
      setTemplates(JSON.parse(storedTemplates))
    } else {
      setTemplates(defaultTemplates)
    }
  }, [])

  // フォームデータの変更を監視してチェックリストを更新
  useEffect(() => {
    setChecklist({
      title: !!formData.title.trim(),
      description: !!formData.description.trim(),
      date: !!formData.date,
      location: !!formData.location.trim(),
      price: !!formData.price.trim(),
      capacity: !!formData.capacity.trim(),
      cautions: !!formData.cautions.trim(),
      category: !!formData.category,
      image: formData.image !== "/placeholder.svg" && !!formData.image,
    })
  }, [formData])

  // フォームの入力値を更新
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // エラーをクリア
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // セレクトの値を更新
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // 画像の更新
  const handleImageChange = (imageData: string) => {
    setFormData((prev) => ({ ...prev, image: imageData || "/placeholder.svg" }))
  }

  // 持ち物アイテムを追加
  const addItem = () => {
    if (itemInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        items: [...prev.items, itemInput.trim()],
      }))
      setItemInput("")
    }
  }

  // 持ち物アイテムを削除
  const removeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  // 注意事項テンプレートを適用
  const applyTemplate = (template: CautionTemplate) => {
    // 既存の注意事項があれば、それに追加する形で適用
    const currentCautions = formData.cautions.trim()
    const newCautions = currentCautions ? `${currentCautions}\n\n${template.content}` : template.content

    setFormData((prev) => ({
      ...prev,
      cautions: newCautions,
    }))

    // ダイアログを閉じる
    setIsTemplateDialogOpen(false)
    setSelectedTemplate(null)
  }

  // テンプレートプレビューを表示
  const showTemplatePreview = (template: CautionTemplate) => {
    setSelectedTemplate(template)
    setIsTemplateDialogOpen(true)
  }

  // カテゴリに基づいたテンプレートのフィルタリング
  const getFilteredTemplates = () => {
    // 一般カテゴリのテンプレートは常に表示
    const generalTemplates = templates.filter((template) => template.category === "一般")

    // 選択されたカテゴリに対応するテンプレート
    const categoryTemplates = templates.filter(
      (template) => template.category.toLowerCase() === formData.category.toLowerCase(),
    )

    // 重複を避けるために一般カテゴリとイベントカテゴリのテンプレートを結合
    return [...generalTemplates, ...categoryTemplates]
  }

  // フォームの検証
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = "タイトルを入力してください"
    if (!formData.date) newErrors.date = "日付を入力してください"
    if (!formData.time.trim()) newErrors.time = "時間を入力してください"
    if (!formData.location.trim()) newErrors.location = "場所を入力してください"
    if (!formData.description.trim()) newErrors.description = "説明を入力してください"
    if (!formData.price.trim()) newErrors.price = "参加費を入力してください"
    if (!formData.capacity.trim()) newErrors.capacity = "定員を入力してください"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ローカルストレージから下書きデータを読み込む
  const loadDraft = (id: string) => {
    const savedDrafts = localStorage.getItem("eventDrafts")
    if (savedDrafts) {
      try {
        const parsedDrafts = JSON.parse(savedDrafts) as EventData[]
        const draft = parsedDrafts.find((draft) => draft.id === id)
        if (draft) {
          return draft
        }
      } catch (e) {
        console.error("下書きデータの読み込みに失敗しました", e)
      }
    }
    return null
  }

  // 下書き保存
  const saveDraft = () => {
    // IDが空の場合は新しいIDを生成
    const draftData = {
      ...formData,
      id: formData.id || `draft-${Date.now()}`,
      status: "draft" as const,
      lastUpdated: Date.now(),
    }

    // 実際のアプリケーションではここでAPIリクエストを送信
    console.log("下書きデータ:", draftData)

    // ローカルストレージに保存（実際のアプリではデータベースに保存）
    const drafts = JSON.parse(localStorage.getItem("eventDrafts") || "[]")
    const existingDraftIndex = drafts.findIndex((draft: EventData) => draft.id === draftData.id)

    if (existingDraftIndex >= 0) {
      drafts[existingDraftIndex] = draftData
    } else {
      drafts.push(draftData)
    }

    localStorage.setItem("eventDrafts", JSON.stringify(drafts))

    // 成功メッセージ
    alert("下書きとして保存しました")
  }

  // フォームの送信
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      // IDが空の場合は新しいIDを生成
      const submitData = {
        ...formData,
        id: formData.id || `event-${Date.now()}`,
        status: "published" as const,
      }

      // 実際のアプリケーションではここでAPIリクエストを送信
      console.log("送信データ:", submitData)

      // 下書きとして保存されていた場合は、下書きリストから削除
      const savedDrafts = localStorage.getItem("eventDrafts")
      if (savedDrafts) {
        try {
          const parsedDrafts = JSON.parse(savedDrafts) as EventData[]
          const updatedDrafts = parsedDrafts.filter((draft) => draft.id !== submitData.id)
          localStorage.setItem("eventDrafts", JSON.stringify(updatedDrafts))
        } catch (e) {
          console.error("下書きデータの削除に失敗しました", e)
        }
      }

      // 成功したら一覧ページに戻る
      alert(isNewMode ? "イベントを作成しました" : "イベントを更新しました")
      router.push("/admin/events")
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="container px-4 mx-auto py-8 md:py-12">
        <div className="flex gap-4 mb-8">
          <Link
            href="/admin/events"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            イベント一覧に戻る
          </Link>

          <Link
            href="/admin/events/drafts"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FileDown className="h-4 w-4 mr-1" />
            下書き一覧
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8">{isNewMode ? "新規イベント作成" : "イベント編集"}</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div>
                <Label htmlFor="title" className="text-base">
                  イベントタイトル <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`mt-1 ${errors.title ? "border-red-500" : ""}`}
                  placeholder="例: 夏のBBQパーティー"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <Label htmlFor="description" className="text-base">
                  イベント説明 <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`mt-1 min-h-[150px] ${errors.description ? "border-red-500" : ""}`}
                  placeholder="イベントの詳細な説明を入力してください"
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label htmlFor="cautions" className="text-base">
                    注意事項
                  </Label>
                  <div className="flex gap-2">
                    <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 gap-1">
                            <FileText className="h-4 w-4" />
                            テンプレート
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[300px]">
                          <DropdownMenuLabel>注意事項テンプレート</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {getFilteredTemplates().map((template) => (
                            <DropdownMenuItem
                              key={template.id}
                              onClick={() => showTemplatePreview(template)}
                              className="cursor-pointer"
                            >
                              <div>
                                <div className="font-medium">{template.name}</div>
                                <div className="text-xs text-gray-500 truncate">{template.content.split("\n")[0]}</div>
                              </div>
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href="/admin/templates" className="cursor-pointer">
                              <Settings className="h-4 w-4 mr-2" />
                              テンプレート管理
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* テンプレートプレビューダイアログ */}
                      <DialogContent className="sm:max-w-md">
                        {selectedTemplate && (
                          <>
                            <DialogHeader>
                              <DialogTitle>{selectedTemplate.name}</DialogTitle>
                              <DialogDescription>カテゴリ: {selectedTemplate.category}</DialogDescription>
                            </DialogHeader>
                            <div className="bg-gray-50 p-4 rounded-md my-2">
                              <div className="whitespace-pre-line text-gray-700">{selectedTemplate.content}</div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
                                キャンセル
                              </Button>
                              <Button
                                onClick={() => applyTemplate(selectedTemplate)}
                                className="bg-[#4ecdc4] hover:bg-[#4ecdc4]/90"
                              >
                                テンプレートを適用
                              </Button>
                            </DialogFooter>
                          </>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <Textarea
                  id="cautions"
                  name="cautions"
                  value={formData.cautions}
                  onChange={handleChange}
                  className="mt-1 min-h-[100px]"
                  placeholder="参加者への注意事項を入力してください（キャンセルポリシー、持ち物、禁止事項など）"
                />
                <p className="text-gray-500 text-xs mt-1">※ 複数の注意事項を記載する場合は、改行で区切ってください。</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date" className="text-base">
                    開催日 <span className="text-red-500">*</span>
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
                  <Label htmlFor="time" className="text-base">
                    開催時間 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className={`mt-1 ${errors.time ? "border-red-500" : ""}`}
                    placeholder="例: 12:00 - 16:00"
                  />
                  {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="location" className="text-base">
                  開催場所 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`mt-1 ${errors.location ? "border-red-500" : ""}`}
                  placeholder="例: 東京・代々木公園"
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price" className="text-base">
                    参加費 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className={`mt-1 ${errors.price ? "border-red-500" : ""}`}
                    placeholder="例: 4,500円（食材・ドリンク込み）"
                  />
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>
                <div>
                  <Label htmlFor="capacity" className="text-base">
                    定員 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    className={`mt-1 ${errors.capacity ? "border-red-500" : ""}`}
                    placeholder="例: 50名"
                  />
                  {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
                </div>
              </div>

              <div>
                <Label className="text-base">持ち物</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={itemInput}
                    onChange={(e) => setItemInput(e.target.value)}
                    placeholder="持ち物を入力"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addItem()
                      }
                    }}
                  />
                  <Button type="button" onClick={addItem} variant="outline">
                    追加
                  </Button>
                </div>
                {formData.items.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {formData.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span>{item}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4">イベント設定</h3>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="category" className="text-base">
                        カテゴリ
                      </Label>
                      <CategorySelector
                        value={formData.category}
                        onValueChange={(value) => handleSelectChange("category", value)}
                        categories={categories}
                      />
                    </div>

                    <div>
                      <Label htmlFor="color" className="text-base">
                        カラー
                      </Label>
                      <Select value={formData.color} onValueChange={(value) => handleSelectChange("color", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="カラーを選択" />
                        </SelectTrigger>
                        <SelectContent>
                          {colors.map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.value }}></div>
                                {color.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-base mb-2 block">イベント画像</Label>
                      <ImageUpload
                        initialImage={formData.image !== "/placeholder.svg" ? formData.image : ""}
                        onImageChange={handleImageChange}
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        推奨サイズ: 1200 x 800px (16:9)、最大ファイルサイズ: 5MB
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* チェックリスト */}
              <div className="px-6 pb-6">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-sm">入力チェックリスト</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => setShowChecklist(!showChecklist)}
                  >
                    {showChecklist ? "閉じる" : "開く"}
                  </Button>
                </div>

                {showChecklist && (
                  <div className="space-y-2 bg-gray-50 p-3 rounded-md text-sm">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <CheckCircle2
                          className={`h-4 w-4 mr-2 ${checklist.title ? "text-green-500" : "text-gray-300"}`}
                        />
                        タイトル
                      </span>
                      <Badge variant={checklist.title ? "success" : "outline"}>
                        {checklist.title ? "完了" : "未入力"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <CheckCircle2
                          className={`h-4 w-4 mr-2 ${checklist.description ? "text-green-500" : "text-gray-300"}`}
                        />
                        説明文
                      </span>
                      <Badge variant={checklist.description ? "success" : "outline"}>
                        {checklist.description ? "完了" : "未入力"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <CheckCircle2
                          className={`h-4 w-4 mr-2 ${checklist.date ? "text-green-500" : "text-gray-300"}`}
                        />
                        開催日
                      </span>
                      <Badge variant={checklist.date ? "success" : "outline"}>
                        {checklist.date ? "完了" : "未入力"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <CheckCircle2
                          className={`h-4 w-4 mr-2 ${checklist.location ? "text-green-500" : "text-gray-300"}`}
                        />
                        開催場所
                      </span>
                      <Badge variant={checklist.location ? "success" : "outline"}>
                        {checklist.location ? "完了" : "未入力"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <CheckCircle2
                          className={`h-4 w-4 mr-2 ${checklist.price ? "text-green-500" : "text-gray-300"}`}
                        />
                        参加費
                      </span>
                      <Badge variant={checklist.price ? "success" : "outline"}>
                        {checklist.price ? "完了" : "未入力"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <CheckCircle2
                          className={`h-4 w-4 mr-2 ${checklist.capacity ? "text-green-500" : "text-gray-300"}`}
                        />
                        定員
                      </span>
                      <Badge variant={checklist.capacity ? "success" : "outline"}>
                        {checklist.capacity ? "完了" : "未入力"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <CheckCircle2
                          className={`h-4 w-4 mr-2 ${checklist.cautions ? "text-green-500" : "text-gray-300"}`}
                        />
                        注意事項
                      </span>
                      <Badge variant={checklist.cautions ? "success" : "outline"}>
                        {checklist.cautions ? "完了" : "未入力"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <CheckCircle2
                          className={`h-4 w-4 mr-2 ${checklist.category ? "text-green-500" : "text-gray-300"}`}
                        />
                        カテゴリ
                      </span>
                      <Badge variant={checklist.category ? "success" : "outline"}>
                        {checklist.category ? "完了" : "未入力"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <CheckCircle2
                          className={`h-4 w-4 mr-2 ${checklist.image ? "text-green-500" : "text-gray-300"}`}
                        />
                        イメージ画像
                      </span>
                      <Badge variant={checklist.image ? "success" : "outline"}>
                        {checklist.image ? "完了" : "未設定"}
                      </Badge>
                    </div>

                    <div className="mt-4 pt-2 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span>入力完了率</span>
                        <span className="font-medium">
                          {Object.values(checklist).filter(Boolean).length} / {Object.values(checklist).length}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div
                          className="bg-green-500 h-2.5 rounded-full"
                          style={{
                            width: `${(Object.values(checklist).filter(Boolean).length / Object.values(checklist).length) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <Link href="/admin/events">
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
                  className="border-amber-200 text-amber-600 hover:bg-amber-50"
                  onClick={saveDraft}
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  下書き保存
                </Button>
                <Button type="submit" className="bg-[#4ecdc4] hover:bg-[#4ecdc4]/90 flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {isNewMode ? "イベントを作成" : "公開する"}
                </Button>
              </div>
            </div>
          </div>
        </form>
        {/* イベントプレビューダイアログ */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>イベントプレビュー</DialogTitle>
              <DialogDescription>実際の表示イメージを確認できます</DialogDescription>
            </DialogHeader>

            <div className="mt-4 border rounded-lg p-6 bg-white">
              <div className="relative h-64 rounded-lg overflow-hidden mb-6">
                <Image src={formData.image || "/placeholder.svg"} alt={formData.title} fill className="object-cover" />
                <div className="absolute inset-0 opacity-30" style={{ backgroundColor: formData.color }} />
                <div
                  className="absolute top-4 right-4 px-3 py-1 rounded-full text-white text-sm font-medium"
                  style={{ backgroundColor: formData.color }}
                >
                  {formData.category}
                </div>
              </div>

              <h1 className="text-3xl font-bold mb-4">{formData.title || "（タイトルなし）"}</h1>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="h-5 w-5 text-[#4ecdc4]" />
                  <span>
                    {formData.date
                      ? new Date(formData.date).toLocaleDateString("ja-JP", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "（日付未設定）"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="h-5 w-5 text-[#ffd93d]" />
                  <span>{formData.time || "（時間未設定）"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="h-5 w-5 text-[#ff6b6b]" />
                  <span>{formData.location || "（場所未設定）"}</span>
                </div>
              </div>

              <div className="prose max-w-none mb-8">
                {formData.description ? (
                  formData.description.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-700">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-400">（説明文がありません）</p>
                )}
              </div>

              {formData.cautions && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-3 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                    注意事項
                  </h3>
                  <Alert variant="warning" className="bg-amber-50 border-amber-200">
                    <AlertTitle className="text-amber-800 font-medium">参加前にご確認ください</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc list-inside space-y-1 text-amber-700 mt-2">
                        {formData.cautions.split("\n").map((caution, index) => (
                          <li key={index}>{caution}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {formData.items.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-3">持ち物</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {formData.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center">
                    <Tag className="h-4 w-4 mr-2 text-[#4ecdc4]" />
                    参加費
                  </span>
                  <span className="font-medium">{formData.price || "（未設定）"}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600 flex items-center">
                    <Users className="h-4 w-4 mr-2 text-[#ff6b6b]" />
                    定員
                  </span>
                  <span className="font-medium">{formData.capacity || "（未設定）"}</span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => setIsPreviewOpen(false)}>閉じる</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Footer />
    </main>
  )
}
