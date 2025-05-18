"use client"

import { useState, useEffect, useCallback } from "react"
import { CategoryCard } from "@/components/category-card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

const categories = [
  {
    category: "サウナ",
    description: "サウナ好きが集まり、様々なサウナ施設を巡るイベントです。",
    image: "/relaxing-sauna.png",
    link: "/event-details?category=sauna",
  },
  {
    category: "フットサル",
    description: "経験や技術レベルを問わず、フットサルを楽しむイベントです。",
    image: "/indoor-futsal-game.png",
    link: "/event-details?category=futsal",
  },
  {
    category: "その他",
    description: "アウトドア活動やボードゲーム会など、様々なイベントを開催しています。",
    image: "/diverse-outdoor-activities.png",
    link: "/event-details?category=others",
  },
]

export function CategoryCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [api, setApi] = useState<any>(null)

  // ドットをクリックしたときの処理
  const handleDotClick = useCallback(
    (index: number) => {
      if (api) {
        api.scrollTo(index)
      }
    },
    [api],
  )

  // スライド変更時の処理
  useEffect(() => {
    if (!api) return

    const onSelect = () => {
      setActiveIndex(api.selectedScrollSnap())
    }

    api.on("select", onSelect)
    // 初期状態でも呼び出す
    onSelect()

    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  return (
    <div className="relative px-4 py-12">
      <h2 className="mb-8 text-center text-3xl font-bold">主なイベント</h2>

      <Carousel
        setApi={setApi}
        opts={{
          align: "center",
          loop: true,
        }}
        className="mx-auto max-w-5xl"
      >
        <CarouselContent>
          {categories.map((category, index) => (
            <CarouselItem key={index} className="md:basis-full">
              <CategoryCard
                category={category.category}
                description={category.description}
                image={category.image}
                link={category.link}
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>

      <div className="mt-6 flex justify-center gap-2">
        {categories.map((_, index) => (
          <button
            key={index}
            className={`h-3 w-3 rounded-full transition-colors ${activeIndex === index ? "bg-primary" : "bg-gray-300"}`}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
