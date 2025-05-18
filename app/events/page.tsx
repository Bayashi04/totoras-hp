"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, Filter, X, Check, AlertCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LineButton } from "@/components/line-button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { CategoryBadge } from "@/components/category-badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// イベントデータの型定義
interface EventData {
  id: string
  title: string
  date: string | Date
  time?: string
  location: string
  image: string
  description: string
  price?: string
  capacity?: number
  category: string
  items?: string[]
  color?: string
  published: boolean
}

export default function EventsPage() {
  // ページ読み込み時に画面上部にスクロール
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // イベントデータと状態
  const [events, setEvents] = useState<EventData[]>([])
  const [filteredEvents, setFilteredEvents] = useState<EventData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // フィルター状態
  const [filters, setFilters] = useState({
    categories: [] as string[],
    locations: [] as string[],
  })

  // 利用可能なカテゴリと場所のリスト
  const [categories, setCategories] = useState<string[]>([])
  const [locations, setLocations] = useState<string[]>([])

  // カテゴリごとの色マッピング
  const categoryColors: Record<string, string> = {
    サウナ: "#ff6b6b",
    フットサル: "#4ecdc4",
    アウトドア: "#ffd93d",
    料理: "#6c5ce7",
    その他: "#636e72",
  }

  // イベントデータをAPIから取得
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // APIからイベント一覧を取得
        const response = await fetch("/api/events?published=true", {
          method: "GET",
          headers: {
            "Cache-Control": "no-cache",
          },
        })

        if (!response.ok) {
          throw new Error("イベントの取得に失敗しました")
        }

        let data = await response.json()

        // 日付フォーマットの調整
        data = data.map((event: any) => ({
          ...event,
          date: new Date(event.date),
          // カテゴリに対応する色を設定（もしカスタム色がなければ）
          color: event.color || categoryColors[event.category] || "#4ecdc4",
        }))

        // 公開されているイベントのみをフィルタリング
        const publishedEvents = data.filter((event: EventData) => event.published)

        setEvents(publishedEvents)
        setFilteredEvents(publishedEvents)

        // カテゴリと場所のリスト取得
        const uniqueCategories = [...new Set(publishedEvents.map((event: EventData) => event.category))]
        const uniqueLocations = [...new Set(publishedEvents.map((event: EventData) => event.location))]
        setCategories(uniqueCategories)
        setLocations(uniqueLocations)
      } catch (error) {
        console.error("イベントデータ取得エラー:", error)
        setError("イベントデータの取得に失敗しました。再読み込みしてください。")

        // フォールバックとしてサンプルデータをロード
        const fallbackEvents = loadFallbackEvents()
        setEvents(fallbackEvents)
        setFilteredEvents(fallbackEvents)

        // サンプルデータからカテゴリと場所のリスト取得
        const uniqueCategories = [...new Set(fallbackEvents.map((event) => event.category))]
        const uniqueLocations = [...new Set(fallbackEvents.map((event) => event.location))]
        setCategories(uniqueCategories)
        setLocations(uniqueLocations)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // フィルターの適用
  useEffect(() => {
    let result = [...events]

    // カテゴリでフィルタリング
    if (filters.categories.length > 0) {
      result = result.filter((event) => filters.categories.includes(event.category))
    }

    // 場所でフィルタリング
    if (filters.locations.length > 0) {
      result = result.filter((event) => filters.locations.includes(event.location))
    }

    setFilteredEvents(result)
  }, [filters, events])

  // フィルターのリセット
  const resetFilters = () => {
    setFilters({
      categories: [],
      locations: [],
    })
  }

  // カテゴリフィルターの切り替え
  const toggleCategoryFilter = (category: string) => {
    setFilters((prev) => {
      if (prev.categories.includes(category)) {
        return {
          ...prev,
          categories: prev.categories.filter((c) => c !== category),
        }
      } else {
        return {
          ...prev,
          categories: [...prev.categories, category],
        }
      }
    })
  }

  // 場所フィルターの切り替え
  const toggleLocationFilter = (location: string) => {
    setFilters((prev) => {
      if (prev.locations.includes(location)) {
        return {
          ...prev,
          locations: prev.locations.filter((l) => l !== location),
        }
      } else {
        return {
          ...prev,
          locations: [...prev.locations, location],
        }
      }
    })
  }

  // 日付フォーマット
  const formatDate = (dateValue: Date | string): string => {
    const date = new Date(dateValue)
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // フォールバック用のサンプルデータ
  const loadFallbackEvents = (): EventData[] => {
    return [
      {
        id: "summer-bbq",
        title: "夏のBBQパーティー",
        date: "2025-07-20",
        time: "12:00 - 16:00",
        location: "東京・代々木公園",
        image: "/placeholder-eduy5.png",
        description:
          "夏の暑い日に、代々木公園で楽しいBBQパーティーを開催します！美味しい食べ物、ドリンク、そして新しい友達との出会いが待っています。初めての方も大歓迎！スタッフが丁寧にサポートするので、お一人での参加も安心です。",
        price: "4,500円（食材・ドリンク込み）",
        capacity: 50,
        category: "サウナ",
        items: ["動きやすい服装", "日焼け止め", "タオル", "雨天時は雨具"],
        color: "#ff6b6b",
        published: true,
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
        price: "3,000円（1ドリンク・軽食付き）",
        capacity: 30,
        category: "フットサル",
        items: [],
        color: "#4ecdc4",
        published: true,
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
        price: "5,500円（2ドリンク・軽食付き）",
        capacity: 100,
        category: "その他",
        items: ["仮装衣装", "身分証明書（20歳以上）"],
        color: "#ffd93d",
        published: true,
      },
    ]
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="bg-gray-50 py-8 md:py-12 border-b">
        <div className="container px-4 mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">イベント一覧</h1>
          <p className="text-gray-600 text-center max-w-2xl mx-auto">
            TOTORASが主催する様々なイベントをご紹介します。 新しい出会いと素敵な思い出を作るチャンスをお見逃しなく！
          </p>
        </div>
      </div>

      <div className="container px-4 mx-auto py-8 md:py-12">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>エラー</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold">開催予定のイベント</h2>
            <p className="text-gray-600">全 {filteredEvents.length} 件のイベントが見つかりました</p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                aria-label={`フィルター ${filters.categories.length > 0 || filters.locations.length > 0 ? "適用中" : ""}`}
              >
                <Filter className="h-4 w-4" />
                フィルター
                {(filters.categories.length > 0 || filters.locations.length > 0) && (
                  <span className="bg-[#4ecdc4] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {filters.categories.length + filters.locations.length}
                  </span>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>イベントフィルター</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <h3 className="font-medium mb-2 flex items-center">
                    <span className="w-1 h-4 bg-[#ff6b6b] rounded-full mr-2"></span>
                    カテゴリ
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={filters.categories.includes(category)}
                          onCheckedChange={() => toggleCategoryFilter(category)}
                        />
                        <Label htmlFor={`category-${category}`}>{category}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2 flex items-center">
                    <span className="w-1 h-4 bg-[#4ecdc4] rounded-full mr-2"></span>
                    開催場所
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {locations.map((location) => (
                      <div key={location} className="flex items-center space-x-2">
                        <Checkbox
                          id={`location-${location}`}
                          checked={filters.locations.includes(location)}
                          onCheckedChange={() => toggleLocationFilter(location)}
                        />
                        <Label htmlFor={`location-${location}`}>{location}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={resetFilters} className="flex items-center gap-1">
                  <X className="h-4 w-4" />
                  リセット
                </Button>
                <DialogClose asChild>
                  <Button className="bg-[#4ecdc4] hover:bg-[#4ecdc4]/90 flex items-center gap-1">
                    <Check className="h-4 w-4" />
                    適用する
                  </Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4ecdc4]"></div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-bold mb-2">該当するイベントが見つかりませんでした</h3>
            <p className="text-gray-600 mb-6">検索条件を変更して、再度お試しください。</p>
            <Button onClick={resetFilters} variant="outline">
              フィルターをリセット
            </Button>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            role="list"
            aria-label="イベント一覧"
          >
            {filteredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden h-full flex flex-col" role="listitem">
                <div className="relative h-48">
                  <Image
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    fill
                    className="object-cover"
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{ backgroundColor: event.color || categoryColors[event.category] || "#4ecdc4" }}
                  />
                  <div className="absolute top-3 right-3">
                    <CategoryBadge category={event.category} />
                  </div>
                </div>
                <CardContent className="p-5 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold mb-3">{event.title}</h3>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
                  <div className="mt-auto pt-4 flex flex-col xs:flex-row gap-2">
                    <Link href={`/events/${event.id}`} className="flex-1">
                      <Button
                        className="w-full"
                        style={{
                          backgroundColor: event.color || categoryColors[event.category] || "#4ecdc4",
                        }}
                        onMouseOver={(e) => {
                          const target = e.currentTarget as HTMLButtonElement
                          const color = event.color || categoryColors[event.category] || "#4ecdc4"
                          target.style.backgroundColor = `${color}cc`
                        }}
                        onMouseOut={(e) => {
                          const target = e.currentTarget as HTMLButtonElement
                          const color = event.color || categoryColors[event.category] || "#4ecdc4"
                          target.style.backgroundColor = color
                        }}
                      >
                        詳細を見る
                      </Button>
                    </Link>
                    <LineButton className="flex-1" eventId={event.id}>
                      申し込む
                    </LineButton>
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
