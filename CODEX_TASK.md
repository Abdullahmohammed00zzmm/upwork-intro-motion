# Codex Execution Contract — Upwork Intro Motion Graphics

**Mission:** Produce ONE original, professional 27.77-second 16:9 Upwork intro video starring the existing green-screen presenter, with authentic portfolio media animated beside him. Final deliverable: downloadable MP4 playable from Android plus a persistent GitHub Remotion project.

## Critical starting actions
1. Work in the currently selected GitHub project repository. The user uploads a ZIP named `upwork_intro_production_package.zip`. If the repository has only this ZIP plus a README, run `unzip -o upwork_intro_production_package.zip -d .` in the root, then inspect `README_START_AR.md`, production docs, and source file. Do not create a second local repository.
2. Run `ffprobe` on `public/presenter_cropped.mp4` to confirm duration 27.766667s / 864×1536 / 30fps / AAC. **Don't crop a second time.** Original file already had 192-pixel top/bottom black strips removed and audio copied intact.
3. Run `bash scripts/stage_assets.sh` to import **only** named original portfolio assets. It first looks for `PORTFOLIO_MEDIA_DIR`, then for a nearby clone, then tries authorized GitHub cloning, then the public portfolio site as a fallback. If unavailable, report the exact missing paths and STOP; do not invent generic images. If GitHub auth fails, ask the user to allow Codex access to `Abdullahmohammed00zzmm/abdullah-portfolio` or upload the exact named media. All paths are in `PRODUCTION/ASSET_MANIFEST.json`.

## Build
4. Build a Remotion project (TypeScript + React) compatible with current stable Remotion, **pin all Remotion packages to same exact published version**. Frame size 1920×1080, fps=30, duration=833 frames. Never create a separate voiceover. Follow `PRODUCTION/STORYBOARD_AR.md`, `DESIGN_SYSTEM.md`, `AUDIO_TIMING.json`, and English script exactly.
5. Presenter must stay visible across most of the narrative; use continuous source with tasteful x/scale position animation. No face alteration, AI avatar, lip sync generation, flipping or retiming.
6. **Green screen:** This footage uses uneven dark teal (not pure chroma green), so prioritize tested `python3 scripts/key_presenter.py public/presenter_cropped.mp4 public/presenter_keyed.webm` (requires Python OpenCV+numpy and FFmpeg/libvpx-vp9). This makes a **silent VP9 WebM with alpha**, so use `<OffthreadVideo transparent muted>` with src `staticFile('presenter_keyed.webm')`; play original voice separately exactly once, e.g. `<Audio src={staticFile('presenter_cropped.mp4')}/>` if Remotion version supports video-as-audio, or extract a WAV/MP3 from source with FFmpeg. Ensure voice and transparent presenter have identical start time and 833-frame length. If transparency decoding is problematic, use official Remotion `<Video effects={[colorKey(...)]}>` from `@remotion/media` and `@remotion/effects/color-key`, tuning teal key + handling dark shadow; evaluate on three stills. Do not risk unusable alpha.
7. Main voice dominates audio. Work sample `al-halimi-ad.mp4` is **muted**. Music not required; no unlicensed music.
8. Keep images readable with `objectFit: 'contain'` and do not mirror designs. Show project names at the moments they are spoken, in exactly Al-Halimi / Abu Shuaib / OSHENZ order. OSHENZ shown as social media posts only. Avoid inventing testimonials or metrics. On-screen English keywords short and clean, with layout matched to narration. Final CTA only `Message Me on Upwork`.
9. Before full render, render **a few PNG stills** at frame ~30, 420, 720 to verify matte edges, composition and card text. No mandatory 8-second test video (user has limited Codex usage). Fix obvious visual defects, then render complete MP4 once using H.264 + AAC with high quality and mobile-friendly playback (`yuv420p`, `+faststart` if relevant).

## Timing
`AUDIO_TIMING.json` contains approximations from actual pauses, **NOT exact word-level alignment**. Listen to the original source or use local word alignment without changing audio. Revise event markers to coincide with spoken phrases. Do not change the voice to fit the initial guess.

## Persistence & delivery
- Keep source and Remix/Remotion code on GitHub and make meaningful commits, updating `work_log/STATUS.md` after asset staging and again after a successful render.
- Produce `out/upwork_intro_final.mp4`. Verify with ffprobe and a contact sheet. No placeholder final video.
- Provide an Android-downloadable URL using a proper GitHub artifact or release. If a final MP4 is too big for standard GitHub browser uploads, avoid pretending it is accessible; use GitHub Actions artifact or release attachment.
- If any quota/time limit interrupts you, leave README/work state and incomplete outputs committed; resume where you left off, not from scratch.
- The user wants few interactions; work independently unless access is truly blocked. At the end report only: result, final link, and concise issues found.

## Official Remotion reference
- https://www.remotion.dev/docs/greenscreen
- https://www.remotion.dev/docs/effects/color-key
- https://www.remotion.dev/docs/videos/transparency
- https://www.remotion.dev/docs/offthreadvideo
