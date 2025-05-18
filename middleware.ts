import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { checkEnvVarsMiddleware } from "./lib/env-check"

// 管理画面のパスをチェック
const ADMIN_PATHS = ["/admin", "/admin/", "/admin/.+"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 環境変数チェック
  const envCheck = checkEnvVarsMiddleware(request)
  if (envCheck) return envCheck

  // 管理画面へのアクセスをチェック
  const isAdminPath = ADMIN_PATHS.some((path) => {
    const regex = new RegExp(`^${path}$`.replace(".+", ".*"))
    return regex.test(pathname)
  })

  if (isAdminPath) {
    // 管理画面のログイン状態確認
    // ここでは簡易的に Cookie をチェック
    const authToken = request.cookies.get("admin_auth_token")?.value

    // ログインページへのアクセスは許可
    if (pathname === "/admin/login") {
      // すでにログイン済みならダッシュボードへリダイレクト
      if (authToken) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url))
      }
      return NextResponse.next()
    }

    // 認証が必要なページなのにトークンがない場合はログインページへリダイレクト
    if (!authToken) {
      // 現在のURLをクエリパラメータで渡してログイン後にリダイレクトできるようにする
      const url = new URL("/admin/login", request.url)
      url.searchParams.set("redirect", pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

// 管理画面のパスに対してのみミドルウェアを実行
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
