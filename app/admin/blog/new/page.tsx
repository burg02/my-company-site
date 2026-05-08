import PostForm from '@/components/blog/PostForm'

export default function NewPostPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="border-b border-zinc-200 pb-6">
        <p className="text-[10px] tracking-[0.3em] text-zinc-400 uppercase mb-1">Blog</p>
        <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">New Post</h1>
        <p className="text-sm text-zinc-400 mt-1">Write and publish a new blog post.</p>
      </div>
      <PostForm mode="create" />
    </div>
  )
}
