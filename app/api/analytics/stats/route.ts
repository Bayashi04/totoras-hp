import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "7days"

    // 期間の計算
    const now = new Date()
    const startDate = new Date()

    switch (period) {
      case "24hours":
        startDate.setHours(now.getHours() - 24)
        break
      case "7days":
        startDate.setDate(now.getDate() - 7)
        break
      case "30days":
        startDate.setDate(now.getDate() - 30)
        break
      case "90days":
        startDate.setDate(now.getDate() - 90)
        break
      default:
        startDate.setDate(now.getDate() - 7)
    }

    // 総ページビュー数
    const totalPageViews = await prisma.pageView.count({
      where: {
        timestamp: {
          gte: startDate,
        },
      },
    })

    // 人気ページ
    const popularPages = await prisma.pageView.groupBy({
      by: ["path"],
      _count: {
        path: true,
      },
      where: {
        timestamp: {
          gte: startDate,
        },
      },
      orderBy: {
        _count: {
          path: "desc",
        },
      },
      take: 10,
    })

    // 日別アクセス数
    const dailyStats = await prisma.$queryRaw`
      SELECT 
        DATE(timestamp) as date, 
        COUNT(*) as count 
      FROM "PageView" 
      WHERE timestamp >= ${startDate}
      GROUP BY DATE(timestamp) 
      ORDER BY date ASC
    `

    return NextResponse.json({
      totalPageViews,
      popularPages,
      dailyStats,
    })
  } catch (error) {
    console.error("統計取得エラー:", error)
    return NextResponse.json({ error: "統計情報の取得に失敗しました" }, { status: 500 })
  }
}
