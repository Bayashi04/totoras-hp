import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// イベント作成APIを確認し、データベース記録を確実にする

// 既存のコードは正しく実装されていますが、エラーハンドリングを強化します
export async function POST(request: Request) {
  try {
    const data = await request.json()

    // 日付文字列をDate型に変換
    const dateValue = data.date ? new Date(data.date) : new Date()

    // 持ち物リストの処理
    const items = Array.isArray(data.items) ? data.items : []

    // データベースにイベントを作成
    const event = await prisma.event.create({
      data: {
        title: data.title || "無題のイベント",
        date: dateValue,
        location: data.location || "",
        description: data.description || "",
        image: data.image || "",
        category: data.category || "その他",
        price: data.price || "",
        capacity: Number.parseInt(data.capacity) || 0,
        published: data.published || false,
        // JSONフィールドとして保存
        metadata: {
          time: data.time || "",
          cautions: data.cautions || "",
          items: items,
          color: data.color || "#4ecdc4",
        },
      },
    })

    // アクティビティログを記録
    await prisma.activityLog
      .create({
        data: {
          action: "イベント作成",
          userId: data.userId || null,
          details: `イベント「${data.title}」を作成しました`,
          metadata: { eventId: event.id },
        },
      })
      .catch((error) => {
        // アクティビティログの記録に失敗してもイベント作成は続行
        console.error("アクティビティログ記録エラー:", error)
      })

    return NextResponse.json(event)
  } catch (error) {
    console.error("イベント作成エラー:", error)
    return NextResponse.json({ error: "イベントの作成に失敗しました" }, { status: 500 })
  }
}
