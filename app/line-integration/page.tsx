import { LineIntegration } from "@/components/line-integration"
import { EventLineIntegration } from "@/components/event-line-integration"

export default function LineIntegrationPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">TOTORAS LINE連携</h1>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          TOTORASの公式LINEアカウントを友だち追加して、イベント情報の受け取りや参加申し込みを簡単に行いましょう。
          LINE連携で、よりスムーズなイベント参加体験を提供します。
        </p>

        <LineIntegration />

        <h2 className="text-2xl font-bold mt-16 mb-6 text-center">LINE連携イベント</h2>
        <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
          以下のイベントはLINEから簡単に申し込みができます。 公式LINEを友だち追加して、スムーズに参加しましょう！
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <EventLineIntegration
            eventTitle="夏のBBQパーティー"
            eventDate="2025年7月20日"
            eventLocation="東京・代々木公園"
            color="#ff6b6b"
          />
          <EventLineIntegration
            eventTitle="ボードゲーム大会"
            eventDate="2025年8月5日"
            eventLocation="渋谷・カフェスペース"
            color="#4ecdc4"
          />
          <EventLineIntegration
            eventTitle="ハロウィンパーティー"
            eventDate="2025年10月31日"
            eventLocation="六本木・イベントホール"
            color="#ffd93d"
          />
        </div>
      </div>
    </div>
  )
}
