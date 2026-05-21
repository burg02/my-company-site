'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    events: 0,
    posts: 0,
    albums: 0,
    unread: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      const [
        { count: events },
        { count: posts },
        { count: albums },
        { count: unread },
      ] = await Promise.all([
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase.from('albums').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
      ])
      setStats({
        events: events ?? 0,
        posts: posts ?? 0,
        albums: albums ?? 0,
        unread: unread ?? 0,
      })
      setLoading(false)
    }
    loadStats()
  }, [])

  const statCards = [
    { label: 'Events', value: stats.events, href: '/admin/events', icon: '◈' },
    { label: 'Blog Posts', value: stats.posts, href: '/admin/blog', icon: '✦' },
    { label: 'Albums', value: stats.albums, href: '/admin/gallery', icon: '⬡' },
    { label: 'Unread Messages', value: stats.unread, href: '/admin/messages', icon: '✉' },
  ]

  return (
    <div className="max-w-5xl space-y-10">
      {/* Header */}
      <div className="border-b border-zinc-200 pb-6">
        <p className="text-[10px] tracking-[0.3em] text-zinc-400 uppercase mb-1">Nevertheless</p>
        <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Dashboard</h1>
        <p className="text-sm text-zinc-400 mt-1">Welcome back. Here's an overview of your content.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-100">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white p-6 hover:bg-zinc-50 transition-colors group"
          >
            <p className="text-2xl mb-3 text-zinc-300 group-hover:text-zinc-500 transition-colors">
              {stat.icon}
            </p>
            <p className="text-3xl font-bold text-zinc-900 mb-1">
              {loading ? '—' : stat.value}
            </p>
            <p className="text-[10px] tracking-[0.2em] uppercase text-zinc-400">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-400">Quick Actions</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { label: 'Create New Event', href: '/admin/events/new', desc: 'Add an upcoming or past event' },
            { label: 'Write a Blog Post', href: '/admin/blog/new', desc: 'Publish a new article or update' },
            { label: 'Create Photo Album', href: '/admin/gallery/new', desc: 'Add a new gallery album' },
            { label: 'View Messages', href: '/admin/messages', desc: loading ? 'Loading...' : `${stats.unread} unread message${stats.unread !== 1 ? 's' : ''}` },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="bg-white border border-zinc-100 p-5 hover:border-zinc-900 transition-colors group"
            >
              <p className="text-sm font-medium text-zinc-900 group-hover:text-zinc-700 mb-1">{action.label}</p>
              <p className="text-xs text-zinc-400">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
