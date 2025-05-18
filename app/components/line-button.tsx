"use client"

import { useEffect, useState } from "react"

interface LineButtonProps {
  eventId?: string
  className?: string
}

export function LineButton({ eventId, className = "" }: LineButtonProps) {
  const [isLineAvailable, setIsLineAvailable] = useState(false)

  useEffect(() => {
    // LINEアプリが利用可能かどうかを確認
    const ua = navigator.userAgent.toLowerCase()
    const isLine = ua.indexOf("line") > -1
    const isMobile = /iphone|ipad|ipod|android/.test(ua)
    setIsLineAvailable(isLine || isMobile)
  }, [])

  const handleClick = () => {
    // イベントIDがある場合は特定のイベント申し込みページへ
    const lineUrl = eventId
      ? `https://line.me/R/oaMessage/@totoras/?イベント申し込み%20${eventId}`
      : "https://lin.ee/DQTr7Il"

    window.open(lineUrl, "_blank")
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center gap-2 bg-[#06C755] hover:bg-[#06C755]/90 text-white font-medium py-2 px-4 rounded-md transition-colors ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
      </svg>
      {eventId ? "LINEで申し込む" : "友だち追加"}
    </button>
  )
}
