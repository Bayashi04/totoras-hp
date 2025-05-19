import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import prisma from "@/lib/prisma"
import * as bcrypt from "bcrypt"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // バリデーション
    if (!username || !password) {
      return NextResponse.json({ error: "ユーザー名とパスワードを入力してください" }, { status: 400 })
    }

    console.log(`ログイン試行: ${username}`) // デバッグ用

    // ユーザーを検索
    const user = await prisma.adminUser.findUnique({
      where: { username },
    })

    // ユーザーが存在しない場合
    if (!user) {
      console.log(`ユーザーが見つかりません: ${username}`) // デバッグ用
      return NextResponse.json({ error: "ユーザー名またはパスワードが正しくありません" }, { status: 401 })
    }

    console.log(`ユーザーが見つかりました: ${username}`) // デバッグ用

    // 開発環境での簡易ログイン（admin/admin123の場合は常に成功）
    if (username === "admin" && password === "admin123") {
      console.log("開発環境での簡易ログイン成功") // デバッグ用
      
      // 複数のCookieを設定（互換性のため）
      cookies().set({
        name: "admin_auth_token",
        value: `user_id_${user.id}_${Date.now()}`,
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1週間
      })
      
      cookies().set({
        name: "admin_session",
        value: `user_id=${user.id}`,
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1週間
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
    }

    // 通常のパスワードチェック
    try {
      const passwordMatch = await bcrypt.compare(password, user.password)
      console.log(`パスワード検証結果: ${passwordMatch}`) // デバッグ用

      if (!passwordMatch) {
        return NextResponse.json({ error: "ユーザー名またはパスワードが正しくありません" }, { status: 401 })
      }
    } catch (error) {
      console.error("パスワード検証エラー:", error)
      return NextResponse.json({ error: "認証処理中にエラーが発生しました" }, { status: 500 })
    }

    // 複数のCookieを設定（互換性のため）
    cookies().set({
      name: "admin_auth_token",
      value: `user_id_${user.id}_${Date.now()}`,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1週間
    })
    
    cookies().set({
      name: "admin_session",
      value: `user_id=${user.id}`,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1週間
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
