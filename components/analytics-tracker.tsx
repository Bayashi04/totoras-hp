"use client"

import { useEffect } from "react"

interface AnalyticsTrackerProps {
  type: "event" | "report"
  id: string
}

export function AnalyticsTracker({ type, id }: AnalyticsTrackerProps) {
  useEffect(() => {
    // 同じページの重複アクセスを防ぐためのセッションストレージチェック
    const sessionKey = `analytics_${type}_${id}`
    if (sessionStorage.getItem(sessionKey)) {
      return
    }

    const recordAnalytics = async () => {
      try {
        // ページが完全に読み込まれた後にアクセス記録を送信
        if (document.readyState === "complete") {
          sendAnalyticsData()
        } else {
          window.addEventListener("load", sendAnalyticsData, { once: true })
        }
      } catch (error) {
        console.error("アクセス記録エラー:", error)
      }
    }

    const sendAnalyticsData = () => {
      // 非同期で送信し、ユーザー体験を妨げないようにする
      setTimeout(() => {
        fetch("/api/analytics/record", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type,
            id,
            referrer: document.referrer || "direct",
            userAgent: navigator.userAgent,
          }),
          // キャッシュを無効化
          cache: "no-store",
        }).catch((error) => {
          console.error("アクセス記録エラー:", error)
        })

        // セッションストレージに記録して重複を防ぐ
        sessionStorage.setItem(sessionKey, "true")
      }, 1000) // 1秒遅延させてページ読み込みを優先
    }

    recordAnalytics()

    return () => {
      window.removeEventListener("load", sendAnalyticsData)
    }
  }, [type, id])

  return null // このコンポーネントはUIをレンダリングしない
}
