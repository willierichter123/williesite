export type PostFrontmatter = {
  title: string;
  slug: string;
  date: string; // ISO yyyy-mm-dd
  description: string;
  tags?: string[];
  published?: boolean;
};

export type Post = PostFrontmatter & {
  body: string;
};


