import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function ActivityLogsLoading() {
  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="mb-6">
        <Skeleton className="h-8 w-40" />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-48" />
        </div>
        <Skeleton className="h-10 w-40 mt-4 md:mt-0" />
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {Array(2)
              .fill(0)
              .map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
