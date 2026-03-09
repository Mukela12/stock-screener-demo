import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { BadgeDelta } from '@/shared/ui/badge-delta'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { stocks, screenerPresets } from '../data/mock-stocks'
import type { Stock } from '../types'

type SortField = 'ticker' | 'price' | 'changePercent' | 'volume' | 'marketCap' | 'pe' | 'aiScore'
type SortDir = 'asc' | 'desc'

const sectors = ['All', ...Array.from(new Set(stocks.map(s => s.sector)))]
const capLabels: Record<string, [number, number]> = {
  'All': [0, Infinity],
  'Mega (>200B)': [200e9, Infinity],
  'Large (10-200B)': [10e9, 200e9],
  'Mid (2-10B)': [2e9, 10e9],
  'Small (<2B)': [0, 2e9],
}

function formatVolume(v: number) {
  if (v >= 1e9) return `${(v / 1e9).toFixed(1)}B`
  if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`
  return `${(v / 1e3).toFixed(0)}K`
}

function formatCap(v: number) {
  if (v >= 1e12) return `$${(v / 1e12).toFixed(2)}T`
  if (v >= 1e9) return `$${(v / 1e9).toFixed(0)}B`
  return `$${(v / 1e6).toFixed(0)}M`
}

export default function StockScreener() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [sector, setSector] = useState('All')
  const [capFilter, setCapFilter] = useState('All')
  const [minPE, setMinPE] = useState('')
  const [maxPE, setMaxPE] = useState('')
  const [minDivYield, setMinDivYield] = useState('')
  const [minAI, setMinAI] = useState('')
  const [sortField, setSortField] = useState<SortField>('aiScore')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  const sortArrow = (field: SortField) => {
    if (sortField !== field) return ' \u2195'
    return sortDir === 'asc' ? ' \u2191' : ' \u2193'
  }

  // Deduplicate stocks by ticker
  const uniqueStocks = useMemo(() => {
    const seen = new Set<string>()
    return stocks.filter(s => {
      if (seen.has(s.ticker)) return false
      seen.add(s.ticker)
      return true
    })
  }, [])

  const filtered = useMemo(() => {
    let result = uniqueStocks

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(s => s.ticker.toLowerCase().includes(q) || s.name.toLowerCase().includes(q))
    }
    if (sector !== 'All') result = result.filter(s => s.sector === sector)
    if (capFilter !== 'All') {
      const [lo, hi] = capLabels[capFilter]
      result = result.filter(s => s.marketCap >= lo && s.marketCap < hi)
    }
    if (minPE) result = result.filter(s => s.pe >= Number(minPE))
    if (maxPE) result = result.filter(s => s.pe <= Number(maxPE))
    if (minDivYield) result = result.filter(s => s.divYield >= Number(minDivYield))
    if (minAI) result = result.filter(s => s.aiScore >= Number(minAI))

    result.sort((a, b) => {
      const av = a[sortField] as number
      const bv = b[sortField] as number
      if (typeof av === 'string') return sortDir === 'asc' ? (av as string).localeCompare(bv as unknown as string) : (bv as unknown as string).localeCompare(av as string)
      return sortDir === 'asc' ? av - bv : bv - av
    })

    return result
  }, [uniqueStocks, search, sector, capFilter, minPE, maxPE, minDivYield, minAI, sortField, sortDir])

  const applyPreset = (presetName: string) => {
    const preset = screenerPresets.find(p => p.name === presetName)
    if (!preset) return
    // Reset all
    setSector('All')
    setCapFilter('All')
    setMinPE('')
    setMaxPE('')
    setMinDivYield('')
    setMinAI('')

    for (const f of preset.filters) {
      if (f.field === 'pe' && f.operator === 'lt') setMaxPE(String(f.value))
      if (f.field === 'pe' && f.operator === 'gt') setMinPE(String(f.value))
      if (f.field === 'divYield' && f.operator === 'gt') setMinDivYield(String(f.value))
      if (f.field === 'aiScore' && f.operator === 'gt') setMinAI(String(f.value))
    }
  }

  const resetFilters = () => {
    setSearch('')
    setSector('All')
    setCapFilter('All')
    setMinPE('')
    setMaxPE('')
    setMinDivYield('')
    setMinAI('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="font-instrument-serif text-[28px]">Stock Screener</h1>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search ticker or name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-56 font-space-mono text-[12px] rounded-none border-2 border-black"
          />
          <span className="font-space-mono text-[11px]" style={{ color: 'var(--text-secondary)' }}>
            {filtered.length} results
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter sidebar */}
        <div className="lg:w-56 shrink-0 space-y-4">
          <div className="card-brutal p-4 space-y-4" style={{ backgroundColor: 'var(--bg-base)' }}>
            <h3 className="font-space-mono text-[11px] font-bold uppercase tracking-[0.04em]">Filters</h3>

            <div>
              <Label className="font-space-mono text-[10px] uppercase tracking-[0.04em] font-bold">Sector</Label>
              <select
                value={sector}
                onChange={e => setSector(e.target.value)}
                className="w-full mt-1 font-space-mono text-[11px] border-2 border-black p-2 bg-white"
              >
                {sectors.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <Label className="font-space-mono text-[10px] uppercase tracking-[0.04em] font-bold">Market Cap</Label>
              <select
                value={capFilter}
                onChange={e => setCapFilter(e.target.value)}
                className="w-full mt-1 font-space-mono text-[11px] border-2 border-black p-2 bg-white"
              >
                {Object.keys(capLabels).map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>

            <div>
              <Label className="font-space-mono text-[10px] uppercase tracking-[0.04em] font-bold">P/E Range</Label>
              <div className="flex gap-2 mt-1">
                <Input placeholder="Min" value={minPE} onChange={e => setMinPE(e.target.value)} className="font-space-mono text-[11px] rounded-none border-2 border-black" />
                <Input placeholder="Max" value={maxPE} onChange={e => setMaxPE(e.target.value)} className="font-space-mono text-[11px] rounded-none border-2 border-black" />
              </div>
            </div>

            <div>
              <Label className="font-space-mono text-[10px] uppercase tracking-[0.04em] font-bold">Min Div Yield %</Label>
              <Input placeholder="0.0" value={minDivYield} onChange={e => setMinDivYield(e.target.value)} className="mt-1 font-space-mono text-[11px] rounded-none border-2 border-black" />
            </div>

            <div>
              <Label className="font-space-mono text-[10px] uppercase tracking-[0.04em] font-bold">Min AI Score</Label>
              <Input placeholder="0" value={minAI} onChange={e => setMinAI(e.target.value)} className="mt-1 font-space-mono text-[11px] rounded-none border-2 border-black" />
            </div>

            <button
              onClick={resetFilters}
              className="w-full font-space-mono text-[11px] font-bold uppercase tracking-[0.04em] py-2 border-2 border-black transition-colors hover:bg-[var(--bg-elevated)]"
            >
              Reset
            </button>
          </div>

          {/* Presets */}
          <div className="card-brutal p-4 space-y-2" style={{ backgroundColor: 'var(--bg-base)' }}>
            <h3 className="font-space-mono text-[11px] font-bold uppercase tracking-[0.04em]">Presets</h3>
            {screenerPresets.map(p => (
              <button
                key={p.name}
                onClick={() => applyPreset(p.name)}
                className="w-full text-left font-space-mono text-[11px] py-2 px-3 border-2 border-black transition-all hover:bg-[var(--accent-yellow)] hover:shadow-[2px_2px_0_#000]"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Data table */}
        <div className="flex-1 card-brutal overflow-hidden" style={{ backgroundColor: 'var(--bg-base)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '3px solid var(--border-default)', backgroundColor: 'var(--bg-elevated)' }}>
                  {([
                    ['ticker', 'Ticker'],
                    ['price', 'Price'],
                    ['changePercent', 'Change'],
                    ['volume', 'Volume'],
                    ['marketCap', 'Mkt Cap'],
                    ['pe', 'P/E'],
                    ['aiScore', 'AI Score'],
                  ] as [SortField, string][]).map(([field, label]) => (
                    <th
                      key={field}
                      className="px-4 py-3 font-space-mono text-[10px] font-bold uppercase tracking-[0.04em] cursor-pointer select-none hover:bg-[var(--bg-muted)] transition-colors"
                      style={{ textAlign: field === 'ticker' ? 'left' : 'right' }}
                      onClick={() => toggleSort(field)}
                    >
                      {label}{sortArrow(field)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((stock: Stock) => (
                  <tr
                    key={stock.ticker}
                    className="cursor-pointer transition-colors hover:bg-[var(--bg-elevated)]"
                    style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}
                    onClick={() => navigate(`/stock-screener/stock/${stock.ticker}`)}
                  >
                    <td className="px-4 py-3">
                      <span className="sticker">{stock.ticker}</span>
                      <span className="font-recursive text-[12px] ml-2 hidden lg:inline" style={{ color: 'var(--text-secondary)' }}>{stock.name}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-space-mono text-[13px]">${stock.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">
                      <BadgeDelta
                        deltaType={stock.changePercent >= 0 ? 'increase' : 'decrease'}
                        variant="outline"
                        value={`${stock.changePercent >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%`}
                      />
                    </td>
                    <td className="px-4 py-3 text-right font-space-mono text-[12px]">{formatVolume(stock.volume)}</td>
                    <td className="px-4 py-3 text-right font-space-mono text-[12px]">{formatCap(stock.marketCap)}</td>
                    <td className="px-4 py-3 text-right font-space-mono text-[12px]">{stock.pe > 0 ? stock.pe.toFixed(1) : 'N/A'}</td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className="brutal-badge"
                        style={{
                          backgroundColor: stock.aiScore >= 80 ? 'var(--accent-yellow)' : stock.aiScore >= 70 ? 'var(--bg-elevated)' : 'transparent',
                          color: '#000',
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
          {filtered.length === 0 && (
            <div className="p-12 text-center">
              <p className="font-space-mono text-[14px] font-bold">No stocks match your filters</p>
              <button onClick={resetFilters} className="mt-4 btn-brutal font-space-mono text-[11px] font-bold uppercase px-6 py-2 border-2 border-black">
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
