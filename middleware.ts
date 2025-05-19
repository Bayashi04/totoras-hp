import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// 管理者ページのパスパターン
const ADMIN_PATHS = /^\/admin(?!\/login)/

export function middleware(request: NextRequest) {
  // 管理者ページへのアクセスをチェック
  if (ADMIN_PATHS.test(request.nextUrl.pathname)) {
    // セッションCookieを確認（複数のCookie名をチェック）
    const authToken = request.cookies.get("admin_auth_token")
    const session = request.cookies.get("admin_session")

    // デバッグ用
    console.log("ミドルウェア: 管理者ページアクセス", request.nextUrl.pathname)
    console.log("認証トークン:", authToken?.value)
    console.log("セッションCookie:", session?.value)

    // どちらのCookieもない場合はログインページにリダイレクト
    if (!authToken?.value && !session?.value) {
      console.log("ミドルウェア: 未認証アクセス - リダイレクト")
      const loginUrl = new URL("/admin/login", request.url)
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }

    // セッションがある場合は通過
    console.log("ミドルウェア: 認証済みアクセス - 許可")
  }

  return NextResponse.next()
}

// ミドルウェアを適用するパスを指定
export const config = {
  matcher: [
    // 管理者ページ全体
    "/admin/:path*",
  ],
}
