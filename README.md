# Abdullah Al-Wuhaishi’s Upwork introduction

A 27.77-second Remotion composition featuring Abdullah’s original green-screen recording and portfolio work for Al-Halimi, Abu Shuaib and OSHENZ.

- [Download the finished video](https://github.com/Abdullahmohammed00zzmm/upwork-intro-motion/releases/download/v1.0.0/upwork-intro-final.mp4)
- [Production notes and verification](work_log/STATUS.md)

## Render in Codex Cloud

The versioned production ZIP contains the original presenter footage. The original portfolio media is staged under `public/media/`. The staging script can also restore those files from the portfolio repository or its published site.

```bash
npm ci
python3 -m venv /tmp/upwork-key
/tmp/upwork-key/bin/pip install -r requirements-key.txt
KEY_PYTHON=/tmp/upwork-key/bin/python npm run render
bash scripts/verify_media.sh
```

The render command extracts the source from the production ZIP and generates the transparent presenter layer as needed. It renders the composition at 1920×1080, 30 fps and 833 frames, and copies the recording’s original AAC stream into `output/upwork-intro-final.mp4`. Set `REMOTION_BROWSER` to a compatible Chromium executable if using the cloud environment’s installed browser.

The scene composition, typography and timing are in `src/`. The approved design and storyboard are in `PRODUCTION/`.
