import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Users } from "lucide-react"

export default function AdminUsersLoading() {
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
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-20" />
        </div>

        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </main>
  )
}
