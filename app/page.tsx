"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { Calendar, MapPin, Users, ArrowRight, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BlogPost } from "@/components/blog-post"
import { EventCard } from "@/components/event-card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { TOTORASLogo } from "@/components/totoras-logo"
import { LineButton } from "@/components/line-button"
import { CategoryCarousel } from "@/components/category-carousel"
import Link from "next/link"

// アニメーション付きのセクションコンポーネント
function AnimatedSection({ children, className = "", delay = 0, id = "" }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" })

  return (
    <section ref={ref} className={className} id={id}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{
          duration: 0.5,
          delay: delay,
          ease: "easeOut",
        }}
      >
        {children}
      </motion.div>
    </section>
  )
}

export default function Home() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // ローディングアニメーションを表示するための遅延
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // ページ読み込み時に画面上部にスクロール（ローディング後）
  useEffect(() => {
    if (!loading) {
      window.scrollTo(0, 0)
    }
  }, [loading])

  return (
    <main className="min-h-screen bg-white">
      <AnimatePresence>
        {loading ? (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-white z-50"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ scale: 0.5, y: 100 }}
              animate={{
                scale: [0.5, 1.2, 1],
                y: [100, -30, 0],
              }}
              transition={{
                duration: 1.2,
                ease: "easeOut",
              }}
            >
              <Image src="/images/logo.png" alt="TOTORAS Logo" width={200} height={200} priority />
            </motion.div>
          </motion.div>
        ) : (
          <>
            <Header />

            {/* ヒーローセクション */}
            <AnimatedSection className="relative py-12 md:py-20 overflow-hidden" id="home">
              <div className="absolute inset-0 z-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#ff6b6b]/30 via-[#4ecdc4]/30 to-[#ffd93d]/30" />
              </div>
              <div className="container px-4 mx-auto relative z-10">
                <div className="flex flex-col items-center text-center mb-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6"
                  >
                    <Image
                      src="/images/logo.png"
                      alt="TOTORAS Logo"
                      width={150}
                      height={150}
                      priority
                      sizes="(max-width: 768px) 100px, 150px"
                    />
                  </motion.div>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-6"
                  >
                    <TOTORASLogo size="xl" />
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-xl md:text-2xl text-gray-700 max-w-2xl mb-8"
                  >
                    若い世代のための楽しいイベントコミュニティ。 新しい出会いと素敵な思い出を作りましょう！
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col gap-4 items-center justify-center"
                  >
                    <Link href="/events">
                      <Button size="lg" className="bg-[#ff6b6b] hover:bg-[#ff6b6b]/90 text-white w-[240px]">
                        イベントに参加する <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <LineButton size="lg" className="w-[240px] whitespace-nowrap">
                      LINE公式アカウント
                    </LineButton>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8"
                >
                  <Card className="border-[#ff6b6b]/20 hover:border-[#ff6b6b] transition-colors">
                    <CardContent className="p-4 flex items-center">
                      <Users className="h-10 w-10 text-[#ff6b6b] mr-4 flex-shrink-0" />
                      <div className="text-left">
                        <h3 className="text-lg font-bold">つながりを作る</h3>
                        <p className="text-gray-600 text-sm">新しい友達と出会い、コミュニティの一員に</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-[#4ecdc4]/20 hover:border-[#4ecdc4] transition-colors">
                    <CardContent className="p-4 flex items-center">
                      <Calendar className="h-10 w-10 text-[#4ecdc4] mr-4 flex-shrink-0" />
                      <div className="text-left">
                        <h3 className="text-lg font-bold">楽しいイベント</h3>
                        <p className="text-gray-600 text-sm">定期的な様々なイベントで新しい体験を</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-[#ffd93d]/20 hover:border-[#ffd93d] transition-colors">
                    <CardContent className="p-4 flex items-center">
                      <MapPin className="h-10 w-10 text-[#ffd93d] mr-4 flex-shrink-0" />
                      <div className="text-left">
                        <h3 className="text-lg font-bold">様々な場所で</h3>
                        <p className="text-gray-600 text-sm">オンラインとオフライン、多様な開催場所</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </AnimatedSection>

            {/* イベントカテゴリーカルーセル */}
            <AnimatedSection className="py-16 bg-gray-50" delay={0.1} id="event-categories">
              <CategoryCarousel />
            </AnimatedSection>

            {/* 次回イベントセクション */}
            <AnimatedSection className="py-20" delay={0.2} id="events">
              <div className="container px-4 mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">次回のイベント</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    TOTORASが主催する次回のイベント情報をチェックしましょう。 参加登録はお早めに！
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  <EventCard
                    title="夏のBBQパーティー"
                    date="2025年7月20日"
                    location="東京・代々木公園"
                    image="/placeholder-eduy5.png"
                    color="#ff6b6b"
                    id="summer-bbq"
                    category="アウトドア"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <EventCard
                    title="ボードゲーム大会"
                    date="2025年8月5日"
                    location="渋谷・カフェスペース"
                    image="/board-game-event.png"
                    color="#4ecdc4"
                    id="board-game"
                    category="ゲーム"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <EventCard
                    title="ハロウィンパーティー"
                    date="2025年10月31日"
                    location="六本木・イベントホール"
                    image="/halloween-party.png"
                    color="#ffd93d"
                    id="halloween-party"
                    category="交流会"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                <div className="text-center mt-10">
                  <Link href="/events">
                    <Button variant="outline" size="lg">
                      すべてのイベントを見る
                    </Button>
                  </Link>
                </div>
              </div>
            </AnimatedSection>

            {/* イベントレポートセクション */}
            <AnimatedSection className="py-20 bg-gray-50" delay={0.3} id="upcoming">
              <div className="container px-4 mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">イベントレポート</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    過去のイベントの様子をご紹介します。
                    TOTORASのイベントがどんな雰囲気か知りたい方はぜひチェックしてください！
                  </p>
                </div>

                {/* BlogPostコンポーネントにリンクを追加します */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                  <BlogPost
                    title="春の花見イベントレポート"
                    date="2025年4月10日"
                    excerpt="桜満開の中、50名以上の参加者と共に素敵な時間を過ごしました。写真と共にイベントの様子をお届けします。"
                    image="/placeholder-e0lj7.png"
                    color="#ff6b6b" // サウナカテゴリーの色（レッド）
                    id="spring-hanami" // 正しいIDを指定
                  />
                  <BlogPost
                    title="クッキング教室イベント大成功！"
                    date="2025年3月15日"
                    excerpt="プロのシェフを招いて行われたクッキング教室。参加者全員が美味しい料理を作ることができました。"
                    image="/placeholder-x5sne.png"
                    color="#4ecdc4" // フットサルカテゴリーの色（ティール）
                    id="report-2" // 正しいIDを指定
                  />
                </div>

                <div className="text-center mt-10">
                  <Link href="/reports">
                    <Button
                      variant="outline"
                      size="lg"
                      className="flex items-center gap-2 w-full sm:w-auto justify-center"
                    >
                      <BookOpen className="h-4 w-4" />
                      すべてのレポートを読む
                    </Button>
                  </Link>
                </div>
              </div>
            </AnimatedSection>

            {/* コミュニティセクション */}
            <AnimatedSection
              className="py-20 bg-gradient-to-r from-[#ff6b6b]/10 via-[#4ecdc4]/10 to-[#ffd93d]/10"
              delay={0.4}
              id="all-events"
            >
              <div className="container px-4 mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                  <div className="md:w-1/2">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">コミュニティに参加しよう</h2>
                    <p className="text-gray-700 mb-6">
                      TOTORASは単なるイベント団体ではなく、温かいコミュニティです。
                      イベントを通じて新しい友達を作り、一緒に素敵な思い出を作りましょう。
                      SNSでも日々情報を発信していますので、ぜひフォローしてください！
                    </p>
                    <div className="flex gap-4">
                      <Button className="bg-[#ff6b6b] hover:bg-[#ff6b6b]/90">参加する</Button>
                      <Button variant="outline">詳細を見る</Button>
                    </div>
                  </div>
                  <div className="md:w-1/2">
                    <Image
                      src="/placeholder-i7cfn.png"
                      alt="TOTORASコミュニティ"
                      width={600}
                      height={400}
                      className="rounded-lg shadow-lg"
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 600px"
                    />
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <Footer />
          </>
        )}
      </AnimatePresence>
    </main>
  )
}
