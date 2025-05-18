import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface BlogPostProps {
  title: string
  date: string
  excerpt: string
  image: string
  color: string
  id: string // IDを追加
}

export function BlogPost({ title, date, excerpt, image, color, id }: BlogPostProps) {
  return (
    <Card className="overflow-hidden border-gray-200 hover:border-gray-300 transition-all duration-300 group">
      <div className="relative h-48 md:h-56 rounded-t-lg overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFdgJCIiZU4AAAAABJRU5ErkJggg=="
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <CardContent className="p-6">
        <div className="text-sm text-gray-500 mb-2">{date}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{excerpt}</p>
        <div className="mt-4">
          <Link
            href={`/reports/${id}`}
            className={`inline-flex items-center font-medium group`}
            aria-label={`${title}の詳細を見る`}
            style={{ color }}
          >
            続きを読む
            <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
