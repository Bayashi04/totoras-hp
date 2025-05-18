export interface Event {
  id: string
  title: string
  date: string
  time?: string
  location: string
  image: string
  description: string
  price?: string
  capacity?: number
  category: string
  items?: string[]
  color?: string
  published: boolean
}
