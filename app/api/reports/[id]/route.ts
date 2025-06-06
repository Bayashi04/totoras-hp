import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// 特定のレポートを取得
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const report = await prisma.report.findUnique({
      where: { id },
    })

    if (!report) {
      return NextResponse.json({ error: "レポートが見つかりません" }, { status: 404 })
    }

    // メタデータからフィールドを展開
    const metadata = (report.metadata as any) || {}

    return NextResponse.json({
      ...report,
      eventId: metadata.eventId || "",
      eventTitle: metadata.eventTitle || "",
      authorName: metadata.authorName || "",
      images: metadata.images || [],
      tags: metadata.tags || [],
      seoDescription: metadata.seoDescription || "",
      seoKeywords: metadata.seoKeywords || [],
      allowComments: metadata.allowComments !== false,
      featuredReport: metadata.featuredReport || false,
    })
  } catch (error) {
    console.error("レポート取得エラー:", error)
    return NextResponse.json({ error: "レポートの取得に失敗しました" }, { status: 500 })
  }
}

// レポートを更新
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const data = await request.json()

    // 公開日の処理
    let publishDate = undefined
    if (data.published && data.scheduledPublishDate) {
      publishDate = new Date(data.scheduledPublishDate)
    } else if (data.published && !data.hasOwnProperty("publishDate")) {
      // publishDateが提供されていない場合は現在の値を維持
      const currentReport = await prisma.report.findUnique({
        where: { id },
        select: { publishDate: true },
      })
      publishDate = currentReport?.publishDate || new Date()
    }

    // タグの処理
    const tags = Array.isArray(data.tags) ? data.tags : []

    // SEOキーワードの処理
    const seoKeywords = Array.isArray(data.seoKeywords) ? data.seoKeywords : []

    const updatedReport = await prisma.report.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content || "",
        excerpt: data.excerpt || "",
        coverImage: data.coverImage || "",
        category: data.category || "その他",
        published: data.published || false,
        ...(publishDate !== undefined && { publishDate }),
        // JSONフィールドとして保存
        metadata: {
          eventId: data.eventId || "",
          eventTitle: data.eventTitle || "",
          authorName: data.authorName || "",
          images: data.images || [],
          tags: tags,
          seoDescription: data.seoDescription || "",
          seoKeywords: seoKeywords,
          allowComments: data.allowComments !== false,
          featuredReport: data.featuredReport || false,
        },
      },
    })

    // アクティビティログを記録
    await prisma.activityLog.create({
      data: {
        action: "レポート更新",
        userId: data.userId || null,
        details: `レポート「${data.title}」を更新しました`,
      },
    })

    // メタデータからフィールドを展開
    const metadata = (updatedReport.metadata as any) || {}

    return NextResponse.json({
      ...updatedReport,
      eventId: metadata.eventId || "",
      eventTitle: metadata.eventTitle || "",
      authorName: metadata.authorName || "",
      images: metadata.images || [],
      tags: metadata.tags || [],
      seoDescription: metadata.seoDescription || "",
      seoKeywords: metadata.seoKeywords || [],
      allowComments: metadata.allowComments !== false,
      featuredReport: metadata.featuredReport || false,
    })
  } catch (error) {
    console.error("レポート更新エラー:", error)
    return NextResponse.json({ error: "レポートの更新に失敗しました" }, { status: 500 })
  }
}

// レポートを削除
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // 削除前にレポート情報を取得
    const report = await prisma.report.findUnique({
      where: { id },
    })

    if (!report) {
      return NextResponse.json({ error: "レポートが見つかりません" }, { status: 404 })
    }

    await prisma.report.delete({
      where: { id },
    })

    // アクティビティログを記録
    await prisma.activityLog.create({
      data: {
        action: "レポート削除",
        userId: null,
        details: `レポート「${report.title}」を削除しました`,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("レポート削除エラー:", error)
    return NextResponse.json({ error: "レポートの削除に失敗しました" }, { status: 500 })
  }
}
