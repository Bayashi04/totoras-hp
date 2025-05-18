import { type NextRequest, NextResponse } from "next/server"
import { AdminUserService } from "@/lib/admin-user-service"
import { ActivityLogService } from "@/lib/activity-log-service"

// 管理者ユーザーを取得
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const user = AdminUserService.getUserById(id)

    if (!user) {
      return NextResponse.json({ error: "管理者ユーザーが見つかりません" }, { status: 404 })
    }

    // パスワードを除外
    const { password, ...userWithoutPassword } = user
    return NextResponse.json({ user: userWithoutPassword })
  } catch (error) {
    console.error("管理者ユーザー取得エラー:", error)
    return NextResponse.json({ error: "管理者ユーザーの取得に失敗しました" }, { status: 500 })
  }
}

// 管理者ユーザーを更新
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const data = await request.json()
    const { username, email, password, role, isActive } = data

    // 入力検証
    if (!username && !email && !role && isActive === undefined) {
      return NextResponse.json({ error: "更新する項目がありません" }, { status: 400 })
    }

    // ユーザーの存在確認
    const existingUser = AdminUserService.getUserById(id)
    if (!existingUser) {
      return NextResponse.json({ error: "管理者ユーザーが見つかりません" }, { status: 404 })
    }

    // ユーザーを更新
    const updateData: any = {}
    if (username) updateData.username = username
    if (email) updateData.email = email
    if (password) updateData.password = password // 実際の実装ではパスワードをハッシュ化
    if (role) updateData.role = role
    if (isActive !== undefined) updateData.isActive = isActive

    const updatedUser = AdminUserService.updateUser(id, updateData)
    if (!updatedUser) {
      return NextResponse.json({ error: "管理者ユーザーの更新に失敗しました" }, { status: 500 })
    }

    // パスワードを除外
    const { password: _, ...userWithoutPassword } = updatedUser

    // アクティビティログに記録
    await ActivityLogService.logActivity({
      username: "管理者", // 実際の実装では現在のユーザー名
      action: "edit",
      targetType: "user",
      targetId: updatedUser.id,
      targetName: updatedUser.username,
      details: `管理者ユーザー「${updatedUser.username}」を更新しました`,
    })

    return NextResponse.json({ user: userWithoutPassword })
  } catch (error) {
    console.error("管理者ユーザー更新エラー:", error)
    return NextResponse.json({ error: "管理者ユーザーの更新に失敗しました" }, { status: 500 })
  }
}

// 管理者ユーザーを削除
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // ユーザーの存在確認
    const existingUser = AdminUserService.getUserById(id)
    if (!existingUser) {
      return NextResponse.json({ error: "管理者ユーザーが見つかりません" }, { status: 404 })
    }

    // 最後の管理者は削除できないようにする
    const allUsers = AdminUserService.getAllUsers()
    const adminUsers = allUsers.filter((user) => user.role === "admin" && user.isActive)
    if (adminUsers.length === 1 && adminUsers[0].id === id) {
      return NextResponse.json({ error: "最後の管理者ユーザーは削除できません" }, { status: 400 })
    }

    // ユーザーを削除
    const success = AdminUserService.deleteUser(id)
    if (!success) {
      return NextResponse.json({ error: "管理者ユーザーの削除に失敗しました" }, { status: 500 })
    }

    // アクティビティログに記録
    await ActivityLogService.logActivity({
      username: "管理者", // 実際の実装では現在のユーザー名
      action: "delete",
      targetType: "user",
      targetId: id,
      targetName: existingUser.username,
      details: `管理者ユーザー「${existingUser.username}」を削除しました`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("管理者ユーザー削除エラー:", error)
    return NextResponse.json({ error: "管理者ユーザーの削除に失敗しました" }, { status: 500 })
  }
}
