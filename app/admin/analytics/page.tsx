"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, BarChart3, Calendar, FileText, Eye, Clock } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// アクセス統計の型定義
interface AccessStats {
  itemId: string
  title: string
  viewCount: number
  lastAccessed: string
}

// 日別アクセス数の型定義
interface DailyAccessCount {
  date: string
  count: number
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("events")
  const [eventStats, setEventStats] = useState<AccessStats[]>([])
  const [reportStats, setReportStats] = useState<AccessStats[]>([])
  const [eventDailyStats, setEventDailyStats] = useState<DailyAccessCount[]>([])
  const [reportDailyStats, setReportDailyStats] = useState<DailyAccessCount[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // データ取得
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // イベント統計を取得
        const eventResponse = await fetch("/api/analytics/stats?type=event")
        const eventData = await eventResponse.json()
        if (eventData.success) {
          setEventStats(eventData.data)
        }

        // レポート統計を取得
        const reportResponse = await fetch("/api/analytics/stats?type=report")
        const reportData = await reportResponse.json()
        if (reportData.success) {
          setReportStats(reportData.data)
        }

        // イベントの日別アクセス数を取得
        const eventDailyResponse = await fetch("/api/analytics/stats?type=event&daily=true&days=14")
        const eventDailyData = await eventDailyResponse.json()
        if (eventDailyData.success) {
          setEventDailyStats(eventDailyData.data)
        }

        // レポートの日別アクセス数を取得
        const reportDailyResponse = await fetch("/api/analytics/stats?type=report&daily=true&days=14")
        const reportDailyData = await reportDailyResponse.json()
        if (reportDailyData.success) {
          setReportDailyStats(reportDailyData.data)
        }
      } catch (error) {
        console.error("Failed to fetch analytics data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()

    // 定期的にデータを更新
    const intervalId = setInterval(fetchData, 60000) // 1分ごとに更新

    return () => clearInterval(intervalId)
  }, [])

  // 日付をフォーマット
  const formatDate = (dateString: string) => {
    if (!dateString) return "---"
    const date = new Date(dateString)
    return date.toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // 日付を短くフォーマット（グラフ用）
  const formatShortDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("ja-JP", {
      month: "2-digit",
      day: "2-digit",
    })
  }

  // グラフの最大値を計算
  const getMaxCount = (data: DailyAccessCount[]) => {
    if (data.length === 0) return 10
    return Math.max(...data.map((item) => item.count), 10)
  }

  // グラフの高さを計算
  const getBarHeight = (count: number, maxCount: number) => {
    if (maxCount === 0) return 0
    return (count / maxCount) * 100
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mr-4 transition-colors"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              ダッシュボードに戻る
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="h-6 w-6 mr-2 text-[#4ecdc4]" />
              アクセス分析
            </h1>
          </div>

          <Button variant="outline" className="mt-4 md:mt-0" onClick={() => window.location.reload()}>
            データを更新
          </Button>
        </div>

        <Tabs defaultValue="events" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="events" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              イベント
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              レポート
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 概要カード */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">イベント閲覧概要</CardTitle>
                  <CardDescription>全体の閲覧統計</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">総閲覧数</span>
                      <span className="text-2xl font-bold">
                        {isLoading ? (
                          <span className="animate-pulse">...</span>
                        ) : (
                          eventStats.reduce((sum, item) => sum + item.viewCount, 0)
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">イベント数</span>
                      <span className="text-2xl font-bold">
                        {isLoading ? <span className="animate-pulse">...</span> : eventStats.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">平均閲覧数</span>
                      <span className="text-2xl font-bold">
                        {isLoading ? (
                          <span className="animate-pulse">...</span>
                        ) : eventStats.length > 0 ? (
                          Math.round(eventStats.reduce((sum, item) => sum + item.viewCount, 0) / eventStats.length)
                        ) : (
                          0
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 日別アクセスグラフ */}
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">日別アクセス推移</CardTitle>
                  <CardDescription>過去14日間のアクセス数</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-64 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4ecdc4]"></div>
                    </div>
                  ) : (
                    <div className="h-64 flex items-end justify-between">
                      {eventDailyStats.map((item, index) => (
                        <div key={index} className="flex flex-col items-center w-full">
                          <div
                            className="w-full max-w-[30px] bg-[#4ecdc4] rounded-t-sm mx-auto transition-all hover:bg-[#4ecdc4]/80"
                            style={{
                              height: `${getBarHeight(item.count, getMaxCount(eventDailyStats))}%`,
                              minHeight: item.count > 0 ? "4px" : "0",
                            }}
                          ></div>
                          <div className="text-xs text-gray-500 mt-2 rotate-45 origin-left">
                            {formatShortDate(item.date)}
                          </div>
                          <div className="text-xs font-medium mt-1 absolute -mt-6">{item.count > 0 && item.count}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* イベント詳細テーブル */}
            <Card className="mt-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">イベント別アクセス詳細</CardTitle>
                <CardDescription>各イベントの閲覧統計</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4ecdc4]"></div>
                  </div>
                ) : eventStats.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>イベントID</TableHead>
                          <TableHead>タイトル</TableHead>
                          <TableHead className="text-right">
                            <span className="flex items-center justify-end">
                              <Eye className="h-4 w-4 mr-1" />
                              閲覧数
                            </span>
                          </TableHead>
                          <TableHead className="text-right">
                            <span className="flex items-center justify-end">
                              <Clock className="h-4 w-4 mr-1" />
                              最終アクセス
                            </span>
                          </TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {eventStats.map((item) => (
                          <TableRow key={item.itemId}>
                            <TableCell className="font-mono text-xs">{item.itemId}</TableCell>
                            <TableCell className="font-medium">{item.title}</TableCell>
                            <TableCell className="text-right">{item.viewCount}</TableCell>
                            <TableCell className="text-right">{formatDate(item.lastAccessed)}</TableCell>
                            <TableCell>
                              <Link href={`/events/${item.itemId}`} target="_blank">
                                <Button variant="ghost" size="sm">
                                  表示
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p>イベントのアクセスデータがありません</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 概要カード */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">レポート閲覧概要</CardTitle>
                  <CardDescription>全体の閲覧統計</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">総閲覧数</span>
                      <span className="text-2xl font-bold">
                        {isLoading ? (
                          <span className="animate-pulse">...</span>
                        ) : (
                          reportStats.reduce((sum, item) => sum + item.viewCount, 0)
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">レポート数</span>
                      <span className="text-2xl font-bold">
                        {isLoading ? <span className="animate-pulse">...</span> : reportStats.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">平均閲覧数</span>
                      <span className="text-2xl font-bold">
                        {isLoading ? (
                          <span className="animate-pulse">...</span>
                        ) : reportStats.length > 0 ? (
                          Math.round(reportStats.reduce((sum, item) => sum + item.viewCount, 0) / reportStats.length)
                        ) : (
                          0
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 日別アクセスグラフ */}
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">日別アクセス推移</CardTitle>
                  <CardDescription>過去14日間のアクセス数</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-64 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4ecdc4]"></div>
                    </div>
                  ) : (
                    <div className="h-64 flex items-end justify-between">
                      {reportDailyStats.map((item, index) => (
                        <div key={index} className="flex flex-col items-center w-full">
                          <div
                            className="w-full max-w-[30px] bg-[#ff6b6b] rounded-t-sm mx-auto transition-all hover:bg-[#ff6b6b]/80"
                            style={{
                              height: `${getBarHeight(item.count, getMaxCount(reportDailyStats))}%`,
                              minHeight: item.count > 0 ? "4px" : "0",
                            }}
                          ></div>
                          <div className="text-xs text-gray-500 mt-2 rotate-45 origin-left">
                            {formatShortDate(item.date)}
                          </div>
                          <div className="text-xs font-medium mt-1 absolute -mt-6">{item.count > 0 && item.count}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* レポート詳細テーブル */}
            <Card className="mt-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">レポート別アクセス詳細</CardTitle>
                <CardDescription>各レポートの閲覧統計</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4ecdc4]"></div>
                  </div>
                ) : reportStats.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>レポートID</TableHead>
                          <TableHead>タイトル</TableHead>
                          <TableHead className="text-right">
                            <span className="flex items-center justify-end">
                              <Eye className="h-4 w-4 mr-1" />
                              閲覧数
                            </span>
                          </TableHead>
                          <TableHead className="text-right">
                            <span className="flex items-center justify-end">
                              <Clock className="h-4 w-4 mr-1" />
                              最終アクセス
                            </span>
                          </TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reportStats.map((item) => (
                          <TableRow key={item.itemId}>
                            <TableCell className="font-mono text-xs">{item.itemId}</TableCell>
                            <TableCell className="font-medium">{item.title}</TableCell>
                            <TableCell className="text-right">{item.viewCount}</TableCell>
                            <TableCell className="text-right">{formatDate(item.lastAccessed)}</TableCell>
                            <TableCell>
                              <Link href={`/reports/${item.itemId}`} target="_blank">
                                <Button variant="ghost" size="sm">
                                  表示
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p>レポートのアクセスデータがありません</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </main>
  )
}
