import { type NextRequest, NextResponse } from "next/server"
import { ActivityLogService } from "@/lib/activity-log-service"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10)
    const userId = searchParams.get("userId")
    const targetType = searchParams.get("targetType")
    const targetId = searchParams.get("targetId")

    let logs

    if (userId) {
      logs = await ActivityLogService.getUserLogs(userId, limit)
    } else if (targetType && targetId) {
      logs = await ActivityLogService.getTargetLogs(targetType, targetId)
    } else {
      logs = await ActivityLogService.getRecentLogs(limit)
    }

    return NextResponse.json({ logs })
  } catch (error) {
    console.error("アクティビティログの取得に失敗しました", error)
    return NextResponse.json({ error: "アクティビティログの取得に失敗しました" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const log = await ActivityLogService.logActivity(data)
    return NextResponse.json({ success: true, log })
  } catch (error) {
    console.error("アクティビティログの記録に失敗しました", error)
    return NextResponse.json({ error: "アクティビティログの記録に失敗しました" }, { status: 500 })
  }
}
