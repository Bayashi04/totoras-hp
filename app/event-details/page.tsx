"use client"

import { useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Calendar, MapPin, Users, Clock, Flame, ClubIcon as Football, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineButton } from "@/components/line-button"

export default function EventDetailsPage() {
  const searchParams = useSearchParams()
  const category = searchParams.get("category") || "sauna"

  const saunaRef = useRef<HTMLDivElement>(null)
  const futsalRef = useRef<HTMLDivElement>(null)
  const othersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // スクロール位置を制御
    const scrollToCategory = () => {
      if (category === "sauna" && saunaRef.current) {
        saunaRef.current.scrollIntoView({ behavior: "smooth" })
      } else if (category === "futsal" && futsalRef.current) {
        futsalRef.current.scrollIntoView({ behavior: "smooth" })
      } else if (category === "others" && othersRef.current) {
        othersRef.current.scrollIntoView({ behavior: "smooth" })
      }
    }

    // ページロード後に少し遅延させてスクロール
    const timer = setTimeout(() => {
      scrollToCategory()
    }, 300)

    return () => clearTimeout(timer)
  }, [category])

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-center text-4xl font-bold">イベント内容</h1>

      <Tabs defaultValue={category} className="mb-12">
        <TabsList className="mx-auto grid w-full max-w-md grid-cols-3">
          <TabsTrigger
            value="sauna"
            onClick={() => window.history.pushState(null, "", "/event-details?category=sauna")}
          >
            <Flame className="mr-2 h-4 w-4" />
            サウナ
          </TabsTrigger>
          <TabsTrigger
            value="futsal"
            onClick={() => window.history.pushState(null, "", "/event-details?category=futsal")}
          >
            <Football className="mr-2 h-4 w-4" />
            フットサル
          </TabsTrigger>
          <TabsTrigger
            value="others"
            onClick={() => window.history.pushState(null, "", "/event-details?category=others")}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            その他
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* サウナセクション */}
      <section ref={saunaRef} id="sauna" className="mb-20 scroll-mt-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-8 flex items-center">
            <Flame className="mr-3 h-8 w-8 text-red-500" />
            <h2 className="text-3xl font-bold">サウナイベント</h2>
          </div>

          <div className="mb-10 grid gap-8 md:grid-cols-2">
            <div className="relative h-[400px] overflow-hidden rounded-xl">
              <Image src="/relaxing-sauna.png" alt="サウナイベント" fill className="object-cover" />
            </div>

            <div className="flex flex-col justify-center">
              <h3 className="mb-4 text-2xl font-semibold">サウナでリラックス＆交流</h3>
              <p className="mb-6 text-gray-700">
                サウナ好きが集まり、様々なサウナ施設を巡るイベントです。サウナの後は、参加者同士で交流会を行い、サウナの魅力や体験を共有します。初心者から上級者まで、サウナに興味がある方なら誰でも参加できます。
              </p>

              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-gray-500" />
                  <span>月1回開催</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-gray-500" />
                  <span>3-4時間程度</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-gray-500" />
                  <span>東京都内各所</span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-gray-500" />
                  <span>5-15名程度</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="/events">
                  <Button>
                    次回のイベントを見る
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <LineButton />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="mb-4 text-2xl font-semibold">サウナイベントの特徴</h3>
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <h4 className="mb-2 text-xl font-medium">様々なサウナ施設</h4>
                  <p className="text-gray-600">毎回異なるサウナ施設を訪れ、様々なタイプのサウナを体験できます。</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h4 className="mb-2 text-xl font-medium">交流会</h4>
                  <p className="text-gray-600">
                    サウナ後の交流会で、参加者同士の親睦を深め、サウナの体験を共有します。
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h4 className="mb-2 text-xl font-medium">初心者歓迎</h4>
                  <p className="text-gray-600">サウナ初心者も安心して参加できるよう、経験者がサポートします。</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </section>

      {/* フットサルセクション */}
      <section ref={futsalRef} id="futsal" className="mb-20 scroll-mt-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-8 flex items-center">
            <Football className="mr-3 h-8 w-8 text-teal-500" />
            <h2 className="text-3xl font-bold">フットサルイベント</h2>
          </div>

          <div className="mb-10 grid gap-8 md:grid-cols-2">
            <div className="relative h-[400px] overflow-hidden rounded-xl">
              <Image src="/indoor-futsal-game.png" alt="フットサルイベント" fill className="object-cover" />
            </div>

            <div className="flex flex-col justify-center">
              <h3 className="mb-4 text-2xl font-semibold">みんなで楽しむフットサル</h3>
              <p className="mb-6 text-gray-700">
                経験や技術レベルを問わず、フットサルを楽しむイベントです。チーム分けをして試合を行い、運動不足解消と交流を図ります。初心者から経験者まで、誰でも気軽に参加できる雰囲気づくりを心がけています。
              </p>

              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-gray-500" />
                  <span>月2回開催</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-gray-500" />
                  <span>2時間程度</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-gray-500" />
                  <span>東京都内フットサル施設</span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-gray-500" />
                  <span>10-20名程度</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="/events">
                  <Button>
                    次回のイベントを見る
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <LineButton />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="mb-4 text-2xl font-semibold">フットサルイベントの特徴</h3>
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <h4 className="mb-2 text-xl font-medium">レベル分け</h4>
                  <p className="text-gray-600">
                    参加者のレベルに合わせてチーム分けを行い、誰もが楽しめる環境を作ります。
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h4 className="mb-2 text-xl font-medium">交流試合</h4>
                  <p className="text-gray-600">試合形式で楽しみながら、参加者同士の交流を深めることができます。</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h4 className="mb-2 text-xl font-medium">運動不足解消</h4>
                  <p className="text-gray-600">楽しく体を動かすことで、運動不足解消と健康増進につながります。</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </section>

      {/* その他セクション */}
      <section ref={othersRef} id="others" className="mb-20 scroll-mt-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-8 flex items-center">
            <Sparkles className="mr-3 h-8 w-8 text-yellow-500" />
            <h2 className="text-3xl font-bold">その他のイベント</h2>
          </div>

          <div className="mb-10 grid gap-8 md:grid-cols-2">
            <div className="relative h-[400px] overflow-hidden rounded-xl">
              <Image src="/diverse-outdoor-activities.png" alt="その他のイベント" fill className="object-cover" />
            </div>

            <div className="flex flex-col justify-center">
              <h3 className="mb-4 text-2xl font-semibold">多彩なアクティビティ</h3>
              <p className="mb-6 text-gray-700">
                アウトドア活動やボードゲーム会など、様々なイベントを開催しています。季節に合わせたアクティビティや、室内で楽しめるゲーム会など、多彩なイベントを通じて新しい体験と出会いの場を提供します。
              </p>

              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-gray-500" />
                  <span>不定期開催</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-gray-500" />
                  <span>イベントにより異なる</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-gray-500" />
                  <span>東京都内各所</span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-gray-500" />
                  <span>5-30名程度</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="/events">
                  <Button>
                    次回のイベントを見る
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <LineButton />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="mb-4 text-2xl font-semibold">その他のイベントの特徴</h3>
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <h4 className="mb-2 text-xl font-medium">アウトドア活動</h4>
                  <p className="text-gray-600">
                    ハイキングやキャンプなど、自然の中で楽しむアクティビティを開催しています。
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h4 className="mb-2 text-xl font-medium">ボードゲーム会</h4>
                  <p className="text-gray-600">
                    様々なボードゲームを通じて、戦略的思考と交流を楽しむイベントを開催しています。
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h4 className="mb-2 text-xl font-medium">季節イベント</h4>
                  <p className="text-gray-600">
                    花見や紅葉狩り、クリスマスパーティーなど、季節に合わせたイベントを開催しています。
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </section>

      <div className="mt-12 text-center">
        <h3 className="mb-6 text-2xl font-semibold">イベントに参加してみませんか？</h3>
        <p className="mb-8 mx-auto max-w-2xl text-gray-700">
          Totorasのイベントは、新しい友達との出会いや、新しい体験を提供します。興味のあるイベントがあれば、ぜひ参加してみてください。LINE公式アカウントでは、最新のイベント情報をお知らせしています。
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/events">
            <Button size="lg">
              次回のイベントを見る
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <LineButton size="lg" />
        </div>
      </div>
    </div>
  )
}
