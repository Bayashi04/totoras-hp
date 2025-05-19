import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// イベント一覧を取得
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        date: "desc",
      },
    })
    return NextResponse.json(events)
  } catch (error) {
    console.error("イベント取得エラー:", error)
    return NextResponse.json({ error: "イベントの取得に失敗しました" }, { status: 500 })
  }
}

// 新規イベントを作成
export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log("イベント作成リクエスト:", data) // デバッグ用

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

    console.log("イベント作成成功:", event.id) // デバッグ用

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
    return NextResponse.json({ error: "イベントの作成に失敗しました", details: error.message }, { status: 500 })
  }
}
