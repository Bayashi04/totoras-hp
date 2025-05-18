import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    // アクティビティログの取得
    const logs = await prisma.activityLog.findMany({
      orderBy: {
        timestamp: "desc",
      },
      skip,
      take: limit,
    })

    // 総件数の取得
    const total = await prisma.activityLog.count()

    return NextResponse.json({
      logs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("アクティビティログ取得エラー:", error)
    return NextResponse.json({ error: "アクティビティログの取得に失敗しました" }, { status: 500 })
  }
}
