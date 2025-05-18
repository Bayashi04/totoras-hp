import { NextResponse } from "next/server"

// 必要な環境変数のリスト
const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET"]

// 環境変数が設定されているかチェック
export function checkRequiredEnvVars() {
  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    console.error(`環境変数が設定されていません: ${missingVars.join(", ")}`)
    return false
  }

  return true
}

// ミドルウェアで使用するための環境変数チェック
export function checkEnvVarsMiddleware(request: Request) {
  if (!checkRequiredEnvVars()) {
    return NextResponse.json({ error: "サーバー設定が不完全です。管理者に連絡してください。" }, { status: 500 })
  }

  return null
}
