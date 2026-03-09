export interface Stock {
  ticker: string
  name: string
  sector: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: number
  pe: number
  eps: number
  divYield: number
  high52w: number
  low52w: number
  avgVolume: number
  chartData: number[]
  aiScore: number
  aiSummary: string
}

export interface WatchlistItem {
  ticker: string
  addedAt: string
  notes: string
}

export interface ScreenerPreset {
  name: string
  filters: ScreenerFilter[]
}

export interface ScreenerFilter {
  field: keyof Stock
  operator: 'gt' | 'lt' | 'eq' | 'between'
  value: number | [number, number]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}
