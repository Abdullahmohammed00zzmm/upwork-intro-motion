# Art Direction & Motion System

## الهوية
- Style: premium but accessible **Modern Portfolio Motion**, not corporate slideshow and not hyperactive meme edits.
- Main backdrop: charcoal `#1D2527` with subtly animated teal-gray/copper lighting; avoid pure pitch-black except on transitions.
- Accent: copper `#9F420B` (use for highlights, underlines, small accents; never long paragraphs).
- Secondary: coastal mist `#E1E7E6` (background of selected cards and readable light text).
- Text white `#F7F8F6` and graphite `#242A29` as appropriate.
- Type: clean legible sans-serif (e.g. Inter if appropriately loaded, or system fallback). No proprietary Thmanyah font files.

## Composition
- Main output: 16:9 / 1920x1080 at 30fps / 833 frames.
- Source presenter: **864x1536 portrait**, after removing black top/bottom bars. Never stretch 9:16 source to fill 16:9. Keep proportions.
- Place presenter in left 35–43% or right 35–43% of the canvas, adapting to cards, generally from shoulders to waist or thighs depending shot.
- Camera naturally tightens around 12–13 seconds; keep it continuous with deliberate x/scale transitions. No attempts to use AI-generated replacement faces.
- Keep safe margins >= 80 px on horizontal sides and >= 60 px vertically for key titles.
- Cards: balanced proportions and light drop shadows. Main work images should be displayed uncropped whenever Arabic copy is part of the design. Use `object-fit: contain` for text-heavy originals.
- Presenter layer should be in front of background; depending scene, card may pass behind, never across face.

## Motion
- Typical entrance 10–16 frames (0.33–0.53s), no random bounce or aggressive 3D spins.
- Animate via Remotion `spring()` and `interpolate()` deterministically using `useCurrentFrame()`; restrained parallax, depth and scale.
- Transitions must align with spoken concepts; linger on each image for readability.
- No strobe, rapid flashing, heavy camera shake or repeated zoom punches.
- No subtitle wall; small words like `Business`, `Customers`, `Message`, `Content` only when useful.

## Keying (known technical challenge)
- The actual 'green screen' is **dark teal**, not a uniform pure green. Approx background hue in OpenCV HSV is H85–88 / 180, saturation often >180; illuminated RGB approx `#208178`, shadows descend to much darker teal.
- Black side bars were removed from the supplied source by crop y=192, h=1536; DO NOT crop another 192px inside `public/presenter_cropped.mp4`.
- Do not assume pure green `#00FF00`: analyze/adjust on real footage. Check hair, fingers, watch, sleeves, left/right edge and deep shadow.
- **Preferred reliable pathway:** `scripts/key_presenter.py` uses an HSV-based alpha matte and creates transparent WebM (without audio); then render with `<OffthreadVideo transparent muted>` or a compatible transparent `<Video>` and separate `<Audio>` from the cropped source. Ensure only one voice track.
- **Optional native effect:** Remotion's `colorKey()` from `@remotion/effects/color-key` with `<Video>` from `@remotion/media`; it needs WebGL2 and can fail to remove dark shades in this footage, so test first and fall back to pre-keying when needed.
- Check 1s, 14s, and 24s on the final background at full preview scale before full render. PNG stills are enough; don't create a mandatory 8-second trial video.

## Audio
- The original voice is authoritative. Do NOT regenerate narration, translate, speed up or cut words.
- Preserve the provided AAC voice from `public/presenter_cropped.mp4`; subtle speech mastering only if needed, not robotic denoise.
- Portfolio demo clip must be muted when visible. No duplicate audio from WebM plus original source.
- No unlicensed music. Music/SFX are optional, extremely subtle and must be cleared for use; prefer voice-only rather than distracting tracks.

## Technical references
- https://www.remotion.dev/docs/greenscreen
- https://www.remotion.dev/docs/effects/color-key
- https://www.remotion.dev/docs/videos/transparency
- https://www.remotion.dev/docs/offthreadvideo
