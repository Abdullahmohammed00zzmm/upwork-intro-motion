# Render QA — mandatory before delivery

## Media
- [ ] `public/presenter_cropped.mp4` exists, 864×1536, 30fps, around 27.77s with original AAC voice.
- [ ] Portfolio images exist at manifest paths and were not replaced by invented/stock images.
- [ ] If videos are used as work samples they are muted, main presenter voice only once.
- [ ] Keyed presenter has clean visible hairline, arms, watch/strap, fingers and shirt in stills at 1s, 14s, 24s.
- [ ] No residual solid teal, tearing, giant green patches, transparent holes in shirt, outlines or clipping.

## Content
- [ ] Exact wording in voice source preserved; no script rewrite or new claims.
- [ ] Al-Halimi, Abu Shuaib and OSHENZ each appear at their spoken name and in correct order.
- [ ] OSHENZ only shown as social media design project.
- [ ] End card explicitly says “Message Me on Upwork”; no Whatsapp/website/contact outside Upwork.
- [ ] Arabic text embedded in client designs is not generated, translated, mirrored or damaged.

## Visual
- [ ] 1920×1080 landscape, 30fps, 833 frames.
- [ ] No stretching, unnatural crop or flipping of the presenter.
- [ ] Cards support dialogue and never cover the speaker's face or important design copy.
- [ ] Typography readable on mobile, no sudden seizure-inducing effects or excessive clutter.
- [ ] Color accents are #9F420B and #E1E7E6, background neutral-charcoal.

## Audio/output
- [ ] Voice intelligible, without doubling/echo, clipped words or sharp volume shifts.
- [ ] Output `out/upwork_intro_final.mp4`: valid H.264 + AAC, plays from start to end.
- [ ] `ffprobe` matches duration, fps, size and codecs; final file reproducibly rendered.
- [ ] Final MP4 has a user-accessible download route from phone (artifact/release or accessible file).
- [ ] Work committed with latest status in `work_log/STATUS.md`; provide succinct final links.
