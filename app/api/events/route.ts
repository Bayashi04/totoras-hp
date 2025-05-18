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

    // 日付文字列をDate型に変換
    const dateValue = data.date ? new Date(data.date) : new Date()

    const event = await prisma.event.create({
      data: {
        title: data.title,
        date: dateValue,
        location: data.location || "",
        description: data.description || "",
        image: data.image || "",
        category: data.category || "その他",
        price: data.price || "",
        capacity: data.capacity ? Number.parseInt(data.capacity) : null,
        published: data.published || false,
      },
    })

    // アクティビティログを記録
    await prisma.activityLog.create({
      data: {
        action: "イベント作成",
        userId: data.userId || null,
        details: `イベント「${data.title}」を作成しました`,
      },
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error("イベント作成エラー:", error)
    return NextResponse.json({ error: "イベントの作成に失敗しました" }, { status: 500 })
  }
}
