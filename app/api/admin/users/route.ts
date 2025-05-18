import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import * as bcrypt from "bcrypt"

// 管理者ユーザー一覧を取得
export async function GET() {
  try {
    const users = await prisma.adminUser.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        // パスワードは除外
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return NextResponse.json(users)
  } catch (error) {
    console.error("ユーザー取得エラー:", error)
    return NextResponse.json({ error: "ユーザーの取得に失敗しました" }, { status: 500 })
  }
}

// 新規管理者ユーザーを作成
export async function POST(request: Request) {
  try {
    const data = await request.json()

    // 必須フィールドの検証
    if (!data.username || !data.password || !data.email) {
      return NextResponse.json({ error: "ユーザー名、パスワード、メールアドレスは必須です" }, { status: 400 })
    }

    // ユーザー名とメールアドレスの重複チェック
    const existingUser = await prisma.adminUser.findFirst({
      where: {
        OR: [{ username: data.username }, { email: data.email }],
      },
    })

    if (existingUser) {
      return NextResponse.json({ error: "ユーザー名またはメールアドレスが既に使用されています" }, { status: 400 })
    }

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(data.password, 10)

    // ユーザーの作成
    const user = await prisma.adminUser.create({
      data: {
        username: data.username,
        password: hashedPassword,
        email: data.email,
        role: data.role || "editor",
      },
    })

    // アクティビティログを記録
    await prisma.activityLog.create({
      data: {
        action: "管理者ユーザー作成",
        userId: data.createdBy || null,
        details: `管理者ユーザー「${data.username}」を作成しました`,
      },
    })

    // パスワードを除外して返す
    const { password, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("ユーザー作成エラー:", error)
    return NextResponse.json({ error: "ユーザーの作成に失敗しました" }, { status: 500 })
  }
}
