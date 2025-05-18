"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Calendar, MapPin, Users, Clock, Tag, ChevronLeft, AlertTriangle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { LineButton } from "@/components/line-button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

// 必要なインポートを追加
import { AnalyticsTracker } from "@/components/analytics-tracker"

// イベントデータの型定義
interface EventData {
  id: string
  title: string
  date: string
  time: string
  location: string
  image: string
  description: string
  cautions: string // 注意事項フィールドを追加
  price: string
  capacity: string
  category: string
  items: string[]
  color: string
}

// サンプルイベントデータ
const eventsData: EventData[] = [
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
      "夏の暑い日に、代々木公園で楽しいBBQパーティーを開催します！美味しい食べ物、ドリンク、そして新しい友達との出会いが待っています。初めての方も大歓迎！スタッフが丁寧にサポートするので、お一人での参加も安心です。\n\n自然の中でリラックスしながら、素敵な夏の思い出を作りましょう。食材や飲み物は主催者側で用意しますので、手ぶらで参加できます。",
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
    date: "2025年8月5日",
    time: "18:30 - 21:30",
    location: "渋谷・カフェスペース",
    image: "/board-game-event.png",
    description:
      "様々なボードゲームを楽しむイベントです。初心者から上級者まで、誰でも参加できます。スタッフがルール説明をするので、ボードゲーム未経験の方も安心してご参加いただけます。\n\n人気のボードゲームから珍しいゲームまで、20種類以上のゲームを用意しています。新しい友達との出会いや、戦略的思考を楽しみながら素敵な夜を過ごしましょう。",
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
    date: "2025年10月31日",
    time: "19:00 - 23:00",
    location: "六本木・イベントホール",
    image: "/halloween-party.png",
    description:
      "今年のハロウィンは、TOTORASの特別パーティーで盛り上がりましょう！仮装コンテストやゲーム、DJによる音楽など、様々なエンターテイメントをご用意しています。\n\n最高の仮装には豪華賞品もあります！友達を誘って、または一人でも参加して、新しい出会いを楽しみましょう。ドレスコードは「ハロウィン」です。仮装での参加をお願いします。",
    cautions:
      "20歳未満の方は参加できません。当日は身分証明書をご持参ください。\n仮装は任意ですが、仮装コンテストに参加される方は事前にエントリーが必要です。",
    price: "5,500円（2ドリンク・軽食付き）",
    capacity: "100名",
    category: "その他",
    items: ["仮装衣装", "身分証明書（20歳以上）"],
    color: "#ffd93d",
  },
]

export default function EventPage({ params }: { params: { id: string } }) {
  // ページ読み込み時に画面上部にスクロール
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // URLのIDからイベントデータを取得
  const event = eventsData.find((event) => event.id === params.id)

  // イベントが見つからない場合は404ページを表示
  if (!event) {
    notFound()
  }

  // コンポーネントの return 文の先頭に以下を追加
  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="container px-4 mx-auto py-8 md:py-12">
        <AnalyticsTracker type="event" id={params.id} />
        <Link
          href="/events"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          すべてのイベントに戻る
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <article className="lg:col-span-2">
            <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-6">
              <Image
                src={event.image || "/placeholder.svg"}
                alt={event.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                priority
                fetchPriority="high"
              />
              <div className="absolute inset-0 opacity-30" style={{ backgroundColor: event.color }} />
              <div
                className="absolute top-4 right-4 px-3 py-1 rounded-full text-white text-sm font-medium"
                style={{ backgroundColor: event.color }}
              >
                {event.category}
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.title}</h1>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="h-5 w-5 text-[#4ecdc4]" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="h-5 w-5 text-[#ffd93d]" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="h-5 w-5 text-[#ff6b6b]" />
                <span>{event.location}</span>
              </div>
            </div>

            <div className="prose max-w-none mb-8">
              {event.description.split("\n\n").map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* 注意事項セクションを追加 */}
            {event.cautions && (
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-3 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                  注意事項
                </h3>
                <Alert variant="warning" className="bg-amber-50 border-amber-200">
                  <AlertTitle className="text-amber-800 font-medium">参加前にご確認ください</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1 text-amber-700 mt-2">
                      {event.cautions.split("\n").map((caution, index) => (
                        <li key={index}>{caution}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {event.items.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-3">持ち物</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {event.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </article>

          <div>
            <Card className="lg:sticky lg:top-24">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">イベント詳細</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600 flex items-center">
                      <Tag className="h-4 w-4 mr-2 text-[#4ecdc4]" />
                      参加費
                    </span>
                    <span className="font-medium">{event.price}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600 flex items-center">
                      <Users className="h-4 w-4 mr-2 text-[#ff6b6b]" />
                      定員
                    </span>
                    <span className="font-medium">{event.capacity}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-[#ffd93d]" />
                      開催日
                    </span>
                    <span className="font-medium">{event.date}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <LineButton className="w-full justify-center" eventId={event.id}>
                    LINEで申し込む
                  </LineButton>
                  <Button
                    className="w-full"
                    style={{ backgroundColor: event.color }}
                    onMouseOver={(e) => {
                      const target = e.currentTarget as HTMLButtonElement
                      target.style.backgroundColor = `${event.color}cc`
                    }}
                    onMouseOut={(e) => {
                      const target = e.currentTarget as HTMLButtonElement
                      target.style.backgroundColor = event.color
                    }}
                  >
                    詳細を問い合わせる
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium mb-2">このイベントをシェア</h4>
                  <div className="flex gap-2 justify-center sm:justify-start">
                    <Button variant="outline" size="icon" className="rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                      </svg>
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                      </svg>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
