'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Trash2, Plus, Upload, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function AdminAlbumPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [album, setAlbum] = useState<any>(null)
  const [photos, setPhotos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newPhotos, setNewPhotos] = useState<{ file: File; preview: string; caption: string }[]>([])
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const photoRef = useRef<HTMLInputElement>(null)

  const loadData = async () => {
    setLoading(true)
    const { data: albumData } = await supabase.from('albums').select('*').eq('id', id).single()
    const { data: photosData } = await supabase.from('photos').select('*').eq('album_id', id).order('created_at', { ascending: true })
    setAlbum(albumData)
    setPhotos(photosData ?? [])
    setLoading(false)
  }

  useEffect(() => { if (id) loadData() }, [id])

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightbox === null) return
      if (e.key === 'ArrowRight') setLightbox((prev) => prev !== null ? Math.min(prev + 1, photos.length - 1) : null)
      if (e.key === 'ArrowLeft') setLightbox((prev) => prev !== null ? Math.max(prev - 1, 0) : null)
      if (e.key === 'Escape') setLightbox(null)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightbox, photos.length])

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  const handlePhotoSelect = (files: FileList) => {
    const selected = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      caption: '',
    }))
    setNewPhotos((prev) => [...prev, ...selected])
  }

  const handleUpload = async () => {
    if (newPhotos.length === 0) return
    setUploading(true)
    for (const photo of newPhotos) {
      try {
        const ext = photo.file.name.split('.').pop()
        const fileName = `albums/${id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error: uploadError } = await supabase.storage.from('Gallery').upload(fileName, photo.file, { upsert: false })
        if (uploadError) { console.error('Upload error:', uploadError); continue }
        const { data: urlData } = supabase.storage.from('Gallery').getPublicUrl(fileName)
        const { error: dbError } = await supabase.from('photos').insert({ album_id: id, image_url: urlData.publicUrl, caption: photo.caption })
        if (dbError) console.error('DB error:', dbError)
      } catch (err) {
        console.error('Error:', err)
      }
    }
    setNewPhotos([])
    setUploading(false)
    await loadData()
  }

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm('Delete this photo?')) return
    await supabase.from('photos').delete().eq('id', photoId)
    if (lightbox !== null) setLightbox(null)
    loadData()
  }

  const handleDeleteAlbum = async () => {
    if (!confirm('Delete this entire album and all its photos?')) return
    setDeleting(true)
    await supabase.from('photos').delete().eq('album_id', id)
    await supabase.from('albums').delete().eq('id', id)
    router.push('/admin/gallery')
  }

  if (loading) return <div className="text-xs text-zinc-400 py-8">Loading...</div>
  if (!album) return <div className="text-xs text-zinc-400 py-8">Album not found.</div>

  return (
    <div className="max-w-5xl space-y-8">

      {/* LIGHTBOX */}
      {lightbox !== null && photos[lightbox] && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          {/* Close */}
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-10"
          >
            <X size={24} />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-widest uppercase">
            {lightbox + 1} / {photos.length}
          </div>

          {/* Prev */}
          {lightbox > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox(lightbox - 1) }}
              className="absolute left-4 text-white/60 hover:text-white transition-colors z-10 p-2"
            >
              <ChevronLeft size={32} />
            </button>
          )}

          {/* Image */}
          <div
            className="max-w-5xl max-h-[85vh] px-16"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photos[lightbox].image_url}
              alt={photos[lightbox].caption || ''}
              className="max-w-full max-h-[80vh] object-contain mx-auto"
            />
            {photos[lightbox].caption && (
              <p className="text-white/60 text-xs text-center mt-4 tracking-wide">
                {photos[lightbox].caption}
              </p>
            )}
          </div>

          {/* Next */}
          {lightbox < photos.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox(lightbox + 1) }}
              className="absolute right-4 text-white/60 hover:text-white transition-colors z-10 p-2"
            >
              <ChevronRight size={32} />
            </button>
          )}

          {/* Delete in lightbox */}
          <button
            onClick={(e) => { e.stopPropagation(); handleDeletePhoto(photos[lightbox].id) }}
            className="absolute bottom-4 right-4 text-red-400/60 hover:text-red-400 transition-colors text-xs tracking-widest uppercase flex items-center gap-2"
          >
            <Trash2 size={12} /> Delete
          </button>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-zinc-200 pb-6 flex items-start justify-between">
        <div>
          <Link href="/admin/gallery" className="text-[10px] tracking-[0.3em] text-zinc-400 uppercase mb-1 hover:text-zinc-900 transition-colors block">
            ← Gallery
          </Link>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight mt-2">{album.title}</h1>
          <p className="text-sm text-zinc-400 mt-1">
            {photos.length} photos
            {album.event_date && ` · ${formatDate(album.event_date)}`}
            {album.tag && ` · ${album.tag}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/gallery/${album.id}`} target="_blank" className="text-xs tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors">
            View Public ↗
          </Link>
          <button onClick={handleDeleteAlbum} disabled={deleting} className="flex items-center gap-2 text-xs text-red-400 hover:text-red-600 transition-colors disabled:opacity-50">
            <Trash2 size={12} />
            {deleting ? 'Deleting...' : 'Delete Album'}
          </button>
        </div>
      </div>

      {/* Cover */}
      {album.cover_image && (
        <div className="aspect-video max-w-sm overflow-hidden bg-zinc-100">
          <img src={album.cover_image} alt={album.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Add Photos */}
      <div className="bg-white border border-zinc-100 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs tracking-[0.3em] uppercase text-zinc-400">Add Photos</h2>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => photoRef.current?.click()}
              className="flex items-center gap-2 text-xs tracking-widest uppercase border border-zinc-200 px-4 py-2 hover:border-zinc-900 transition-colors">
              <Plus size={12} /> Select Photos
            </button>
            {newPhotos.length > 0 && (
              <button type="button" onClick={handleUpload} disabled={uploading}
                className="flex items-center gap-2 text-xs tracking-widest uppercase bg-zinc-900 text-white px-4 py-2 hover:bg-zinc-700 transition-colors disabled:opacity-50">
                <Upload size={12} />
                {uploading ? 'Uploading...' : `Upload ${newPhotos.length} Photo${newPhotos.length > 1 ? 's' : ''}`}
              </button>
            )}
          </div>
        </div>
        <input ref={photoRef} type="file" accept="image/*" multiple className="hidden"
          onChange={(e) => { if (e.target.files) handlePhotoSelect(e.target.files) }} />
        {newPhotos.length > 0 && (
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {newPhotos.map((photo, i) => (
              <div key={i} className="group relative aspect-square overflow-hidden bg-zinc-100">
                <img src={photo.preview} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setNewPhotos((prev) => prev.filter((_, idx) => idx !== i))}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={8} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Photos Grid */}
      {photos.length === 0 ? (
        <div className="border border-dashed border-zinc-200 p-16 text-center">
          <p className="text-sm text-zinc-400">No photos yet. Select and upload photos above!</p>
        </div>
      ) : (
        <>
          <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-400">Click a photo to preview</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="group relative aspect-square overflow-hidden bg-zinc-100 cursor-pointer"
                onClick={() => setLightbox(index)}
              >
                <img
                  src={photo.image_url}
                  alt={photo.caption || ''}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                {photo.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1">
                    <p className="text-white text-[10px] truncate">{photo.caption}</p>
                  </div>
                )}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeletePhoto(photo.id) }}
                    className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X size={10} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
