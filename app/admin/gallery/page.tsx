import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function AdminGalleryPage() {
  const { data: albums } = await supabase
    .from('albums')
    .select('*')
    .order('created_at', { ascending: false })

  // Get photo counts separately
  const albumsWithCounts = await Promise.all(
    (albums ?? []).map(async (album) => {
      const { count } = await supabase
        .from('photos')
        .select('*', { count: 'exact', head: true })
        .eq('album_id', album.id)
      return { ...album, photoCount: count ?? 0 }
    })
  )

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div className="max-w-5xl space-y-8">
      <div className="border-b border-zinc-200 pb-6 flex items-end justify-between">
        <div>
          <p className="text-[10px] tracking-[0.3em] text-zinc-400 uppercase mb-1">Nevertheless</p>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Gallery</h1>
          <p className="text-sm text-zinc-400 mt-1">{albumsWithCounts.length} albums</p>
        </div>
        <Link
          href="/admin/gallery/new"
          className="bg-zinc-900 text-white text-xs tracking-widest uppercase px-5 py-3 hover:bg-zinc-700 transition-colors"
        >
          + New Album
        </Link>
      </div>

      {albumsWithCounts.length === 0 && (
        <div className="bg-white border border-dashed border-zinc-200 p-16 text-center">
          <p className="text-4xl mb-4">⬡</p>
          <p className="text-sm font-medium text-zinc-900 mb-1">No albums yet</p>
          <p className="text-xs text-zinc-400 mb-6">Create your first album to start uploading photos.</p>
          <Link href="/admin/gallery/new" className="inline-block bg-zinc-900 text-white text-xs tracking-widest uppercase px-6 py-3 hover:bg-zinc-700 transition-colors">
            Create Album
          </Link>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {albumsWithCounts.map((album) => (
          <div key={album.id} className="group bg-white border border-zinc-100 overflow-hidden hover:border-zinc-300 transition-colors">
            <div className="aspect-video bg-zinc-100 overflow-hidden relative">
              {album.cover_image ? (
                <img
                  src={album.cover_image}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-zinc-300 text-xs tracking-widest uppercase">No Cover</p>
                </div>
              )}
              {album.tag && (
                <span className="absolute top-2 left-2 text-[10px] tracking-widest uppercase bg-white/90 text-zinc-700 px-2 py-1">
                  {album.tag}
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-zinc-900 mb-1 truncate">{album.title}</h3>
              {album.event_date && (
                <p className="text-xs text-zinc-400 mb-1">{formatDate(album.event_date)}</p>
              )}
              <p className="text-xs text-zinc-300">{album.photoCount} photos</p>
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-zinc-100">
                <Link
                  href={`/admin/gallery/${album.id}`}
                  className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors"
                >
                  Manage
                </Link>
                <Link
                  href={`/gallery/${album.id}`}
                  target="_blank"
                  className="text-xs text-zinc-300 hover:text-zinc-600 transition-colors"
                >
                  View ↗
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
