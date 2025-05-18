"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import Image from "next/image"
import { Upload, X, ImageIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

interface ImageUploadProps {
  initialImage?: string
  onImageChange: (imageData: string) => void
  className?: string
  maxSizeMB?: number
}

export function ImageUpload({ initialImage, onImageChange, className = "", maxSizeMB = 5 }: ImageUploadProps) {
  const [image, setImage] = useState<string>(initialImage || "")
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 初期画像の設定
  useEffect(() => {
    if (initialImage) {
      setImage(initialImage)
    }
  }, [initialImage])

  // サーバーへのアップロード処理
  const uploadToServer = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)

    try {
      // アップロードリクエスト
      const response = await fetch("/api/images/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "画像のアップロードに失敗しました")
      }

      const data = await response.json()
      return data.url
    } catch (error) {
      console.error("アップロードエラー:", error)
      throw error
    }
  }

  // ファイルを処理する関数
  const processFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "エラー",
          description: "画像ファイルを選択してください",
          variant: "destructive",
        })
        return
      }

      // ファイルサイズチェック
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast({
          title: "ファイルサイズエラー",
          description: `ファイルサイズが上限(${maxSizeMB}MB)を超えています`,
          variant: "destructive",
        })
        return
      }

      setIsLoading(true)
      setUploadProgress(0)

      try {
        // ローカルプレビュー用に読み込み
        const reader = new FileReader()
        reader.onload = (e) => {
          const imageData = e.target?.result as string
          setImage(imageData)
          setUploadProgress(50) // プレビュー生成完了
        }
        reader.readAsDataURL(file)

        // サーバーにアップロード
        const uploadedUrl = await uploadToServer(file)
        onImageChange(uploadedUrl)
        setUploadProgress(100)

        toast({
          title: "成功",
          description: "画像がアップロードされました",
        })
      } catch (error) {
        console.error("画像処理エラー:", error)
        toast({
          title: "エラー",
          description: error instanceof Error ? error.message : "画像のアップロードに失敗しました",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [onImageChange, maxSizeMB],
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
            <p className="text-xs text-gray-500">JPG, PNG, GIF, WEBP (最大 {maxSizeMB}MB)</p>
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
                disabled={isLoading}
              >
                変更
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="bg-white hover:bg-red-50 text-red-500 hover:text-red-600"
                onClick={handleRemoveImage}
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-1" />
                削除
              </Button>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-[#4ecdc4] h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-center mt-1">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm text-gray-500">
              {uploadProgress < 50 ? "画像を処理中..." : uploadProgress < 100 ? "サーバーにアップロード中..." : "完了"}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
