#!/usr/bin/env python3
"""Generate a Payments Briefing post from PaymentsDive articles."""

from __future__ import annotations

import argparse
import dataclasses
from datetime import datetime, timedelta
from email.utils import parsedate_to_datetime
import html
from html.parser import HTMLParser
import sys
import textwrap
from pathlib import Path
from typing import Iterable, List, Optional
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET

try:
    from zoneinfo import ZoneInfo
except ImportError:  # pragma: no cover
    ZoneInfo = None  # type: ignore


DEFAULT_FEED_URL = "https://www.paymentsdive.com/feeds/news/"
DEFAULT_OUTPUT_DIR = Path("content/posts")
DEFAULT_TZ = "America/New_York"


class _HTMLStripper(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self._chunks: List[str] = []

    def handle_data(self, data: str) -> None:
        self._chunks.append(data)

    def get_text(self) -> str:
        text = " ".join(self._chunks)
        return " ".join(text.split())


def strip_html(raw_html: Optional[str]) -> str:
    if not raw_html:
        return ""
    stripper = _HTMLStripper()
    stripper.feed(raw_html)
    return stripper.get_text()


def fetch_feed(feed_url: str) -> bytes:
    headers = {"User-Agent": "payments-briefing-script/1.0"}
    req = Request(feed_url, headers=headers)
    with urlopen(req, timeout=20) as resp:  # nosec: B310
        return resp.read()


@dataclasses.dataclass
class Article:
    title: str
    link: str
    summary: str
    author: str
    published: datetime


def parse_feed(xml_bytes: bytes, tz: ZoneInfo) -> List[Article]:
    root = ET.fromstring(xml_bytes)
    channel = root.find("channel")
    if channel is None:
        return []
    ns = {"dc": "http://purl.org/dc/elements/1.1/"}
    articles: List[Article] = []
    for item in channel.findall("item"):
        title = (item.findtext("title") or "").strip()
        link = (item.findtext("link") or "").strip()
        description = item.findtext("description")
        summary = html.unescape(strip_html(description))
        creator = (item.findtext("dc:creator", default="", namespaces=ns) or "").strip()
        pub_date_raw = (item.findtext("pubDate") or "").strip()
        if not title or not link or not pub_date_raw:
            continue
        try:
            pub_dt = parsedate_to_datetime(pub_date_raw)
        except (TypeError, ValueError):
            continue
        if pub_dt.tzinfo is None:
            pub_dt = pub_dt.replace(tzinfo=ZoneInfo("UTC") if ZoneInfo else None)  # type: ignore
        if ZoneInfo:
            pub_dt = pub_dt.astimezone(tz)
        articles.append(
            Article(
                title=title,
                link=link,
                summary=summary,
                author=creator or "Staff",
                published=pub_dt,
            )
        )
    return sorted(articles, key=lambda art: art.published, reverse=True)


def ensure_output_path(base_dir: Path, slug: str) -> Path:
    base_dir.mkdir(parents=True, exist_ok=True)
    candidate = base_dir / f"{slug}.mdx"
    suffix = 1
    while candidate.exists():
        candidate = base_dir / f"{slug}-{suffix}.mdx"
        suffix += 1
    return candidate


def format_article_markdown(article: Article, tz: ZoneInfo) -> str:
    published_str = article.published.astimezone(tz).strftime("%b %d, %Y %I:%M %p %Z")
    details = [
        f"### {article.title}",
        f"- **Takeaway:** {article.summary or 'No summary provided.'}",
        f"- **Filed:** {published_str} by {article.author}",
    ]
    return "\n".join(details)


def build_markdown(
    articles: Iterable[Article],
    tz: ZoneInfo,
    report_date: datetime,
    tag: str,
    lookback_hours: int,
) -> str:
    articles = list(articles)
    formatted_date = report_date.strftime("%B %d, %Y")
    slug_date = report_date.strftime("%Y-%m-%d")
    tag_list = f'["{tag}"]'
    frontmatter = textwrap.dedent(
        f"""\
        ---
        title: "Payments Briefing: {formatted_date}"
        slug: "payments-briefing-{slug_date}"
        date: "{slug_date}"
        description: "PaymentsDive highlights from the last {lookback_hours} hours."
        tags: {tag_list}
        published: true
        ---
        """
    ).strip()
    body_lines = [frontmatter, ""]
    if articles:
        intro = (
            f"{len(articles)} article{'s' if len(articles) != 1 else ''} "
            f"posted in the past {lookback_hours} hours."
        )
    else:
        intro = (
            f"No new articles were posted in the past {lookback_hours} hours, "
            "but this entry logs the check for completeness."
        )
    body_lines.extend([intro, ""])
    if articles:
        body_lines.append("## Key Takeaways")
        body_lines.append("")
        for article in articles:
            body_lines.append(format_article_markdown(article, tz))
            body_lines.append("")
    body_lines.append("## Source Links")
    body_lines.append("")
    if articles:
        for article in articles:
            body_lines.append(f"- [{article.title}]({article.link})")
    else:
        body_lines.append("- _No sources to list today._")
    body_lines.append("")
    return "\n".join(body_lines).strip() + "\n"


def filter_recent(articles: Iterable[Article], now: datetime, hours: int) -> List[Article]:
    cutoff = now - timedelta(hours=hours)
    return [article for article in articles if article.published >= cutoff]


def parse_args(argv: Optional[List[str]] = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--feed-url",
        default=DEFAULT_FEED_URL,
        help="RSS feed URL to scan",
    )
    parser.add_argument(
        "--output-dir",
        default=str(DEFAULT_OUTPUT_DIR),
        help="Directory where the MDX file will be written",
    )
    parser.add_argument(
        "--hours",
        type=int,
        default=24,
        help="Lookback window in hours for new articles",
    )
    parser.add_argument(
        "--timezone",
        default=DEFAULT_TZ,
        help="IANA timezone name used for timestamps and scheduling context",
    )
    parser.add_argument(
        "--tag",
        default="Payments Briefing",
        help="Tag to attach in the MDX frontmatter",
    )
    return parser.parse_args(argv)


def main(argv: Optional[List[str]] = None) -> int:
    args = parse_args(argv)
    if ZoneInfo is None:
        raise RuntimeError("Python 3.9+ with zoneinfo support is required.")
    tz = ZoneInfo(args.timezone)
    output_dir = Path(args.output_dir)
    now = datetime.now(tz)
    feed_bytes = fetch_feed(args.feed_url)
    articles = parse_feed(feed_bytes, tz)
    recent = filter_recent(articles, now, args.hours)
    if not recent:
        print(
            f"No articles found in the last {args.hours} hours; "
            "creating a placeholder entry.",
            file=sys.stderr,
        )
    markdown = build_markdown(recent, tz, report_date=now, tag=args.tag, lookback_hours=args.hours)
    slug_date = now.strftime("%Y-%m-%d")
    destination = ensure_output_path(output_dir, f"payments-briefing-{slug_date}")
    destination.write_text(markdown, encoding="utf-8")
    print(f"Wrote briefing for {now.date()} to {destination}")
    return 0


if __name__ == "__main__":  # pragma: no cover
    raise SystemExit(main())
