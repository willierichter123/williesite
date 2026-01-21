## williesite

A simple personal site + blog built with **Next.js** and deployed on **Vercel**. Blog posts live in `content/posts` as Markdown/MDX files.

## Local development

Use Node.js `20.x` (the repo includes an `.nvmrc` you can `nvm use`), install dependencies, then run the dev server:

```bash
nvm use
npm install
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open `http://localhost:3000` to view the site.

## Writing a blog post

Create a new `.md` or `.mdx` file in `content/posts/` with frontmatter:

```md
---
title: "My post title"
slug: "my-post-title"
date: "2026-01-21"
description: "One sentence summary."
tags: ["tag1", "tag2"]
published: true
---

Your content here...
```

Then visit `/blog` to see it listed, and `/blog/<slug>` to read it.

## Deploying on Vercel

- Import the repository into Vercel.
- The production URL will be `https://<project-name>.vercel.app` until you add a custom domain.
- Optional: set `NEXT_PUBLIC_SITE_URL` in Vercel project environment variables to your final canonical URL (e.g. `https://yourdomain.com`) for correct `sitemap.xml`/`robots.txt`.

## Learn more

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

You can also check out the [Next.js GitHub repository](https://github.com/vercel/next.js).
