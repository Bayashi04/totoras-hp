import { NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const signature = request.headers.get("x-line-signature") || ""

    // 署名検証
    const channelSecret = process.env.LINE_CHANNEL_SECRET || ""
    if (!channelSecret) {
      console.error("LINE_CHANNEL_SECRET is not set")
      return new Response("Configuration error", { status: 500 })
    }

    const stringBody = JSON.stringify(body)
    const hmac = crypto.createHmac("sha256", channelSecret)
    const expectedSignature = hmac.update(stringBody).digest("base64")

    if (signature !== expectedSignature) {
      console.warn("Invalid signature received")
      return new Response("Invalid signature", { status: 401 })
    }

    // イベント処理
    const events = body.events
    if (!events || !Array.isArray(events)) {
      console.warn("No events or invalid events format received")
      return new Response("Invalid request format", { status: 400 })
    }

    for (const event of events) {
      await handleEvent(event)
    }

    return new Response("OK", { status: 200 })
  } catch (error) {
    console.error("Webhook error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}

async function handleEvent(event: any) {
  try {
    // メッセージイベントの処理
    if (event.type === "message" && event.message.type === "text") {
      const replyToken = event.replyToken
      const text = event.message.text

      // 返信メッセージを作成
      let replyMessage = {
        type: "text",
        text: `「${text}」というメッセージを受け取りました！`,
      }

      // イベント申し込みの処理
      if (text.includes("申し込み") || text.includes("参加")) {
        replyMessage = {
          type: "text",
          text: "イベントへの参加申し込みありがとうございます！詳細を送信します。",
        }
      }

      // LINEメッセージAPIで返信
      await replyToUser(replyToken, replyMessage)
    } else if (event.type === "follow") {
      // 友だち追加時の処理
      const replyToken = event.replyToken
      const welcomeMessage = {
        type: "text",
        text: "TOTORASの公式LINEアカウントを友だち追加していただき、ありがとうございます！イベント情報やお得な情報をお届けします。",
      }

      await replyToUser(replyToken, welcomeMessage)
    }
  } catch (error) {
    console.error("Event handling error:", error)
    // エラーをスローせず、ログに記録するだけにして処理を続行
  }
}

async function replyToUser(replyToken: string, message: any) {
  const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN
  if (!LINE_CHANNEL_ACCESS_TOKEN) {
    console.error("LINE_CHANNEL_ACCESS_TOKEN is not set")
    return
  }

  try {
    const response = await fetch("https://api.line.me/v2/bot/message/reply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        replyToken: replyToken,
        messages: [message],
      }),
    })

    if (!response.ok) {
      console.error(`Failed to send reply: ${response.status} ${response.statusText}`)
      const errorBody = await response.text()
      console.error("Error body:", errorBody)
    }
  } catch (error) {
    console.error("Error sending reply:", error)
  }
}

export async function GET() {
  return new NextResponse("Webhook endpoint is working", { status: 200 })
}
