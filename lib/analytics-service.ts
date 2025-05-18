// データベース連携を見据えたアクセス分析サービス

// 将来的にはデータベースモデルになる型定義
export interface AccessRecord {
  id: string
  type: "event" | "report"
  itemId: string
  timestamp: string
  userId?: string
  userAgent?: string
  referrer?: string
  ip?: string
}

export interface AccessStats {
  itemId: string
  title: string
  viewCount: number
  lastAccessed: string
}

// メモリ内ストレージ（将来的にはデータベースに置き換え）
const accessRecords: AccessRecord[] = []

// イベントとレポートのタイトルキャッシュ（将来的にはDBから取得）
const eventTitles: Record<string, string> = {}
const reportTitles: Record<string, string> = {}

export const analyticsService = {
  // アクセスを記録する
  recordAccess: async (data: Omit<AccessRecord, "timestamp">) => {
    const record: AccessRecord = {
      ...data,
      timestamp: new Date().toISOString(),
    }

    // 将来的にはデータベースに保存
    // await db.accessRecords.create({ data: record });

    // 現在はメモリに保存
    accessRecords.push(record)

    return record
  },

  // イベントのタイトルを設定（キャッシュ用）
  setEventTitle: (id: string, title: string) => {
    eventTitles[id] = title
  },

  // レポートのタイトルを設定（キャッシュ用）
  setReportTitle: (id: string, title: string) => {
    reportTitles[id] = title
  },

  // イベントのアクセス統計を取得
  getEventStats: async (): Promise<AccessStats[]> => {
    // 将来的にはデータベースからの集計クエリ
    // return await db.accessRecords.groupBy({ ... });

    const stats: Record<string, AccessStats> = {}

    // イベントのアクセス記録を集計
    accessRecords
      .filter((record) => record.type === "event")
      .forEach((record) => {
        if (!stats[record.itemId]) {
          stats[record.itemId] = {
            itemId: record.itemId,
            title: eventTitles[record.itemId] || `イベント ${record.itemId}`,
            viewCount: 0,
            lastAccessed: "",
          }
        }

        stats[record.itemId].viewCount++

        // 最新のアクセス日時を更新
        if (!stats[record.itemId].lastAccessed || record.timestamp > stats[record.itemId].lastAccessed) {
          stats[record.itemId].lastAccessed = record.timestamp
        }
      })

    return Object.values(stats).sort((a, b) => b.viewCount - a.viewCount)
  },

  // レポートのアクセス統計を取得
  getReportStats: async (): Promise<AccessStats[]> => {
    // 将来的にはデータベースからの集計クエリ
    // return await db.accessRecords.groupBy({ ... });

    const stats: Record<string, AccessStats> = {}

    // レポートのアクセス記録を集計
    accessRecords
      .filter((record) => record.type === "report")
      .forEach((record) => {
        if (!stats[record.itemId]) {
          stats[record.itemId] = {
            itemId: record.itemId,
            title: reportTitles[record.itemId] || `レポート ${record.itemId}`,
            viewCount: 0,
            lastAccessed: "",
          }
        }

        stats[record.itemId].viewCount++

        // 最新のアクセス日時を更新
        if (!stats[record.itemId].lastAccessed || record.timestamp > stats[record.itemId].lastAccessed) {
          stats[record.itemId].lastAccessed = record.timestamp
        }
      })

    return Object.values(stats).sort((a, b) => b.viewCount - a.viewCount)
  },

  // 特定のイベントのアクセス統計を取得
  getEventStatsById: async (id: string): Promise<AccessStats | null> => {
    const stats = await analyticsService.getEventStats()
    return stats.find((stat) => stat.itemId === id) || null
  },

  // 特定のレポートのアクセス統計を取得
  getReportStatsById: async (id: string): Promise<AccessStats | null> => {
    const stats = await analyticsService.getReportStats()
    return stats.find((stat) => stat.itemId === id) || null
  },

  // 日別のアクセス数を取得（グラフ表示用）
  getDailyAccessCounts: async (type: "event" | "report", days = 30): Promise<{ date: string; count: number }[]> => {
    // 将来的にはデータベースからの集計クエリ
    // return await db.accessRecords.groupBy({ ... });

    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const dateMap: Record<string, number> = {}

    // 日付の範囲を初期化
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0]
      dateMap[dateStr] = 0
    }

    // アクセス記録を日付ごとに集計
    accessRecords
      .filter((record) => record.type === type && new Date(record.timestamp) >= startDate)
      .forEach((record) => {
        const dateStr = record.timestamp.split("T")[0]
        if (dateMap[dateStr] !== undefined) {
          dateMap[dateStr]++
        }
      })

    // 日付順に並べ替えて返す
    return Object.entries(dateMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))
  },
}

// APIルートからアクセスするためのエクスポート
export default analyticsService
