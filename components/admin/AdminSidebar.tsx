'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { authService } from '@/services/auth.service'

const NAV = [
  { label: 'Dashboard', href: '/admin', icon: '▪' },
  { label: 'Events', href: '/admin/events', icon: '◈' },
  { label: 'Blog', href: '/admin/blog', icon: '◉' },
  { label: 'Gallery', href: '/admin/gallery', icon: '◫' },
  { label: 'Messages', href: '/admin/messages', icon: '◎' },
]

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    await authService.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <aside className="w-56 min-h-screen bg-zinc-950 flex flex-col justify-between py-8 px-5 shrink-0 border-r border-zinc-800">
      {/* Logo */}
      <div className="space-y-10">
        <div>
          <p className="text-[10px] tracking-[0.3em] text-zinc-500 uppercase mb-1">Admin</p>
          <h1 className="text-white font-semibold text-sm tracking-wide">Nevertheless</h1>
        </div>

        {/* Nav */}
        <nav className="space-y-0.5">
          {NAV.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 text-xs rounded-sm transition-all duration-150',
                  isActive
                    ? 'bg-white text-zinc-900 font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                )}
              >
                <span className="text-base leading-none">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="space-y-3 pt-6 border-t border-zinc-800">
        <p className="text-[10px] text-zinc-600 truncate">{userEmail}</p>
        <button
          onClick={handleSignOut}
          className="text-[10px] text-zinc-500 hover:text-white transition-colors tracking-widest uppercase"
        >
          Sign out →
        </button>
      </div>
    </aside>
  )
}
