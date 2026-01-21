const tracedContentGlobs = ["./content/posts/**/*"];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure Markdown/MDX content is packaged with every route that reads from disk.
  outputFileTracingIncludes: {
    "/": tracedContentGlobs,
    "/blog": tracedContentGlobs,
    "/blog/[slug]": tracedContentGlobs,
    "/sitemap": tracedContentGlobs,
  },
};

export default nextConfig;
