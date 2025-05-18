"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Calendar,
  MapPin,
  Edit,
  Trash2,
  Plus,
  Search,
  AlertCircle,
  LogOut,
  FileText,
  MoreHorizontal,
  Copy,
  FileDown,
  BookOpen,
  ChevronLeft,
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// イベントデータの型定義
interface EventData {
  id: string
  title: string
  date: string
  time: string
  location: string
  image: string
  description: string
  price: string
  capacity: string
  category: string
  items: string[]
  color: string
}

// サンプルイベントデータ
const initialEventsData: EventData[] = [
  {
    id: "sauna-rental",
    title: "第7回 スゴイサウナ貸切",
    date: "2025年5月18日",
    time: "14:00 - 16:00",
    location: "スゴイサウナ赤坂店",
    image: "/sauna1.jpg",
    description:
      "毎月恒例！TOTORAS貸切サウナイベント！\n今回で7回目となります！\n「つながりとくつろぎと非日常」\n本来のサウナ施設では体験できない楽しみ方や貸切ならではの特別感、満足感のある時間を提供します！",
    cautions:
      "開始時間は14時です。それ以前の入館はできません。受付は14:20締切とします。それ以降の参加はできません。入館された方からシャワー浴びてお待ちください。\nサウナ室以外ではスマートフォンの持ち込みが可能です。水着は無料レンタルがあります。LサイズまたはXLサイズをお選びください。私物は自己管理をお願いします。防水ケースレンタルご希望の方はスタッフにお申し付けください。食べ物の持ち込みは禁止です。タトゥーや刺青がある方もラッシュガードなしでご利用いただけます。貸切終了後は、時間内に完全退店をお願いします。\n館内は完全禁煙です。施設前の路上喫煙もご遠慮ください。\nお車でお越しの際は、周辺の駐車場をご利用ください。無断駐車はご遠慮ください。",
    price: "2,500円（初回参加2,000円）",
    capacity: "20名",
    category: "サウナ",
    items: ["特に無し"],
    color: "#ff6b6b",
  },
  {
    id: "summer-bbq",
    title: "夏のBBQパーティー",
    date: "2025年7月20日",
    time: "12:00 - 16:00",
    location: "東京・代々木公園",
    image: "/placeholder-eduy5.png",
    description:
      "夏の暑い日に、代々木公園で楽しいBBQパーティーを開催します！美味しい食べ物、ドリンク、そして新しい友達との出会いが待っています。初めての方も大歓迎！スタッフが丁寧にサポートするので、お一人での参加も安心です。",
    price: "4,500円（食材・ドリンク込み）",
    capacity: "50名",
    category: "サウナ",
    items: ["動きやすい服装", "日焼け止め", "タオル", "雨天時は雨具"],
    color: "#ff6b6b",
  },
  {
    id: "board-game",
    title: "ボードゲーム大会",
    date: "2025年8月5日",
    time: "18:30 - 21:30",
    location: "渋谷・カフェスペース",
    image: "/board-game-event.png",
    description:
      "様々なボードゲームを楽しむイベントです。初心者から上級者まで、誰でも参加できます。スタッフがルール説明をするので、ボードゲーム未経験の方も安心してご参加いただけます。",
    price: "3,000円（1ドリンク・軽食付き）",
    capacity: "30名",
    category: "フットサル",
    items: [],
    color: "#4ecdc4",
  },
  {
    id: "halloween-party",
    title: "ハロウィンパーティー",
    date: "2025年10月31日",
    time: "19:00 - 23:00",
    location: "六本木・イベントホール",
    image: "/halloween-party.png",
    description:
      "今年のハロウィンは、TOTORASの特別パーティーで盛り上がりましょう！仮装コンテストやゲーム、DJによる音楽など、様々なエンターテイメントをご用意しています。",
    price: "5,500円（2ドリンク・軽食付き）",
    capacity: "100名",
    category: "その他",
    items: ["仮装衣装", "身分証明書（20歳以上）"],
    color: "#ffd93d",
  },
]

export default function AdminEventsPage() {
  // ページ読み込み時に画面上部にスクロール
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const router = useRouter()
  const [events, setEvents] = useState<EventData[]>(initialEventsData)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null)
  const [eventToDelete, setEventToDelete] = useState<string | null>(null)

  // イベント複製関数
  const duplicateEvent = (event: EventData) => {
    // 新しいIDを生成
    const newId = `${event.id}-copy-${Date.now()}`

    // イベントを複製（タイトルに「コピー」を追加）
    const duplicatedEvent: EventData = {
      ...event,
      id: newId,
      title: `${event.title}（コピー）`,
    }

    // イベントリストに追加
    setEvents([...events, duplicatedEvent])

    // 成功メッセージ
    alert(`「${event.title}」を複製しました。`)
  }

  // 検索フィルタリング
  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // イベントの削除
  const deleteEvent = (id: string) => {
    setEvents(events.filter((event) => event.id !== id))
    setEventToDelete(null)
  }

  // ログアウト処理
  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated")
    router.push("/admin/login")
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="bg-gray-50 py-8 md:py-12 border-b">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">イベント管理</h1>
            <Button
              variant="outline"
              className="flex items-center gap-2 text-gray-600 hover:text-red-600 hover:border-red-200"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              ログアウト
            </Button>
          </div>
          <p className="text-gray-600 max-w-2xl">イベントの追加、編集、削除を行うことができます。</p>
        </div>
      </div>

      <div className="container px-4 mx-auto py-8 md:py-12">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          ダッシュボードに戻る
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="w-full md:w-auto flex gap-4 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="イベントを検索..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Link href="/admin/events/drafts">
              <Button variant="outline" className="flex items-center gap-2">
                <FileDown className="h-4 w-4" />
                下書き一覧
              </Button>
            </Link>
            <Link href="/admin/reports">
              <Button variant="outline" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                レポート管理
              </Button>
            </Link>
            <Link href="/admin/templates">
              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                テンプレート管理
              </Button>
            </Link>
          </div>
          <Link href="/admin/events/edit/new">
            <Button className="bg-[#4ecdc4] hover:bg-[#4ecdc4]/90 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              新規イベント作成
            </Button>
          </Link>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <AlertCircle className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-bold mb-2">イベントが見つかりませんでした</h3>
            <p className="text-gray-600 mb-6">検索条件を変更するか、新しいイベントを作成してください。</p>
            <Link href="/admin/events/edit/new">
              <Button className="bg-[#4ecdc4] hover:bg-[#4ecdc4]/90">新規イベント作成</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden h-full flex flex-col">
                <div className="relative h-48">
                  <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                  <div className="absolute inset-0 opacity-30" style={{ backgroundColor: event.color }} />
                  <div
                    className="absolute top-3 right-3 px-3 py-1 rounded-full text-white text-xs font-medium"
                    style={{ backgroundColor: event.color }}
                  >
                    {event.category}
                  </div>
                </div>
                <CardContent className="p-5 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold mb-3">{event.title}</h3>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
                  <div className="mt-auto pt-4 flex gap-2">
                    <Link href={`/admin/events/edit/${event.id}`} className="flex-1">
                      <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                        <Edit className="h-4 w-4" />
                        編集
                      </Button>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex-1">
                          <MoreHorizontal className="h-4 w-4" />
                          その他
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => duplicateEvent(event)}>
                          <Copy className="h-4 w-4 mr-2" />
                          複製する
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-500 focus:text-red-500"
                          onClick={() => setEventToDelete(event.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          削除する
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
