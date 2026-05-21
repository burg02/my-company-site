import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50 flex">
      <AdminSidebar userEmail="admin@nevertheless.com" />
      <main className="flex-1 p-6 md:p-8 overflow-auto pt-20 md:pt-8">
        {children}
      </main>
    </div>
  )
}