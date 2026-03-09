import Anthropic from "@anthropic-ai/sdk"
import type { Config, Context } from "@netlify/functions"

const SYSTEM_PROMPT = `You are StockPulse AI, a financial analysis assistant. You provide:
- Stock analysis with key metrics (P/E ratio, market cap, EPS, dividend yield)
- Market insights and sector analysis
- Portfolio recommendations based on quantitative and AI-driven sentiment analysis
- Risk assessments and diversification strategies

Be concise but insightful. Use bullet points and bold headers (**Header**) for readability.
Always mention relevant financial metrics when discussing individual stocks.
Format your responses in a clean, readable way with line breaks between sections.

You have access to the following stock universe for analysis:
AAPL, MSFT, GOOGL, AMZN, NVDA, META, TSLA, BRK.B, JPM, V, JNJ, UNH, PG, HD, MA, ABBV, MRK, PFE, KO, PEP, COST, AVGO, TMO, LLY, MCD, WMT, CRM, ADBE, CSCO, NFLX, INTC, AMD, QCOM, TXN, ORCL, IBM, BA, CAT, GS, AXP, CVX, XOM, SLB, NEE, DUK, COIN, SQ

When asked about "value picks", "growth stocks", "dividend kings", etc., provide specific ticker-level analysis with numbers.`

export default async (req: Request, _context: Context) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const { messages } = await req.json()

    const client = new Anthropic({ apiKey })

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    })

    const content = response.content[0].type === 'text' ? response.content[0].text : ''

    return new Response(JSON.stringify({ content }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export const config: Config = {
  path: "/api/chat",
}
