#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

source_file=public/presenter_cropped.mp4
keyed_file=public/presenter_keyed.webm
final_file=output/upwork-intro-final.mp4

ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate,duration,nb_frames -of compact "$source_file"
ffprobe -v error -show_entries stream=codec_name,r_frame_rate:stream_tags=alpha_mode -of compact "$keyed_file"
ffprobe -v error -show_entries stream=codec_name,width,height,pix_fmt,r_frame_rate,start_time,duration,nb_frames -of compact "$final_file"

audio_hash() {
  ffmpeg -v error -i "$1" -map 0:a:0 -c copy -f hash -hash sha256 -
}

if [[ "$(audio_hash "$source_file")" != "$(audio_hash "$final_file")" ]]; then
  echo 'Final audio differs from the original recording.' >&2
  exit 1
fi

ffmpeg -v error -xerror -i "$final_file" -f null -
echo 'Final MP4 decoded successfully. AAC packet data matches the recording.'
