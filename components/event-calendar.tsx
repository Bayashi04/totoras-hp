"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// イベントデータの型定義
interface CalendarEvent {
  id: string
  title: string
  date: Date
  location: string
  color: string
}

// サンプルイベントデータ
const sampleEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "夏のBBQパーティー",
    date: new Date(2025, 6, 20), // 7月20日
    location: "東京・代々木公園",
    color: "#ff6b6b",
  },
  {
    id: "2",
    title: "ボードゲーム大会",
    date: new Date(2025, 7, 5), // 8月5日
    location: "渋谷・カフェスペース",
    color: "#4ecdc4",
  },
  {
    id: "3",
    title: "ハロウィンパーティー",
    date: new Date(2025, 9, 31), // 10月31日
    location: "六本木・イベントホール",
    color: "#ffd93d",
  },
  {
    id: "4",
    title: "クリスマス会",
    date: new Date(2025, 11, 23), // 12月23日
    location: "新宿・レンタルスペース",
    color: "#ff6b6b",
  },
]

export function EventCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth())
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear())

  // 月を進める
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  // 月を戻す
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  // 月の最初の日を取得
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  // 月の最後の日を取得
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
  // 月の最初の日の曜日（0: 日曜日, 1: 月曜日, ..., 6: 土曜日）
  const firstDayOfWeek = firstDayOfMonth.getDay()

  // カレンダーの日付を生成
  const daysInMonth = lastDayOfMonth.getDate()
  const days = []

  // 前月の日を追加
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null)
  }

  // 当月の日を追加
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  // 月の名前
  const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]

  // 曜日の名前
  const weekDayNames = ["日", "月", "火", "水", "木", "金", "土"]

  // 特定の日にイベントがあるかチェック
  const getEventsForDay = (day: number) => {
    if (!day) return []

    return sampleEvents.filter((event) => {
      return (
        event.date.getFullYear() === currentYear &&
        event.date.getMonth() === currentMonth &&
        event.date.getDate() === day
      )
    })
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={prevMonth}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-[#4ecdc4]" />
            <span>
              {currentYear}年 {monthNames[currentMonth]}
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* 曜日の表示 */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDayNames.map((day, index) => (
            <div
              key={index}
              className={`text-center text-sm font-medium p-1 ${index === 0 ? "text-red-500" : index === 6 ? "text-blue-500" : ""}`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* カレンダー本体 */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const events = day ? getEventsForDay(day) : []
            const isToday =
              day &&
              currentYear === new Date().getFullYear() &&
              currentMonth === new Date().getMonth() &&
              day === new Date().getDate()

            return (
              <div
                key={index}
                className={`min-h-[80px] p-1 border rounded-md ${isToday ? "bg-gray-100 border-[#4ecdc4]" : "border-gray-200"}`}
              >
                {day && (
                  <>
                    <div
                      className={`text-right text-sm ${(index + firstDayOfWeek) % 7 === 0 ? "text-red-500" : (index + firstDayOfWeek) % 7 === 6 ? "text-blue-500" : ""}`}
                    >
                      {day}
                    </div>
                    <div className="mt-1">
                      {events.map((event, eventIndex) => (
                        <Link href="#" key={eventIndex}>
                          <div
                            className="text-xs p-1 mb-1 rounded truncate text-white"
                            style={{ backgroundColor: event.color }}
                          >
                            {event.title}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
