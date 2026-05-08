'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { Plus, Trash2, Upload, X } from 'lucide-react'
import { useRef, useState, useTransition } from 'react'
import { createEvent, updateEvent } from '@/app/admin/events/actions'

interface SpeakerField {
  name: string
  position: string
  image: FileList | null
  existing_image?: string
}

interface EventFormValues {
  title: string
  description: string
  location: string
  event_date: string
  event_time: string
  is_upcoming: string
  accent_color: string
  speakers: SpeakerField[]
}

interface EventFormProps {
  mode: 'create' | 'edit'
  eventId?: string
  defaultValues?: Partial<EventFormValues> & {
    existing_hero_url?: string
    speakers?: Array<{ name: string; position: string; existing_image?: string }>
  }
}

const PRESET_COLORS = [
  '#18181b', '#1e3a5f', '#7c2d12', '#14532d',
  '#4c1d95', '#831843', '#0c4a6e', '#713f12',
]

export default function EventForm({ mode, eventId, defaultValues }: EventFormProps) {
  const [isPending, startTransition] = useTransition()
  const [heroPreview, setHeroPreview] = useState<string | null>(defaultValues?.existing_hero_url || null)
  const [speakerPreviews, setSpeakerPreviews] = useState<Record<number, string>>({})
  const heroInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<EventFormValues>({
    defaultValues: {
      title: defaultValues?.title || '',
      description: defaultValues?.description || '',
      location: defaultValues?.location || '',
      event_date: defaultValues?.event_date || '',
      event_time: defaultValues?.event_time || '',
      is_upcoming: defaultValues?.is_upcoming ?? 'true',
      accent_color: defaultValues?.accent_color || '#18181b',
      speakers: defaultValues?.speakers?.map(s => ({
        name: s.name,
        position: s.position,
        image: null,
        existing_image: s.existing_image,
      })) || [],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'speakers' })
  const accentColor = watch('accent_color')

  const onSubmit = async (data: EventFormValues) => {
    if (!formRef.current) return
    const fd = new FormData(formRef.current)
    fd.set('accent_color', data.accent_color)
    fd.set('is_upcoming', data.is_upcoming)
    fd.set('speaker_count', String(fields.length))

    startTransition(async () => {
      if (mode === 'create') {
        await createEvent(fd)
      } else if (eventId) {
        await updateEvent(eventId, fd)
      }
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-10">

      {/* Existing hero URL (hidden, for edit mode) */}
      {defaultValues?.existing_hero_url && (
        <input type="hidden" name="existing_hero_url" value={defaultValues.existing_hero_url} />
      )}

      {/* ── BASIC INFO ── */}
      <div className="bg-white border border-zinc-100 p-8 space-y-6">
        <h2 className="text-xs tracking-[0.3em] uppercase text-zinc-400 border-b border-zinc-100 pb-4">Event Details</h2>

        {/* Title */}
        <div>
          <label className="block text-[10px] tracking-widest uppercase text-zinc-400 mb-2">Title *</label>
          <input
            {...register('title', { required: 'Title is required' })}
            name="title"
            className="w-full border border-zinc-200 px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 transition-colors"
            placeholder="Event title..."
          />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-[10px] tracking-widests uppercase text-zinc-400 mb-2">Description</label>
          <textarea
            {...register('description')}
            name="description"
            rows={4}
            className="w-full border border-zinc-200 px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 transition-colors resize-none"
            placeholder="What's this event about?"
          />
        </div>

        {/* Date / Time / Location */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-[10px] tracking-widests uppercase text-zinc-400 mb-2">Date *</label>
            <input
              {...register('event_date', { required: 'Date is required' })}
              name="event_date"
              type="date"
              className="w-full border border-zinc-200 px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 transition-colors"
            />
            {errors.event_date && <p className="text-xs text-red-500 mt-1">{errors.event_date.message}</p>}
          </div>
          <div>
            <label className="block text-[10px] tracking-widests uppercase text-zinc-400 mb-2">Time</label>
            <input
              {...register('event_time')}
              name="event_time"
              type="time"
              className="w-full border border-zinc-200 px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-widests uppercase text-zinc-400 mb-2">Location</label>
            <input
              {...register('location')}
              name="location"
              className="w-full border border-zinc-200 px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 transition-colors"
              placeholder="City, Venue..."
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-[10px] tracking-widests uppercase text-zinc-400 mb-2">Status</label>
          <select
            {...register('is_upcoming')}
            name="is_upcoming"
            className="border border-zinc-200 px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 transition-colors bg-white"
          >
            <option value="true">Upcoming</option>
            <option value="false">Past</option>
          </select>
        </div>
      </div>

      {/* ── VISUAL ── */}
      <div className="bg-white border border-zinc-100 p-8 space-y-6">
        <h2 className="text-xs tracking-[0.3em] uppercase text-zinc-400 border-b border-zinc-100 pb-4">Visual</h2>

        {/* Hero Image */}
        <div>
          <label className="block text-[10px] tracking-widests uppercase text-zinc-400 mb-2">Hero Image</label>
          <div
            onClick={() => heroInputRef.current?.click()}
            className="relative border-2 border-dashed border-zinc-200 hover:border-zinc-400 transition-colors cursor-pointer overflow-hidden"
          >
            {heroPreview ? (
              <div className="relative">
                <img src={heroPreview} alt="Hero preview" className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-2 text-white text-xs">
                    <Upload size={14} /> Click to change
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setHeroPreview(null); if (heroInputRef.current) heroInputRef.current.value = '' }}
                  className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <div className="p-12 text-center">
                <Upload size={24} className="mx-auto text-zinc-300 mb-3" />
                <p className="text-sm text-zinc-500">Click to upload hero image</p>
                <p className="text-xs text-zinc-300 mt-1">JPG, PNG, WebP — recommended 1600×900</p>
              </div>
            )}
          </div>
          <input
            ref={heroInputRef}
            name="hero_image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) setHeroPreview(URL.createObjectURL(file))
            }}
          />
        </div>

        {/* Accent Color */}
        <div>
          <label className="block text-[10px] tracking-widests uppercase text-zinc-400 mb-3">Accent Color</label>
          <div className="flex items-center gap-3 flex-wrap">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setValue('accent_color', color)}
                className="w-8 h-8 rounded-full border-2 transition-all"
                style={{
                  backgroundColor: color,
                  borderColor: accentColor === color ? color : 'transparent',
                  outline: accentColor === color ? `2px solid ${color}` : 'none',
                  outlineOffset: '2px',
                }}
              />
            ))}
            {/* Custom color picker */}
            <div className="relative flex items-center gap-2 border border-zinc-200 px-3 py-1.5">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setValue('accent_color', e.target.value)}
                className="w-6 h-6 cursor-pointer border-0 bg-transparent p-0"
              />
              <span className="text-xs text-zinc-500 font-mono">{accentColor}</span>
            </div>
          </div>
          {/* Preview */}
          <div className="mt-4 h-1.5 w-32 rounded-full" style={{ backgroundColor: accentColor }} />
        </div>
      </div>

      {/* ── SPEAKERS ── */}
      <div className="bg-white border border-zinc-100 p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <h2 className="text-xs tracking-[0.3em] uppercase text-zinc-400">Speakers</h2>
          <button
            type="button"
            onClick={() => append({ name: '', position: '', image: null })}
            className="flex items-center gap-2 text-xs tracking-widest uppercase bg-zinc-900 text-white px-4 py-2 hover:bg-zinc-700 transition-colors"
          >
            <Plus size={12} /> Add Speaker
          </button>
        </div>

        {fields.length === 0 && (
          <div className="border border-dashed border-zinc-200 p-10 text-center">
            <p className="text-sm text-zinc-400">No speakers added yet.</p>
            <p className="text-xs text-zinc-300 mt-1">Click "Add Speaker" to get started.</p>
          </div>
        )}

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="border border-zinc-100 p-6 bg-zinc-50 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] tracking-widests uppercase text-zinc-400">Speaker {index + 1}</p>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-400 hover:text-red-600 transition-colors p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-widests uppercase text-zinc-400 mb-2">Name *</label>
                  <input
                    {...register(`speakers.${index}.name` as const, { required: true })}
                    name={`speakers[${index}][name]`}
                    className="w-full border border-zinc-200 px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-zinc-900 transition-colors"
                    placeholder="Speaker name..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-widests uppercase text-zinc-400 mb-2">Position / Title</label>
                  <input
                    {...register(`speakers.${index}.position` as const)}
                    name={`speakers[${index}][position]`}
                    className="w-full border border-zinc-200 px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-zinc-900 transition-colors"
                    placeholder="CEO, Manager..."
                  />
                </div>
              </div>

              {/* Speaker Photo Upload */}
              <div>
                <label className="block text-[10px] tracking-widests uppercase text-zinc-400 mb-2">Photo</label>
                {/* Hidden existing image */}
                {field.existing_image && (
                  <input type="hidden" name={`speakers[${index}][existing_image]`} value={field.existing_image} />
                )}
                <div className="flex items-center gap-4">
                  {(speakerPreviews[index] || field.existing_image) && (
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-zinc-200 shrink-0">
                      <img
                        src={speakerPreviews[index] || field.existing_image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <label className="flex items-center gap-2 border border-zinc-200 bg-white px-4 py-2 text-xs text-zinc-500 hover:border-zinc-400 cursor-pointer transition-colors">
                    <Upload size={12} />
                    {speakerPreviews[index] || field.existing_image ? 'Change photo' : 'Upload photo'}
                    <input
                      type="file"
                      name={`speakers[${index}][image]`}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) setSpeakerPreviews(prev => ({ ...prev, [index]: URL.createObjectURL(file) }))
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SUBMIT ── */}
      <div className="flex items-center justify-between pt-2">
        <a href="/admin/events" className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors tracking-widest uppercase">
          ← Cancel
        </a>
        <button
          type="submit"
          disabled={isPending}
          className="bg-zinc-900 text-white text-xs tracking-widest uppercase px-10 py-4 hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Saving...' : mode === 'create' ? 'Create Event' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
