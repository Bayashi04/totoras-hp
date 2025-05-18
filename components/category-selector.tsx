"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getCategoryIcon } from "@/lib/category-icons"
import { getCategoryColorClasses } from "@/lib/category-colors"

interface CategorySelectorProps {
  value: string
  onValueChange: (value: string) => void
  categories: string[]
}

export function CategorySelector({ value, onValueChange, categories }: CategorySelectorProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {value ? (
            <div className="flex items-center">
              {(() => {
                const CategoryIcon = getCategoryIcon(value)
                const colors = getCategoryColorClasses(value)
                return (
                  <>
                    <CategoryIcon className={`mr-2 h-4 w-4 ${colors.text}`} />
                    <span>{value}</span>
                  </>
                )
              })()}
            </div>
          ) : (
            "カテゴリーを選択"
          )}
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
            className="ml-2 h-4 w-4 shrink-0 opacity-50"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="カテゴリーを検索..." />
          <CommandList>
            <CommandEmpty>カテゴリーが見つかりません</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {categories.map((category) => {
                const CategoryIcon = getCategoryIcon(category)
                const colors = getCategoryColorClasses(category)
                return (
                  <CommandItem
                    key={category}
                    value={category}
                    onSelect={(currentValue) => {
                      onValueChange(currentValue)
                      setOpen(false)
                    }}
                  >
                    <CategoryIcon className={`mr-2 h-4 w-4 ${colors.text}`} />
                    {category}
                    <Check className={`ml-auto h-4 w-4 ${value === category ? "opacity-100" : "opacity-0"}`} />
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
