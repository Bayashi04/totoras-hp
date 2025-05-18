import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { QuoteIcon } from "lucide-react"

interface TestimonialProps {
  quote: string
  name: string
  event: string
  image?: string
}

function Testimonial({ quote, name, event, image }: TestimonialProps) {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <QuoteIcon className="h-8 w-8 text-[#4ecdc4] mb-4 opacity-50" />
        <p className="text-gray-700 mb-6 italic">{quote}</p>
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-4 flex-shrink-0">
            <Image
              src={image || "/placeholder.svg?height=48&width=48&query=person"}
              alt={name}
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-sm text-gray-500">{event}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function Testimonials() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Testimonial
        quote="初めて参加しましたが、スタッフの方々の温かい対応で緊張せずに楽しめました。次回も絶対参加します！"
        name="田中 美咲"
        event="夏のBBQパーティー"
        image="/diverse-woman-smiling.png"
      />
      <Testimonial
        quote="ボードゲーム大会では新しい友達ができて、とても充実した時間を過ごせました。運営の皆さんありがとう！"
        name="佐藤 健太"
        event="ボードゲーム大会"
        image="/smiling-man.png"
      />
      <Testimonial
        quote="ハロウィンパーティーの仮装コンテストが最高に楽しかったです！みんなの個性的な衣装に驚きました。"
        name="山本 由美"
        event="ハロウィンパーティー"
        image="/woman-in-vibrant-costume.png"
      />
    </div>
  )
}
