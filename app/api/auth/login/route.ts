import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import prisma from "@/lib/prisma"
import { checkEnvVarsMiddleware } from "@/lib/env-check"
import * as bcrypt from "bcrypt"
import * as crypto from "crypto"

export async function POST(request: Request) {
  // 環境変数チェック
  const envCheck = checkEnvVarsMiddleware(request)
  if (envCheck) return envCheck

  try {
    const { username, password } = await request.json()

    // バリデーション
    if (!username || !password) {
      return NextResponse.json({ error: "ユーザー名とパスワードを入力してください" }, { status: 400 })
    }

    // ユーザーを検索
    const user = await prisma.adminUser.findUnique({
      where: { username },
    })

    // ユーザーが存在しない場合
    if (!user) {
      return NextResponse.json({ error: "ユーザー名またはパスワードが正しくありません" }, { status: 401 })
    }

    // パスワードチェック
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return NextResponse.json({ error: "ユーザー名またはパスワードが正しくありません" }, { status: 401 })
    }

    // セキュアなトークンを生成
    const token = crypto.randomBytes(64).toString("hex")

    // トークンの有効期限（7日間）
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    // Cookieにトークンをセット
    cookies().set({
      name: "admin_auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: expiresAt,
      path: "/",
    })

    // 最終ログイン日時を更新
    await prisma.adminUser.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    })

    // 活動ログに記録
    await prisma.activityLog.create({
      data: {
        action: "login",
        userId: user.id,
        details: `ユーザー ${user.username} がログインしました`,
      },
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("ログインエラー:", error)
    return NextResponse.json({ error: "ログイン処理中にエラーが発生しました" }, { status: 500 })
  }
}
