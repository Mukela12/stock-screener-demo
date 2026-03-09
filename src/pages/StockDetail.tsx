import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { BadgeDelta } from '@/shared/ui/badge-delta'
import { stocks } from '../data/mock-stocks'

const timeRanges = ['1D', '1W', '1M', '3M', '1Y'] as const

function generateChartData(stock: typeof stocks[0], range: string) {
  const base = stock.price
  const points = range === '1D' ? 24 : range === '1W' ? 7 : range === '1M' ? 30 : range === '3M' ? 90 : 365
  const volatility = range === '1D' ? 0.005 : range === '1W' ? 0.01 : range === '1M' ? 0.03 : range === '3M' ? 0.08 : 0.15
  const data = []
  let price = base * (1 - volatility * 0.5)
  for (let i = 0; i < points; i++) {
    price += (Math.random() - 0.47) * base * volatility * 0.1
    data.push({
      label: range === '1D' ? `${i}:00` : range === '1W' ? `Day ${i + 1}` : `${i + 1}`,
      price: +price.toFixed(2),
    })
  }
  // Ensure last point matches current price
  data[data.length - 1].price = stock.price
  return data
}

function formatLargeNum(v: number) {
  if (v >= 1e12) return `$${(v / 1e12).toFixed(2)}T`
  if (v >= 1e9) return `$${(v / 1e9).toFixed(1)}B`
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`
  return `$${v.toLocaleString()}`
}

export default function StockDetail() {
  const { ticker } = useParams<{ ticker: string }>()
  const navigate = useNavigate()
  const [range, setRange] = useState<string>('1M')

  const stock = stocks.find(s => s.ticker === ticker)
  if (!stock) {
    return (
      <div className="text-center py-20">
        <p className="font-space-mono text-[14px] font-bold">Stock not found: {ticker}</p>
        <button onClick={() => navigate('/stock-screener/screener')} className="mt-4 btn-brutal font-space-mono text-[11px] font-bold uppercase px-6 py-2 border-2 border-black">
          Back to Screener
        </button>
      </div>
    )
  }

  const chartData = generateChartData(stock, range)

  const metrics = [
    { label: 'Market Cap', value: formatLargeNum(stock.marketCap) },
    { label: 'P/E Ratio', value: stock.pe > 0 ? stock.pe.toFixed(1) : 'N/A' },
    { label: 'EPS', value: `$${stock.eps.toFixed(2)}` },
    { label: 'Div Yield', value: `${stock.divYield.toFixed(2)}%` },
    { label: '52W High', value: `$${stock.high52w.toFixed(2)}` },
    { label: '52W Low', value: `$${stock.low52w.toFixed(2)}` },
    { label: 'Avg Volume', value: `${(stock.avgVolume / 1e6).toFixed(1)}M` },
    { label: 'AI Score', value: `${stock.aiScore}/100` },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="font-space-mono text-[11px] font-bold uppercase tracking-[0.04em] mb-4 flex items-center gap-1 transition-colors hover:text-[var(--accent-coral)]"
        >
          &larr; Back
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="sticker text-[14px] px-3 py-1">{stock.ticker}</span>
            <h1 className="font-instrument-serif text-[28px]">{stock.name}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-space-mono text-[28px] font-bold">${stock.price.toFixed(2)}</span>
            <BadgeDelta
              deltaType={stock.changePercent >= 0 ? 'increase' : 'decrease'}
              variant="outline"
              value={`${stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)} (${stock.changePercent >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%)`}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="brutal-badge brutal-badge--black">{stock.sector}</span>
          <span className="brutal-badge brutal-badge--green">Market Open</span>
        </div>
      </div>

      {/* Price Chart */}
      <div className="card-brutal p-5" style={{ backgroundColor: 'var(--bg-base)' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-space-mono text-[12px] font-bold uppercase tracking-[0.04em]">Price Chart</h2>
          <div className="flex">
            {timeRanges.map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`brutal-tab ${range === r ? 'brutal-tab--active' : ''}`}
                style={{ marginLeft: r === '1D' ? 0 : -3 }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="0" stroke="#000" strokeWidth={0.5} vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: '#000', fontFamily: 'Space Mono' }}
              axisLine={{ stroke: '#000', strokeWidth: 2 }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#000', fontFamily: 'Space Mono' }}
              axisLine={{ stroke: '#000', strokeWidth: 2 }}
              tickLine={false}
              domain={['auto', 'auto']}
              tickFormatter={(v: number) => `$${v}`}
            />
            <Tooltip
              contentStyle={{
                background: '#FFFFFF',
                border: '3px solid #000000',
                borderRadius: 0,
                fontSize: 12,
                fontFamily: 'Space Mono',
                boxShadow: '4px 4px 0 #000',
              }}
              formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Price']}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#000000"
              strokeWidth={2}
              fill="rgba(255,107,107,0.15)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {metrics.map(m => (
          <div key={m.label} className="card-brutal p-3" style={{ backgroundColor: 'var(--bg-base)' }}>
            <p className="font-space-mono text-[10px] font-bold uppercase tracking-[0.04em]" style={{ color: 'var(--text-secondary)' }}>
              {m.label}
            </p>
            <p className="font-space-mono text-[18px] font-bold mt-1">{m.value}</p>
          </div>
        ))}
      </div>

      {/* AI Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fundamentals */}
        <div className="card-brutal overflow-hidden" style={{ backgroundColor: 'var(--bg-base)' }}>
          <div className="px-5 py-3" style={{ borderBottom: '3px solid var(--border-default)' }}>
            <h2 className="font-space-mono text-[12px] font-bold uppercase tracking-[0.04em]">Fundamentals</h2>
          </div>
          <div className="divide-y divide-black/10">
            {[
              ['Price', `$${stock.price.toFixed(2)}`],
              ['Market Cap', formatLargeNum(stock.marketCap)],
              ['P/E Ratio', stock.pe > 0 ? stock.pe.toFixed(1) : 'N/A'],
              ['EPS (TTM)', `$${stock.eps.toFixed(2)}`],
              ['Dividend Yield', `${stock.divYield.toFixed(2)}%`],
              ['52W Range', `$${stock.low52w.toFixed(2)} - $${stock.high52w.toFixed(2)}`],
              ['Volume', `${(stock.volume / 1e6).toFixed(1)}M`],
              ['Avg Volume', `${(stock.avgVolume / 1e6).toFixed(1)}M`],
            ].map(([label, val]) => (
              <div key={label} className="px-5 py-2.5 flex justify-between items-center">
                <span className="font-space-mono text-[11px]" style={{ color: 'var(--text-secondary)' }}>{label}</span>
                <span className="font-space-mono text-[13px] font-bold">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Analysis Panel */}
        <div className="card-brutal p-5" style={{ backgroundColor: 'var(--bg-base)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-space-mono text-[12px] font-bold uppercase tracking-[0.04em]">AI Analysis</h2>
            <span className="brutal-badge brutal-badge--yellow">{stock.aiScore}/100</span>
          </div>
          <div className="p-4 border-l-4 border-black mb-4" style={{ backgroundColor: 'var(--bg-elevated)' }}>
            <p className="font-recursive text-[14px] leading-relaxed">{stock.aiSummary}</p>
          </div>
          <div className="space-y-3">
            <div>
              <p className="font-space-mono text-[10px] font-bold uppercase tracking-[0.04em] mb-1">Sentiment</p>
              <div className="brutal-progress">
                <div
                  className="brutal-progress__fill"
                  style={{
                    width: `${stock.aiScore}%`,
                    backgroundColor: stock.aiScore >= 80 ? '#16a34a' : stock.aiScore >= 60 ? '#FFCC00' : '#FF6B6B',
                  }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="brutal-badge brutal-badge--black">
                {stock.aiScore >= 80 ? 'BUY' : stock.aiScore >= 60 ? 'HOLD' : 'SELL'}
              </span>
              <span className="font-space-mono text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                Generated by Gemini 1.5 Flash
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate('/stock-screener/ai')}
            className="mt-4 w-full btn-brutal font-space-mono text-[11px] font-bold uppercase tracking-[0.04em] py-2.5 border-[3px] border-black"
            style={{ backgroundColor: 'var(--bg-base)' }}
          >
            Ask AI About {stock.ticker} &rarr;
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          className="btn-brutal font-space-mono text-[11px] font-bold uppercase tracking-[0.06em] px-6 py-2.5 border-[3px] border-black"
          style={{ backgroundColor: 'var(--accent-yellow)' }}
        >
          Add to Watchlist
        </button>
        <button
          className="btn-brutal font-space-mono text-[11px] font-bold uppercase tracking-[0.06em] px-6 py-2.5 border-[3px] border-black"
          style={{ backgroundColor: 'var(--accent-coral)', color: '#fff' }}
        >
          Set Price Alert
        </button>
      </div>
    </div>
  )
}
