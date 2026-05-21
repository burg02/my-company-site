'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { supabase } from '@/lib/supabase'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [checked, setChecked] = useState(false)
  const [email, setEmail] = useState('admin@nevertheless.com')

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.replace('/auth/login')
      } else {
        setEmail(session.user.email ?? 'admin@nevertheless.com')
        setChecked(true)
      }
    }
    checkAuth()
  }, [router])

  if (!checked) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <p className="text-xs text-zinc-400 tracking-widest uppercase">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      <AdminSidebar userEmail={email} />
      <main className="flex-1 p-6 md:p-8 overflow-auto pt-20 md:pt-8">
        {children}
      </main>
    </div>
  )
}
