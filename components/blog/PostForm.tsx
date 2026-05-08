'use client'

import { useForm } from 'react-hook-form'
import { Upload, X } from 'lucide-react'
import { useRef, useState, useTransition } from 'react'
import { createPost, updatePost } from '@/app/admin/blog/actions'

const CATEGORIES = [
  'General', 'News', 'Events', 'Industry', 'Technology',
  'Human Resources', 'Finance', 'Marketing', 'Leadership', 'Culture',
]

interface PostFormValues {
  title: string
  excerpt: string
  content: string
  category: string
  published: string
}

interface PostFormProps {
  mode: 'create' | 'edit'
  postId?: string
  defaultValues?: Partial<PostFormValues> & { existing_cover_url?: string }
}

export default function PostForm({ mode, postId, defaultValues }: PostFormProps) {
  const [isPending, startTransition] = useTransition()
  const [coverPreview, setCoverPreview] = useState<string | null>(defaultValues?.existing_cover_url || null)
  const coverInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<PostFormValues>({
    defaultValues: {
      title: defaultValues?.title || '',
      excerpt: defaultValues?.excerpt || '',
      content: defaultValues?.content || '',
      category: defaultValues?.category || 'General',
      published: defaultValues?.published ?? 'false',
    },
  })

  const onSubmit = async () => {
    if (!formRef.current) return
    const fd = new FormData(formRef.current)
    startTransition(async () => {
      if (mode === 'create') {
        await createPost(fd)
      } else if (postId) {
        await updatePost(postId, fd)
      }
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      {defaultValues?.existing_cover_url && (
        <input type="hidden" name="existing_cover_url" value={defaultValues.existing_cover_url} />
      )}

      {/* BASIC INFO */}
      <div className="bg-white border border-zinc-100 p-8 space-y-6">
        <h2 className="text-xs tracking-[0.3em] uppercase text-zinc-400 border-b border-zinc-100 pb-4">Post Details</h2>

        <div>
          <label className="block text-[10px] tracking-widest uppercase text-zinc-400 mb-2">Title *</label>
          <input
            {...register('title', { required: 'Title is required' })}
            name="title"
            className="w-full border border-zinc-200 px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 transition-colors"
            placeholder="Post title..."
          />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-[10px] tracking-widests uppercase text-zinc-400 mb-2">Category</label>
            <select
              {...register('category')}
              name="category"
              className="w-full border border-zinc-200 px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 transition-colors bg-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] tracking-widests uppercase text-zinc-400 mb-2">Status</label>
            <select
              {...register('published')}
              name="published"
              className="w-full border border-zinc-200 px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 transition-colors bg-white"
            >
              <option value="false">Draft</option>
              <option value="true">Published</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[10px] tracking-widests uppercase text-zinc-400 mb-2">Excerpt</label>
          <textarea
            {...register('excerpt')}
            name="excerpt"
            rows={2}
            className="w-full border border-zinc-200 px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 transition-colors resize-none"
            placeholder="Short summary shown in listings..."
          />
        </div>
      </div>

      {/* COVER IMAGE */}
      <div className="bg-white border border-zinc-100 p-8 space-y-6">
        <h2 className="text-xs tracking-[0.3em] uppercase text-zinc-400 border-b border-zinc-100 pb-4">Cover Image</h2>
        <div
          onClick={() => coverInputRef.current?.click()}
          className="relative border-2 border-dashed border-zinc-200 hover:border-zinc-400 transition-colors cursor-pointer overflow-hidden"
        >
          {coverPreview ? (
            <div className="relative">
              <img src={coverPreview} alt="Cover preview" className="w-full h-56 object-cover" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-2 text-white text-xs"><Upload size={14} /> Click to change</div>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setCoverPreview(null); if (coverInputRef.current) coverInputRef.current.value = '' }}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Upload size={24} className="mx-auto text-zinc-300 mb-3" />
              <p className="text-sm text-zinc-500">Click to upload cover image</p>
              <p className="text-xs text-zinc-300 mt-1">JPG, PNG, WebP — recommended 1200×630</p>
            </div>
          )}
        </div>
        <input
          ref={coverInputRef}
          name="cover_image"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) setCoverPreview(URL.createObjectURL(file))
          }}
        />
      </div>

      {/* CONTENT */}
      <div className="bg-white border border-zinc-100 p-8 space-y-6">
        <h2 className="text-xs tracking-[0.3em] uppercase text-zinc-400 border-b border-zinc-100 pb-4">Content</h2>
        <div>
          <label className="block text-[10px] tracking-widests uppercase text-zinc-400 mb-2">Body *</label>
          <textarea
            {...register('content', { required: 'Content is required' })}
            name="content"
            rows={20}
            className="w-full border border-zinc-200 px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 transition-colors resize-y font-mono"
            placeholder="Write your post content here..."
          />
          {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content.message}</p>}
          <p className="text-xs text-zinc-300 mt-2">You can use line breaks to separate paragraphs.</p>
        </div>
      </div>

      {/* SUBMIT */}
      <div className="flex items-center justify-between pt-2">
        <a href="/admin/blog" className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors tracking-widest uppercase">
          ← Cancel
        </a>
        <button
          type="submit"
          disabled={isPending}
          className="bg-zinc-900 text-white text-xs tracking-widest uppercase px-10 py-4 hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Saving...' : mode === 'create' ? 'Publish Post' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
