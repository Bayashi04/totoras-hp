// 管理者ユーザーの型定義
export type AdminUser = {
  id: string
  username: string
  email: string
  password: string // 実際の実装では暗号化されたパスワードを保存
  role: "admin" | "editor" | "viewer" // 権限レベル
  createdAt: string
  updatedAt: string
  lastLogin?: string
  isActive: boolean
}

// メモリ内のデータストア（実際の実装ではデータベースを使用）
const adminUsers: AdminUser[] = [
  {
    id: "1",
    username: "管理者",
    email: "admin@example.com",
    password: "admin123", // 実際の実装では暗号化
    role: "admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    isActive: true,
  },
]

// 管理者ユーザーサービス
export const AdminUserService = {
  // すべての管理者ユーザーを取得
  getAllUsers: () => {
    return [...adminUsers]
  },

  // IDで管理者ユーザーを取得
  getUserById: (id: string) => {
    return adminUsers.find((user) => user.id === id)
  },

  // ユーザー名またはメールアドレスで管理者ユーザーを取得
  getUserByUsernameOrEmail: (usernameOrEmail: string) => {
    return adminUsers.find((user) => user.username === usernameOrEmail || user.email === usernameOrEmail)
  },

  // 新しい管理者ユーザーを作成
  createUser: (userData: Omit<AdminUser, "id" | "createdAt" | "updatedAt">) => {
    const newUser: AdminUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    adminUsers.push(newUser)
    return newUser
  },

  // 管理者ユーザーを更新
  updateUser: (id: string, userData: Partial<Omit<AdminUser, "id" | "createdAt">>) => {
    const index = adminUsers.findIndex((user) => user.id === id)
    if (index === -1) return null

    const updatedUser = {
      ...adminUsers[index],
      ...userData,
      updatedAt: new Date().toISOString(),
    }
    adminUsers[index] = updatedUser
    return updatedUser
  },

  // 管理者ユーザーを削除
  deleteUser: (id: string) => {
    const index = adminUsers.findIndex((user) => user.id === id)
    if (index === -1) return false
    adminUsers.splice(index, 1)
    return true
  },

  // 管理者ユーザーのログイン
  loginUser: (usernameOrEmail: string, password: string) => {
    const user = AdminUserService.getUserByUsernameOrEmail(usernameOrEmail)
    if (!user || user.password !== password || !user.isActive) return null

    // 最終ログイン日時を更新
    AdminUserService.updateUser(user.id, {
      lastLogin: new Date().toISOString(),
    })

    // パスワードを除いたユーザー情報を返す
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  },

  // 管理者ユーザーの権限を確認
  hasPermission: (userId: string, requiredRole: AdminUser["role"]) => {
    const user = AdminUserService.getUserById(userId)
    if (!user || !user.isActive) return false

    const roleHierarchy = {
      admin: 3,
      editor: 2,
      viewer: 1,
    }

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole]
  },
}
