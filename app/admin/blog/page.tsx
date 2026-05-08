import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function AdminBlogPage() {
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  const published = posts?.filter((p) => p.published) ?? []
  const drafts = posts?.filter((p) => !p.published) ?? []

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const PostRow = ({ post }: { post: any }) => (
    <div className="bg-white border border-zinc-100 p-5 flex items-center justify-between hover:border-zinc-300 transition-colors">
      <div className="flex items-center gap-4 min-w-0">
        {post.cover_image && (
          <div className="w-14 h-14 shrink-0 overflow-hidden bg-zinc-100">
            <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-sm font-medium text-zinc-900 truncate">{post.title}</p>
            {post.category && (
              <span className="text-[10px] tracking-widest uppercase px-2 py-0.5 bg-zinc-100 text-zinc-500">
                {post.category}
              </span>
            )}
            <span className="text-[10px] tracking-widest uppercase px-2 py-0.5"
              style={{ backgroundColor: post.published ? '#f0fdf4' : '#fefce8', color: post.published ? '#16a34a' : '#ca8a04' }}>
              {post.published ? 'Published' : 'Draft'}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">{formatDate(post.created_at)}</p>
          {post.slug && <p className="text-[10px] text-zinc-300 mt-0.5 font-mono">/blog/{post.slug}</p>}
        </div>
      </div>
      <div className="flex items-center gap-4 shrink-0 ml-4">
        {post.published && (
          <Link href={`/blog/${post.slug}`} target="_blank" className="text-xs text-zinc-300 hover:text-zinc-600 transition-colors" title="View public page">↗</Link>
        )}
        <Link href={`/admin/blog/${post.id}/edit`} className="text-xs text-zinc-400 hover:text-zinc-900 transition-colors">Edit</Link>
      </div>
    </div>
  )

  return (
    <div className="max-w-5xl space-y-8">
      <div className="border-b border-zinc-200 pb-6 flex items-end justify-between">
        <div>
          <p className="text-[10px] tracking-[0.3em] text-zinc-400 uppercase mb-1">Nevertheless</p>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Blog</h1>
          <p className="text-sm text-zinc-400 mt-1">{published.length} published · {drafts.length} drafts</p>
        </div>
        <Link href="/admin/blog/new" className="bg-zinc-900 text-white text-xs tracking-widest uppercase px-5 py-3 hover:bg-zinc-700 transition-colors">
          + New Post
        </Link>
      </div>

      {(!posts || posts.length === 0) && (
        <div className="bg-white border border-dashed border-zinc-200 p-16 text-center">
          <p className="text-4xl mb-4">✦</p>
          <p className="text-sm font-medium text-zinc-900 mb-1">No posts yet</p>
          <p className="text-xs text-zinc-400 mb-6">Write your first blog post to get started.</p>
          <Link href="/admin/blog/new" className="inline-block bg-zinc-900 text-white text-xs tracking-widest uppercase px-6 py-3 hover:bg-zinc-700 transition-colors">
            Write Post
          </Link>
        </div>
      )}

      {published.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-400">Published</p>
          <div className="space-y-px">{published.map((post) => <PostRow key={post.id} post={post} />)}</div>
        </div>
      )}

      {drafts.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-400">Drafts</p>
          <div className="space-y-px">{drafts.map((post) => <PostRow key={post.id} post={post} />)}</div>
        </div>
      )}
    </div>
  )
}
