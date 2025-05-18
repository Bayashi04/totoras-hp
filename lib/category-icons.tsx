import {
  Flame,
  ClubIcon as Football,
  Sparkles,
  Mountain,
  Users,
  Briefcase,
  Gamepad2,
  Utensils,
  Music,
  Palette,
  GraduationCap,
  Tent,
  Bike,
  Dumbbell,
  Coffee,
  Camera,
  Wine,
  Plane,
  BookOpen,
  Heart,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

// カテゴリーごとのアイコンを定義
export const categoryIcons: Record<string, LucideIcon> = {
  // 既存のカテゴリー
  サウナ: Flame,
  フットサル: Football,
  その他: Sparkles,
  アウトドア: Mountain,
  交流会: Users,
  ワークショップ: Briefcase,
  ゲーム: Gamepad2,

  // 新しいカテゴリー
  料理: Utensils,
  音楽: Music,
  アート: Palette,
  勉強会: GraduationCap,
  キャンプ: Tent,
  サイクリング: Bike,
  スポーツ: Dumbbell,
  カフェ: Coffee,
  写真: Camera,
  お酒: Wine,
  旅行: Plane,
  読書会: BookOpen,
  ボランティア: Heart,
  イベントレポート: BookOpen,
}

// カテゴリー名からアイコンを取得する関数
export function getCategoryIcon(category: string): LucideIcon {
  return categoryIcons[category] || categoryIcons["その他"]
}
