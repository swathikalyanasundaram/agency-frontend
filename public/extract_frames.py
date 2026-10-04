# Usage: python extract_frames.py hero_video.mp4   (pip install opencv-python)
# Writes samplesai/frames/frame_000.jpg ... then set "frameCount" in content.json to the number printed.
import cv2, os, sys
src = sys.argv[1] if len(sys.argv) > 1 else "hero_video.mp4"
os.makedirs("samplesai/frames", exist_ok=True)
cap = cv2.VideoCapture(src); total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT)); want = min(240, total); n = 0
for i in range(want):
    cap.set(cv2.CAP_PROP_POS_FRAMES, int(i * total / want)); ok, f = cap.read()
    if not ok: break
    f = cv2.resize(f, (1280, 720)); cv2.imwrite(f"samplesai/frames/frame_{n:03d}.jpg", f, [cv2.IMWRITE_JPEG_QUALITY, 82]); n += 1
print("frameCount =", n)
