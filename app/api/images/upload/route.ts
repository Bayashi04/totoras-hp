import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { checkEnvVarsMiddleware } from "@/lib/env-check"
import prisma from "@/lib/prisma"

// 許可するファイル形式
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]

// ファイルサイズ上限 (5MB)
const MAX_SIZE = 5 * 1024 * 1024

export async function POST(request: Request) {
  // 環境変数チェック
  const envCheck = checkEnvVarsMiddleware(request)
  if (envCheck) return envCheck

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    // バリデーション
    if (!file) {
      return NextResponse.json({ error: "ファイルが見つかりません" }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: "サポートされていないファイル形式です。JPEG, PNG, GIF, WEBPのみ許可されています",
        },
        { status: 400 },
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        {
          error: "ファイルサイズが上限を超えています (最大5MB)",
        },
        { status: 400 },
      )
    }

    // ファイル名の生成（一意の名前に）
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 10)
    const extension = file.name.split(".").pop()
    const uniqueFilename = `${timestamp}-${randomStr}.${extension}`

    // Vercel Blobにアップロード
    const blob = await put(uniqueFilename, file, {
      access: "public",
    })

    // データベースに画像情報を保存
    const image = await prisma.image.create({
      data: {
        url: blob.url,
        name: file.name,
        size: file.size,
        contentType: file.type,
      },
    })

    return NextResponse.json({
      id: image.id,
      url: blob.url,
      name: file.name,
      size: file.size,
      contentType: file.type,
      success: true,
    })
  } catch (error) {
    console.error("画像アップロードエラー:", error)
    return NextResponse.json({ error: "画像のアップロードに失敗しました" }, { status: 500 })
  }
}
