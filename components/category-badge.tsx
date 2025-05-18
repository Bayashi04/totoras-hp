"use client"

import { Badge } from "@/components/ui/badge"
import { getCategoryIcon } from "@/lib/category-icons"
import { getCategoryColorClasses } from "@/lib/category-colors"

interface CategoryBadgeProps {
  category: string
  size?: "sm" | "md" | "lg"
  onClick?: () => void
}

export function CategoryBadge({ category, size = "md", onClick }: CategoryBadgeProps) {
  const CategoryIcon = getCategoryIcon(category)
  const colors = getCategoryColorClasses(category)

  const sizeClasses = {
    sm: "text-xs py-0.5 px-1.5",
    md: "text-sm py-1 px-2",
    lg: "text-base py-1.5 px-3",
  }

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
    lg: "h-4 w-4",
  }

  return (
    <Badge
      className={`flex items-center gap-1 ${colors.bg} ${colors.text} hover:bg-opacity-20 cursor-pointer ${sizeClasses[size]} ${onClick ? "cursor-pointer" : "cursor-default"}`}
      onClick={onClick}
    >
      <CategoryIcon className={`${iconSizes[size]} mr-0.5`} />
      <span>{category}</span>
    </Badge>
  )
}
