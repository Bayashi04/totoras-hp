import { Skeleton } from "@/components/ui/skeleton"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function ReportEditLoading() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="container px-4 mx-auto py-8 md:py-12">
        <div className="h-6 w-32 mb-6">
          <Skeleton className="h-full w-full" />
        </div>

        <div className="h-10 w-64 mb-8">
          <Skeleton className="h-full w-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <div className="h-5 w-40 mb-1">
                <Skeleton className="h-full w-full" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>

            <div>
              <div className="h-5 w-40 mb-1">
                <Skeleton className="h-full w-full" />
              </div>
              <Skeleton className="h-24 w-full" />
            </div>

            <div>
              <div className="h-5 w-40 mb-1">
                <Skeleton className="h-full w-full" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>

            <div>
              <div className="h-5 w-40 mb-1">
                <Skeleton className="h-full w-full" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>

            <div>
              <div className="h-5 w-40 mb-2">
                <Skeleton className="h-full w-full" />
              </div>
              <div className="h-8 w-full mb-2">
                <Skeleton className="h-full w-full" />
              </div>
              <Skeleton className="h-[400px] w-full" />
            </div>
          </div>

          <div className="space-y-6">
            <Skeleton className="h-[300px] w-full rounded-lg" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <div className="flex justify-end space-x-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
