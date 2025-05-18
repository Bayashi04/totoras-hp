"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"

export default function ContactPage() {
  // ページ読み込み時に画面上部にスクロール
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-2 text-center">お問い合わせ</h1>
            <p className="text-gray-600 mb-8 text-center">
              イベントやコミュニティに関するご質問・ご相談はこちらからお気軽にお問い合わせください。
            </p>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    お名前 <span className="text-red-500">*</span>
                  </label>
                  <Input id="name" placeholder="山田 太郎" required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    メールアドレス <span className="text-red-500">*</span>
                  </label>
                  <Input id="email" type="email" placeholder="example@email.com" required />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  件名 <span className="text-red-500">*</span>
                </label>
                <Input id="subject" placeholder="お問い合わせの件名" required />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  メッセージ <span className="text-red-500">*</span>
                </label>
                <Textarea id="message" placeholder="お問い合わせ内容を入力してください" rows={6} required />
              </div>

              <div className="flex justify-center">
                <Button type="submit" className="bg-[#4ecdc4] hover:bg-[#4ecdc4]/90 px-8">
                  <Send className="mr-2 h-4 w-4" /> 送信する
                </Button>
              </div>
            </form>

            <div className="mt-12 bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold mb-4">その他のお問い合わせ方法</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">LINE公式アカウント</h3>
                  <p className="text-gray-600 text-sm">
                    LINE公式アカウントからもお問い合わせいただけます。友だち追加後、メッセージをお送りください。
                  </p>
                  <div className="mt-2">
                    <a href="https://lin.ee/DQTr7Il" target="_blank" rel="noopener noreferrer">
                      <img
                        src="https://scdn.line-apps.com/n/line_add_friends/btn/ja.png"
                        alt="友だち追加"
                        height="36"
                        style={{ height: "36px" }}
                      />
                    </a>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">メールでのお問い合わせ</h3>
                  <p className="text-gray-600 text-sm">
                    <a href="mailto:info@totoras.jp" className="text-[#4ecdc4] hover:underline">
                      info@totoras.jp
                    </a>{" "}
                    まで直接メールをお送りいただくこともできます。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
