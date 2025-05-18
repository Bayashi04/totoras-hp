"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, ImageIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import type { Event } from "@/types"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { useSession } from "next-auth/react"
import { ServerImageSelector } from "@/components/server-image-selector"

interface Params {
  id: string
}

const EditEventPage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { id } = useParams<Params>()
  const [formData, setFormData] = useState<Partial<Event>>({
    title: "",
    description: "",
    location: "",
    image: "",
  })
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false)
  const [selectedServerImage, setSelectedServerImage] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return

      try {
        const response = await fetch(`/api/events/${id}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setFormData(data)
        setDate(data.date ? new Date(data.date) : undefined)
        setSelectedServerImage(data.image || null)
      } catch (error) {
        console.error("Could not fetch event:", error)
        toast({
          title: "Error fetching event",
          description: "Failed to retrieve event details.",
          variant: "destructive",
        })
      }
    }

    fetchEvent()
  }, [id])

  useEffect(() => {
    if (date) {
      setFormData((prev) => ({ ...prev, date: date.toISOString() }))
    }
  }, [date])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (status !== "authenticated") {
      toast({
        title: "Unauthorized",
        description: "You must be logged in to perform this action.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Event updated successfully!",
        })
        router.push("/admin/events")
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.message || "Failed to update event.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("There was an error updating the event:", error)
      toast({
        title: "Error",
        description: "Failed to update event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // サーバーの画像を選択
  const selectServerImage = (imageUrl: string) => {
    setSelectedServerImage(imageUrl)
    setFormData((prev) => ({ ...prev, image: imageUrl }))
  }

  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>イベント編集</CardTitle>
          <CardDescription>イベントの詳細を編集します。</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">タイトル</Label>
              <Input type="text" id="title" name="title" value={formData.title || ""} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="location">場所</Label>
              <Input
                type="text"
                id="location"
                name="location"
                value={formData.location || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">説明</Label>
            <Textarea id="description" name="description" value={formData.description || ""} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>日付</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "yyyy-MM-dd") : <span>日付を選択</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="image">画像</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image || ""}
                  onChange={handleChange}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsImageSelectorOpen(true)}
                  className="text-xs"
                >
                  <ImageIcon className="h-3 w-3 mr-1" />
                  サーバー画像を選択
                </Button>
              </div>
            </div>
          </div>

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "更新中..." : "更新"}
          </Button>
        </CardContent>
      </Card>

      {/* サーバー画像選択ダイアログ */}
      <ServerImageSelector
        isOpen={isImageSelectorOpen}
        setIsOpen={setIsImageSelectorOpen}
        onImageSelect={selectServerImage}
        selectedImage={selectedServerImage}
      />
    </div>
  )
}

export default EditEventPage
