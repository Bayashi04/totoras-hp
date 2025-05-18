import { type NextRequest, NextResponse } from "next/server"
import { analyticsService } from "@/lib/analytics-service"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get("type") as "event" | "report" | null
    const id = searchParams.get("id")
    const daily = searchParams.get("daily") === "true"
    const days = Number.parseInt(searchParams.get("days") || "30", 10)

    // 日別アクセス数を取得
    if (daily && type) {
      const dailyStats = await analyticsService.getDailyAccessCounts(type, days)
      return NextResponse.json({ success: true, data: dailyStats })
    }

    // 特定のアイテムの統計を取得
    if (id && type) {
      let stats = null
      if (type === "event") {
        stats = await analyticsService.getEventStatsById(id)
      } else if (type === "report") {
        stats = await analyticsService.getReportStatsById(id)
      }

      if (!stats) {
        return NextResponse.json({ error: "Item not found" }, { status: 404 })
      }

      return NextResponse.json({ success: true, data: stats })
    }

    // タイプ別の全統計を取得
    if (type) {
      let stats = []
      if (type === "event") {
        stats = await analyticsService.getEventStats()
      } else if (type === "report") {
        stats = await analyticsService.getReportStats()
      }

      return NextResponse.json({ success: true, data: stats })
    }

    // パラメータが不足している場合
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
  } catch (error) {
    console.error("Error fetching analytics stats:", error)
    return NextResponse.json({ error: "Failed to fetch analytics stats" }, { status: 500 })
  }
}
