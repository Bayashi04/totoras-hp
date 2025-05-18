"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, LogIn } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

// 仮の認証情報
const ADMIN_USERNAME = "totoras_admin"
const ADMIN_PASSWORD = "totoras2025"

export default function AdminLoginPage() {
  // ページ読み込み時に画面上部にスクロール
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // ログイン処理
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // 簡易的な認証（実際のアプリケーションではサーバーサイドで行うべき）
    setTimeout(() => {
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // 認証成功
        // 実際のアプリケーションではセッションやトークンを保存
        localStorage.setItem("admin_authenticated", "true")
        localStorage.setItem("admin_username", username)
        localStorage.setItem("admin_last_login", new Date().toISOString())

        // ダッシュボードページにリダイレクト
        router.push("/admin/dashboard")
      } else {
        // 認証失敗
        setError("ユーザー名またはパスワードが正しくありません。")
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="container px-4 mx-auto py-12">
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors">
          <ChevronLeft className="h-4 w-4 mr-1" />
          ホームに戻る
        </Link>

        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">管理者ログイン</CardTitle>
              <CardDescription>管理画面にアクセスするには認証が必要です</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">ユーザー名</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">パスワード</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
                <Button type="submit" className="w-full bg-[#4ecdc4] hover:bg-[#4ecdc4]/90" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      ログイン中...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <LogIn className="mr-2 h-4 w-4" />
                      ログイン
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </main>
  )
}
