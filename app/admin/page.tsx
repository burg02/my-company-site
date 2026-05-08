import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function AdminDashboardPage() {
  const { data: events } = await supabase.from('events').select('id')
  const { data: posts } = await supabase.from('posts').select('id')
  const { data: gallery } = await supabase.from('gallery').select('id')
  const { data: messages } = await supabase.from('messages').select('id').eq('is_read', false)

  const stats = [
    { label: 'Events', value: events?.length ?? 0, href: '/admin/events', icon: '◈' },
    { label: 'Blog Posts', value: posts?.length ?? 0, href: '/admin/blog', icon: '✦' },
    { label: 'Gallery', value: gallery?.length ?? 0, href: '/admin/gallery', icon: '⬡' },
    { label: 'Unread Messages', value: messages?.length ?? 0, href: '/admin/messages', icon: '✉' },
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
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white p-6 hover:bg-zinc-50 transition-colors group"
          >
            <p className="text-2xl mb-3 text-zinc-300 group-hover:text-zinc-500 transition-colors">
              {stat.icon}
            </p>
            <p className="text-3xl font-bold text-zinc-900 mb-1">{stat.value}</p>
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
            { label: 'Upload to Gallery', href: '/admin/gallery', desc: 'Add photos to the gallery' },
            { label: 'View Messages', href: '/admin/messages', desc: 'Read contact form submissions' },
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
