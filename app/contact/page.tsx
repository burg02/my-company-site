'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setStatus('sending')
    const { error } = await supabase.from('messages').insert(form)
    if (error) { setStatus('error'); return }
    setStatus('sent')
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <main className="bg-white text-zinc-900 font-sans">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold tracking-[0.2em] uppercase">Nevertheless</Link>
          <div className="hidden md:flex items-center gap-8">
            {[['About', '/about'], ['Events', '/events'], ['Blog', '/blog'], ['Gallery', '/gallery'], ['Contact', '/contact']].map(([label, href]) => (
              <Link key={href} href={href} className={`text-xs tracking-widest uppercase transition-colors ${href === '/contact' ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-900'}`}>{label}</Link>
            ))}
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <section className="pt-16 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-24 items-start">
          {/* Left */}
          <div className="md:sticky md:top-32">
            <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-400 mb-6">— Contact</p>
            <h1 className="text-5xl font-bold tracking-tight leading-tight mb-8" style={{ fontFamily: 'Georgia, serif' }}>
              Let's start a<br /><span className="italic font-normal">conversation.</span>
            </h1>
            <p className="text-base text-zinc-500 leading-relaxed max-w-sm mb-12">
              Have a question, a partnership idea, or just want to connect? We'd love to hear from you. Fill out the form and we'll get back to you shortly.
            </p>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-300 mb-1">Email</p>
                <p className="text-sm text-zinc-600">hello@nevertheless.com</p>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-300 mb-1">Location</p>
                <p className="text-sm text-zinc-600">Manila, Philippines</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            {status === 'sent' ? (
              <div className="border border-zinc-100 bg-zinc-50 p-16 text-center">
                <p className="text-3xl mb-4" style={{ fontFamily: 'Georgia, serif' }}>✓</p>
                <p className="text-sm font-semibold text-zinc-900 mb-2">Message sent</p>
                <p className="text-xs text-zinc-400">We'll get back to you as soon as possible.</p>
                <button onClick={() => setStatus('idle')} className="mt-8 text-xs tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors">
                  Send another →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] tracking-widest uppercase text-zinc-400 mb-2">Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-zinc-900 transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-widest uppercase text-zinc-400 mb-2">Email *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-zinc-900 transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-zinc-400 mb-2">Subject</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-zinc-900 transition-colors"
                    placeholder="What's this about?"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-zinc-400 mb-2">Message *</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    rows={7}
                    className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-zinc-900 transition-colors resize-none"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>
                {status === 'error' && (
                  <p className="text-xs text-red-500">Something went wrong. Please try again.</p>
                )}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-zinc-900 text-white text-xs tracking-widest uppercase py-4 hover:bg-zinc-700 transition-colors disabled:opacity-50"
                >
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-900">Nevertheless</Link>
          <p className="text-[10px] text-zinc-300">© {new Date().getFullYear()} Nevertheless</p>
        </div>
      </footer>
    </main>
  )
}
