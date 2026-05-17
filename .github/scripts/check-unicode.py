#!/usr/bin/env python3
"""
Fail if any markdown file contains dangerous invisible / bidirectional
Unicode — the "Trojan Source" class of attack (CVE-2021-42574) and
zero-width-character injection.

In a plugin whose SKILL.md files ARE executed as agent instructions, a
hidden instruction a human reviewer cannot see is a real poisoning vector.

Detected codepoints:
  U+202A-U+202E, U+2066-U+2069, U+061C  bidirectional controls
  U+200B-U+200D, U+2060, U+FEFF         zero-width / word-joiner / BOM
  U+00AD                                soft hyphen

Legitimate typography (em/en dashes, curly quotes, arrows) is not in this
set and is unaffected.

Run locally:  python3 .github/scripts/check-unicode.py
"""
import sys
from pathlib import Path

DANGEROUS = (
    set(range(0x202A, 0x202F))      # bidi embeddings + overrides
    | set(range(0x2066, 0x206A))    # bidi isolates
    | {0x061C}                      # arabic letter mark
    | set(range(0x200B, 0x200E))    # ZWSP, ZWNJ, ZWJ
    | {0x2060, 0xFEFF, 0x00AD}      # word joiner, BOM/ZWNBSP, soft hyphen
)


def main() -> int:
    hits = []
    for path in sorted(Path(".").rglob("*.md")):
        if ".git" in path.parts:
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        for lineno, line in enumerate(text.splitlines(), 1):
            for col, ch in enumerate(line, 1):
                if ord(ch) in DANGEROUS:
                    hits.append((path, lineno, col, ord(ch)))

    if hits:
        print("::error::Dangerous invisible / bidirectional Unicode in markdown:")
        for path, lineno, col, cp in hits:
            print(f"  {path}:{lineno}:{col}  U+{cp:04X}")
        print("\nRemove the invisible/bidi characters above before merging.")
        return 1

    print("OK - no invisible / bidirectional Unicode in any markdown file.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
