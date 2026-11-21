# Production status

## Completed

- Found and extracted the approved production ZIP from the repository root.
- Staged all 12 original assets from the portfolio GitHub repository using `bash scripts/stage_assets.sh`.
- Built the five approved scenes in Remotion 4.0.545. The original presenter remains visible throughout, and the Al-Halimi ad plays silently in the services scene.
- Aligned the scene and portfolio cues to the original recording. The three named showcases start at frames 560 (Al-Halimi), 586 (Abu Shuaib), and 609 (OSHENZ).
- Rendered and checked `output/upwork-intro-final.mp4`. It is a 27.766667-second fast-start MP4 with 833 frames of 1920×1080, 30 fps H.264, Rec. 709 yuv420p video, and one AAC audio track.
- Decoded the entire MP4. The AAC payload hash and every audio packet timestamp match the original recording. Reviewed frames at 1, 14, and 24 seconds, as well as the project titles, service examples, CTA, and final frame.

## Files

- `src/index.ts`, `src/root.tsx`, `src/intro.tsx`, `src/timing.ts`, and `src/style.css` define the composition.
- `package.json`, `package-lock.json`, `tsconfig.json`, and `requirements-key.txt` pin and configure the build.
- `scripts/key_presenter.py` creates the alpha layer. `scripts/render_final.sh` renders and muxes the MP4. `scripts/verify_media.sh` probes, decodes, and checks the result.
- `public/media/` contains the original portfolio files. The production ZIP retains the original recording, and the render command regenerates the derived alpha video as needed.
- `output/upwork-intro-final.mp4` is the final deliverable.

## Issues resolved

- The bundled browser download timed out in the cloud environment. The installed Chromium completed the render.
- The uneven teal screen needed edge despill and small-component filtering to keep shirt and watch details opaque.
- Remotion’s default color settings produced full-range video. The final render explicitly uses Rec. 709 with PNG frame intermediates.
- The original AAC has a brief decoded peak near full scale. The original recording was preserved byte for byte.

## Exact final render command

```bash
KEY_PYTHON=/tmp/upwork-video-venv/bin/python REMOTION_BROWSER=/usr/bin/chromium npm run render > /tmp/upwork-final-render.log 2>&1
```
