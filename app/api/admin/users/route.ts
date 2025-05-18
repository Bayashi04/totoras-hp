import { type NextRequest, NextResponse } from "next/server"
import { AdminUserService } from "@/lib/admin-user-service"
import { ActivityLogService } from "@/lib/activity-log-service"

// 管理者ユーザー一覧を取得
export async function GET(request: NextRequest) {
  try {
    // 認証チェック（実際の実装ではセッションやJWTなどで認証）
    // この例では簡略化のため省略

    const users = AdminUserService.getAllUsers().map((user) => {
      // パスワードを除外
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error("管理者ユーザー取得エラー:", error)
    return NextResponse.json({ error: "管理者ユーザーの取得に失敗しました" }, { status: 500 })
  }
}

// 新しい管理者ユーザーを作成
export async function POST(request: NextRequest) {
  try {
    // 認証チェック（実際の実装ではセッションやJWTなどで認証）
    // この例では簡略化のため省略

    const data = await request.json()
    const { username, email, password, role } = data

    // 入力検証
    if (!username || !email || !password || !role) {
      return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 })
    }

    // 既存ユーザーのチェック
    const existingUser = AdminUserService.getUserByUsernameOrEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "このユーザー名またはメールアドレスは既に使用されています" }, { status: 400 })
    }

    // 新しいユーザーを作成
    const newUser = AdminUserService.createUser({
      username,
      email,
      password, // 実際の実装ではパスワードをハッシュ化
      role,
      isActive: true,
    })

    // パスワードを除外
    const { password: _, ...userWithoutPassword } = newUser

    // アクティビティログに記録
    await ActivityLogService.logActivity({
      username: "管理者", // 実際の実装では現在のユーザー名
      action: "create",
      targetType: "user",
      targetId: newUser.id,
      targetName: newUser.username,
      details: `新しい管理者ユーザー「${newUser.username}」を作成しました。権限: ${newUser.role}`,
    })

    return NextResponse.json({ user: userWithoutPassword }, { status: 201 })
  } catch (error) {
    console.error("管理者ユーザー作成エラー:", error)
    return NextResponse.json({ error: "管理者ユーザーの作成に失敗しました" }, { status: 500 })
  }
}
