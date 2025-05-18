// 変更履歴（アクティビティログ）を管理するサービス

export interface ActivityLogEntry {
  id: string
  timestamp: string
  userId: string
  username: string
  action: string
  targetType: "event" | "report" | "template" | "system" | "user"
  targetId: string
  targetName: string
  details?: string
}

// メモリ内ストレージ（将来的にはデータベースに置き換え）
const activityLogs: ActivityLogEntry[] = [
  // 初期サンプルデータ
  {
    id: "log-1",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2時間前
    userId: "admin-1",
    username: "管理者",
    action: "create",
    targetType: "event",
    targetId: "summer-bbq",
    targetName: "夏のBBQパーティー",
  },
  {
    id: "log-2",
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), // 5時間前
    userId: "admin-1",
    username: "管理者",
    action: "edit",
    targetType: "event",
    targetId: "board-game",
    targetName: "ボードゲーム大会",
    details: "開催時間を変更しました",
  },
  {
    id: "log-3",
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), // 24時間前
    userId: "admin-2",
    username: "副管理者",
    action: "create",
    targetType: "report",
    targetId: "report-1",
    targetName: "春の花見イベントレポート",
  },
  {
    id: "log-4",
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString(), // 48時間前
    userId: "admin-1",
    username: "管理者",
    action: "publish",
    targetType: "report",
    targetId: "report-2",
    targetName: "クッキング教室イベント大成功！",
  },
]

export const ActivityLogService = {
  // 新しいログエントリを記録
  logActivity: async (data: Omit<ActivityLogEntry, "id" | "timestamp">) => {
    const entry: ActivityLogEntry = {
      ...data,
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toISOString(),
    }

    // 将来的にはデータベースに保存
    // await db.activityLogs.create({ data: entry });

    // 現在はメモリに保存
    activityLogs.unshift(entry) // 新しいログを先頭に追加

    // ログが多すぎる場合は古いものを削除（メモリ節約のため）
    if (activityLogs.length > 1000) {
      activityLogs.pop()
    }

    return entry
  },

  // 最新のログエントリを取得
  getRecentLogs: async (limit = 10): Promise<ActivityLogEntry[]> => {
    // 将来的にはデータベースからの取得
    // return await db.activityLogs.findMany({
    //   orderBy: { timestamp: 'desc' },
    //   take: limit
    // });

    // 現在はメモリから取得
    return activityLogs.slice(0, limit)
  },

  // 特定のユーザーのログを取得
  getUserLogs: async (userId: string, limit = 10): Promise<ActivityLogEntry[]> => {
    // 将来的にはデータベースからの取得
    // return await db.activityLogs.findMany({
    //   where: { userId },
    //   orderBy: { timestamp: 'desc' },
    //   take: limit
    // });

    // 現在はメモリから取得
    return activityLogs.filter((log) => log.userId === userId).slice(0, limit)
  },

  // 特定のターゲット（イベントやレポート）のログを取得
  getTargetLogs: async (targetType: string, targetId: string): Promise<ActivityLogEntry[]> => {
    // 将来的にはデータベースからの取得
    // return await db.activityLogs.findMany({
    //   where: { targetType, targetId },
    //   orderBy: { timestamp: 'desc' }
    // });

    // 現在はメモリから取得
    return activityLogs.filter((log) => log.targetType === targetType && log.targetId === targetId)
  },

  // 日付範囲でログを取得
  getLogsByDateRange: async (startDate: Date, endDate: Date): Promise<ActivityLogEntry[]> => {
    // 将来的にはデータベースからの取得
    // return await db.activityLogs.findMany({
    //   where: {
    //     timestamp: {
    //       gte: startDate.toISOString(),
    //       lte: endDate.toISOString()
    //     }
    //   },
    //   orderBy: { timestamp: 'desc' }
    // });

    // 現在はメモリから取得
    return activityLogs.filter((log) => {
      const logDate = new Date(log.timestamp)
      return logDate >= startDate && logDate <= endDate
    })
  },
}

// デフォルトエクスポートも追加
export default ActivityLogService
