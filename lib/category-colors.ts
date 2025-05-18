// カテゴリーごとの色クラスを定義
type CategoryColorClasses = {
  bg: string
  text: string
  border: string
}

// カテゴリーごとの色を定義
export function getCategoryColorClasses(category: string): CategoryColorClasses {
  switch (category) {
    case "サウナ":
      return {
        bg: "bg-[#ff6b6b]/10",
        text: "text-[#ff6b6b]",
        border: "border-[#ff6b6b]/20",
      }
    case "フットサル":
      return {
        bg: "bg-[#4ecdc4]/10",
        text: "text-[#4ecdc4]",
        border: "border-[#4ecdc4]/20",
      }
    case "その他":
      return {
        bg: "bg-[#ffd93d]/10",
        text: "text-[#ffd93d]",
        border: "border-[#ffd93d]/20",
      }
    case "アウトドア":
      return {
        bg: "bg-[#6BCB77]/10",
        text: "text-[#6BCB77]",
        border: "border-[#6BCB77]/20",
      }
    case "交流会":
      return {
        bg: "bg-[#4D96FF]/10",
        text: "text-[#4D96FF]",
        border: "border-[#4D96FF]/20",
      }
    case "ワークショップ":
      return {
        bg: "bg-[#9B5DE5]/10",
        text: "text-[#9B5DE5]",
        border: "border-[#9B5DE5]/20",
      }
    case "ゲーム":
      return {
        bg: "bg-[#F15BB5]/10",
        text: "text-[#F15BB5]",
        border: "border-[#F15BB5]/20",
      }
    case "料理":
      return {
        bg: "bg-[#FF8066]/10",
        text: "text-[#FF8066]",
        border: "border-[#FF8066]/20",
      }
    case "音楽":
      return {
        bg: "bg-[#845EC2]/10",
        text: "text-[#845EC2]",
        border: "border-[#845EC2]/20",
      }
    case "アート":
      return {
        bg: "bg-[#FF9671]/10",
        text: "text-[#FF9671]",
        border: "border-[#FF9671]/20",
      }
    case "勉強会":
      return {
        bg: "bg-[#00C9A7]/10",
        text: "text-[#00C9A7]",
        border: "border-[#00C9A7]/20",
      }
    case "キャンプ":
      return {
        bg: "bg-[#8AC926]/10",
        text: "text-[#8AC926]",
        border: "border-[#8AC926]/20",
      }
    case "サイクリング":
      return {
        bg: "bg-[#1982C4]/10",
        text: "text-[#1982C4]",
        border: "border-[#1982C4]/20",
      }
    case "スポーツ":
      return {
        bg: "bg-[#FF595E]/10",
        text: "text-[#FF595E]",
        border: "border-[#FF595E]/20",
      }
    case "カフェ":
      return {
        bg: "bg-[#A68A64]/10",
        text: "text-[#A68A64]",
        border: "border-[#A68A64]/20",
      }
    case "写真":
      return {
        bg: "bg-[#6A4C93]/10",
        text: "text-[#6A4C93]",
        border: "border-[#6A4C93]/20",
      }
    case "お酒":
      return {
        bg: "bg-[#B83B5E]/10",
        text: "text-[#B83B5E]",
        border: "border-[#B83B5E]/20",
      }
    case "旅行":
      return {
        bg: "bg-[#3BCEAC]/10",
        text: "text-[#3BCEAC]",
        border: "border-[#3BCEAC]/20",
      }
    case "読書会":
      return {
        bg: "bg-[#F08A5D]/10",
        text: "text-[#F08A5D]",
        border: "border-[#F08A5D]/20",
      }
    case "ボランティア":
      return {
        bg: "bg-[#F9ED69]/10",
        text: "text-[#F9ED69]",
        border: "border-[#F9ED69]/20",
      }
    case "イベントレポート":
      return {
        bg: "bg-[#6A0572]/10",
        text: "text-[#6A0572]",
        border: "border-[#6A0572]/20",
      }
    default:
      return {
        bg: "bg-gray-100",
        text: "text-gray-700",
        border: "border-gray-200",
      }
  }
}

export function getCategoryColor(category: string): string {
  const colorClasses = getCategoryColorClasses(category)
  return colorClasses.text.replace("text-[", "").replace("]", "")
}
