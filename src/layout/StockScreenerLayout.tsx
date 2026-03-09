import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import LordIcon from '@/shared/components/LordIcon'
import { tickerData } from '../data/mock-stocks'
import '../theme.css'

const navItems = [
  { label: 'DASHBOARD', path: '/stock-screener', icon: 'system-regular-41-home-hover-home' },
  { label: 'SCREENER', path: '/stock-screener/screener', icon: 'system-regular-42-search-hover-pinch' },
  { label: 'AI ASSISTANT', path: '/stock-screener/ai', icon: 'system-regular-186-chat-empty-hover-chat' },
]

const tickerText = tickerData
  .map(t => `${t.ticker} $${t.price.toFixed(2)} ${t.change >= 0 ? '+' : ''}${t.change.toFixed(2)}%`)
  .join(' \u2605 ')

export default function StockScreenerLayout() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div data-theme="stock-screener" className="min-h-screen" style={{ backgroundColor: 'var(--bg-base)' }}>
      {/* Ticker bar */}
      <div
        className="ticker py-1.5"
        style={{
          backgroundColor: 'var(--accent-yellow)',
          borderBottom: '2px solid var(--border-default)',
        }}
      >
        <div className="ticker-content">
          <span className="font-space-mono text-[10px] font-bold tracking-[0.06em] uppercase">
            {tickerText} &nbsp;{'\u2605'}&nbsp; {tickerText} &nbsp;{'\u2605'}&nbsp;
          </span>
        </div>
      </div>

      {/* Top bar */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-5 sm:px-8 py-4"
        style={{
          backgroundColor: 'var(--bg-base)',
          borderBottom: '3px solid var(--border-default)',
        }}
      >
        {/* Logo */}
        <NavLink to="/stock-screener" className="flex items-center gap-2">
          <h1 className="font-instrument-serif text-[22px] sm:text-[26px]">
            StockPulse
          </h1>
          <span className="brutal-badge brutal-badge--black text-[8px]">AI</span>
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive =
              item.path === '/stock-screener'
                ? location.pathname === '/stock-screener'
                : location.pathname.startsWith(item.path)
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="relative flex items-center gap-2 font-space-mono text-[11px] font-bold tracking-[0.06em] py-1 transition-colors"
                style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--accent-coral)'
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)'
                }}
              >
                <LordIcon name={item.icon} size={18} trigger="hover" />
                {item.label}
                {isActive && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-[3px]"
                    style={{ backgroundColor: 'var(--accent-coral)' }}
                  />
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Right section */}
        <div className="hidden md:flex items-center gap-4">
          <div className="brutal-badge brutal-badge--green text-[9px]">MARKET OPEN</div>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden font-space-mono text-[11px] font-bold tracking-[0.06em] border-[3px] border-black px-3 py-1.5 btn-brutal"
          style={{
            backgroundColor: mobileOpen ? 'var(--accent-coral)' : 'var(--bg-base)',
            color: mobileOpen ? '#fff' : 'var(--text-primary)',
          }}
        >
          {mobileOpen ? 'CLOSE' : 'MENU'}
        </button>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 flex flex-col items-center justify-center gap-8 md:hidden"
          style={{ backgroundColor: 'var(--bg-base)' }}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className="font-instrument-serif text-[36px] transition-colors"
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-coral)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            >
              {item.label.charAt(0) + item.label.slice(1).toLowerCase()}
            </NavLink>
          ))}
        </div>
      )}

      {/* Main content */}
      <main className="px-5 sm:px-8 py-8 max-w-6xl mx-auto">
        <div className="page-reveal">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
