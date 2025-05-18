"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import Image from "next/image"
import { Upload, X, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  initialImage?: string
  onImageChange: (imageData: string) => void
  className?: string
}

export function ImageUpload({ initialImage, onImageChange, className = "" }: ImageUploadProps) {
  const [image, setImage] = useState<string>(initialImage || "")
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ファイルを処理する関数
  const processFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        alert("画像ファイルを選択してください")
        return
      }

      setIsLoading(true)

      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        setImage(imageData)
        onImageChange(imageData)
        setIsLoading(false)
      }
      reader.onerror = () => {
        alert("画像の読み込みに失敗しました")
        setIsLoading(false)
      }
      reader.readAsDataURL(file)
    },
    [onImageChange],
  )

  // ファイル選択ハンドラー
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  // ドラッグ&ドロップハンドラー
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  // 画像削除ハンドラー
  const handleRemoveImage = () => {
    setImage("")
    onImageChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // ファイル選択ダイアログを開く
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className={`w-full ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        aria-label="画像をアップロード"
      />

      {!image ? (
        <div
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
            isDragging ? "border-[#4ecdc4] bg-[#4ecdc4]/10" : "border-gray-300 hover:border-[#4ecdc4] hover:bg-gray-50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
          style={{ minHeight: "200px" }}
        >
          <div className="flex flex-col items-center justify-center h-full py-6">
            <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-2">画像をドラッグ&ドロップするか、クリックして選択してください</p>
            <p className="text-xs text-gray-500">JPG, PNG, GIF (最大 5MB)</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={(e) => {
                e.stopPropagation()
                openFileDialog()
              }}
            >
              <Upload className="h-4 w-4 mr-2" />
              画像を選択
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden" style={{ minHeight: "200px" }}>
          <Image
            src={image || "/placeholder.svg"}
            alt="イベント画像"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="bg-white hover:bg-gray-100"
                onClick={openFileDialog}
              >
                変更
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="bg-white hover:bg-red-50 text-red-500 hover:text-red-600"
                onClick={handleRemoveImage}
              >
                <X className="h-4 w-4 mr-1" />
                削除
              </Button>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="mt-2 text-center">
          <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite] mr-2"></div>
          <span className="text-sm text-gray-500">画像を処理中...</span>
        </div>
      )}
    </div>
  )
}
