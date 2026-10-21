#!/usr/bin/env python3
"""Smoke test postaveného webu v _site/.

Ověří, že existuje index a verze, že každá HTML stránka jde přečíst
a má <title>, a že všechny relativní odkazy (href/src) vedou na
existující soubory. Při chybě skončí s nenulovým kódem.
"""
import re
import sys
from pathlib import Path
from urllib.parse import unquote, urlparse

SITE = Path(__file__).resolve().parent.parent / "_site"
LINK = re.compile(r"""(?:href|src)\s*=\s*["']([^"']+)["']""", re.I)


def main():
    errors = []
    for required in ("index.html", "version.txt"):
        if not (SITE / required).is_file():
            errors.append(f"chybí {required}")

    pages = sorted(SITE.rglob("*.html"))
    for page in pages:
        rel = page.relative_to(SITE)
        try:
            text = page.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError) as e:
            errors.append(f"{rel}: nejde přečíst ({e})")
            continue
        if not re.search(r"<title>.+?</title>", text, re.S | re.I):
            errors.append(f"{rel}: chybí <title>")
        for target in LINK.findall(text):
            url = urlparse(target)
            if url.scheme or url.netloc or target.startswith(("#", "mailto:", "data:")):
                continue
            path = unquote(url.path)
            if not path:
                continue
            dest = (SITE / path.lstrip("/")) if path.startswith("/") else (page.parent / path)
            if dest.is_dir():
                dest = dest / "index.html"
            if not dest.exists():
                errors.append(f"{rel}: rozbitý odkaz {target}")

    if errors:
        print("Smoke test SELHAL:")
        for e in errors:
            print("  -", e)
        sys.exit(1)
    print(f"Smoke test OK: {len(pages)} stránek")


if __name__ == "__main__":
    main()
