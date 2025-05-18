"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Instagram, ExternalLink, MessageSquare } from "lucide-react"
import { TOTORASLogo } from "@/components/totoras-logo"

export function Footer() {
  const [adminClickCount, setAdminClickCount] = useState(0)
  const adminTimerRef = useRef<NodeJS.Timeout | null>(null)

  // 管理者モードへのアクセス（ロゴを5回クリックで管理画面リンクを表示）
  const handleLogoClick = () => {
    // 前回のタイマーをクリア
    if (adminTimerRef.current) {
      clearTimeout(adminTimerRef.current)
    }

    // カウントを増やす
    setAdminClickCount((prev) => prev + 1)

    // 3秒後にカウントをリセットするタイマーをセット
    adminTimerRef.current = setTimeout(() => {
      setAdminClickCount(0)
    }, 3000)

    // 5回クリックで管理画面へ
    if (adminClickCount === 4) {
      window.location.href = "/admin/login"
    }
  }

  // コンポーネントのアンマウント時にタイマーをクリア
  useEffect(() => {
    return () => {
      if (adminTimerRef.current) {
        clearTimeout(adminTimerRef.current)
      }
    }
  }, [])

  return (
    <footer className="bg-gray-50 border-t py-8 md:py-12">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image src="/images/logo.png" alt="TOTORAS Logo" width={50} height={50} />
              <div onClick={handleLogoClick}>
                <TOTORASLogo size="md" />
              </div>
            </Link>
            <p className="text-gray-600 mb-6 max-w-md">
              TOTORASは若い世代のためのイベントコミュニティです。 新しい出会いと素敵な思い出を一緒に作りましょう！
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-1 mb-4">
              <span className="w-1 h-6 bg-[#4ecdc4] rounded-full mr-2"></span>
              <h3 className="font-bold text-lg">リンク</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* お問い合わせリンク */}
              <Link href="/contact" className="block h-full">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group h-full">
                  <div className="flex items-start p-4 h-full">
                    <div className="bg-[#4ecdc4] p-2 rounded-full flex-shrink-0 mr-3 group-hover:scale-110 transition-transform mt-1">
                      <MessageSquare className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 flex items-center">
                        お問い合わせ
                        <ExternalLink className="h-3.5 w-3.5 ml-1 text-gray-400 group-hover:text-[#4ecdc4] transition-colors" />
                      </h4>
                      <p className="text-gray-600 text-sm">イベントやコミュニティに関するご質問はこちら</p>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Instagramリンク */}
              <Link
                href="https://www.instagram.com/totoras_community"
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full"
                aria-label="TOTORASのInstagramページ"
              >
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group h-full">
                  <div className="flex items-start p-4 h-full">
                    <div className="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] p-2 rounded-full flex-shrink-0 mr-3 group-hover:scale-110 transition-transform mt-1">
                      <Instagram className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 flex items-center">
                        Instagram
                        <ExternalLink className="h-3.5 w-3.5 ml-1 text-gray-400 group-hover:text-[#FD1D1D] transition-colors" />
                      </h4>
                      <p className="text-gray-600 text-sm">イベント写真や最新情報をチェック</p>
                    </div>
                  </div>
                </div>
              </Link>

              {/* LINE公式アカウント */}
              <Link
                href="https://lin.ee/DQTr7Il"
                target="_blank"
                rel="noopener noreferrer"
                className="block sm:col-span-2"
              >
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                  <div className="p-4">
                    <div className="flex items-start">
                      <div className="bg-[#06C755] p-2 rounded-full flex-shrink-0 mr-3 group-hover:scale-110 transition-transform mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5 text-white"
                        >
                          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 flex items-center">
                          LINE公式アカウント
                          <ExternalLink className="h-3.5 w-3.5 ml-1 text-gray-400 group-hover:text-[#06C755] transition-colors" />
                        </h4>
                        <p className="text-gray-600 text-sm">イベント申し込みやお知らせをLINEで簡単に受け取れます</p>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-center sm:justify-start">
                      <img
                        src="https://scdn.line-apps.com/n/line_add_friends/btn/ja.png"
                        alt="友だち追加"
                        height="36"
                        width="118"
                        style={{ height: "36px" }}
                        className="border-0"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* コピーライト情報をページ最下部に配置 */}
        <div className="border-t mt-8 md:mt-10 pt-4 md:pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} TOTORAS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
