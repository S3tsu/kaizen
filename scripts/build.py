#!/usr/bin/env python3
"""Sestaví web pro GitHub Pages do _site/.

Bere jen veřejné výstupy z /teach workspaců (<oblast>/<tema>/repo/):
lessons/, reference/, assets/. Přidá sdílené komponenty z assets/ v kořeni,
vygeneruje rozcestník index.html a do patičky vloží verzi ze souboru VERSION.
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


# Barvy linek na mapě (světlý, tmavý režim) a písmeno v kolečku. Téma bez záznamu dostane šedou.
LINES = {
    "japonstina": ("J", "#d4213d", "#ff5c72"),
    "anglictina": ("A", "#1c64d6", "#5a9bff"),
    "networking": ("N", "#0b7d49", "#3fcf8a"),
    "security": ("S", "#e0a000", "#ffc13d"),
}
# Linky tak světlé, že na nich bílé písmeno nejde přečíst, dostanou tmavé.
DARK_LETTER = {"security"
}


def zivost_key(workspace: Path):
    cfg = workspace / "assets" / "zivost-config.js"
    if not cfg.is_file():
        return None
    m = re.search(r'key:\s*"([^"]+)"', cfg.read_text(encoding="utf-8"))
    return m.group(1) if m else None


def render_index(version: str, areas) -> str:
    lines = []
    # Linky s lekcemi nahoru, rozestavěné dolů; uvnitř podle oblasti a názvu.
    order = sorted(
        ((a, t) for a, topics in areas for t in topics),
        key=lambda at: (not at[1][2]["lessons"], at[0].name, at[1][0].name),
    )
    for area_dir, topics in [(a, [t]) for a, t in order]:
        for topic_dir, workspace, pages in topics:
            rel = f"{area_dir.name}/{topic_dir.name}"
            name = TOPICS.get(topic_dir.name, topic_dir.name)
            letter, light, dark = LINES.get(topic_dir.name, (name[:1], "#6b7383", "#9aa3b5"))
            on = "#151922" if topic_dir.name in DARK_LETTER else "#ffffff"
            key = zivost_key(workspace)
            stations = "".join(
                f'<li class="st" data-path="{rel}/lessons/{p.name}"><a href="{rel}/lessons/{p.name}">{html.escape(title_of(p))}</a></li>'
                for p in pages["lessons"]
            )
            if stations:
                stations += '<li class="st future"><span>další lekce se staví</span></li>'
            else:
                stations = '<li class="st future"><span>linka se staví, první lekce brzy</span></li>'
            refs = ""
            if pages["reference"]:
                refs = '<p class="refs">Přestup na reference: ' + ", ".join(
                    f'<a href="{rel}/reference/{p.name}">{html.escape(title_of(p))}</a>' for p in pages["reference"]
                ) + "</p>"
            today = f'<span class="today" data-key="{html.escape(key)}"></span>' if key else ""
            lines.append(
                f'<section class="line{"" if pages["lessons"] else " planned"}" style="--c-l:{light};--c-d:{dark};--on-l:{on}">'
                f'<h2><b aria-hidden="true">{html.escape(letter)}</b>{html.escape(name)}'
                f'<small>{AREAS[area_dir.name]}</small>{today}</h2>'
                f'<ol class="track">{stations}</ol>{refs}</section>'
            )
    return f"""<!doctype html>
<html lang="cs">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Kaizen</title>
<link rel="stylesheet" href="assets/base.css">
<style>
main.map::before {{ display:none; }}
main.map {{ padding-left:20px; }}
.map header h1 {{ font-size:4.2rem; line-height:1; margin:8px 0 12px; }}
.map header p {{ font-size:1.15rem; margin:0 0 40px; max-width:30em; }}
.line {{ --c:var(--c-l); --on:var(--on-l); margin:0 0 34px; }}
@media (prefers-color-scheme: dark) {{ :root:not([data-theme="light"]) .line {{ --c:var(--c-d); --on:#10141c; }} }}
.line h2 {{ display:flex; flex-wrap:wrap; align-items:center; gap:4px 12px; margin:0 0 8px; font-size:1.35rem; }}
.line h2::before {{ display:none; }}
.line h2 b {{ display:inline-grid; place-items:center; width:36px; height:36px; border-radius:50%; background:var(--c); color:var(--on); font-size:1.05rem; }}
.line h2 small {{ font-weight:600; font-size:.85rem; color:var(--muted); }}
.today {{ margin-left:auto; font-size:.85rem; font-weight:700; }}
.today:empty {{ display:none; }}
.today span {{ display:inline-block; background:var(--card); border-radius:999px; padding:3px 10px 1px; margin-left:6px; }}
.track {{ list-style:none; margin:0 0 0 15px; padding:0; border-left:6px solid var(--c); }}
.planned .track {{ border-left-style:dashed; }}
.st {{ position:relative; padding:8px 0 8px 26px; font-weight:600; }}
.st::before {{ content:""; position:absolute; left:-15px; top:12px; width:14px; height:14px; border-radius:50%; background:var(--bg); border:5px solid var(--c); }}
.st.passed::before {{ background:var(--c); }}
.st.passed a::after {{ content:" ✓"; color:var(--c); }}
.st a {{ color:var(--fg); text-decoration:none; border-bottom:2px solid var(--line); }}
.st a:hover {{ border-color:var(--c); }}
.st.future {{ color:var(--muted); font-weight:400; }}
.st.future::before {{ border-color:var(--line); }}
.refs {{ margin:6px 0 0 41px; font-size:.92rem; color:var(--muted); }}
.legend {{ font-size:.85rem; color:var(--muted); }}
footer.map-foot::before {{ display:none; }}
@media (min-width:760px) {{
  .track {{ display:flex; flex-wrap:wrap; border-left:0; border-top:6px solid var(--c); margin:22px 0 0; }}
  .planned .track {{ border-top-style:dashed; }}
  .st {{ padding:18px 28px 0 0; max-width:15em; line-height:1.35; }}
  .st::before {{ left:0; top:-16px; }}
  .refs {{ margin:12px 0 0; }}
}}
@media (max-width:600px) {{ .map header h1 {{ font-size:3.2rem; }} .today {{ margin-left:48px; flex-basis:100%; }} }}
</style>
</head>
<body>
<main class="map">
<header>
<h1>Kaizen</h1>
<p>Každé téma je jedna linka, každá lekce jedna stanice. Stačí ujet jednu za den.</p>
</header>
{''.join(lines)}
<p class="legend">Plné kolečko je lekce, kterou máš v tomhle prohlížeči prošlou až do konce.</p>
<footer class="map-foot">Verze {html.escape(version)}</footer>
</main>
<script>
(function () {{
  function get(k) {{ try {{ return JSON.parse(localStorage.getItem(k)); }} catch (e) {{ return null; }} }}
  var passed = get("kaizen-trasa-prosle") || {{}};
  document.querySelectorAll(".st[data-path]").forEach(function (li) {{
    if (passed[li.dataset.path]) li.classList.add("passed");
  }});
  function ds(d) {{ return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }}
  document.querySelectorAll(".today[data-key]").forEach(function (el) {{
    var p = get(el.dataset.key);
    if (!p || !p.days) return;
    var g = p.goal == null ? 20 : p.goal, n = p.days[ds(new Date())] || 0, st = 0, d = new Date(), need = g || 1;
    if ((p.days[ds(d)] || 0) < need) d.setDate(d.getDate() - 1);
    while ((p.days[ds(d)] || 0) >= need) {{ st++; d.setDate(d.getDate() - 1); }}
    el.innerHTML = (st ? "<span>🔥 " + st + "</span>" : "") + "<span>Dnes " + n + (g ? " / " + g : "") + "</span>";
  }});
}})();
</script>
</body>
</html>
"""


def main():
    version = (ROOT / "VERSION").read_text(encoding="utf-8").strip()
    areas = list(collect())
    if SITE.exists():
        shutil.rmtree(SITE)
    SITE.mkdir()
    shutil.copytree(ROOT / "assets", SITE / "assets")
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
