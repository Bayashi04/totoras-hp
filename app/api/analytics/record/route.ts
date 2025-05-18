import { type NextRequest, NextResponse } from "next/server"
import { analyticsService } from "@/lib/analytics-service"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // 必須フィールドの検証
    if (!data.type || !data.itemId) {
      return NextResponse.json({ error: "type and itemId are required" }, { status: 400 })
    }

    // アクセス情報を記録
    const record = await analyticsService.recordAccess({
      id: crypto.randomUUID(),
      type: data.type,
      itemId: data.itemId,
      userId: data.userId,
      userAgent: request.headers.get("user-agent") || undefined,
      referrer: request.headers.get("referer") || undefined,
      ip: request.headers.get("x-forwarded-for") || undefined,
    })

    // タイトル情報があれば保存
    if (data.title) {
      if (data.type === "event") {
        analyticsService.setEventTitle(data.itemId, data.title)
      } else if (data.type === "report") {
        analyticsService.setReportTitle(data.itemId, data.title)
      }
    }

    return NextResponse.json({ success: true, recordId: record.id })
  } catch (error) {
    console.error("Error recording analytics:", error)
    return NextResponse.json({ error: "Failed to record analytics" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
