'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function PublicAlbumPage() {
  const params = useParams()
  const id = params.id as string

  const [album, setAlbum] = useState<any>(null)
  const [photos, setPhotos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState<number | null>(null)

  useEffect(() => {
    const loadData = async () => {
      const { data: albumData } = await supabase.from('albums').select('*').eq('id', id).single()
      const { data: photosData } = await supabase.from('photos').select('*').eq('album_id', id).order('created_at', { ascending: true })
      setAlbum(albumData)
      setPhotos(photosData ?? [])
      setLoading(false)
    }
    if (id) loadData()
  }, [id])

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

  // Prevent body scroll when lightbox open
  useEffect(() => {
    if (lightbox !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [lightbox])

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  if (loading) return (
    <main className="bg-white min-h-screen flex items-center justify-center">
      <p className="text-xs text-zinc-400 tracking-widest uppercase">Loading...</p>
    </main>
  )

  if (!album) return (
    <main className="bg-white min-h-screen flex items-center justify-center">
      <p className="text-xs text-zinc-400">Album not found.</p>
    </main>
  )

  return (
    <main className="bg-white text-zinc-900 font-sans">

      {/* LIGHTBOX */}
      {lightbox !== null && photos[lightbox] && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          {/* Close */}
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors z-10"
          >
            <X size={24} />
          </button>

          {/* Counter */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/40 text-xs tracking-[0.3em] uppercase">
            {lightbox + 1} / {photos.length}
          </div>

          {/* Prev */}
          {lightbox > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox(lightbox - 1) }}
              className="absolute left-4 md:left-8 text-white/50 hover:text-white transition-colors z-10 p-2 hover:bg-white/10 rounded-full"
            >
              <ChevronLeft size={36} />
            </button>
          )}

          {/* Image */}
          <div
            className="max-w-5xl max-h-[85vh] px-16 md:px-24"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photos[lightbox].image_url}
              alt={photos[lightbox].caption || ''}
              className="max-w-full max-h-[80vh] object-contain mx-auto shadow-2xl"
            />
            {photos[lightbox].caption && (
              <p className="text-white/50 text-xs text-center mt-5 tracking-wide">
                {photos[lightbox].caption}
              </p>
            )}
          </div>

          {/* Next */}
          {lightbox < photos.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox(lightbox + 1) }}
              className="absolute right-4 md:right-8 text-white/50 hover:text-white transition-colors z-10 p-2 hover:bg-white/10 rounded-full"
            >
              <ChevronRight size={36} />
            </button>
          )}

          {/* Thumbnail strip */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 max-w-xs overflow-hidden">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setLightbox(i) }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === lightbox ? 'bg-white w-4' : 'bg-white/30 hover:bg-white/60'}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold tracking-[0.2em] uppercase">Nevertheless</Link>
          <div className="hidden md:flex items-center gap-8">
            {([['About', '/about'], ['Events', '/events'], ['Blog', '/blog'], ['Gallery', '/gallery'], ['Contact', '/contact']] as [string, string][]).map(([label, href]) => (
              <Link key={href} href={href} className={`text-xs tracking-widest uppercase transition-colors ${href === '/gallery' ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-900'}`}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-16">
        <div className="relative min-h-[45vh] flex flex-col justify-end overflow-hidden bg-zinc-900">
          {album.cover_image && (
            <div className="absolute inset-0">
              <img src={album.cover_image} alt={album.title} className="w-full h-full object-cover opacity-30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="relative max-w-6xl mx-auto px-6 py-16 w-full">
            <Link href="/gallery" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-xs tracking-widest uppercase transition-colors mb-8">
              ← All Albums
            </Link>
            {album.tag && (
              <div className="mb-3">
                <span className="inline-block text-[10px] tracking-[0.3em] uppercase px-3 py-1.5 bg-white/20 text-white">
                  {album.tag}
                </span>
              </div>
            )}
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight max-w-4xl" style={{ fontFamily: 'Georgia, serif' }}>
              {album.title}
            </h1>
            <div className="flex items-center gap-6 mt-4">
              {album.event_date && <p className="text-white/60 text-sm">{formatDate(album.event_date)}</p>}
              <p className="text-white/40 text-sm">{photos.length} photos</p>
            </div>
          </div>
        </div>
      </section>

      {/* DESCRIPTION */}
      {album.description && (
        <section className="border-b border-zinc-100">
          <div className="max-w-6xl mx-auto px-6 py-10">
            <p className="text-base text-zinc-500 max-w-2xl leading-relaxed">{album.description}</p>
          </div>
        </section>
      )}

      {/* PHOTO GRID */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          {photos.length === 0 ? (
            <div className="border border-dashed border-zinc-200 p-24 text-center">
              <p className="text-sm text-zinc-400">No photos in this album yet.</p>
            </div>
          ) : (
            <>
              <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-400 mb-6">
                Click any photo to view full size
              </p>
              <div className="columns-2 md:columns-3 gap-2 space-y-2">
                {photos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className="break-inside-avoid group relative overflow-hidden bg-zinc-100 cursor-pointer"
                    onClick={() => setLightbox(index)}
                  >
                    <img
                      src={photo.image_url}
                      alt={photo.caption || album.title}
                      className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    {photo.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 px-3 py-2">
                        <p className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">{photo.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* BACK */}
      <section className="py-16 bg-zinc-50 border-t border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <Link href="/gallery" className="text-xs tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors">
            ← Back to Gallery
          </Link>
          <Link href="/contact" className="bg-zinc-900 text-white text-xs tracking-widest uppercase px-6 py-3 hover:bg-zinc-700 transition-colors">
            Get In Touch
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="text-xs font-semibold tracking-[0.2em] uppercase text-zinc-900">Nevertheless</Link>
          <Link href="/gallery" className="text-[10px] tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors">← Back to Gallery</Link>
          <p className="text-[10px] text-zinc-300">© {new Date().getFullYear()} Nevertheless</p>
        </div>
      </footer>
    </main>
  )
}
