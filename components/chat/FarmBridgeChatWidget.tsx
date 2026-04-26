'use client'

import { useEffect, useMemo, useState } from 'react'
import { MessageCircle, Plus, X } from 'lucide-react'

type ChatMessage = { role: 'user' | 'assistant'; content: string; timestamp: string }
type ChatThread = { id: string; title: string; createdAt: string; messages: ChatMessage[] }

const STORAGE_KEY = 'farmbridge_chat_threads_v1'

function createThread(): ChatThread {
  const now = new Date().toISOString()
  return { id: crypto.randomUUID(), title: 'New Chat', createdAt: now, messages: [] }
}

export function FarmBridgeChatWidget() {
  const [open, setOpen] = useState(false)
  const [threads, setThreads] = useState<ChatThread[]>(() => {
    if (typeof window === 'undefined') return [createThread()]

    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return [createThread()]

    const parsed = JSON.parse(raw) as ChatThread[]
    return parsed.length ? parsed : [createThread()]
  })
  const [activeThreadId, setActiveThreadId] = useState<string>(() => {
    if (typeof window === 'undefined') return ''

    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return ''

    const parsed = JSON.parse(raw) as ChatThread[]
    return parsed[0]?.id ?? ''
  })
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (threads.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(threads))
  }, [threads])

  const activeThread = useMemo(
    () => threads.find((thread) => thread.id === activeThreadId) ?? threads[0],
    [threads, activeThreadId]
  )

  const newChat = () => {
    const thread = createThread()
    setThreads((prev) => [thread, ...prev])
    setActiveThreadId(thread.id)
  }

  const sendMessage = async () => {
    if (!input.trim() || !activeThread) return
    const text = input.trim()
    setInput('')
    setLoading(true)

    const userMessage: ChatMessage = { role: 'user', content: text, timestamp: new Date().toISOString() }
    const updatedThread = {
      ...activeThread,
      title: activeThread.messages.length === 0 ? text.slice(0, 28) : activeThread.title,
      messages: [...activeThread.messages, userMessage],
    }
    setThreads((prev) => prev.map((thread) => (thread.id === activeThread.id ? updatedThread : thread)))

    const res = await fetch('/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: updatedThread.messages.map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          content: m.content,
        })),
      }),
    })

    const json = await res.json()
    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: res.ok ? json.answer : 'I could not answer right now. Please try again in a moment.',
      timestamp: new Date().toISOString(),
    }

    setThreads((prev) =>
      prev.map((thread) =>
        thread.id === activeThread.id
          ? { ...thread, messages: [...updatedThread.messages, assistantMessage] }
          : thread
      )
    )
    setLoading(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen((value) => !value)}
        className="fixed bottom-5 right-5 z-[80] rounded-full bg-growth text-parchment p-3 shadow-card border border-growth/50"
        aria-label="Toggle FarmBridge assistant chat"
        aria-expanded={open}
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
      </button>

      {open && (
        <aside className="fixed bottom-20 right-5 z-[79] w-[360px] max-w-[92vw] h-[560px] bg-soil/95 border border-wheat/15 rounded-2xl shadow-card flex flex-col overflow-hidden">
          <header className="px-4 py-3 border-b border-wheat/10 flex items-center justify-between">
            <div>
              <p className="text-wheat font-semibold">FarmBridge Assistant</p>
              <p className="text-wheat/55 text-xs">Chats are saved locally on this device.</p>
            </div>
            <button onClick={newChat} className="rounded-md border border-wheat/20 p-1.5 text-wheat/70">
              <Plus size={14} />
            </button>
          </header>

          <div className="grid grid-cols-[120px_1fr] flex-1 min-h-0">
            <div className="border-r border-wheat/10 overflow-y-auto">
              {threads.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => setActiveThreadId(thread.id)}
                  className={`w-full text-left px-2 py-2 text-xs border-b border-wheat/5 ${
                    activeThread?.id === thread.id ? 'bg-growth/20 text-wheat' : 'text-wheat/65'
                  }`}
                >
                  {thread.title || 'Chat'}
                </button>
              ))}
            </div>
            <div className="flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
                {(activeThread?.messages ?? []).map((message, index) => (
                  <div
                    key={`${message.timestamp}-${index}`}
                    className={`rounded-xl px-3 py-2 text-sm ${
                      message.role === 'user'
                        ? 'bg-growth/30 text-wheat ml-8'
                        : 'bg-ash/70 border border-wheat/10 text-wheat/90 mr-5'
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-[10px] text-wheat/45 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}
                {loading && <p className="text-xs text-wheat/50">Thinking...</p>}
              </div>
              <div className="p-3 border-t border-wheat/10">
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask about resources, programs, deadlines..."
                  className="w-full h-20 rounded-lg bg-ash/70 border border-wheat/20 px-3 py-2 text-sm text-wheat"
                />
                <button
                  onClick={sendMessage}
                  disabled={loading}
                  className="mt-2 w-full rounded-lg bg-growth px-3 py-2 text-sm text-parchment font-semibold disabled:opacity-60"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}
    </>
  )
}
