import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "管理者ユーザー管理 | Totoras",
  description: "管理者ユーザーの登録・編集・削除を行います。",
}

export default function AdminUsersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
