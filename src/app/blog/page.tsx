import Link from "next/link";

import { PostMeta } from "@/components/PostMeta";
import { getAllPosts } from "@/lib/posts";

export const metadata = {
  title: "Blog",
  description: "Writing and notes.",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Blog</h1>
        <p className="text-sm text-muted-foreground">Posts, notes, and experiments.</p>
      </div>

      <div className="mt-10">
        {posts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No posts yet.</p>
        ) : (
          <ul className="space-y-8">
            {posts.map((post) => (
              <li key={post.slug} className="space-y-1">
                <Link className="text-lg font-medium underline underline-offset-4" href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
                <p className="text-sm text-muted-foreground">{post.description}</p>
                <PostMeta date={post.date} tags={post.tags} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

