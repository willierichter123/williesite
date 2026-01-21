import { formatPostDate } from "@/lib/dates";

type PostMetaProps = {
  date: string;
  tags?: string[];
  showTags?: boolean;
  className?: string;
};

export function PostMeta({ date, tags = [], showTags = true, className }: PostMetaProps) {
  const wrapperClass = ["flex flex-wrap items-center gap-3 text-xs text-muted-foreground"];
  if (className) {
    wrapperClass.push(className);
  }

  const shouldShowTags = showTags && tags.length > 0;

  return (
    <div className={wrapperClass.join(" ")}>
      <time dateTime={date} className="font-medium tracking-wide">
        {formatPostDate(date)}
      </time>
      {shouldShowTags && (
        <ul className="flex flex-wrap gap-1.5 text-[0.65rem]">
          {tags.map((tag, index) => (
            <li
              key={`${tag}-${index}`}
              className="rounded-full border border-black/10 px-2 py-0.5 uppercase tracking-[0.12em] text-muted-foreground dark:border-white/20"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

