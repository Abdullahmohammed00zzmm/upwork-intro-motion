#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

presenter=public/presenter_cropped.mp4
keyed=public/presenter_keyed.webm
output=output/upwork-intro-final.mp4
if [[ ! -s "$presenter" ]]; then
  unzip -o upwork_intro_production_package.zip "$presenter"
fi
if [[ ! -s "$keyed" || "$presenter" -nt "$keyed" || scripts/key_presenter.py -nt "$keyed" ]]; then
  "${KEY_PYTHON:-python3}" scripts/key_presenter.py "$presenter" "$keyed" --crf 18 --cpu-used 5
fi

mkdir -p output
temp_dir="$(mktemp -d output/.render.XXXXXX)"
trap 'rm -rf "$temp_dir"' EXIT
browser=()
if [[ -n "${REMOTION_BROWSER:-}" ]]; then
  browser=(--browser-executable="$REMOTION_BROWSER")
fi

npx --no-install remotion render src/index.ts UpworkIntro "$temp_dir/video.mp4" \
  "${browser[@]}" --muted --codec=h264 --pixel-format=yuv420p --crf=17 \
  --concurrency="${REMOTION_CONCURRENCY:-4}" --log=warn

# Stream copy preserves every original AAC speech packet, including its gapless timing.
ffmpeg -hide_banner -loglevel error -y -i "$temp_dir/video.mp4" -i "$presenter" \
  -map 0:v:0 -map 1:a:0 -c copy -movflags +faststart "$temp_dir/final.mp4"
mv "$temp_dir/final.mp4" "$output"
printf 'Rendered %s\n' "$output"
