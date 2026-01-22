import Link from "next/link";

import { PostMeta } from "@/components/PostMeta";
import { getAllPosts } from "@/lib/posts";

export default function Home() {
  const posts = getAllPosts().slice(0, 5);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">Willie Richter</h1>
        <p className="text-muted-foreground">A place to capture ideas and progress.</p>
        <div className="flex gap-4 text-sm">
          <Link className="underline underline-offset-4" href="/blog">
            Read the blog
          </Link>
        </div>
      </section>

      <section className="mt-12 space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-medium">Latest</h2>
          <Link className="text-sm underline underline-offset-4" href="/blog">
            View all
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No posts yet.</p>
        ) : (
          <ul className="space-y-6">
            {posts.map((post) => (
              <li key={post.slug} className="space-y-1">
                <Link className="text-base font-medium underline underline-offset-4" href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
                <p className="text-sm text-muted-foreground">{post.description}</p>
                <PostMeta date={post.date} tags={post.tags} showTags={false} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
