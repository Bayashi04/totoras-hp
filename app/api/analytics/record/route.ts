import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { path, userAgent, referer } = data

    // IPアドレスの取得（ヘッダーから）
    const headers = new Headers(request.headers)
    const ip = headers.get("x-forwarded-for") || headers.get("x-real-ip") || "unknown"

    // ページビューを記録
    const pageView = await prisma.pageView.create({
      data: {
        path,
        userAgent: userAgent || null,
        referer: referer || null,
        ip: ip.toString(),
      },
    })

    return NextResponse.json({ success: true, id: pageView.id })
  } catch (error) {
    console.error("アクセス記録エラー:", error)
    return NextResponse.json({ error: "アクセスの記録に失敗しました" }, { status: 500 })
  }
}
