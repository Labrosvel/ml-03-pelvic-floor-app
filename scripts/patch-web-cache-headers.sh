#!/usr/bin/env bash
# Make GitHub Pages HTML less sticky in browsers after deploys.
set -euo pipefail

root="${1:-dist}"
stamp="${GITHUB_SHA:-$(git rev-parse --short HEAD 2>/dev/null || echo local)}"
stamp="${stamp:0:7}"
injected="<meta http-equiv=\"Cache-Control\" content=\"no-cache, no-store, must-revalidate\" /><meta http-equiv=\"Pragma\" content=\"no-cache\" /><meta name=\"pelviguide-build\" content=\"${stamp}\" />"

if [[ ! -d "$root" ]]; then
  echo "Missing export directory: $root" >&2
  exit 1
fi

while IFS= read -r -d '' file; do
  if grep -q 'pelviguide-build' "$file"; then
    continue
  fi
  # Insert cache meta immediately after <head ...>
  python3 - "$file" "$injected" <<'PY'
import pathlib, sys, re
path = pathlib.Path(sys.argv[1])
injected = sys.argv[2]
text = path.read_text(encoding="utf-8")
text2, n = re.subn(r"(<head[^>]*>)", r"\1" + injected, text, count=1, flags=re.I)
if n != 1:
    raise SystemExit(f"Could not patch <head> in {path}")
path.write_text(text2, encoding="utf-8")
PY
done < <(find "$root" -type f -name '*.html' -print0)

echo "Patched HTML cache headers in $root (build ${stamp})"
