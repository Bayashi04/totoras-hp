"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getCategoryIcon } from "@/lib/category-icons"

interface EventCardProps {
  title: string
  date: string
  location: string
  image: string
  color: string
  id: string
  category: string
  sizes?: string
}

export function EventCard({
  title,
  date,
  location,
  image,
  color,
  id,
  category,
  sizes = "(max-width: 768px) 100vw, 33vw",
}: EventCardProps) {
  // カテゴリーアイコンを取得
  const CategoryIcon = getCategoryIcon(category)

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg h-full">
      <div className="relative h-40 sm:h-48 group">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes={sizes}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFdgJCIiZU4AAAAABJRU5ErkJggg=="
        />
        <div className="absolute inset-0 opacity-30" style={{ backgroundColor: color }} />

        {/* カテゴリーバッジを追加 */}
        <div className="absolute top-3 right-3">
          <Badge
            className="flex items-center gap-1 px-2 py-1"
            style={{
              backgroundColor: `${color}`,
              color: "white",
            }}
          >
            <CategoryIcon className="h-3.5 w-3.5" />
            <span>{category}</span>
          </Badge>
        </div>
      </div>
      <CardContent className="p-5">
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <Calendar className="h-4 w-4" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>
        <Link href={`/events/${id}`}>
          <Button
            className="w-full"
            style={
              {
                backgroundColor: color,
                "--hover-color": `${color}e6`,
              } as React.CSSProperties
            }
            onMouseOver={(e) => {
              const target = e.currentTarget as HTMLButtonElement
              target.style.backgroundColor = `${color}e6`
            }}
            onMouseOut={(e) => {
              const target = e.currentTarget as HTMLButtonElement
              target.style.backgroundColor = color
            }}
          >
            詳細を見る
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
