const readableDateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "long" });

export function formatPostDate(dateString: string) {
  // Normalize the YYYY-MM-DD frontmatter date into a real Date in UTC.
  const parsed = new Date(`${dateString}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) {
    return dateString;
  }

  return readableDateFormatter.format(parsed);
}

