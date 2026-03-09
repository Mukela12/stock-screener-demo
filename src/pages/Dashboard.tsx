import { useNavigate } from 'react-router-dom'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { BadgeDelta } from '@/shared/ui/badge-delta'
import { stocks, watchlist, portfolioAllocation } from '../data/mock-stocks'
import type { Stock } from '../types'

const watchlistStocks = watchlist
  .map(w => stocks.find(s => s.ticker === w.ticker))
  .filter((s): s is Stock => !!s)

const economicEvents = [
  { date: 'Mar 12', event: 'CPI Report', impact: 'HIGH' as const },
  { date: 'Mar 14', event: 'AAPL Earnings', impact: 'HIGH' as const },
  { date: 'Mar 18', event: 'FOMC Meeting', impact: 'HIGH' as const },
  { date: 'Mar 20', event: 'Retail Sales', impact: 'MED' as const },
  { date: 'Mar 22', event: 'PMI Data', impact: 'MED' as const },
]

const aiInsights = [
  { ticker: 'NVDA', score: 91, summary: 'AI chip demand unprecedented. Data center revenue surging.' },
  { ticker: 'MSFT', score: 88, summary: 'AI integration across product suite driving enterprise adoption.' },
  { ticker: 'LLY', score: 85, summary: 'GLP-1 drugs creating massive TAM. Mounjaro/Zepbound demand soaring.' },
]

function Sparkline({ data }: { data: number[] }) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 60
    const y = 18 - ((v - min) / range) * 14
    return `${x},${y}`
  }).join(' ')
  const isUp = data[data.length - 1] >= data[0]

  return (
    <svg width="60" height="20" viewBox="0 0 60 20">
      <polyline points={points} fill="none" stroke={isUp ? '#16a34a' : '#dc2626'} strokeWidth="1.5" />
    </svg>
  )
}

export default function StockScreenerDashboard() {
  const navigate = useNavigate()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-instrument-serif text-[28px]">Market Overview</h1>
          <p className="font-space-mono text-[11px] uppercase tracking-[0.04em]" style={{ color: 'var(--text-secondary)' }}>
            March 9, 2026 &bull; US Markets
          </p>
        </div>
        <span className="brutal-badge brutal-badge--black">Market Open</span>
      </div>

      {/* Stat blocks */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-brutal p-4" style={{ backgroundColor: 'var(--bg-base)' }}>
          <p className="font-space-mono text-[10px] font-bold uppercase tracking-[0.04em]" style={{ color: 'var(--text-secondary)' }}>
            Portfolio Value
          </p>
          <p className="font-space-mono text-[24px] font-bold mt-1">$127,450</p>
          <BadgeDelta deltaType="increase" variant="outline" value="+2.4%" />
        </div>
        <div className="card-brutal p-4" style={{ backgroundColor: 'var(--bg-base)' }}>
          <p className="font-space-mono text-[10px] font-bold uppercase tracking-[0.04em]" style={{ color: 'var(--text-secondary)' }}>
            Day&apos;s P&amp;L
          </p>
          <p className="font-space-mono text-[24px] font-bold mt-1 stock-up">+$1,832</p>
          <BadgeDelta deltaType="increase" variant="outline" value="+1.4%" />
        </div>
        <div className="card-brutal p-4" style={{ backgroundColor: 'var(--bg-base)' }}>
          <p className="font-space-mono text-[10px] font-bold uppercase tracking-[0.04em]" style={{ color: 'var(--text-secondary)' }}>
            Watchlist Alerts
          </p>
          <p className="font-space-mono text-[24px] font-bold mt-1">3</p>
          <span className="brutal-badge brutal-badge--coral">Active</span>
        </div>
        <div className="card-brutal p-4" style={{ backgroundColor: 'var(--bg-base)' }}>
          <p className="font-space-mono text-[10px] font-bold uppercase tracking-[0.04em]" style={{ color: 'var(--text-secondary)' }}>
            AI Score Avg
          </p>
          <p className="font-space-mono text-[24px] font-bold mt-1">74/100</p>
          <span className="brutal-badge brutal-badge--yellow">Strong</span>
        </div>
      </div>

      {/* Two column: Watchlist + Pie chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Watchlist */}
        <div className="lg:col-span-2 card-brutal overflow-hidden" style={{ backgroundColor: 'var(--bg-base)' }}>
          <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '3px solid var(--border-default)' }}>
            <h2 className="font-space-mono text-[12px] font-bold uppercase tracking-[0.04em]">Watchlist</h2>
            <span className="font-space-mono text-[10px]" style={{ color: 'var(--text-secondary)' }}>{watchlistStocks.length} stocks</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-default)' }}>
                  <th className="text-left px-5 py-2 font-space-mono text-[10px] font-bold uppercase tracking-[0.04em]">Ticker</th>
                  <th className="text-right px-3 py-2 font-space-mono text-[10px] font-bold uppercase tracking-[0.04em]">Price</th>
                  <th className="text-right px-3 py-2 font-space-mono text-[10px] font-bold uppercase tracking-[0.04em]">Change</th>
                  <th className="text-center px-3 py-2 font-space-mono text-[10px] font-bold uppercase tracking-[0.04em] hidden sm:table-cell">7D</th>
                  <th className="text-right px-5 py-2 font-space-mono text-[10px] font-bold uppercase tracking-[0.04em]">AI</th>
                </tr>
              </thead>
              <tbody>
                {watchlistStocks.map((stock) => (
                  <tr
                    key={stock.ticker}
                    className="cursor-pointer transition-colors hover:bg-[var(--bg-elevated)]"
                    style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}
                    onClick={() => navigate(`/stock-screener/stock/${stock.ticker}`)}
                  >
                    <td className="px-5 py-3">
                      <span className="sticker">{stock.ticker}</span>
                      <span className="font-recursive text-[12px] ml-2 hidden sm:inline" style={{ color: 'var(--text-secondary)' }}>{stock.name}</span>
                    </td>
                    <td className="text-right px-3 py-3 font-space-mono text-[13px]">${stock.price.toFixed(2)}</td>
                    <td className="text-right px-3 py-3">
                      <BadgeDelta
                        deltaType={stock.changePercent >= 0 ? 'increase' : 'decrease'}
                        variant="outline"
                        value={`${stock.changePercent >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%`}
                      />
                    </td>
                    <td className="text-center px-3 py-3 hidden sm:table-cell">
                      <Sparkline data={stock.chartData.slice(-7)} />
                    </td>
                    <td className="text-right px-5 py-3">
                      <span
                        className="brutal-badge"
                        style={{
                          backgroundColor: stock.aiScore >= 80 ? 'var(--accent-yellow)' : 'transparent',
                          color: stock.aiScore >= 80 ? '#000' : 'var(--text-primary)',
                        }}
                      >
                        {stock.aiScore}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Portfolio Allocation */}
        <div className="card-brutal p-5" style={{ backgroundColor: 'var(--bg-base)' }}>
          <h2 className="font-space-mono text-[12px] font-bold uppercase tracking-[0.04em] mb-4">Portfolio Allocation</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={portfolioAllocation}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                stroke="#000"
                strokeWidth={2}
              >
                {portfolioAllocation.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#FFFFFF',
                  border: '3px solid #000000',
                  borderRadius: 0,
                  fontSize: 12,
                  fontFamily: 'Space Mono',
                  boxShadow: '4px 4px 0 #000',
                }}
                formatter={(value) => [`${value}%`, 'Allocation']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {portfolioAllocation.map((item) => (
              <div key={item.name} className="flex items-center justify-between font-space-mono text-[11px]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border border-black" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </div>
                <span className="font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Economic Calendar */}
      <div className="card-brutal overflow-hidden" style={{ backgroundColor: 'var(--bg-base)' }}>
        <div className="px-5 py-3" style={{ borderBottom: '3px solid var(--border-default)' }}>
          <h2 className="font-space-mono text-[12px] font-bold uppercase tracking-[0.04em]">Upcoming Events</h2>
        </div>
        <div className="divide-y divide-black/10">
          {economicEvents.map((event, i) => (
            <div key={i} className="px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-space-mono text-[11px] font-bold w-16">{event.date}</span>
                <span className="font-recursive text-[14px]">{event.event}</span>
              </div>
              <span
                className={`brutal-badge ${event.impact === 'HIGH' ? 'brutal-badge--coral' : 'brutal-badge--yellow'}`}
              >
                {event.impact}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div>
        <h2 className="font-space-mono text-[12px] font-bold uppercase tracking-[0.04em] mb-4">AI Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aiInsights.map((insight) => (
            <div
              key={insight.ticker}
              className="card-brutal p-5 cursor-pointer"
              style={{ backgroundColor: 'var(--bg-base)' }}
              onClick={() => navigate(`/stock-screener/stock/${insight.ticker}`)}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="sticker">{insight.ticker}</span>
                <span className="brutal-badge brutal-badge--yellow">{insight.score}/100</span>
              </div>
              <p className="font-recursive text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                {insight.summary}
              </p>
              <p className="font-space-mono text-[10px] mt-3 uppercase" style={{ color: 'var(--accent-coral)' }}>
                View Analysis &rarr;
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
