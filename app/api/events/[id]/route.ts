// イベント更新APIを確認し、データベース記録を確実にする

// 既存のコードは正しく実装されていますが、エラーハンドリングを強化します
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const data = await request.json()

    // 日付文字列をDate型に変換
    const dateValue = data.date ? new Date(data.date) : new Date()

    // 持ち物リストの処理
    const items = Array.isArray(data.items) ? data.items : []

    // データベースでイベントを更新
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
          action: "イベント更新",
          userId: data.userId || null,
          details: `イベント「${data.title}」を更新しました`,
          metadata: { eventId: id },
        },
      })
      .catch((error) => {
        // アクティビティログの記録に失敗してもイベント更新は続行
        console.error("アクティビティログ記録エラー:", error)
      })

    // メタデータからフィールドを展開
    const metadata = (updatedEvent.metadata as any) || {}

    return NextResponse.json({
      ...updatedEvent,
      time: metadata.time || "",
      cautions: metadata.cautions || "",
      items: metadata.items || [],
      color: metadata.color || "#4ecdc4",
    })
  } catch (error) {
    console.error("イベント更新エラー:", error)
    return NextResponse.json({ error: "イベントの更新に失敗しました" }, { status: 500 })
  }
}
