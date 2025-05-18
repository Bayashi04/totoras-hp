import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// レポート一覧を取得
export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
    return NextResponse.json(reports)
  } catch (error) {
    console.error("レポート取得エラー:", error)
    return NextResponse.json({ error: "レポートの取得に失敗しました" }, { status: 500 })
  }
}

// 新規レポートを作成
export async function POST(request: Request) {
  try {
    const data = await request.json()

    // 公開日の処理
    let publishDate = null
    if (data.published && data.publishDate) {
      publishDate = new Date(data.publishDate)
    } else if (data.published) {
      publishDate = new Date()
    }

    const report = await prisma.report.create({
      data: {
        title: data.title,
        content: data.content || "",
        image: data.image || "",
        category: data.category || "その他",
        published: data.published || false,
        publishDate: publishDate,
      },
    })

    // アクティビティログを記録
    await prisma.activityLog.create({
      data: {
        action: "レポート作成",
        userId: data.userId || null,
        details: `レポート「${data.title}」を作成しました`,
      },
    })

    return NextResponse.json(report)
  } catch (error) {
    console.error("レポート作成エラー:", error)
    return NextResponse.json({ error: "レポートの作成に失敗しました" }, { status: 500 })
  }
}
