export default function Loading() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">アクセス分析</h1>
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    </div>
  )
}
