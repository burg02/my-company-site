import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-zinc-50 flex">
      <AdminSidebar userEmail="admin@nevertheless.com" />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  )
}