import { Skeleton } from "@/components/ui/skeleton"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function ReportsLoading() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="bg-gray-50 py-8 md:py-12 border-b">
        <div className="container px-4 mx-auto">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-5 w-full max-w-2xl" />
        </div>
      </div>

      <div className="container px-4 mx-auto py-8 md:py-12">
        <Skeleton className="h-6 w-40 mb-6" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="w-full md:w-auto">
            <Skeleton className="h-10 w-64" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-[350px] rounded-lg" />
          ))}
        </div>
      </div>

      <Footer />
    </main>
  )
}
