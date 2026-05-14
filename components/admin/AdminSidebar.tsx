'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { LayoutDashboard, Calendar, FileText, Image, MessageSquare, LogOut, Menu, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Events', href: '/admin/events', icon: Calendar },
  { label: 'Blog', href: '/admin/blog', icon: FileText },
  { label: 'Gallery', href: '/admin/gallery', icon: Image },
  { label: 'Messages', href: '/admin/messages', icon: MessageSquare },
]

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-zinc-800">
        <p className="text-[9px] tracking-[0.3em] uppercase text-zinc-500 mb-1">Admin</p>
        <p className="text-sm font-semibold text-white tracking-wide">Nevertheless</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 text-xs tracking-wide transition-colors rounded ${
                active
                  ? 'bg-white/10 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={14} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <p className="text-[10px] text-zinc-500 truncate mb-3 px-3">{userEmail}</p>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 text-xs text-zinc-400 hover:text-white transition-colors w-full rounded hover:bg-white/5"
        >
          <LogOut size={14} />
          Sign Out →
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-52 shrink-0 bg-zinc-900 flex-col min-h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-zinc-900 h-14 flex items-center justify-between px-4 border-b border-zinc-800">
        <p className="text-sm font-semibold text-white tracking-wide">Nevertheless</p>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-zinc-400 hover:text-white transition-colors">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-zinc-900 flex flex-col pt-14">
          <SidebarContent />
        </div>
      )}
    </>
  )
}
