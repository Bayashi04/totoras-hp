"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, Activity, Search, Download, Clock } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ActivityLogEntry } from "@/lib/activity-log-service"

// アクションに対応するアイコンを取得する関数
function getActionIcon(action: string) {
  switch (action) {
    case "create":
      return <span className="text-green-500">作成</span>
    case "edit":
      return <span className="text-blue-500">編集</span>
    case "delete":
      return <span className="text-red-500">削除</span>
    case "publish":
      return <span className="text-purple-500">公開</span>
    default:
      return <span className="text-gray-500">{action}</span>
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

export default function ActivityLogsPage() {
  const router = useRouter()
  const [activityLogs, setActivityLogs] = useState<ActivityLogEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterAction, setFilterAction] = useState<string>("all")
  const [filterUser, setFilterUser] = useState<string>("all")
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  })

  useEffect(() => {
    fetchActivityLogs()
  }, [])

  // アクティビティログを取得する関数
  const fetchActivityLogs = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/activity-logs?limit=100")
      if (!response.ok) {
        throw new Error("アクティビティログの取得に失敗しました")
      }
      const data = await response.json()
      setActivityLogs(data.logs)
    } catch (error) {
      console.error("アクティビティログの取得エラー:", error)
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

  // フィルタリングされたログを取得
  const filteredLogs = activityLogs.filter((log) => {
    // 検索語でフィルタリング
    if (
      searchTerm &&
      !log.targetName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !log.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !(log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase()))
    ) {
      return false
    }

    // ターゲットタイプでフィルタリング
    if (filterType !== "all" && log.targetType !== filterType) {
      return false
    }

    // アクションでフィルタリング
    if (filterAction !== "all" && log.action !== filterAction) {
      return false
    }

    // ユーザーでフィルタリング
    if (filterUser !== "all" && log.username !== filterUser) {
      return false
    }

    // 日付範囲でフィルタリング
    if (dateRange.start && new Date(log.timestamp) < new Date(dateRange.start)) {
      return false
    }
    if (dateRange.end) {
      const endDate = new Date(dateRange.end)
      endDate.setHours(23, 59, 59, 999) // 終了日の終わりまで
      if (new Date(log.timestamp) > endDate) {
        return false
      }
    }

    return true
  })

  // ユニークなユーザー名のリストを取得
  const uniqueUsers = Array.from(new Set(activityLogs.map((log) => log.username)))

  // CSVエクスポート
  const exportToCSV = () => {
    // ヘッダー行
    let csvContent = "日時,ユーザー,アクション,タイプ,対象,詳細\n"

    // データ行
    filteredLogs.forEach((log) => {
      const row = [
        formatDate(log.timestamp),
        log.username,
        log.action,
        getTargetTypeText(log.targetType),
        log.targetName,
        log.details || "",
      ]
      // 各フィールドをダブルクォートで囲み、カンマでつなぐ
      csvContent += row.map((field) => `"${field.replace(/"/g, '""')}"`).join(",") + "\n"
    })

    // BOMを追加してUTF-8として認識されるようにする
    const BOM = "\uFEFF"
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `activity-logs-${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="container px-4 py-8 mx-auto">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          ダッシュボードに戻る
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Activity className="mr-2 h-6 w-6 text-[#4ecdc4]" />
              変更履歴
            </h1>
            <p className="text-gray-600">システムの変更履歴を確認できます</p>
          </div>

          <Button variant="outline" className="mt-4 md:mt-0 flex items-center" onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            CSVエクスポート
          </Button>
        </div>

        {/* フィルターセクション */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">検索</label>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="検索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">タイプ</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="すべてのタイプ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべてのタイプ</SelectItem>
                    <SelectItem value="event">イベント</SelectItem>
                    <SelectItem value="report">レポート</SelectItem>
                    <SelectItem value="template">テンプレート</SelectItem>
                    <SelectItem value="system">システム</SelectItem>
                    <SelectItem value="user">ユーザー</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">アクション</label>
                <Select value={filterAction} onValueChange={setFilterAction}>
                  <SelectTrigger>
                    <SelectValue placeholder="すべてのアクション" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべてのアクション</SelectItem>
                    <SelectItem value="create">作成</SelectItem>
                    <SelectItem value="edit">編集</SelectItem>
                    <SelectItem value="delete">削除</SelectItem>
                    <SelectItem value="publish">公開</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">ユーザー</label>
                <Select value={filterUser} onValueChange={setFilterUser}>
                  <SelectTrigger>
                    <SelectValue placeholder="すべてのユーザー" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべてのユーザー</SelectItem>
                    {uniqueUsers.map((user) => (
                      <SelectItem key={user} value={user}>
                        {user}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-1 block">開始日</label>
                <Input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">終了日</label>
                <Input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ログ一覧 */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">読み込み中...</p>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">条件に一致する変更履歴はありません</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        日時
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ユーザー
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        アクション
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        タイプ
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        対象
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        詳細
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1 text-gray-400" />
                            {formatDate(log.timestamp)}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-[#4ecdc4]">
                          {log.username}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">{getActionIcon(log.action)}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <Badge variant="outline">{getTargetTypeText(log.targetType)}</Badge>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{log.targetName}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{log.details || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </main>
  )
}
