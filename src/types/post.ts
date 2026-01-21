export type PostFrontmatter = {
  title: string;
  slug: string;
  date: string; // ISO yyyy-mm-dd
  description: string;
  tags?: string[];
  published?: boolean;
};

export type Post = Omit<PostFrontmatter, "tags" | "published"> & {
  tags: string[];
  published: boolean;
  body: string;
};

