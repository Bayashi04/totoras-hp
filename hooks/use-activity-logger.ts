"use client"

import { useState } from "react"

interface LogActivityParams {
  userId: string
  username: string
  action: string
  targetType: "event" | "report" | "template" | "system" | "user"
  targetId: string
  targetName: string
  details?: string
}

export function useActivityLogger() {
  const [isLogging, setIsLogging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const logActivity = async (params: LogActivityParams) => {
    setIsLogging(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/activity-logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        throw new Error("アクティビティログの記録に失敗しました")
      }

      return await response.json()
    } catch (err) {
      console.error("ログ記録エラー:", err)
      setError(err instanceof Error ? err.message : "不明なエラーが発生しました")
      return null
    } finally {
      setIsLogging(false)
    }
  }

  return {
    logActivity,
    isLogging,
    error,
  }
}
