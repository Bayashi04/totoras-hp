"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, Plus, Edit, Trash2, FileText } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 注意事項テンプレートの型定義
interface CautionTemplate {
  id: string
  name: string
  content: string
  category: string
}

// 初期テンプレートデータ
const initialTemplates: CautionTemplate[] = [
  {
    id: "weather",
    name: "雨天中止ポリシー",
    content: "雨天の場合は中止となります。中止の場合は前日までにLINEでご連絡いたします。\n参加費は全額返金いたします。",
    category: "一般",
  },
  {
    id: "alcohol",
    name: "アルコール注意事項",
    content:
      "アルコールを提供するイベントのため、20歳未満の方は参加できません。\n当日は身分証明書をご持参ください。\n飲酒される方は公共交通機関をご利用ください。",
    category: "一般",
  },
  {
    id: "cancel",
    name: "キャンセルポリシー",
    content:
      "キャンセルは開催日の3日前まで受け付けております。\n3日前〜前日のキャンセル：参加費の50%\n当日のキャンセル：参加費の100%\nキャンセルの際は必ずLINEでご連絡ください。",
    category: "一般",
  },
  {
    id: "valuables",
    name: "貴重品管理",
    content: "貴重品の管理は各自でお願いいたします。\n紛失・盗難等について、主催者側は一切の責任を負いかねます。",
    category: "一般",
  },
  {
    id: "photo",
    name: "写真撮影について",
    content:
      "イベント中に撮影した写真は、TOTORASのSNSやウェブサイトで使用させていただく場合があります。\n写真掲載を希望されない方は、事前にスタッフにお申し出ください。",
    category: "一般",
  },
  {
    id: "sauna",
    name: "サウナイベント注意事項",
    content:
      "サウナ初心者の方も参加可能ですが、持病をお持ちの方は事前に医師にご相談ください。\n水分補給はこまめに行ってください。\n体調が優れない場合は無理をせず、スタッフにお声がけください。",
    category: "サウナ",
  },
  {
    id: "futsal",
    name: "フットサル注意事項",
    content:
      "運動に適した服装と室内シューズをご持参ください。\nケガ防止のため、アクセサリー類は外してご参加ください。\n水分補給用の飲み物をご持参ください。",
    category: "フットサル",
  },
  {
    id: "workshop",
    name: "ワークショップ注意事項",
    content:
      "材料費は参加費に含まれています。\n汚れても良い服装でお越しください。\n作品のお持ち帰り用の袋をご持参いただくことをおすすめします。",
    category: "ワークショップ",
  },
]

// 利用可能なカテゴリ
const categories = ["一般", "サウナ", "フットサル", "ワークショップ", "その他"]

export default function TemplatesPage() {
  // ページ読み込み時に画面上部にスクロール
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const router = useRouter()
  const [templates, setTemplates] = useState<CautionTemplate[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [editingTemplate, setEditingTemplate] = useState<CautionTemplate | null>(null)
  const [newTemplate, setNewTemplate] = useState<Omit<CautionTemplate, "id">>({
    name: "",
    content: "",
    category: "一般",
  })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // ローカルストレージからテンプレートを読み込む
  useEffect(() => {
    const storedTemplates = localStorage.getItem("cautionTemplates")
    if (storedTemplates) {
      setTemplates(JSON.parse(storedTemplates))
    } else {
      // 初期データを設定
      setTemplates(initialTemplates)
      localStorage.setItem("cautionTemplates", JSON.stringify(initialTemplates))
    }
  }, [])

  // テンプレートの保存
  const saveTemplates = (updatedTemplates: CautionTemplate[]) => {
    setTemplates(updatedTemplates)
    localStorage.setItem("cautionTemplates", JSON.stringify(updatedTemplates))
  }

  // フィルタリングされたテンプレート
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.content.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = activeTab === "all" || template.category.toLowerCase() === activeTab.toLowerCase()

    return matchesSearch && matchesCategory
  })

  // 新規テンプレートの追加
  const handleAddTemplate = () => {
    // バリデーション
    const newErrors: Record<string, string> = {}
    if (!newTemplate.name.trim()) newErrors.name = "テンプレート名を入力してください"
    if (!newTemplate.content.trim()) newErrors.content = "内容を入力してください"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // 新しいIDを生成
    const newId = `template-${Date.now()}`
    const templateToAdd = {
      id: newId,
      ...newTemplate,
    }

    // テンプレートを追加
    const updatedTemplates = [...templates, templateToAdd]
    saveTemplates(updatedTemplates)

    // フォームをリセット
    setNewTemplate({
      name: "",
      content: "",
      category: "一般",
    })
    setIsAddDialogOpen(false)
    setErrors({})
  }

  // テンプレートの編集
  const handleEditTemplate = () => {
    if (!editingTemplate) return

    // バリデーション
    const newErrors: Record<string, string> = {}
    if (!editingTemplate.name.trim()) newErrors.name = "テンプレート名を入力してください"
    if (!editingTemplate.content.trim()) newErrors.content = "内容を入力してください"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // テンプレートを更新
    const updatedTemplates = templates.map((template) =>
      template.id === editingTemplate.id ? editingTemplate : template,
    )
    saveTemplates(updatedTemplates)

    setIsEditDialogOpen(false)
    setEditingTemplate(null)
    setErrors({})
  }

  // テンプレートの削除
  const handleDeleteTemplate = (id: string) => {
    const updatedTemplates = templates.filter((template) => template.id !== id)
    saveTemplates(updatedTemplates)
    setTemplateToDelete(null)
  }

  // 編集ダイアログを開く
  const openEditDialog = (template: CautionTemplate) => {
    setEditingTemplate({ ...template })
    setIsEditDialogOpen(true)
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="bg-gray-50 py-8 md:py-12 border-b">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">注意事項テンプレート管理</h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            イベント作成時に使用する注意事項テンプレートの追加、編集、削除を行うことができます。
          </p>
        </div>
      </div>

      <div className="container px-4 mx-auto py-8 md:py-12">
        <div className="flex flex-wrap gap-4 mb-6">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            ダッシュボードに戻る
          </Link>
          <Link
            href="/admin/events"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            イベント管理に戻る
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="w-full md:w-auto">
            <Input
              placeholder="テンプレートを検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#4ecdc4] hover:bg-[#4ecdc4]/90 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                新規テンプレート作成
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>新規テンプレート作成</DialogTitle>
                <DialogDescription>注意事項テンプレートを作成します。</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    テンプレート名 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                    placeholder="例: キャンセルポリシー"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">カテゴリ</Label>
                  <Select
                    value={newTemplate.category}
                    onValueChange={(value) => setNewTemplate({ ...newTemplate, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="カテゴリを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">
                    内容 <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="content"
                    value={newTemplate.content}
                    onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                    placeholder="テンプレートの内容を入力してください"
                    className={`min-h-[150px] ${errors.content ? "border-red-500" : ""}`}
                  />
                  {errors.content && <p className="text-red-500 text-sm">{errors.content}</p>}
                  <p className="text-gray-500 text-xs">※ 複数の注意事項を記載する場合は、改行で区切ってください。</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  キャンセル
                </Button>
                <Button onClick={handleAddTemplate} className="bg-[#4ecdc4] hover:bg-[#4ecdc4]/90">
                  作成する
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">すべて</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category.toLowerCase()}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">テンプレートが見つかりませんでした</h3>
                <p className="text-gray-600 mb-6">検索条件を変更するか、新しいテンプレートを作成してください。</p>
                <Button onClick={() => setIsAddDialogOpen(true)} className="bg-[#4ecdc4] hover:bg-[#4ecdc4]/90">
                  新規テンプレート作成
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                  <Card key={template.id} className="overflow-hidden h-full flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <div className="text-xs text-gray-500 mt-1">カテゴリ: {template.category}</div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(template)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => setTemplateToDelete(template.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>テンプレートを削除しますか？</AlertDialogTitle>
                                <AlertDialogDescription>
                                  この操作は元に戻せません。テンプレート「{template.name}」を削除してもよろしいですか？
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-500 hover:bg-red-600"
                                  onClick={() => handleDeleteTemplate(template.id)}
                                >
                                  削除する
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2 flex-grow">
                      <div className="text-gray-700 whitespace-pre-line line-clamp-4 text-sm">{template.content}</div>
                    </CardContent>
                    <CardContent className="pt-0">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full">
                            プレビュー
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>{template.name}</DialogTitle>
                            <DialogDescription>カテゴリ: {template.category}</DialogDescription>
                          </DialogHeader>
                          <div className="bg-gray-50 p-4 rounded-md my-2">
                            <div className="whitespace-pre-line text-gray-700">{template.content}</div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* 編集ダイアログ */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>テンプレート編集</DialogTitle>
              <DialogDescription>注意事項テンプレートを編集します。</DialogDescription>
            </DialogHeader>
            {editingTemplate && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">
                    テンプレート名 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="edit-name"
                    value={editingTemplate.name}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                    placeholder="例: キャンセルポリシー"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">カテゴリ</Label>
                  <Select
                    value={editingTemplate.category}
                    onValueChange={(value) => setEditingTemplate({ ...editingTemplate, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="カテゴリを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-content">
                    内容 <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="edit-content"
                    value={editingTemplate.content}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, content: e.target.value })}
                    placeholder="テンプレートの内容を入力してください"
                    className={`min-h-[150px] ${errors.content ? "border-red-500" : ""}`}
                  />
                  {errors.content && <p className="text-red-500 text-sm">{errors.content}</p>}
                  <p className="text-gray-500 text-xs">※ 複数の注意事項を記載する場合は、改行で区切ってください。</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                キャンセル
              </Button>
              <Button onClick={handleEditTemplate} className="bg-[#4ecdc4] hover:bg-[#4ecdc4]/90">
                保存する
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Footer />
    </main>
  )
}
