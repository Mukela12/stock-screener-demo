import { useState, useRef, useEffect } from 'react'
import { sampleChatHistory, aiResponseTemplates } from '../data/mock-stocks'
import type { ChatMessage } from '../types'

const quickPrompts = [
  'Top Value Picks',
  'Sector Analysis',
  'Portfolio Review',
  'Risk Assessment',
]

function getMockResponse(input: string): string {
  const lower = input.toLowerCase()
  for (const [key, response] of Object.entries(aiResponseTemplates)) {
    if (lower.includes(key)) return response
  }
  return aiResponseTemplates['default']
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>(sampleChatHistory)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) throw new Error('API error')

      const data = await response.json()
      const aiMsg: ChatMessage = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, aiMsg])
    } catch {
      // Fallback to mock responses when API is unavailable
      const aiMsg: ChatMessage = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: getMockResponse(text),
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, aiMsg])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-instrument-serif text-[28px]">AI Assistant</h1>
          <p className="font-space-mono text-[11px] uppercase tracking-[0.04em]" style={{ color: 'var(--text-secondary)' }}>
            Powered by Claude AI
          </p>
        </div>
        <span className="brutal-badge brutal-badge--yellow">Claude</span>
      </div>

      {/* Chat area */}
      <div
        ref={scrollRef}
        className="flex-1 card-brutal p-4 overflow-y-auto space-y-4"
        style={{ backgroundColor: 'var(--bg-base)' }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] ${
                msg.role === 'user'
                  ? 'border-[3px] border-black p-4'
                  : 'card-brutal p-4'
              }`}
              style={{
                backgroundColor: msg.role === 'user' ? '#000' : 'var(--bg-elevated)',
                color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
              }}
            >
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="sticker" style={{ fontSize: '8px' }}>AI</span>
                </div>
              )}
              <div className="font-recursive text-[13px] leading-relaxed whitespace-pre-wrap">
                {msg.content.split('\n').map((line, i) => {
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return <p key={i} className="font-bold mt-2">{line.replace(/\*\*/g, '')}</p>
                  }
                  if (line.startsWith('- ') || line.match(/^\d+\./)) {
                    return <p key={i} className="ml-3">{line}</p>
                  }
                  return <p key={i}>{line}</p>
                })}
              </div>
              <p className="font-space-mono text-[9px] mt-2 opacity-50">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="card-brutal p-4" style={{ backgroundColor: 'var(--bg-elevated)' }}>
              <span className="sticker" style={{ fontSize: '8px' }}>AI</span>
              <div className="flex items-center gap-1 mt-2">
                <span className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick prompts */}
      <div className="flex flex-wrap gap-2 mt-3">
        {quickPrompts.map(prompt => (
          <button
            key={prompt}
            onClick={() => sendMessage(prompt.toLowerCase())}
            className="font-space-mono text-[10px] font-bold uppercase tracking-[0.04em] px-3 py-1.5 border-2 border-black transition-all hover:bg-[var(--accent-yellow)] hover:shadow-[2px_2px_0_#000]"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="card-brutal flex items-end" style={{ backgroundColor: 'var(--bg-base)' }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about stocks, sectors, or your portfolio..."
            rows={2}
            className="flex-1 p-4 font-recursive text-[14px] bg-transparent resize-none focus:outline-none"
            style={{ border: 'none' }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="m-2 btn-brutal font-space-mono text-[11px] font-bold uppercase px-4 py-2 border-[3px] border-black disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: 'var(--accent-coral)', color: '#fff' }}
          >
            Send
          </button>
        </div>
        <p className="font-space-mono text-[9px] mt-1.5 text-center" style={{ color: 'var(--text-secondary)' }}>
          Powered by Claude AI (Anthropic) — swappable with Gemini for production.
        </p>
      </form>
    </div>
  )
}
