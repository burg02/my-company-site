'use client'

import { useState, useRef, useTransition } from 'react'
import { Upload, X, Plus } from 'lucide-react'
import { createAlbum } from '@/app/admin/gallery/actions'

const TAGS = ['General', 'B2B', 'HR', 'Technology', 'Marketing', 'Finance', 'Leadership', 'Networking']

export default function NewAlbumPage() {
  const [isPending, startTransition] = useTransition()
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [photos, setPhotos] = useState<{ file: File; preview: string; caption: string }[]>([])
  const coverRef = useRef<HTMLInputElement>(null)
  const photoRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handlePhotoSelect = (files: FileList) => {
    const newPhotos = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      caption: '',
    }))
    setPhotos((prev) => [...prev, ...newPhotos])
  }

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const updateCaption = (index: number, caption: string) => {
    setPhotos((prev) => prev.map((p, i) => i === index ? { ...p, caption } : p))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formRef.current) return
    const fd = new FormData(formRef.current)
    fd.set('photo_count', String(photos.length))
    photos.forEach((photo, i) => {
      fd.set(`photos[${i}][file]`, photo.file)
      fd.set(`photos[${i}][caption]`, photo.caption)
    })
    startTransition(async () => {
      await createAlbum(fd)
    })
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div className="border-b border-zinc-200 pb-6">
        <p className="text-[10px] tracking-[0.3em] text-zinc-400 uppercase mb-1">Gallery</p>
        <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">New Album</h1>
        <p className="text-sm text-zinc-400 mt-1">Create a photo album for an event or occasion.</p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-10">

        {/* ALBUM DETAILS */}
        <div className="bg-white border border-zinc-100 p-8 space-y-6">
          <h2 className="text-xs tracking-[0.3em] uppercase text-zinc-400 border-b border-zinc-100 pb-4">Album Details</h2>

          <div>
            <label className="block text-[10px] tracking-widests uppercase text-zinc-400 mb-2">Album Title *</label>
            <input
              name="title"
              required
              className="w-full border border-zinc-200 px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 transition-colors"
              placeholder="e.g. Annual Leadership Summit 2025"
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-widests uppercase text-zinc-400 mb-2">Description</label>
            <textarea
              name="description"
              rows={2}
              className="w-full border border-zinc-200 px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 transition-colors resize-none"
              placeholder="Brief description of this album..."
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] tracking-widests uppercase text-zinc-400 mb-2">Event Date</label>
              <input
                name="event_date"
                type="date"
                className="w-full border border-zinc-200 px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-widests uppercase text-zinc-400 mb-2">Tag / Category</label>
              <select
                name="tag"
                className="w-full border border-zinc-200 px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 transition-colors bg-white"
              >
                {TAGS.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* COVER IMAGE */}
        <div className="bg-white border border-zinc-100 p-8 space-y-4">
          <h2 className="text-xs tracking-[0.3em] uppercase text-zinc-400 border-b border-zinc-100 pb-4">Cover Image</h2>
          <div
            onClick={() => coverRef.current?.click()}
            className="relative border-2 border-dashed border-zinc-200 hover:border-zinc-400 transition-colors cursor-pointer overflow-hidden"
          >
            {coverPreview ? (
              <div className="relative">
                <img src={coverPreview} alt="Cover" className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs">Click to change</p>
                </div>
                <button type="button" onClick={(e) => { e.stopPropagation(); setCoverPreview(null); if (coverRef.current) coverRef.current.value = '' }}
                  className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1"><X size={12} /></button>
              </div>
            ) : (
              <div className="p-10 text-center">
                <Upload size={24} className="mx-auto text-zinc-300 mb-3" />
                <p className="text-sm text-zinc-500">Click to upload cover image</p>
                <p className="text-xs text-zinc-300 mt-1">This is the thumbnail shown in the gallery list</p>
              </div>
            )}
          </div>
          <input ref={coverRef} name="cover_image" type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) setCoverPreview(URL.createObjectURL(f)) }} />
        </div>

        {/* PHOTOS */}
        <div className="bg-white border border-zinc-100 p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <h2 className="text-xs tracking-[0.3em] uppercase text-zinc-400">Photos ({photos.length})</h2>
            <button
              type="button"
              onClick={() => photoRef.current?.click()}
              className="flex items-center gap-2 text-xs tracking-widests uppercase bg-zinc-900 text-white px-4 py-2 hover:bg-zinc-700 transition-colors"
            >
              <Plus size={12} /> Add Photos
            </button>
          </div>
          <input
            ref={photoRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => { if (e.target.files) handlePhotoSelect(e.target.files) }}
          />

          {photos.length === 0 ? (
            <div
              className="border-2 border-dashed border-zinc-200 p-16 text-center cursor-pointer hover:border-zinc-400 transition-colors"
              onClick={() => photoRef.current?.click()}
            >
              <Upload size={24} className="mx-auto text-zinc-300 mb-3" />
              <p className="text-sm text-zinc-500">Click to select photos</p>
              <p className="text-xs text-zinc-300 mt-1">You can select multiple photos at once</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((photo, index) => (
                <div key={index} className="group relative border border-zinc-100 overflow-hidden">
                  <div className="aspect-square overflow-hidden bg-zinc-100">
                    <img src={photo.preview} alt="" className="w-full h-full object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={10} />
                  </button>
                  <input
                    type="text"
                    value={photo.caption}
                    onChange={(e) => updateCaption(index, e.target.value)}
                    placeholder="Caption (optional)"
                    className="w-full px-2 py-1.5 text-xs border-t border-zinc-100 focus:outline-none focus:bg-zinc-50"
                  />
                </div>
              ))}
              {/* Add more button */}
              <div
                className="aspect-square border-2 border-dashed border-zinc-200 hover:border-zinc-400 transition-colors cursor-pointer flex items-center justify-center"
                onClick={() => photoRef.current?.click()}
              >
                <div className="text-center">
                  <Plus size={20} className="mx-auto text-zinc-300 mb-1" />
                  <p className="text-xs text-zinc-400">Add more</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SUBMIT */}
        <div className="flex items-center justify-between pt-2">
          <a href="/admin/gallery" className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors tracking-widests uppercase">← Cancel</a>
          <button
            type="submit"
            disabled={isPending}
            className="bg-zinc-900 text-white text-xs tracking-widests uppercase px-10 py-4 hover:bg-zinc-700 transition-colors disabled:opacity-50"
          >
            {isPending ? 'Creating Album...' : 'Create Album'}
          </button>
        </div>
      </form>
    </div>
  )
}
