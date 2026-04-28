'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowUp,
  ClipboardCheck,
  Clock,
  CloudRain,
  MessageSquare,
  PhoneCall,
  RotateCcw,
  Wheat,
  X,
} from 'lucide-react'
import styles from './FarmBridgeChatWidget.module.css'

type ChatMessage = { role: 'user' | 'assistant'; content: string; timestamp: string }

const STORAGE_KEY = 'farmbridge_chat_v3'

const STARTER_CHIPS: { text: string; icon: LucideIcon }[] = [
  { text: 'Check eligibility', icon: ClipboardCheck },
  { text: 'Find drought programs', icon: CloudRain },
  { text: 'Upcoming deadlines', icon: Clock },
  { text: 'Talk to an agent', icon: PhoneCall },
]

export function FarmBridgeChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showUnreadDot, setShowUnreadDot] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const openRef = useRef(false)

  useEffect(() => {
    openRef.current = open
    if (open) setShowUnreadDot(false)
  }, [open])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as ChatMessage[]
        if (Array.isArray(parsed)) setMessages(parsed)
      }
    } catch {
      /* ignore */
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    } catch {
      /* ignore quota */
    }
  }, [messages, hydrated])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const resizeTextarea = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    const max = 120
    el.style.height = `${Math.min(el.scrollHeight, max)}px`
  }, [])

  useEffect(() => {
    resizeTextarea()
  }, [input, resizeTextarea])

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return
    setLoading(true)

    const userMessage: ChatMessage = {
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            content: m.content,
          })),
        }),
      })

      const json = await res.json()
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: res.ok
          ? json.answer
          : 'I encountered an error connecting to our rural intelligence network. Please try again.',
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      if (!openRef.current) setShowUnreadDot(true)
    } catch {
      /* network error; loading cleared in finally */
    } finally {
      setLoading(false)
    }
  }

  const onSend = () => {
    if (!input.trim() || loading) return
    const text = input
    setInput('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
    handleSendMessage(text)
  }

  const clearThread = () => {
    setMessages([])
    setInput('')
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div className={styles.container}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={styles.toggleButton}
        aria-label={open ? 'Close assistant' : 'Open assistant'}
        aria-expanded={open}
      >
        <span
          className={`${styles.toggleIconSlot} ${open ? styles.toggleOpen : styles.toggleClosed}`}
          aria-hidden
        >
          <span className={styles.toggleIconLayer}>
            <MessageSquare size={20} strokeWidth={2} />
          </span>
          <span className={styles.toggleIconLayer}>
            <X size={20} strokeWidth={2} />
          </span>
        </span>
        {!open && showUnreadDot ? <span className={styles.unreadDot} aria-hidden /> : null}
      </button>

      {open ? (
        <aside className={styles.chatWindow} role="dialog" aria-label="FarmBridge AI chat">
          <header className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.botAvatar} aria-hidden>
                <Wheat size={14} strokeWidth={2} color="white" />
              </div>
              <div className={styles.headerTitles}>
                <span className={styles.headerName}>FarmBridge AI</span>
                <span className={styles.statusRow}>
                  <span className={styles.statusDot} />
                  Online
                </span>
              </div>
            </div>
            <div className={styles.headerActions}>
              <button
                type="button"
                className={styles.headerIconBtn}
                data-tip="New chat"
                aria-label="New chat"
                onClick={clearThread}
              >
                <RotateCcw size={14} strokeWidth={2} />
              </button>
              <button
                type="button"
                className={styles.headerIconBtn}
                aria-label="Close"
                onClick={() => setOpen(false)}
              >
                <X size={14} strokeWidth={2} />
              </button>
            </div>
          </header>

          <div className={styles.body}>
            <div className={styles.messagesList}>
              {messages.length === 0 ? (
                <div className={styles.welcome}>
                  <div className={styles.welcomeAvatar} aria-hidden>
                    <Wheat size={18} strokeWidth={2} color="white" />
                  </div>
                  <p className={styles.welcomeHeading}>How can I help?</p>
                  <p className={styles.welcomeSub}>Ask about programs, deadlines, or eligibility.</p>
                  <div className={styles.chipGrid}>
                    {STARTER_CHIPS.map(({ text, icon: Icon }) => (
                      <button
                        key={text}
                        type="button"
                        className={styles.chip}
                        onClick={() => handleSendMessage(text)}
                        disabled={loading}
                      >
                        <Icon size={13} strokeWidth={2} className={styles.chipIcon} />
                        {text}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((m, i) => (
                    <div key={`${m.timestamp}-${i}`} className={styles.messageEnter}>
                      {m.role === 'user' ? (
                        <div className={styles.userRow}>
                          <div className={styles.userBubble}>
                            <p className={styles.bubbleText}>{m.content}</p>
                          </div>
                          <span className={`${styles.timestamp} ${styles.timestampUser}`}>{formatTime(m.timestamp)}</span>
                        </div>
                      ) : (
                        <div className={styles.assistantRow}>
                          <div className={styles.assistantAvatarSmall} aria-hidden>
                            <Wheat size={12} strokeWidth={2} color="white" />
                          </div>
                          <div className={styles.assistantCol}>
                            <div className={styles.assistantBubble}>
                              <p className={styles.bubbleText}>{m.content}</p>
                            </div>
                            <span className={`${styles.timestamp} ${styles.timestampAssistant}`}>
                              {formatTime(m.timestamp)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {loading ? (
                    <div className={styles.assistantRow}>
                      <div className={styles.assistantAvatarSmall} aria-hidden>
                        <Wheat size={12} strokeWidth={2} color="white" />
                      </div>
                      <div className={styles.typingBubble}>
                        <span className={styles.dot} />
                        <span className={styles.dot} />
                        <span className={styles.dot} />
                      </div>
                    </div>
                  ) : null}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            <div className={styles.inputArea}>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onInput={resizeTextarea}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    onSend()
                  }
                }}
                placeholder="Ask a question..."
                className={styles.textarea}
                rows={1}
                disabled={loading}
                aria-label="Message"
              />
              <button
                type="button"
                onClick={onSend}
                disabled={loading || !input.trim()}
                className={styles.sendButton}
                aria-label="Send"
              >
                <ArrowUp size={16} strokeWidth={2} />
              </button>
            </div>
          </div>
        </aside>
      ) : null}
    </div>
  )
}
