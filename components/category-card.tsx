"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { getCategoryIcon } from "@/lib/category-icons"
import { getCategoryColor } from "@/lib/category-colors"

interface CategoryCardProps {
  category: string
  description: string
  image: string
  link: string
}

export function CategoryCard({ category, description, image, link }: CategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const CategoryIcon = getCategoryIcon(category)
  const color = getCategoryColor(category)

  // カテゴリーIDをURLパラメータ用に変換
  const getCategoryParam = () => {
    if (category === "サウナ") return "sauna"
    if (category === "フットサル") return "futsal"
    return "others"
  }

  return (
    <motion.div
      className="relative h-[400px] w-full overflow-hidden rounded-xl shadow-lg"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 z-0">
        <Image
          src={image || "/placeholder.svg"}
          alt={category}
          fill
          className="object-cover transition-transform duration-700"
          style={{
            transform: isHovered ? "scale(1.1)" : "scale(1)",
          }}
        />
        <div className="absolute inset-0 opacity-60" style={{ backgroundColor: color }} />
      </div>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center text-white">
        <CategoryIcon className="mb-4 h-16 w-16" />
        <h3 className="mb-3 text-3xl font-bold">{category}</h3>
        <p className="mb-6 max-w-xs text-lg">{description}</p>
        <Link href={`/event-details?category=${getCategoryParam()}`}>
          <Button size="lg" className="bg-white font-medium text-gray-900 hover:bg-white/90">
            詳細を見る
          </Button>
        </Link>
      </div>
    </motion.div>
  )
}
