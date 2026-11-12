# The paintings again, at 2-3x their old size: the lossless render upscaled first, then the same
# motion smear done at full resolution (so nothing is blown up afterwards), then fine grain so
# dark gradients don't band, saved at high quality.
import sys, math, time, numpy as np
from PIL import Image, ImageFilter
src, out, angle, length, scale, grain, q = sys.argv[1], sys.argv[2], float(sys.argv[3]), int(sys.argv[4]), float(sys.argv[5]), float(sys.argv[6]), int(sys.argv[7])
t0 = time.time()
im = Image.open(src).convert("RGB")
W, H = round(im.width * scale), round(im.height * scale)
im = im.resize((W, H), Image.LANCZOS)
a = np.asarray(im).astype(np.float32)
L = round(length * scale)
pad = L
p = np.pad(a, ((pad, pad), (pad, pad), (0, 0)), mode="reflect")
acc = np.zeros_like(a)
dx, dy = math.cos(math.radians(angle)), math.sin(math.radians(angle))
n = 0
step = max(1, round(scale))
for i in range(-L // 2, L // 2 + 1, step):
    ox, oy = int(round(i * dx)), int(round(i * dy))
    acc += p[pad + oy: pad + oy + H, pad + ox: pad + ox + W]
    n += 1
acc /= n
img = Image.fromarray(np.clip(acc + 0.5, 0, 255).astype("uint8")).filter(ImageFilter.GaussianBlur(2.2 * scale))
g = np.asarray(img).astype(np.float32) + np.random.default_rng(3).normal(0, grain, (H, W, 1))
Image.fromarray(np.clip(g + 0.5, 0, 255).astype("uint8")).save(out, quality=q, method=6)
import os
print(out.split("/")[-1], W, H, f"{os.path.getsize(out) / 1024:.0f} KB", f"{time.time() - t0:.1f}s")
