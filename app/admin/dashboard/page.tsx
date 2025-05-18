"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  BarChart3,
  Calendar,
  FileText,
  Settings,
  Users,
  Clock,
  LogOut,
  Activity,
  Edit,
  Plus,
  Eye,
  AlertCircle,
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { ActivityLogEntry } from "@/lib/activity-log-service"

// アクションに対応するアイコンを取得する関数
function getActionIcon(action: string) {
  switch (action) {
    case "create":
      return <Plus className="h-4 w-4 text-green-500" />
    case "edit":
      return <Edit className="h-4 w-4 text-blue-500" />
    case "delete":
      return <LogOut className="h-4 w-4 text-red-500" />
    case "publish":
      return <Eye className="h-4 w-4 text-purple-500" />
    default:
      return <Activity className="h-4 w-4 text-gray-500" />
  }
}

// アクションの日本語表示を取得する関数
function getActionText(action: string) {
  switch (action) {
    case "create":
      return "作成"
    case "edit":
      return "編集"
    case "delete":
      return "削除"
    case "publish":
      return "公開"
    default:
      return action
  }
}

// ターゲットタイプの日本語表示を取得する関数
function getTargetTypeText(targetType: string) {
  switch (targetType) {
    case "event":
      return "イベント"
    case "report":
      return "レポート"
    case "template":
      return "テンプレート"
    case "system":
      return "システム"
    case "user":
      return "ユーザー"
    default:
      return targetType
  }
}

export default function AdminDashboard() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [lastLogin, setLastLogin] = useState("")
  const [activityLogs, setActivityLogs] = useState<ActivityLogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // ログイン情報を取得
    const storedUsername = localStorage.getItem("admin_username") || "管理者"
    setUsername(storedUsername)

    // 最終ログイン日時を取得
    const storedLastLogin = localStorage.getItem("admin_last_login")
    if (storedLastLogin) {
      const date = new Date(storedLastLogin)
      setLastLogin(date.toLocaleString("ja-JP"))
    } else {
      // 現在の日時を保存
      const now = new Date().toISOString()
      localStorage.setItem("admin_last_login", now)
      setLastLogin(new Date(now).toLocaleString("ja-JP"))
    }

    // アクティビティログを取得
    fetchActivityLogs()
  }, [])

  // アクティビティログを取得する関数
  const fetchActivityLogs = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/admin/activity-logs?limit=10")
      if (!response.ok) {
        throw new Error(`APIエラー: ${response.status}`)
      }
      const data = await response.json()
      if (data.logs) {
        setActivityLogs(data.logs)
      } else {
        // データ形式が期待と異なる場合
        console.error("予期しないAPIレスポンス形式:", data)
        setActivityLogs([])
      }
    } catch (error) {
      console.error("アクティビティログの取得エラー:", error)
      setError("アクティビティログの取得に失敗しました。しばらくしてから再度お試しください。")
      // エラー時は空の配列を設定
      setActivityLogs([])
    } finally {
      setIsLoading(false)
    }
  }

  // 日時をフォーマットする関数
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // ログアウト処理
  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated")
    router.push("/admin/login")
  }

  // エラー時に再試行する関数
  const handleRetry = () => {
    fetchActivityLogs()
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">管理者ダッシュボード</h1>
            <p className="text-gray-600">ようこそ、{username}さん</p>
            <p className="text-sm text-gray-500">最終ログイン: {lastLogin}</p>
          </div>

          <Button variant="outline" className="mt-4 sm:mt-0 flex items-center" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            ログアウト
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* アクセス分析 */}
          <Link href="/admin/analytics" className="block">
            <Card className="h-full transition-all hover:shadow-md hover:border-[#4ecdc4]">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-xl">
                  <BarChart3 className="mr-2 h-5 w-5 text-[#4ecdc4]" />
                  アクセス分析
                </CardTitle>
                <CardDescription>イベントとレポートのアクセス統計を確認</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  閲覧数や人気コンテンツのランキングを分析し、効果的なコンテンツ戦略を立てましょう。
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* イベント管理 */}
          <Link href="/admin/events" className="block">
            <Card className="h-full transition-all hover:shadow-md hover:border-[#4ecdc4]">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-xl">
                  <Calendar className="mr-2 h-5 w-5 text-[#4ecdc4]" />
                  イベント管理
                </CardTitle>
                <CardDescription>イベントの作成・編集・管理</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  新しいイベントの作成や既存イベントの編集、下書き管理などを行います。
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* レポート管理 */}
          <Link href="/admin/reports" className="block">
            <Card className="h-full transition-all hover:shadow-md hover:border-[#4ecdc4]">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-xl">
                  <FileText className="mr-2 h-5 w-5 text-[#4ecdc4]" />
                  レポート管理
                </CardTitle>
                <CardDescription>イベントレポートの作成・編集</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">イベントレポートの作成、編集、公開設定などを管理します。</p>
              </CardContent>
            </Card>
          </Link>

          {/* テンプレート管理 */}
          <Link href="/admin/templates" className="block">
            <Card className="h-full transition-all hover:shadow-md hover:border-[#4ecdc4]">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-xl">
                  <Settings className="mr-2 h-5 w-5 text-[#4ecdc4]" />
                  テンプレート管理
                </CardTitle>
                <CardDescription>注意事項テンプレートの管理</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">イベント用の注意事項テンプレートを作成・管理します。</p>
              </CardContent>
            </Card>
          </Link>

          {/* 管理者ユーザー管理 */}
          <Link href="/admin/users" className="block">
            <Card className="h-full transition-all hover:shadow-md hover:border-[#4ecdc4]">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-xl">
                  <Users className="mr-2 h-5 w-5 text-[#4ecdc4]" />
                  管理者ユーザー
                </CardTitle>
                <CardDescription>管理者ユーザーの登録・管理</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">管理者ユーザーの登録、編集、権限設定などを行います。</p>
              </CardContent>
            </Card>
          </Link>

          {/* 変更履歴（アクティビティログ） */}
          <Link href="/admin/activity-logs" className="block">
            <Card className="h-full transition-all hover:shadow-md hover:border-[#4ecdc4]">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-xl">
                  <Activity className="mr-2 h-5 w-5 text-[#4ecdc4]" />
                  変更履歴
                </CardTitle>
                <CardDescription>システムの変更履歴を確認</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">イベントやレポートの作成・編集などの操作履歴を確認できます。</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* 変更履歴（アクティビティログ） */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold flex items-center mb-4">
            <Activity className="mr-2 h-5 w-5 text-[#4ecdc4]" />
            最近の変更履歴
          </h2>

          {error ? (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2">{error}</AlertDescription>
              <Button variant="outline" size="sm" className="ml-auto" onClick={handleRetry}>
                再試行
              </Button>
            </Alert>
          ) : null}

          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">読み込み中...</p>
                </div>
              ) : activityLogs.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">変更履歴はありません</p>
                </div>
              ) : (
                <ul className="divide-y">
                  {activityLogs.map((log) => (
                    <li key={log.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="mt-1">{getActionIcon(log.action)}</div>
                        <div className="flex-1">
                          <p className="font-medium text-sm sm:text-base">
                            <span className="text-[#4ecdc4]">{log.username}</span>さんが
                            <Badge variant="outline" className="mx-1 text-xs sm:text-sm">
                              {getTargetTypeText(log.targetType)}
                            </Badge>
                            <span className="break-all">「{log.targetName}」</span>を{getActionText(log.action)}しました
                          </p>
                          {log.details && <p className="text-sm text-gray-600 mt-1">{log.details}</p>}
                          <p className="text-xs text-gray-500 mt-1 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDate(log.timestamp)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
          <div className="mt-4 text-center">
            <Link href="/admin/activity-logs">
              <Button variant="outline">すべての変更履歴を見る</Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
