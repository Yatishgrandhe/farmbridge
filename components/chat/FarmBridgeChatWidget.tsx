'use client'

import { useEffect, useMemo, useState } from 'react'
import { MessageCircle, Plus, X } from 'lucide-react'
import styles from './FarmBridgeChatWidget.module.css'

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
    <div className={styles.container}>
      <button
        onClick={() => setOpen((value) => !value)}
        className={styles.toggleButton}
        aria-label="Toggle FarmBridge assistant chat"
        aria-expanded={open}
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
      </button>

      {open && (
        <aside className={styles.chatWindow}>
          <header className={styles.header}>
            <div>
              <p className={styles.headerTitle}>FarmBridge Assistant</p>
              <p className={styles.headerSubtitle}>Chats are saved locally.</p>
            </div>
            <button onClick={newChat} className={styles.newChatButton}>
              <Plus size={14} />
            </button>
          </header>

          <div className={styles.mainGrid}>
            <div className={styles.sidebar}>
              {threads.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => setActiveThreadId(thread.id)}
                  className={`${styles.threadButton} ${
                    activeThread?.id === thread.id ? styles.threadButtonActive : styles.threadButtonInactive
                  }`}
                >
                  {thread.title || 'Chat'}
                </button>
              ))}
            </div>
            <div className={styles.chatArea}>
              <div className={styles.messagesList}>
                {(activeThread?.messages ?? []).map((message, index) => (
                  <div
                    key={`${message.timestamp}-${index}`}
                    className={`${styles.messageBubble} ${
                      message.role === 'user' ? styles.userMessage : styles.assistantMessage
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className={styles.timestamp}>
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}
                {loading && <p className={styles.loadingText}>Thinking...</p>}
              </div>
              <div className={styles.inputArea}>
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask about resources..."
                  className={styles.textarea}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading}
                  className={styles.sendButton}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  )
}
