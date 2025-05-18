import { NextResponse } from "next/server"
import { list } from "@vercel/blob"
import prisma from "@/lib/prisma"
import { checkEnvVarsMiddleware } from "@/lib/env-check"

export async function GET(request: Request) {
  // 環境変数チェック
  const envCheck = checkEnvVarsMiddleware(request)
  if (envCheck) return envCheck

  try {
    // データベースから画像情報を取得
    const dbImages = await prisma.image.findMany({
      orderBy: {
        uploadedAt: "desc",
      },
    })

    // データベースに画像が保存されている場合はそちらを優先
    if (dbImages.length > 0) {
      return NextResponse.json(dbImages)
    }

    // データベースに情報がない場合はVercel Blobから直接取得
    const { blobs } = await list()

    const images = await Promise.all(
      blobs.map(async (blob) => {
        // データベースに保存
        const image = await prisma.image.create({
          data: {
            url: blob.url,
            name: blob.pathname,
            size: blob.size,
            contentType: blob.contentType || "",
          },
        })

        return {
          id: image.id,
          url: blob.url,
          name: blob.pathname,
          size: blob.size,
          contentType: blob.contentType,
          uploadedAt: blob.uploadedAt,
        }
      }),
    )

    return NextResponse.json(images)
  } catch (error) {
    console.error("画像一覧取得エラー:", error)

    // エラー発生時には代替として静的なサンプルデータを返す
    const fallbackImages = [
      {
        url: "/placeholder-e0lj7.png",
        name: "イベント1.png",
        size: 102400,
        uploadedAt: new Date().toISOString(),
      },
      {
        url: "/placeholder-x5sne.png",
        name: "イベント2.png",
        size: 153600,
        uploadedAt: new Date().toISOString(),
      },
      {
        url: "/board-game-event.png",
        name: "ボードゲーム.png",
        size: 204800,
        uploadedAt: new Date().toISOString(),
      },
      {
        url: "/halloween-party.png",
        name: "ハロウィン.png",
        size: 307200,
        uploadedAt: new Date().toISOString(),
      },
    ]

    return NextResponse.json(fallbackImages)
  }
}
