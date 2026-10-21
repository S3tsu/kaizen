#!/usr/bin/env python3
"""Sestaví web pro GitHub Pages do _site/.

Bere jen veřejné výstupy z /teach workspaců (<oblast>/<tema>/repo/):
lessons/, reference/, assets/. Vygeneruje rozcestník index.html
a do patičky vloží verzi ze souboru VERSION.
"""
import html
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "_site"
PUBLIC_DIRS = ("lessons", "reference", "assets")

AREAS = {
    "jazyky": "Jazyky",
    "it": "IT",
}
TOPICS = {
    "anglictina": "Angličtina",
    "japonstina": "Japonština",
    "networking": "Networking",
    "security": "Security",
}


def title_of(path: Path) -> str:
    m = re.search(r"<title>(.*?)</title>", path.read_text(encoding="utf-8"), re.S | re.I)
    return m.group(1).strip() if m else path.stem


def collect():
    for area_dir in sorted(p for p in ROOT.iterdir() if p.name in AREAS):
        topics = []
        for topic_dir in sorted(p for p in area_dir.iterdir() if p.is_dir()):
            workspace = topic_dir / "repo"
            if not workspace.is_dir():
                continue
            pages = {
                kind: sorted((workspace / kind).glob("*.html"))
                for kind in ("lessons", "reference")
            }
            topics.append((topic_dir, workspace, pages))
        yield area_dir, topics


def render_index(version: str, areas) -> str:
    sections = []
    for area_dir, topics in areas:
        cards = []
        for topic_dir, _, pages in topics:
            rel = f"{area_dir.name}/{topic_dir.name}"
            items = []
            for kind, label in (("lessons", "Lekce"), ("reference", "Reference")):
                if not pages[kind]:
                    continue
                links = "".join(
                    f'<li><a href="{rel}/{kind}/{p.name}">{html.escape(title_of(p))}</a></li>'
                    for p in pages[kind]
                )
                items.append(f"<h4>{label}</h4><ul>{links}</ul>")
            body = "".join(items) or '<p class="empty">Zatím žádné lekce.</p>'
            name = TOPICS.get(topic_dir.name, topic_dir.name)
            cards.append(f'<article><h3>{html.escape(name)}</h3>{body}</article>')
        sections.append(
            f"<section><h2>{AREAS[area_dir.name]}</h2><div class=\"grid\">{''.join(cards)}</div></section>"
        )
    return f"""<!doctype html>
<html lang="cs">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Learning</title>
<style>
:root {{ --bg:#fbfaf7; --fg:#1d1d1b; --muted:#6b6a65; --line:#e4e1da; --accent:#2f5d8a; }}
@media (prefers-color-scheme: dark) {{ :root {{ --bg:#161614; --fg:#ecebe6; --muted:#9a9892; --line:#2e2d2a; --accent:#8ab4e0; }} }}
body {{ margin:0; background:var(--bg); color:var(--fg); font:17px/1.55 Georgia, "Iowan Old Style", serif; }}
main {{ max-width:960px; margin:0 auto; padding:48px 16px; }}
h1 {{ font-weight:normal; font-size:2.2rem; margin:0 0 8px; }}
h2 {{ font-weight:normal; border-bottom:1px solid var(--line); padding-bottom:6px; margin-top:40px; }}
h3 {{ margin:0 0 8px; }} h4 {{ margin:12px 0 4px; color:var(--muted); font-size:.85rem; text-transform:uppercase; letter-spacing:.05em; }}
.grid {{ display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:16px; }}
article {{ border:1px solid var(--line); border-radius:8px; padding:16px; }}
ul {{ margin:0; padding-left:18px; }} a {{ color:var(--accent); }}
.empty, footer {{ color:var(--muted); }} footer {{ margin-top:48px; font-size:.85rem; }}
</style>
</head>
<body>
<main>
<h1>Learning</h1>
<p class="empty">Denní učení: jazyky a IT.</p>
{''.join(sections)}
<footer>Verze {html.escape(version)}</footer>
</main>
</body>
</html>
"""


def main():
    version = (ROOT / "VERSION").read_text(encoding="utf-8").strip()
    areas = list(collect())
    if SITE.exists():
        shutil.rmtree(SITE)
    SITE.mkdir()
    for area_dir, topics in areas:
        for topic_dir, workspace, _ in topics:
            for d in PUBLIC_DIRS:
                src = workspace / d
                if src.is_dir():
                    shutil.copytree(src, SITE / area_dir.name / topic_dir.name / d)
    (SITE / "index.html").write_text(render_index(version, areas), encoding="utf-8")
    (SITE / "version.txt").write_text(version + "\n", encoding="utf-8")
    (SITE / ".nojekyll").write_text("", encoding="utf-8")
    print(f"Postaveno _site/ (verze {version})")


if __name__ == "__main__":
    main()
