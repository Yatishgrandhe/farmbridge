'use client'

import { useEffect, useMemo, useState, useRef } from 'react'
import { MessageCircle, Plus, X, Send, Sparkles } from 'lucide-react'
import styles from './FarmBridgeChatWidget.module.css'

type ChatMessage = { role: 'user' | 'assistant'; content: string; timestamp: string }
type ChatThread = { id: string; title: string; createdAt: string; messages: ChatMessage[] }

const STORAGE_KEY = 'farmbridge_chat_threads_v2'

const STARTER_PROMPTS = [
  { id: 'eligibility', title: 'CHECK STATUS', text: 'Am I eligible for current relief?' },
  { id: 'disaster', title: 'DISASTER RELIEF', text: 'Find drought programs for Ashe county.' },
  { id: 'agent', title: 'EXPERT HELP', text: 'How do I talk to a retired agent?' },
  { id: 'files', title: 'FSA FILING', text: 'What documents do I need for CRP?' },
]

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
    try {
      const parsed = JSON.parse(raw) as ChatThread[]
      return parsed.length ? parsed : [createThread()]
    } catch {
      return [createThread()]
    }
  })
  const [activeThreadId, setActiveThreadId] = useState<string>(() => {
    if (typeof window === 'undefined') return ''
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return ''
    try {
      const parsed = JSON.parse(raw) as ChatThread[]
      return parsed[0]?.id ?? ''
    } catch {
      return ''
    }
  })
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(threads))
  }, [threads])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [threads, loading])

  const activeThread = useMemo(
    () => threads.find((thread) => thread.id === activeThreadId) ?? threads[0],
    [threads, activeThreadId]
  )

  const newChat = () => {
    const thread = createThread()
    setThreads((prev) => [thread, ...prev])
    setActiveThreadId(thread.id)
  }

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !activeThread) return
    setLoading(true)

    const userMessage: ChatMessage = { role: 'user', content: text, timestamp: new Date().toISOString() }
    const updatedThread = {
      ...activeThread,
      title: activeThread.messages.length === 0 ? text.slice(0, 20) : activeThread.title,
      messages: [...activeThread.messages, userMessage],
    }
    
    setThreads((prev) => prev.map((t) => (t.id === activeThread.id ? updatedThread : t)))

    try {
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
        content: res.ok ? json.answer : 'I encountered an error connecting to our rural intelligence network. Please try again.',
        timestamp: new Date().toISOString(),
      }

      setThreads((prev) =>
        prev.map((t) =>
          t.id === activeThread.id
            ? { ...t, messages: [...updatedThread.messages, assistantMessage] }
            : t
        )
      )
    } catch {
      // Error handling
    } finally {
      setLoading(false)
    }
  }

  const onSend = () => {
    if (!input.trim()) return
    const text = input
    setInput('')
    handleSendMessage(text)
  }

  return (
    <div className={styles.container}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={styles.toggleButton}
        aria-label="Toggle assistant"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {open && (
        <aside className={styles.chatWindow}>
          <header className={styles.header}>
            <div>
              <p className={styles.headerTitle}>FarmBridge AI</p>
              <p className={styles.headerSubtitle}>Operational Intelligence</p>
            </div>
            <button onClick={newChat} className={styles.newChatButton} title="New Session">
              <Plus size={16} />
            </button>
          </header>

          <div className={styles.mainGrid}>
            <div className={styles.sidebar}>
              {threads.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={() => setActiveThreadId(t.id)}
                  className={`${styles.threadButton} ${
                    activeThread?.id === t.id ? styles.threadButtonActive : styles.threadButtonInactive
                  }`}
                >
                  <Sparkles size={14} />
                  <span style={{ fontSize: '10px' }}>{idx + 1}</span>
                </button>
              ))}
            </div>
            
            <div className={styles.chatArea}>
              <div className={styles.messagesList}>
                {activeThread?.messages.length === 0 && (
                  <div className={styles.welcomeState}>
                    <p className="label" style={{ marginBottom: '12px' }}>INITIALIZING ASSISTANT</p>
                    <h3 className={styles.headerTitle} style={{ fontSize: '1.4rem', marginBottom: '16px' }}>
                      How can we bridge the gap today?
                    </h3>
                    <div className={styles.starterGrid}>
                      {STARTER_PROMPTS.map((p) => (
                        <button 
                          key={p.id} 
                          className={styles.promptBox}
                          onClick={() => handleSendMessage(p.text)}
                        >
                          <span className={styles.promptTitle}>{p.title}</span>
                          <span className={styles.promptText}>{p.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeThread?.messages.map((m, i) => (
                  <div
                    key={`${m.timestamp}-${i}`}
                    className={`${styles.messageBubble} ${
                      m.role === 'user' ? styles.userMessage : styles.assistantMessage
                    }`}
                  >
                    <p>{m.content}</p>
                    <span className={styles.timestamp}>
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
                {loading && <p className={styles.loadingText}>ANALYZING DATA...</p>}
                <div ref={messagesEndRef} />
              </div>

              <div className={styles.inputArea}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      onSend()
                    }
                  }}
                  placeholder="Ask a question..."
                  className={styles.textarea}
                />
                <button
                  onClick={onSend}
                  disabled={loading || !input.trim()}
                  className={styles.sendButton}
                >
                  {loading ? '...' : 'SEND COMMAND'}
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  )
}
