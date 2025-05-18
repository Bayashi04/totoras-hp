"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"
import Image from "next/image"
import { toast } from "@/components/ui/use-toast"

interface ImageData {
  id: string
  url: string
  name: string
  size: number
  uploadedAt?: string
  contentType?: string
}

interface ServerImageSelectorProps {
  onImageSelect: (imageUrl: string) => void
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  selectedImage?: string | null
}

export function ServerImageSelector({ onImageSelect, isOpen, setIsOpen, selectedImage }: ServerImageSelectorProps) {
  const [images, setImages] = useState<ImageData[]>([])
  const [filteredImages, setFilteredImages] = useState<ImageData[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 画像を取得
  const fetchImages = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // 実際の環境では、サーバーから画像リストを取得するAPIを呼び出す
      // ここではダミーデータを使用
      const dummyImages: ImageData[] = [
        {
          id: "1",
          url: "https://line.totoras.jp/images/event1.jpg",
          name: "event1.jpg",
          size: 102400,
        },
        {
          id: "2",
          url: "https://line.totoras.jp/images/event2.jpg",
          name: "event2.jpg",
          size: 153600,
        },
        {
          id: "3",
          url: "https://line.totoras.jp/images/event3.jpg",
          name: "event3.jpg",
          size: 204800,
        },
        {
          id: "4",
          url: "https://line.totoras.jp/images/sauna1.jpg",
          name: "sauna1.jpg",
          size: 204800,
        },
        {
          id: "5",
          url: "https://line.totoras.jp/images/futsal1.jpg",
          name: "futsal1.jpg",
          size: 307200,
        },
        {
          id: "6",
          url: "https://line.totoras.jp/images/workshop1.jpg",
          name: "workshop1.jpg",
          size: 409600,
        },
      ]

      setImages(dummyImages)
      setFilteredImages(dummyImages)
    } catch (error) {
      console.error("画像取得エラー:", error)
      setError("画像の読み込みに失敗しました。再試行してください。")
      toast({
        title: "エラー",
        description: "画像の読み込みに失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // ダイアログが開かれたときに画像を取得
  useEffect(() => {
    if (isOpen) {
      fetchImages()
    }
  }, [isOpen])

  // 検索クエリが変更されたときにフィルタリング
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredImages(images)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = images.filter((image) => image.name.toLowerCase().includes(query))
      setFilteredImages(filtered)
    }
  }, [searchQuery, images])

  // 画像を選択
  const handleSelectImage = (image: ImageData) => {
    onImageSelect(image.url)
    setIsOpen(false)
    toast({
      title: "画像を選択しました",
      description: image.name,
    })
  }

  // 人間が読める形式のサイズ表示
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>サーバー上の画像から選択</DialogTitle>
        </DialogHeader>

        <div className="my-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="ファイル名で検索..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">画像を読み込み中...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <Button onClick={fetchImages} className="mt-4">
              再試行
            </Button>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">画像が見つかりません</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className={`border rounded-md overflow-hidden cursor-pointer transition-all hover:scale-[1.02] ${
                  selectedImage === image.url ? "ring-2 ring-[#4ecdc4] ring-offset-2" : ""
                }`}
                onClick={() => handleSelectImage(image)}
                role="button"
                tabIndex={0}
                aria-label={`画像: ${image.name}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    handleSelectImage(image)
                  }
                }}
              >
                <div className="relative aspect-video">
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={image.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>
                <div className="p-2 bg-white">
                  <p className="text-sm font-medium truncate" title={image.name}>
                    {image.name}
                  </p>
                  <p className="text-xs text-gray-500" title={formatFileSize(image.size)}>
                    {formatFileSize(image.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            キャンセル
          </Button>
          <Button onClick={fetchImages} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            更新
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
