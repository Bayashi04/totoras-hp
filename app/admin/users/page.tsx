"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Users,
  Plus,
  Edit,
  Trash2,
  ShieldAlert,
  ShieldCheck,
  Eye,
  Search,
  RefreshCw,
  Check,
  X,
  ChevronLeft,
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"

// 管理者ユーザーの型定義（パスワードなし）
type AdminUserWithoutPassword = {
  id: string
  username: string
  email: string
  role: "admin" | "editor" | "viewer"
  createdAt: string
  updatedAt: string
  lastLogin?: string
  isActive: boolean
}

// 権限レベルの表示名とアイコン
const roleConfig = {
  admin: {
    label: "管理者",
    icon: <ShieldAlert className="h-4 w-4 text-red-500" />,
    description: "すべての機能にアクセスできます",
    badgeVariant: "destructive" as const,
  },
  editor: {
    label: "編集者",
    icon: <ShieldCheck className="h-4 w-4 text-amber-500" />,
    description: "コンテンツの作成と編集ができます",
    badgeVariant: "default" as const,
  },
  viewer: {
    label: "閲覧者",
    icon: <Eye className="h-4 w-4 text-blue-500" />,
    description: "コンテンツの閲覧のみ可能です",
    badgeVariant: "secondary" as const,
  },
}

// サンプルユーザーデータ
const sampleUsers: AdminUserWithoutPassword[] = [
  {
    id: "admin-1",
    username: "管理者",
    email: "admin@example.com",
    role: "admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    isActive: true,
  },
]

export default function AdminUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<AdminUserWithoutPassword[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<AdminUserWithoutPassword | null>(null)

  // 新規ユーザーフォーム状態
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "editor" as "admin" | "editor" | "viewer",
  })

  // 編集ユーザーフォーム状態
  const [editUser, setEditUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "editor" as "admin" | "editor" | "viewer",
    isActive: true,
  })

  // ページ読み込み時に画面上部にスクロール
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // 管理者ユーザー一覧を取得
  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      // APIエンドポイントが実装されるまでは、ローカルストレージから取得
      const storedUsers = localStorage.getItem("adminUsers")
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers))
      } else {
        // サンプルデータを設定
        setUsers(sampleUsers)
        localStorage.setItem("adminUsers", JSON.stringify(sampleUsers))
      }
    } catch (error) {
      console.error("管理者ユーザー取得エラー:", error)
      toast({
        title: "エラー",
        description: "管理者ユーザーの取得に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 初回読み込み時にユーザー一覧を取得
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true)
      try {
        // APIエンドポイントが存在するか確認
        const testResponse = await fetch("/api/admin/users", { method: "HEAD" }).catch(() => null)

        if (testResponse && testResponse.ok) {
          // APIが存在する場合はAPIを使用
          const response = await fetch("/api/admin/users")
          if (!response.ok) {
            throw new Error("ユーザー情報の取得に失敗しました")
          }
          const data = await response.json()
          setUsers(data.users)
        } else {
          // APIが存在しない場合はローカルストレージを使用
          const storedUsers = localStorage.getItem("admin_users")
          if (storedUsers) {
            setUsers(JSON.parse(storedUsers))
          } else {
            // 初期データがない場合は管理者ユーザーを作成
            const initialUsers = [
              {
                id: "1",
                username: "admin",
                role: "admin",
                createdAt: new Date().toISOString(),
              },
            ]
            localStorage.setItem("admin_users", JSON.stringify(initialUsers))
            setUsers(initialUsers)
          }
        }
      } catch (error) {
        console.error("ユーザー情報取得エラー:", error)
        toast({
          variant: "destructive",
          title: "エラー",
          description: "ユーザー情報の取得に失敗しました。",
        })

        // エラー時はローカルストレージを確認
        const storedUsers = localStorage.getItem("admin_users")
        if (storedUsers) {
          setUsers(JSON.parse(storedUsers))
        } else {
          // ローカルストレージにもない場合はダミーデータを表示
          setUsers([
            {
              id: "1",
              username: "admin",
              role: "admin",
              createdAt: new Date().toISOString(),
            },
          ])
        }
      } finally {
        setIsLoading(false)
      }
    }

    // ページ読み込み時に画面上部にスクロール
    window.scrollTo(0, 0)

    fetchUsers()
  }, [toast])

  // 検索フィルター
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // 新規ユーザー作成
  const handleCreateUser = () => {
    try {
      // バリデーション
      if (!newUser.username || !newUser.email || !newUser.password) {
        toast({
          title: "入力エラー",
          description: "すべての必須項目を入力してください",
          variant: "destructive",
        })
        return
      }

      // 新しいユーザーを作成
      const newUserId = `user-${Date.now()}`
      const now = new Date().toISOString()

      const createdUser: AdminUserWithoutPassword = {
        id: newUserId,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        createdAt: now,
        updatedAt: now,
        isActive: true,
      }

      // ユーザーリストに追加
      const updatedUsers = [...users, createdUser]
      setUsers(updatedUsers)
      localStorage.setItem("adminUsers", JSON.stringify(updatedUsers))

      // 成功したらフォームをリセットしてダイアログを閉じる
      setNewUser({
        username: "",
        email: "",
        password: "",
        role: "editor",
      })
      setIsCreateDialogOpen(false)

      toast({
        title: "成功",
        description: "管理者ユーザーを作成しました",
      })
    } catch (error: any) {
      console.error("管理者ユーザー作成エラー:", error)
      toast({
        title: "エラー",
        description: error.message || "管理者ユーザーの作成に失敗しました",
        variant: "destructive",
      })
    }
  }

  // ユーザー編集ダイアログを開く
  const openEditDialog = (user: AdminUserWithoutPassword) => {
    setSelectedUser(user)
    setEditUser({
      username: user.username,
      email: user.email,
      password: "", // パスワードは空にしておく
      role: user.role,
      isActive: user.isActive,
    })
    setIsEditDialogOpen(true)
  }

  // ユーザー削除ダイアログを開く
  const openDeleteDialog = (user: AdminUserWithoutPassword) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  // ユーザー編集
  const handleEditUser = () => {
    if (!selectedUser) return

    try {
      // バリデーション
      if (!editUser.username || !editUser.email) {
        toast({
          title: "入力エラー",
          description: "ユーザー名とメールアドレスは必須です",
          variant: "destructive",
        })
        return
      }

      // ユーザーを更新
      const now = new Date().toISOString()
      const updatedUsers = users.map((user) => {
        if (user.id === selectedUser.id) {
          return {
            ...user,
            username: editUser.username,
            email: editUser.email,
            role: editUser.role,
            isActive: editUser.isActive,
            updatedAt: now,
          }
        }
        return user
      })

      setUsers(updatedUsers)
      localStorage.setItem("adminUsers", JSON.stringify(updatedUsers))

      // ダイアログを閉じる
      setIsEditDialogOpen(false)

      toast({
        title: "成功",
        description: "管理者ユーザーを更新しました",
      })
    } catch (error: any) {
      console.error("管理者ユーザー更新エラー:", error)
      toast({
        title: "エラー",
        description: error.message || "管理者ユーザーの更新に失敗しました",
        variant: "destructive",
      })
    }
  }

  // ユーザー削除
  const handleDeleteUser = () => {
    if (!selectedUser) return

    try {
      // ユーザーを削除
      const updatedUsers = users.filter((user) => user.id !== selectedUser.id)
      setUsers(updatedUsers)
      localStorage.setItem("adminUsers", JSON.stringify(updatedUsers))

      // ダイアログを閉じる
      setIsDeleteDialogOpen(false)

      toast({
        title: "成功",
        description: "管理者ユーザーを削除しました",
      })
    } catch (error: any) {
      console.error("管理者ユーザー削除エラー:", error)
      toast({
        title: "エラー",
        description: error.message || "管理者ユーザーの削除に失敗しました",
        variant: "destructive",
      })
    }
  }

  // 日時フォーマット
  const formatDate = (dateString?: string) => {
    if (!dateString) return "なし"
    return new Date(dateString).toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // APIエンドポイントが存在するか確認
      const testResponse = await fetch("/api/admin/users", { method: "HEAD" }).catch(() => null)

      if (testResponse && testResponse.ok) {
        // APIが存在する場合はAPIを使用
        const response = await fetch("/api/admin/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: newUser.username,
            password: newUser.password,
            role: newUser.role,
          }),
        })

        if (!response.ok) {
          throw new Error("ユーザー登録に失敗しました")
        }

        // 成功したら新しいユーザーを追加
        const data = await response.json()
        setUsers([...users, data.user])
      } else {
        // APIが存在しない場合はローカルストレージを使用
        const newUserObj = {
          id: `user_${Date.now()}`,
          username: newUser.username,
          password: newUser.password, // 実際のアプリではハッシュ化すべき
          role: newUser.role,
          createdAt: new Date().toISOString(),
        }

        // ローカルストレージから既存のユーザーを取得
        const storedUsers = localStorage.getItem("admin_users")
        const existingUsers = storedUsers ? JSON.parse(storedUsers) : []

        // 新しいユーザーを追加
        const updatedUsers = [...existingUsers, newUserObj]
        localStorage.setItem("admin_users", JSON.stringify(updatedUsers))

        // 状態を更新
        setUsers([...users, newUserObj])
      }

      // 共通の成功処理
      setNewUser({ username: "", password: "", role: "editor" })
      setIsAddUserDialogOpen(false)
      toast({
        title: "ユーザーを追加しました",
        description: `${newUser.username}を${getRoleText(newUser.role)}として登録しました`,
      })

      // アクティビティログに記録
      logActivity("create", "user", newUser.username, `新しい${getRoleText(newUser.role)}を追加しました`)
    } catch (error) {
      console.error("ユーザー登録エラー:", error)
      toast({
        variant: "destructive",
        title: "エラー",
        description: "ユーザー登録に失敗しました。もう一度お試しください。",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case "admin":
        return "管理者"
      case "editor":
        return "編集者"
      case "viewer":
        return "閲覧者"
      default:
        return "不明なロール"
    }
  }

  const logActivity = (action: string, resourceType: string, resourceName: string, description: string) => {
    console.log(`Activity: ${action} ${resourceType} ${resourceName} - ${description}`)
  }

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Users className="mr-2 h-6 w-6 text-[#4ecdc4]" />
              管理者ユーザー
            </h1>
            <p className="text-gray-600">管理者ユーザーの登録・編集・削除</p>
          </div>

          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
            <Link href="/admin/dashboard">
              <Button variant="outline" className="flex items-center">
                <ChevronLeft className="mr-2 h-4 w-4" />
                ダッシュボードに戻る
              </Button>
            </Link>

            <Button
              className="bg-[#4ecdc4] hover:bg-[#3dbdab] flex items-center"
              onClick={() => setIsAddUserDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              新規ユーザー登録
            </Button>
          </div>
        </div>

        {/* 検索バー */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="ユーザー名またはメールアドレスで検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={fetchUsers} className="whitespace-nowrap">
            <RefreshCw className="mr-2 h-4 w-4" />
            更新
          </Button>
        </div>

        {/* ユーザー一覧 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">管理者ユーザー一覧</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">読み込み中...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {searchQuery ? "検索条件に一致するユーザーはありません" : "管理者ユーザーはまだ登録されていません"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left font-medium text-gray-500">ユーザー名</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">メールアドレス</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">権限</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">ステータス</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">最終ログイン</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-500">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{user.username}</td>
                        <td className="px-4 py-3">{user.email}</td>
                        <td className="px-4 py-3">
                          <Badge variant={roleConfig[user.role].badgeVariant} className="flex items-center w-fit">
                            {roleConfig[user.role].icon}
                            <span className="ml-1">{roleConfig[user.role].label}</span>
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          {user.isActive ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <Check className="mr-1 h-3 w-3" />
                              有効
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              <X className="mr-1 h-3 w-3" />
                              無効
                            </Badge>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">{formatDate(user.lastLogin)}</td>
                        <td className="px-4 py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">編集</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditDialog(user)}>
                                <Edit className="mr-2 h-4 w-4" />
                                編集
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openDeleteDialog(user)} className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                削除
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 新規ユーザー登録ダイアログ */}
        <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>新規管理者ユーザー登録</DialogTitle>
              <DialogDescription>新しい管理者ユーザーを作成します。必要な情報を入力してください。</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddUser}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">ユーザー名</Label>
                  <Input
                    id="username"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    placeholder="例: 山田太郎"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">パスワード</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="8文字以上の強力なパスワード"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">権限</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value: "admin" | "editor" | "viewer") => setNewUser({ ...newUser, role: value })}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="権限を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin" className="flex items-center">
                        <div className="flex items-center">
                          {roleConfig.admin.icon}
                          <span className="ml-2">{roleConfig.admin.label}</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="editor">
                        <div className="flex items-center">
                          {roleConfig.editor.icon}
                          <span className="ml-2">{roleConfig.editor.label}</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="viewer">
                        <div className="flex items-center">
                          {roleConfig.viewer.icon}
                          <span className="ml-2">{roleConfig.viewer.label}</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">{roleConfig[newUser.role].description}</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                  キャンセル
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !newUser.username || !newUser.password}
                  className="bg-[#4ecdc4] hover:bg-[#3dbdab]"
                >
                  {isSubmitting ? "登録中..." : "登録する"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* 編集ダイアログ */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>管理者ユーザー編集</DialogTitle>
              <DialogDescription>管理者ユーザー「{selectedUser?.username}」の情報を編集します。</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-username">ユーザー名</Label>
                <Input
                  id="edit-username"
                  value={editUser.username}
                  onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">メールアドレス</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editUser.email}
                  onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-password">パスワード（変更する場合のみ入力）</Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={editUser.password}
                  onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                  placeholder="変更しない場合は空欄"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role">権限</Label>
                <Select
                  value={editUser.role}
                  onValueChange={(value: "admin" | "editor" | "viewer") => setEditUser({ ...editUser, role: value })}
                >
                  <SelectTrigger id="edit-role">
                    <SelectValue placeholder="権限を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">
                      <div className="flex items-center">
                        {roleConfig.admin.icon}
                        <span className="ml-2">{roleConfig.admin.label}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="editor">
                      <div className="flex items-center">
                        {roleConfig.editor.icon}
                        <span className="ml-2">{roleConfig.editor.label}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="viewer">
                      <div className="flex items-center">
                        {roleConfig.viewer.icon}
                        <span className="ml-2">{roleConfig.viewer.label}</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">{roleConfig[editUser.role].description}</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">ステータス</Label>
                <Select
                  value={editUser.isActive ? "active" : "inactive"}
                  onValueChange={(value) => setEditUser({ ...editUser, isActive: value === "active" })}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="ステータスを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">
                      <div className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                        <span>有効</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="inactive">
                      <div className="flex items-center">
                        <X className="mr-2 h-4 w-4 text-red-500" />
                        <span>無効</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                キャンセル
              </Button>
              <Button
                onClick={handleEditUser}
                disabled={!editUser.username || !editUser.email}
                className="bg-[#4ecdc4] hover:bg-[#3dbdab]"
              >
                更新する
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 削除確認ダイアログ */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>管理者ユーザー削除</DialogTitle>
              <DialogDescription>
                本当に管理者ユーザー「{selectedUser?.username}」を削除しますか？この操作は元に戻せません。
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                キャンセル
              </Button>
              <Button onClick={handleDeleteUser} variant="destructive">
                削除する
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Footer />
    </main>
  )
}
