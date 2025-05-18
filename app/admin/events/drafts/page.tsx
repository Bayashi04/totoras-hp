"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ChevronLeft, Edit, Trash2, Calendar, MapPin, Clock, Eye, Save, AlertCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"

// イベントデータの型定義
interface EventData {
  id: string
  title: string
  date: string
  time: string
  location: string
  image: string
  description: string
  cautions: string
  price: string
  capacity: string
  category: string
  items: string[]
  color: string
  status?: "published" | "draft"
  lastUpdated?: number // 最終更新日時
}

export default function EventDraftsPage() {
  const router = useRouter()
  const [drafts, setDrafts] = useState<EventData[]>([])
  const [selectedDraft, setSelectedDraft] = useState<EventData | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [draftToDelete, setDraftToDelete] = useState<string | null>(null)

  // ページ読み込み時に画面上部にスクロール
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // ローカルストレージから下書きデータを読み込む
  useEffect(() => {
    const loadDrafts = () => {
      const savedDrafts = localStorage.getItem("eventDrafts")
      if (savedDrafts) {
        try {
          const parsedDrafts = JSON.parse(savedDrafts) as EventData[]
          // 最新の更新順にソート
          parsedDrafts.sort((a, b) => (b.lastUpdated || 0) - (a.lastUpdated || 0))
          setDrafts(parsedDrafts)
        } catch (e) {
          console.error("下書きデータの読み込みに失敗しました", e)
          setDrafts([])
        }
      }
    }

    loadDrafts()
  }, [])

  // 下書き削除処理
  const deleteDraft = (id: string) => {
    const updatedDrafts = drafts.filter((draft) => draft.id !== id)
    setDrafts(updatedDrafts)
    localStorage.setItem("eventDrafts", JSON.stringify(updatedDrafts))
    setDraftToDelete(null)
  }

  // 下書きの編集を再開
  const continueDraftEditing = (id: string) => {
    router.push(`/admin/events/edit/${id}?source=draft`)
  }

  // 下書きを公開する
  const publishDraft = (draft: EventData) => {
    // ここでは仮の実装としてステータスを変更するだけ
    // 実際のアプリケーションではAPIを呼び出して公開処理を行う
    const publishedDraft = { ...draft, status: "published" as const }

    // 下書きリストから削除
    const updatedDrafts = drafts.filter((d) => d.id !== draft.id)
    localStorage.setItem("eventDrafts", JSON.stringify(updatedDrafts))

    // 成功メッセージ
    alert(`「${draft.title}」を公開しました`)

    // 下書きリストを更新
    setDrafts(updatedDrafts)
  }

  // 日付をフォーマット
  const formatDate = (timestamp: number) => {
    if (!timestamp) return "不明"
    return new Date(timestamp).toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="bg-gray-50 py-8 md:py-12 border-b">
        <div className="container px-4 mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">下書き一覧</h1>
          <p className="text-gray-600 max-w-2xl">
            保存した下書きイベントを管理します。編集を再開したり、プレビューで確認したりできます。
          </p>
        </div>
      </div>

      <div className="container px-4 mx-auto py-8 md:py-12">
        <Link
          href="/admin/events"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          イベント管理に戻る
        </Link>

        {drafts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <AlertCircle className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-bold mb-2">下書きがありません</h3>
            <p className="text-gray-600 mb-6">
              イベント編集画面で「下書き保存」ボタンをクリックすると、ここに表示されます。
            </p>
            <Link href="/admin/events/edit/new">
              <Button className="bg-[#4ecdc4] hover:bg-[#4ecdc4]/90">新規イベント作成</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drafts.map((draft) => (
              <Card key={draft.id} className="overflow-hidden h-full flex flex-col">
                <div className="relative h-40">
                  <Image
                    src={draft.image || "/placeholder.svg"}
                    alt={draft.title || "無題のイベント"}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 opacity-30" style={{ backgroundColor: draft.color }} />
                  <div
                    className="absolute top-3 right-3 px-3 py-1 rounded-full text-white text-xs font-medium"
                    style={{ backgroundColor: draft.color }}
                  >
                    {draft.category}
                  </div>
                  <Badge className="absolute top-3 left-3" variant="outline">
                    下書き
                  </Badge>
                </div>
                <CardContent className="p-5 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold mb-3">{draft.title || "無題のイベント"}</h3>

                  {draft.date && (
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(draft.date).toLocaleDateString("ja-JP")}</span>
                    </div>
                  )}

                  {draft.location && (
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>{draft.location}</span>
                    </div>
                  )}

                  {draft.time && (
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <Clock className="h-4 w-4" />
                      <span>{draft.time}</span>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 mb-4">最終更新: {formatDate(draft.lastUpdated || 0)}</div>

                  <div className="mt-auto pt-4 flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 gap-1"
                        onClick={() => {
                          setSelectedDraft(draft)
                          setIsPreviewOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                        プレビュー
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-amber-200 text-amber-600 hover:bg-amber-50 gap-1"
                        onClick={() => continueDraftEditing(draft.id)}
                      >
                        <Edit className="h-4 w-4" />
                        編集
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 border-green-200 text-green-600 hover:bg-green-50 gap-1"
                        onClick={() => publishDraft(draft)}
                      >
                        <Save className="h-4 w-4" />
                        公開
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex-1 border-red-200 text-red-600 hover:bg-red-50 gap-1"
                            onClick={() => setDraftToDelete(draft.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            削除
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>下書きを削除しますか？</AlertDialogTitle>
                            <AlertDialogDescription>
                              この操作は元に戻せません。下書き「{draft.title || "無題のイベント"}
                              」を削除してもよろしいですか？
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>キャンセル</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-500 hover:bg-red-600"
                              onClick={() => deleteDraft(draft.id)}
                            >
                              削除する
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* イベントプレビューダイアログ */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>イベントプレビュー</DialogTitle>
            <DialogDescription>実際の表示イメージを確認できます</DialogDescription>
          </DialogHeader>

          {selectedDraft && (
            <div className="mt-4 border rounded-lg p-6 bg-white">
              <div className="relative h-64 rounded-lg overflow-hidden mb-6">
                <Image
                  src={selectedDraft.image || "/placeholder.svg"}
                  alt={selectedDraft.title || "無題のイベント"}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 opacity-30" style={{ backgroundColor: selectedDraft.color }} />
                <div
                  className="absolute top-4 right-4 px-3 py-1 rounded-full text-white text-sm font-medium"
                  style={{ backgroundColor: selectedDraft.color }}
                >
                  {selectedDraft.category}
                </div>
              </div>

              <h1 className="text-3xl font-bold mb-4">{selectedDraft.title || "（タイトルなし）"}</h1>

              <div className="flex flex-wrap gap-4 mb-6">
                {selectedDraft.date && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="h-5 w-5 text-[#4ecdc4]" />
                    <span>
                      {new Date(selectedDraft.date).toLocaleDateString("ja-JP", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}

                {selectedDraft.time && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="h-5 w-5 text-[#ffd93d]" />
                    <span>{selectedDraft.time}</span>
                  </div>
                )}

                {selectedDraft.location && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="h-5 w-5 text-[#ff6b6b]" />
                    <span>{selectedDraft.location}</span>
                  </div>
                )}
              </div>

              <div className="prose max-w-none mb-8">
                {selectedDraft.description ? (
                  selectedDraft.description.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-700">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-400">（説明文がありません）</p>
                )}
              </div>

              {selectedDraft.cautions && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-3 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
                    注意事項
                  </h3>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h4 className="text-amber-800 font-medium">参加前にご確認ください</h4>
                    <ul className="list-disc list-inside space-y-1 text-amber-700 mt-2">
                      {selectedDraft.cautions.split("\n").map((caution, index) => (
                        <li key={index}>{caution}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {selectedDraft.items && selectedDraft.items.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-3">持ち物</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {selectedDraft.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">参加費</span>
                  <span className="font-medium">{selectedDraft.price || "（未設定）"}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">定員</span>
                  <span className="font-medium">{selectedDraft.capacity || "（未設定）"}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              閉じる
            </Button>
            {selectedDraft && (
              <Button
                className="bg-[#4ecdc4] hover:bg-[#4ecdc4]/90"
                onClick={() => {
                  setIsPreviewOpen(false)
                  continueDraftEditing(selectedDraft.id)
                }}
              >
                編集する
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </main>
  )
}
