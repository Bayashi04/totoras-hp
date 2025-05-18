import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// 特定のイベントを取得
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const event = await prisma.event.findUnique({
      where: { id },
    })

    if (!event) {
      return NextResponse.json({ error: "イベントが見つかりません" }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error("イベント取得エラー:", error)
    return NextResponse.json({ error: "イベントの取得に失敗しました" }, { status: 500 })
  }
}

// イベントを更新
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const data = await request.json()

    // 日付文字列をDate型に変換
    const dateValue = data.date ? new Date(data.date) : new Date()

    const updatedEvent = await prisma.event.update({
      where: { id },
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
        action: "イベント更新",
        userId: data.userId || null,
        details: `イベント「${data.title}」を更新しました`,
      },
    })

    return NextResponse.json(updatedEvent)
  } catch (error) {
    console.error("イベント更新エラー:", error)
    return NextResponse.json({ error: "イベントの更新に失敗しました" }, { status: 500 })
  }
}

// イベントを削除
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // 削除前にイベント情報を取得
    const event = await prisma.event.findUnique({
      where: { id },
    })

    if (!event) {
      return NextResponse.json({ error: "イベントが見つかりません" }, { status: 404 })
    }

    await prisma.event.delete({
      where: { id },
    })

    // アクティビティログを記録
    await prisma.activityLog.create({
      data: {
        action: "イベント削除",
        userId: null, // リクエストからユーザーIDを取得する方法を実装する必要があります
        details: `イベント「${event.title}」を削除しました`,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("イベント削除エラー:", error)
    return NextResponse.json({ error: "イベントの削除に失敗しました" }, { status: 500 })
  }
}
