"use client"

interface PayPayButtonProps {
  amount: number
  description: string
  className?: string
}

export function PayPayButton({ amount, description, className = "" }: PayPayButtonProps) {
  const handlePayment = () => {
    // 実際の実装では、サーバーサイドでPayPay決済リンクを生成し、
    // そのURLにリダイレクトする処理が必要です
    alert(`PayPay決済画面へ移動します。金額: ${amount}円、内容: ${description}`)

    // 実際のPayPay決済ページへのリダイレクト例
    // window.location.href = `/api/create-paypay-payment?amount=${amount}&description=${encodeURIComponent(description)}`;
  }

  return (
    <button
      onClick={handlePayment}
      className={`flex items-center justify-center gap-2 bg-[#ff0033] hover:bg-[#ff0033]/90 text-white font-medium py-2 px-4 rounded-md transition-colors ${className}`}
    >
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
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
      PayPayで支払う
    </button>
  )
}
