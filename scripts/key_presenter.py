#!/usr/bin/env python3
"""HSV chroma key for this user's particular dark-teal screen.

Usage:
  python3 -m pip install opencv-python-headless numpy
  python3 scripts/key_presenter.py public/presenter_cropped.mp4 public/presenter_keyed.webm
Optional QA: --max-frames 60 (key technique test, not final deliverable).

Outputs a SILENT WebM video with VP9 alpha. For audio use the original mp4 once.
Requires ffmpeg with libvpx-vp9 encoder.
"""
import argparse
from pathlib import Path
import subprocess
import sys

import cv2
import numpy as np


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('input')
    ap.add_argument('output')
    ap.add_argument('--max-frames', type=int, default=0)
    ap.add_argument('--crf', type=int, default=23)
    ap.add_argument('--cpu-used', type=int, default=4)
    a=ap.parse_args()
    cv2.setNumThreads(2)
    cap=cv2.VideoCapture(a.input)
    if not cap.isOpened():
        raise SystemExit('Cannot open source video')
    w,h=int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)),int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps=cap.get(cv2.CAP_PROP_FPS)
    if (w,h)!=(864,1536):
        print('WARNING source is not expected 864x1536:',(w,h),file=sys.stderr)
    out=Path(a.output)
    out.parent.mkdir(parents=True,exist_ok=True)
    cmd=[
      'ffmpeg','-hide_banner','-loglevel','error','-y',
      '-f','rawvideo','-pixel_format','rgba','-video_size',f'{w}x{h}',
      '-framerate',f'{fps:.6f}','-i','pipe:0',
      '-an','-c:v','libvpx-vp9','-pix_fmt','yuva420p',
      '-auto-alt-ref','0','-deadline','good','-cpu-used',str(a.cpu_used),
      '-crf',str(a.crf),'-b:v','0','-row-mt','1','-threads','4',str(out)
    ]
    proc=subprocess.Popen(cmd,stdin=subprocess.PIPE)
    count=0
    kernel=np.ones((3,3),np.uint8)
    try:
        while True:
            ok,frame=cap.read()
            if not ok or (a.max_frames and count>=a.max_frames):
                break
            hsv=cv2.cvtColor(frame,cv2.COLOR_BGR2HSV)
            # Actual screen: teal H~85-88 (OpenCV 0-179), variable brightness.
            # Gray shirt/skin remain outside hue+S threshold; deep screen shadows key out.
            bg=cv2.inRange(hsv, (74,92,13), (103,255,255))
            bg=cv2.morphologyEx(bg,cv2.MORPH_OPEN,kernel)
            # Small isolated teal patches occur in shirt folds and the watch.
            # Keep them opaque while retaining the screen gaps below the arms.
            _, labels, stats, _ = cv2.connectedComponentsWithStats(bg)
            screen = stats[:, cv2.CC_STAT_AREA] >= 160
            screen[0] = False
            bg = screen.astype(np.uint8)[labels] * 255
            alpha=255-cv2.GaussianBlur(bg,(5,5),0.9)
            # Neutralize excess green close to the matte edge. Leave skin,
            # clothing and opaque interior details at their recorded colors.
            edge = cv2.dilate(bg, kernel) > 0
            rgba=cv2.cvtColor(frame,cv2.COLOR_BGR2RGBA)
            red, green, blue = (rgba[:, :, index] for index in range(3))
            neutral_green = np.maximum(red, blue)
            green[edge] = np.minimum(green[edge], neutral_green[edge])
            rgba[:,:,3]=alpha
            proc.stdin.write(rgba.tobytes())
            count+=1
            if count%150==0:
                print('keyed',count,'frames',flush=True)
    except BrokenPipeError:
        raise SystemExit('Encoder pipe closed: verify ffmpeg libvpx-vp9 support')
    finally:
        cap.release()
        if proc.stdin:
            proc.stdin.close()
    status=proc.wait()
    if status: raise SystemExit(f'ffmpeg failed with status {status}')
    print(f'Keyed {count} frames at {fps:.3f}fps -> {out}')
    print('Verify ffprobe stream tags show alpha_mode=1; QA over different background colors.')

if __name__=='__main__':
    main()
