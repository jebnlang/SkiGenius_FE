// Telegram notification Edge Function
// Triggered by database webhook on new email signup

import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')
const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID')

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  record: {
    id: string
    email: string
    created_at: string
    source: string
  }
  schema: string
  old_record: null | Record<string, unknown>
}

Deno.serve(async (req) => {
  try {
    // Verify we have the required env vars
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID')
      return new Response(
        JSON.stringify({ error: 'Missing Telegram configuration' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const payload: WebhookPayload = await req.json()

    // Only process INSERT events
    if (payload.type !== 'INSERT') {
      return new Response(
        JSON.stringify({ message: 'Ignored non-INSERT event' }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    const { email, created_at } = payload.record
    const timestamp = new Date(created_at).toLocaleString('en-US', {
      timeZone: 'UTC',
      dateStyle: 'medium',
      timeStyle: 'short'
    })

    // Format Telegram message
    const message = `🎿 *New SkiGenius Signup!*

📧 Email: \`${email}\`
🕐 Time: ${timestamp} UTC
📍 Source: Landing Page

Total signups growing! 🚀`

    // Send to Telegram
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
    const telegramResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    })

    const telegramResult = await telegramResponse.json()

    if (!telegramResponse.ok) {
      console.error('Telegram API error:', telegramResult)
      return new Response(
        JSON.stringify({ error: 'Failed to send Telegram notification', details: telegramResult }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Notification sent for: ${email}`)

    return new Response(
      JSON.stringify({ success: true, email }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
