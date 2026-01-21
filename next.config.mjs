/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure content files used by fs-based loaders are bundled in serverless builds.
  // Without this, production can 404 because `content/posts/**` is missing at runtime.
  outputFileTracingIncludes: {
    "/*": ["./content/posts/**/*"],
  },
};

export default nextConfig;
