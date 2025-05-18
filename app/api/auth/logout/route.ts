import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import prisma from "@/lib/prisma"
import { checkEnvVarsMiddleware } from "@/lib/env-check"

export async function POST(request: Request) {
  // 環境変数チェック
  const envCheck = checkEnvVarsMiddleware(request)
  if (envCheck) return envCheck

  try {
    // Cookieからユーザー情報を取得
    const authToken = cookies().get("admin_auth_token")?.value

    if (authToken) {
      const [userId] = authToken.split(":")

      // 活動ログに記録
      await prisma.activityLog.create({
        data: {
          action: "logout",
          userId,
          details: `ユーザーがログアウトしました`,
        },
      })
    }

    // Cookieを削除
    cookies().delete("admin_auth_token")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("ログアウトエラー:", error)
    return NextResponse.json({ error: "ログアウト処理中にエラーが発生しました" }, { status: 500 })
  }
}
