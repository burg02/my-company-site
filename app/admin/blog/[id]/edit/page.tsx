import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import PostForm from '@/components/blog/PostForm'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (!post) notFound()

  return (
    <div className="max-w-4xl space-y-8">
      <div className="border-b border-zinc-200 pb-6">
        <p className="text-[10px] tracking-[0.3em] text-zinc-400 uppercase mb-1">Blog</p>
        <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Edit Post</h1>
        <p className="text-sm text-zinc-400 mt-1">Editing <span className="text-zinc-700">{post.title}</span></p>
      </div>
      <PostForm
        mode="edit"
        postId={post.id}
        defaultValues={{
          title: post.title,
          excerpt: post.excerpt || '',
          content: post.content || '',
          category: post.category || 'General',
          published: post.published ? 'true' : 'false',
          existing_cover_url: post.cover_image || '',
        }}
      />
    </div>
  )
}
