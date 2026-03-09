import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import RiveCursorTracker from '@/shared/components/RiveCursorTracker'
import { useMousePosition } from '@/shared/hooks/useMousePosition'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import '../theme.css'

export default function StockScreenerLogin() {
  const navigate = useNavigate()
  const mousePos = useMousePosition()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/stock-screener')
  }

  return (
    <div
      data-theme="stock-screener"
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: 'var(--bg-cream)' }}
    >
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-instrument-serif text-[42px] sm:text-[56px] leading-tight">
            StockPulse
          </h1>
          <p className="font-space-mono text-[12px] uppercase tracking-[0.06em] mt-2" style={{ color: 'var(--text-secondary)' }}>
            AI-Powered Stock Screening
          </p>
        </div>

        {/* Main card */}
        <div
          className="card-brutal p-6 sm:p-8"
          style={{ backgroundColor: 'var(--bg-base)' }}
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Rive character */}
            <div className="w-48 h-48 shrink-0">
              <RiveCursorTracker
                src="/animations/rive/look-login.riv"
                mouseX={mousePos.x}
                mouseY={mousePos.y}
                className="w-full h-full"
              />
            </div>

            {/* Login form */}
            <form onSubmit={handleSubmit} className="flex-1 w-full space-y-4">
              <div>
                <Label className="font-space-mono text-[10px] uppercase tracking-[0.04em] font-bold">
                  Email
                </Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="trader@stockpulse.io"
                  className="mt-1.5 font-recursive rounded-none border-2 border-black"
                />
              </div>
              <div>
                <Label className="font-space-mono text-[10px] uppercase tracking-[0.04em] font-bold">
                  Password
                </Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1.5 font-recursive rounded-none border-2 border-black"
                />
              </div>
              <button
                type="submit"
                className="w-full btn-brutal font-space-mono text-[12px] font-bold uppercase tracking-[0.06em] py-3 border-[3px] border-black"
                style={{ backgroundColor: 'var(--accent-coral)', color: '#fff' }}
              >
                Sign In
              </button>
              <p className="text-center font-recursive text-[12px]" style={{ color: 'var(--text-secondary)' }}>
                Demo mode — click Sign In to enter
              </p>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 space-y-2">
          <div className="flex items-center justify-center gap-3">
            <span className="sticker">Supabase</span>
            <span className="sticker">Gemini</span>
            <span className="sticker">Next.js</span>
            <span className="sticker">Massive API</span>
          </div>
          <p className="font-space-mono text-[10px] uppercase tracking-[0.04em]" style={{ color: 'var(--text-secondary)' }}>
            Built with Supabase + Gemini 1.5 + Massive Stock API
          </p>
        </div>
      </div>
    </div>
  )
}
