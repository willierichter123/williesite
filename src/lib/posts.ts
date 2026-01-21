import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

import type { Post, PostFrontmatter } from "@/types/post";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

function assertPostFrontmatter(data: unknown, fileName: string): asserts data is PostFrontmatter {
  if (!data || typeof data !== "object") {
    throw new Error(`Invalid frontmatter in ${fileName}: expected an object`);
  }
  const d = data as Record<string, unknown>;

  const requiredString = (key: string) => {
    if (typeof d[key] !== "string" || !d[key]) {
      throw new Error(`Invalid frontmatter in ${fileName}: "${key}" must be a non-empty string`);
    }
  };

  requiredString("title");
  requiredString("slug");
  requiredString("date");
  requiredString("description");

  if (d.tags !== undefined && !Array.isArray(d.tags)) {
    throw new Error(`Invalid frontmatter in ${fileName}: "tags" must be an array of strings`);
  }
  if (Array.isArray(d.tags) && d.tags.some((t) => typeof t !== "string")) {
    throw new Error(`Invalid frontmatter in ${fileName}: "tags" must be an array of strings`);
  }

  if (d.published !== undefined && typeof d.published !== "boolean") {
    throw new Error(`Invalid frontmatter in ${fileName}: "published" must be a boolean`);
  }
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

  const posts = files.map((fileName) => {
    const fullPath = path.join(POSTS_DIR, fileName);
    const raw = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(raw);

    assertPostFrontmatter(data, fileName);

    return {
      title: data.title,
      slug: data.slug,
      date: data.date,
      description: data.description,
      tags: data.tags ?? [],
      published: data.published ?? true,
      body: content,
    } satisfies Post;
  });

  return posts
    .filter((p) => p.published)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function getPostBySlug(slug: string): Post | null {
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

