/**
 * LINE連携機能は実装しないため、すべてダミー関数に置き換え
 */

/**
 * イベントリマインダーを送信する
 * @param userId ユーザーID
 * @param eventName イベント名
 * @param eventDate イベント日時
 * @param eventLocation イベント場所
 */
export async function sendEventReminder(userId: string, eventName: string, eventDate: string, eventLocation: string) {
  console.log("LINE integration is not implemented")
  return false
}

/**
 * イベント申し込み確認メッセージを送信する
 * @param userId ユーザーID
 * @param eventName イベント名
 * @param eventDate イベント日時
 */
export async function sendEventRegistrationConfirmation(userId: string, eventName: string, eventDate: string) {
  console.log("LINE integration is not implemented")
  return false
}

/**
 * PayPay支払いリンクを送信する
 * @param userId ユーザーID
 * @param eventName イベント名
 * @param amount 金額
 * @param paymentUrl 支払いURL
 */
export async function sendPaymentLink(userId: string, eventName: string, amount: number, paymentUrl: string) {
  console.log("LINE integration is not implemented")
  return false
}
