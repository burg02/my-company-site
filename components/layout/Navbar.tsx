'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const links = [
  { label: 'About', href: '/about' },
  { label: 'Events', href: '/events' },
  { label: 'Blog', href: '/blog' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Close menu on route change
  useEffect(() => { setOpen(false) }, [pathname])

  // Prevent scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold tracking-[0.2em] uppercase">
            Nevertheless
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs tracking-widest uppercase transition-colors ${
                  pathname === link.href ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-zinc-600 hover:text-zinc-900 transition-colors p-1"
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-white md:hidden flex flex-col pt-16">
          <div className="flex flex-col px-6 py-8 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`py-4 text-lg font-medium border-b border-zinc-100 transition-colors ${
                  pathname === link.href ? 'text-zinc-900' : 'text-zinc-400'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-auto px-6 py-8">
            <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-300">
              © {new Date().getFullYear()} Nevertheless
            </p>
          </div>
        </div>
      )}
    </>
  )
}
