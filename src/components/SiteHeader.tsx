import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-black/5 dark:border-white/10">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-sm font-medium tracking-tight">
          Willie Richter
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link className="text-muted-foreground hover:text-foreground transition-colors" href="/">
            Home
          </Link>
          <Link className="text-muted-foreground hover:text-foreground transition-colors" href="/blog">
            Blog
          </Link>
        </nav>
      </div>
    </header>
  );
}


