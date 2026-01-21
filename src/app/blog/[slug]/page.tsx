import Link from "next/link";
import { notFound } from "next/navigation";

import { PostMeta } from "@/components/PostMeta";
import { renderMdx } from "@/lib/mdx";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const content = await renderMdx(post.body);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="space-y-2">
        <Link className="text-sm underline underline-offset-4 text-muted-foreground" href="/blog">
          ← Back
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight">{post.title}</h1>
        <PostMeta date={post.date} tags={post.tags} className="text-sm" />
        <p className="text-base text-muted-foreground">{post.description}</p>
      </div>

      <article className="prose prose-zinc mt-10 max-w-none dark:prose-invert">{content}</article>
    </div>
  );
}
