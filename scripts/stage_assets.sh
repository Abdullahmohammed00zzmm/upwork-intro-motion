#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BASE_URL="https://abdullah-portfolio-a4s.pages.dev"
SOURCE=""
TMPCLONE=""

# Optional source: absolute path directly to the portfolio's public/media directory.
if [[ -n "${PORTFOLIO_MEDIA_DIR:-}" && -d "${PORTFOLIO_MEDIA_DIR}" ]]; then
  SOURCE="${PORTFOLIO_MEDIA_DIR}"
elif [[ -d "$ROOT/../abdullah-portfolio/public/media" ]]; then
  SOURCE="$ROOT/../abdullah-portfolio/public/media"
elif [[ -d "/workspace/abdullah-portfolio/public/media" ]]; then
  SOURCE="/workspace/abdullah-portfolio/public/media"
fi

ASSETS=(
  "media/social/al-halimi/full/01-friday.webp"
  "media/social/al-halimi/full/02-energy.webp"
  "media/social/al-halimi/full/03-breakfast.webp"
  "media/identity/al-halimi/07.webp"
  "media/identity/al-halimi/09.webp"
  "media/videos/al-halimi-ad.mp4"
  "media/social/abu-shuaib/full/01-trust.webp"
  "media/social/abu-shuaib/full/02-road.webp"
  "media/identity/abu-shuaib/07.webp"
  "media/social/oshenz/full/01-shark-fingers.webp"
  "media/social/oshenz/full/03-shopping-list.webp"
  "media/social/oshenz/full/04-geant-store.webp"
)

# The source is a private portfolio repository. Git auth may be unavailable in this Codex runner.
if [[ -z "$SOURCE" ]]; then
  TMPCLONE="$(mktemp -d)"
  echo 'Trying portfolio repository clone with existing Git credentials...'
  if GIT_TERMINAL_PROMPT=0 git clone --depth 1 --quiet \
    'https://github.com/Abdullahmohammed00zzmm/abdullah-portfolio.git' \
    "$TMPCLONE/repo" 2>/dev/null; then
    SOURCE="$TMPCLONE/repo/public/media"
  else
    echo 'Git clone unavailable. Will try the PUBLIC deployed portfolio site as fallback.'
  fi
fi

failed=0
for rel in "${ASSETS[@]}"; do
  local_path="$ROOT/public/$rel"
  mkdir -p "$(dirname "$local_path")"
  if [[ -s "$local_path" ]]; then
    echo "EXISTS $rel"; continue
  fi
  if [[ -n "$SOURCE" && -s "$SOURCE/${rel#media/}" ]]; then
    cp "$SOURCE/${rel#media/}" "$local_path"
  else
    echo "Trying CDN for: $rel"
    if ! curl -fL --retry 2 --connect-timeout 10 --max-time 90 \
      "$BASE_URL/$rel" -o "$local_path"; then
      echo "ERROR - unavailable: $rel"
      rm -f "$local_path"
      failed=1
    fi
  fi
  [[ -s "$local_path" ]] || { echo "ERROR - empty: $rel"; failed=1; }
done

if [[ -n "$TMPCLONE" ]]; then rm -rf "$TMPCLONE"; fi
if [[ "$failed" -ne 0 ]]; then
  echo 'Some authentic portfolio assets are missing. Do not use stock replacements.' >&2
  echo 'Allow Codex access to the private portfolio repository or provide these named files.' >&2
  exit 1
fi

echo 'Portfolio assets staged under public/media/'
