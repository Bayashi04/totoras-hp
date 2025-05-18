import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, MessageCircle } from "lucide-react"

interface EventLineIntegrationProps {
  eventTitle: string
  eventDate: string
  eventLocation: string
  color: string
}

export function EventLineIntegration({ eventTitle, eventDate, eventLocation, color }: EventLineIntegrationProps) {
  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{eventTitle}</CardTitle>
        <CardDescription>
          <div className="flex items-center gap-2 text-gray-600 mt-1">
            <Calendar className="h-4 w-4" />
            <span>{eventDate}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 mt-1">
            <MapPin className="h-4 w-4" />
            <span>{eventLocation}</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg mb-3">
          <MessageCircle className="h-5 w-5 text-[#06C755]" />
          <div className="text-sm">
            <span className="font-medium">LINEで簡単参加申し込み</span>
            <p className="text-gray-500 text-xs mt-0.5">公式LINEから数タップで申し込み完了！</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            style={{ color }}
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
          <div className="text-sm">
            <span className="font-medium">PayPay決済対応</span>
            <p className="text-gray-500 text-xs mt-0.5">参加費の支払いもスムーズに</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-[#06C755] hover:bg-[#06C755]/90 text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 mr-2"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          LINEで申し込む
        </Button>
      </CardFooter>
    </Card>
  )
}
