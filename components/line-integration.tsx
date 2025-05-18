"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Calendar } from "lucide-react"

export function LineIntegration() {
  const [copied, setCopied] = useState(false)

  const handleCopyId = () => {
    navigator.clipboard.writeText("@totoras")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-[#4ecdc4]/10 to-[#ffd93d]/10 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-2xl">
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
            className="h-6 w-6 text-[#06C755]"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          TOTORAS 公式LINE
        </CardTitle>
        <CardDescription>イベント情報やお知らせをLINEで受け取り、簡単に参加申し込みができます</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="features" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="features">主な機能</TabsTrigger>
            <TabsTrigger value="howto">友だち追加方法</TabsTrigger>
            <TabsTrigger value="benefits">メリット</TabsTrigger>
          </TabsList>

          <TabsContent value="features" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Calendar className="h-6 w-6 text-[#ff6b6b] mt-1" />
                <div>
                  <h4 className="font-bold text-lg">イベント申し込み</h4>
                  <p className="text-gray-600 text-sm">LINEから簡単にイベントへの参加申し込みができます</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Bell className="h-6 w-6 text-[#4ecdc4] mt-1" />
                <div>
                  <h4 className="font-bold text-lg">リマインド通知</h4>
                  <p className="text-gray-600 text-sm">イベント前日に自動でリマインド通知が届きます</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
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
                  className="h-6 w-6 text-[#ffd93d] mt-1"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
                <div>
                  <h4 className="font-bold text-lg">イベント情報</h4>
                  <p className="text-gray-600 text-sm">最新のイベント情報をいち早くお届けします</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
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
                  className="h-6 w-6 text-[#ff6b6b] mt-1"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
                <div>
                  <h4 className="font-bold text-lg">PayPay決済</h4>
                  <p className="text-gray-600 text-sm">イベント参加費をPayPayで簡単に支払えます</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="howto">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="md:w-1/2 flex justify-center">
                <div className="bg-white p-4 rounded-lg shadow-sm inline-block">
                  <Image src="/qr-code.png" alt="LINE QRコード" width={200} height={200} className="mx-auto" />
                  <div className="text-center mt-2">
                    <p className="text-sm text-gray-500">LINE ID: @totoras</p>
                    <button onClick={handleCopyId} className="text-xs text-[#4ecdc4] hover:underline mt-1">
                      {copied ? "コピーしました！" : "IDをコピー"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="md:w-1/2">
                <h3 className="font-bold text-xl mb-4">友だち追加方法</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="bg-[#ff6b6b] text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      1
                    </span>
                    <p>QRコードをスキャンして友だち追加</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-[#4ecdc4] text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      2
                    </span>
                    <p>
                      LINE IDで検索：<span className="font-medium">@totoras</span>
                    </p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-[#ffd93d] text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      3
                    </span>
                    <p>下のボタンから直接友だち追加</p>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="benefits">
            <div className="space-y-4">
              <div className="border-l-4 border-[#ff6b6b] pl-4 py-2">
                <h4 className="font-bold">イベント情報をリアルタイムで受け取れる</h4>
                <p className="text-gray-600 text-sm">
                  新しいイベントが公開されたらすぐにLINEで通知が届きます。人気イベントの申し込み開始もお見逃しなく！
                </p>
              </div>
              <div className="border-l-4 border-[#4ecdc4] pl-4 py-2">
                <h4 className="font-bold">申し込み・キャンセルが簡単</h4>
                <p className="text-gray-600 text-sm">
                  イベントへの参加申し込みやキャンセルがLINE上で数タップで完了します。面倒な入力は不要です。
                </p>
              </div>
              <div className="border-l-4 border-[#ffd93d] pl-4 py-2">
                <h4 className="font-bold">PayPay決済でスムーズに支払い</h4>
                <p className="text-gray-600 text-sm">
                  イベント参加費の支払いがPayPayで簡単に行えます。現金不要で手続きがスムーズに完了します。
                </p>
              </div>
              <div className="border-l-4 border-[#ff6b6b] pl-4 py-2">
                <h4 className="font-bold">特典情報をいち早くゲット</h4>
                <p className="text-gray-600 text-sm">
                  LINE友だち限定の特典やクーポン、先行予約情報などをいち早くお届けします。
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="bg-gray-50 rounded-b-lg flex flex-col sm:flex-row gap-4 items-center justify-between p-6">
        <p className="text-sm text-gray-600 text-center sm:text-left">
          TOTORASの公式LINEアカウントを友だち追加して、
          <br className="hidden sm:inline" />
          イベント情報やお得な情報をゲットしましょう！
        </p>
        <a href="https://lin.ee/DQTr7Il" target="_blank" rel="noopener noreferrer" className="inline-block">
          <img
            src="https://scdn.line-apps.com/n/line_add_friends/btn/ja.png"
            alt="友だち追加"
            style={{ height: "32px" }}
            className="border-0"
          />
        </a>
      </CardFooter>
    </Card>
  )
}
