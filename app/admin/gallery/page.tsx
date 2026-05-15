'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function AdminGalleryPage() {
  const [albums, setAlbums] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const loadAlbums = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('albums')
      .select('*')
      .order('created_at', { ascending: false })

    const withCounts = await Promise.all(
      (data ?? []).map(async (album) => {
        const { count } = await supabase
          .from('photos')
          .select('*', { count: 'exact', head: true })
          .eq('album_id', album.id)
        return { ...album, photoCount: count ?? 0 }
      })
    )
    setAlbums(withCounts)
    setLoading(false)
  }

  useEffect(() => { loadAlbums() }, [])

  const handleDelete = async (albumId: string) => {
    if (!confirm('Delete this entire album and all its photos?')) return
    setDeleting(albumId)
    await supabase.from('photos').delete().eq('album_id', albumId)
    await supabase.from('albums').delete().eq('id', albumId)
    setAlbums((prev) => prev.filter((a) => a.id !== albumId))
    setDeleting(null)
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  if (loading) return <div className="text-xs text-zinc-400 py-8">Loading...</div>

  return (
    <div className="max-w-5xl space-y-8">
      <div className="border-b border-zinc-200 pb-6 flex items-end justify-between">
        <div>
          <p className="text-[10px] tracking-[0.3em] text-zinc-400 uppercase mb-1">Nevertheless</p>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Gallery</h1>
          <p className="text-sm text-zinc-400 mt-1">{albums.length} albums</p>
        </div>
        <Link href="/admin/gallery/new" className="bg-zinc-900 text-white text-xs tracking-widest uppercase px-5 py-3 hover:bg-zinc-700 transition-colors">
          + New Album
        </Link>
      </div>

      {albums.length === 0 && (
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
        {albums.map((album) => (
          <div key={album.id} className="group bg-white border border-zinc-100 overflow-hidden hover:border-zinc-300 transition-colors">
            <div className="aspect-video bg-zinc-100 overflow-hidden relative">
              {album.cover_image ? (
                <img src={album.cover_image} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-100">
                <div className="flex items-center gap-3">
                  <Link href={`/admin/gallery/${album.id}`} className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors">
                    Manage
                  </Link>
                  <Link href={`/gallery/${album.id}`} target="_blank" className="text-xs text-zinc-300 hover:text-zinc-600 transition-colors">
                    View ↗
                  </Link>
                </div>
                <button
                  onClick={() => handleDelete(album.id)}
                  disabled={deleting === album.id}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                >
                  <Trash2 size={11} />
                  {deleting === album.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
