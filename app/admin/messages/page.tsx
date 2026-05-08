'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Message {
  id: string
  name: string
  email: string
  subject: string
  message: string
  is_read: boolean
  created_at: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Message | null>(null)
  const [tab, setTab] = useState<'all' | 'unread' | 'read'>('all')

  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
    setMessages(data ?? [])
    setLoading(false)
  }

  const markRead = async (msg: Message) => {
    setSelected(msg)
    if (!msg.is_read) {
      await supabase.from('messages').update({ is_read: true }).eq('id', msg.id)
      setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, is_read: true } : m))
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return
    await supabase.from('messages').delete().eq('id', id)
    if (selected?.id === id) setSelected(null)
    loadMessages()
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  const filtered = messages.filter((m) => {
    if (tab === 'unread') return !m.is_read
    if (tab === 'read') return m.is_read
    return true
  })

  const unreadCount = messages.filter((m) => !m.is_read).length

  return (
    <div className="max-w-6xl space-y-8">
      {/* Header */}
      <div className="border-b border-zinc-200 pb-6 flex items-end justify-between">
        <div>
          <p className="text-[10px] tracking-[0.3em] text-zinc-400 uppercase mb-1">Nevertheless</p>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Messages</h1>
          <p className="text-sm text-zinc-400 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'All messages read'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-zinc-100">
        {(['all', 'unread', 'read'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-xs tracking-wide pb-3 border-b-2 transition-colors capitalize ${
              tab === t ? 'border-zinc-900 text-zinc-900 font-medium' : 'border-transparent text-zinc-400 hover:text-zinc-600'
            }`}
          >
            {t} {t === 'unread' && unreadCount > 0 && `(${unreadCount})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-xs text-zinc-400 py-8">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-zinc-200 p-16 text-center">
          <p className="text-4xl mb-4">✉</p>
          <p className="text-sm font-medium text-zinc-900 mb-1">No messages yet</p>
          <p className="text-xs text-zinc-400">Messages from your contact form will appear here.</p>
        </div>
      ) : (
        <div className="flex gap-6">
          {/* Message List */}
          <div className="w-80 shrink-0 space-y-1">
            {filtered.map((msg) => (
              <div
                key={msg.id}
                onClick={() => markRead(msg)}
                className={`p-4 cursor-pointer border transition-colors ${
                  selected?.id === msg.id
                    ? 'border-zinc-900 bg-zinc-50'
                    : 'border-zinc-100 hover:border-zinc-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm truncate ${msg.is_read ? 'text-zinc-600' : 'text-zinc-900 font-semibold'}`}>
                    {msg.name}
                  </p>
                  {!msg.is_read && (
                    <span className="shrink-0 w-2 h-2 bg-zinc-900 rounded-full mt-1.5" />
                  )}
                </div>
                <p className="text-xs text-zinc-400 truncate mt-0.5">{msg.subject || msg.message}</p>
                <p className="text-[10px] text-zinc-300 mt-1">{formatDate(msg.created_at)}</p>
              </div>
            ))}
          </div>

          {/* Message Detail */}
          {selected ? (
            <div className="flex-1 bg-white border border-zinc-100 p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-base font-semibold text-zinc-900">{selected.subject || '(No subject)'}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-zinc-500">{selected.name}</p>
                    <span className="text-zinc-200">·</span>
                    <a href={`mailto:${selected.email}`} className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors">{selected.email}</a>
                  </div>
                  <p className="text-[10px] text-zinc-300 mt-1">{formatDate(selected.created_at)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                    className="text-xs tracking-widest uppercase bg-zinc-900 text-white px-4 py-2 hover:bg-zinc-700 transition-colors"
                  >
                    Reply
                  </a>
                  <button
                    onClick={() => handleDelete(selected.id)}
                    className="text-xs text-red-400 hover:text-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="border-t border-zinc-100 pt-5">
                <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 bg-white border border-dashed border-zinc-200 flex items-center justify-center">
              <p className="text-xs text-zinc-400">Select a message to read</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
