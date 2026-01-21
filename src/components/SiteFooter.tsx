export function SiteFooter() {
  return (
    <footer className="border-t border-black/5 dark:border-white/10">
      <div className="mx-auto max-w-2xl px-6 py-8 text-xs text-muted-foreground">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Willie Richter</p>
          <div className="flex gap-4">
            <a className="hover:text-foreground transition-colors" href="mailto:hello@example.com">
              Email
            </a>
            <a className="hover:text-foreground transition-colors" href="https://github.com/" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}


