# The engagement scene: one isometric bench that builds up phase by phase.
# Your team's row of desks is always there. Frame: a brief is written on a low table and four cards pop up.
# Join: our desk slides in at the end of the row and a cable links it to yours.
# Deliver: modules stack up on a pallet. Handover: a binder slides to your first desk, a key appears there,
# and our desk lifts away. Classes on the root (.ph1 to .ph4) drive it.
import sys, os, json, math
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "v10"))
import iso
from iso import *

iso.K = float(sys.argv[2]) if len(sys.argv) > 2 else 1.55
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), "scene.svg")

o = []
A = o.append

# soft shadow under the bench
hb = [P(x, y, -14) for x, y in rrect(-150, -96, 280, 230, 14)]
A(f'<path d="{path(hull(hb))}" fill="#000000" opacity="0.28" filter="url(#sh)"/>')
# bench
A(box(-144, -90, -10, 268, 218, 10, "lo", r=10, sw=0.9))
A(poly3([(x, y, 0) for x, y in rrect(-137, -83, 254, 204, 6)], LO, 0.55, close=True))
A(box(-126, 116, 0, 170, 6, 0.8, "paper", r=1, sw=0.5, crease=False))
for i, x in enumerate(range(-122, 40, 4)):
    L = 4 if i % 5 == 0 else 2.2
    A(line((x, 116.4, 0.8), (x, 116.4 + L, 0.8), LINE if i % 5 == 0 else LO, 0.45))

def desk(x, y, tone="paper", screen="#ffffff"):
    s = box(x, y, 0, 36, 24, 13, tone, r=1.2, sw=0.7)
    s += box(x + 2, y + 2, 13, 32, 20, 1.6, "mid" if tone == "paper" else tone, r=1, sw=0.5)
    s += box(x + 14, y + 6, 14.6, 8, 5, 1, "mid", sw=0.4)
    s += box(x + 17, y + 8, 15.6, 2, 2, 7, "mid", sw=0.4)
    s += box(x + 6, y + 6, 22.6, 24, 2, 15, tone, r=0.8, sw=0.6)
    s += poly3(face_y(x + 8, x + 28, 24.6, 35.6, y + 8.04), LO, 0.4, fill=screen, close=True)
    s += box(x + 9, y + 14, 15.2, 14, 6, 1, "paper", r=0.6, sw=0.4)
    return s

ROW_Y = -70
ROW_X = [-118, -74, -30]
OUR_X = 14
# your team's row
for k, x in enumerate(ROW_X):
    if k == 0:
        A(f'<g class="d0"><g class="n">{desk(x, ROW_Y)}</g><g class="l">{desk(x, ROW_Y, screen="#cfe0f2")}</g></g>')
    else:
        A(desk(x, ROW_Y))
# the cable along the back of the row, out to our desk (Join)
CAB = [(-100, ROW_Y + 1, 2), (-100, ROW_Y - 6, 2), (OUR_X + 18, ROW_Y - 6, 2), (OUR_X + 18, ROW_Y + 1, 2)]
cp = path([P(*p) for p in CAB], False)
A(f'<g class="cab"><path d="{cp}" stroke="{LIT}" stroke-width="{2.6 * iso.K / 1.3:.2f}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
  f'<path class="cabp" d="{cp}" pathLength="100" stroke="#ffffff" stroke-width="{1.4 * iso.K / 1.3:.2f}" fill="none" stroke-linecap="round" stroke-dasharray="6 100" stroke-dashoffset="106"/></g>')
# our desk (Join, leaves at Handover)
A(f'<g class="our"><g class="oi">{desk(OUR_X, ROW_Y, "lit", "#dbe7f4")}</g></g>')

# the brief on a low table (Frame)
TX, TY = -112, 18
A(box(TX, TY, 0, 52, 36, 9, "mid", r=1.5, sw=0.6))
A(f'<g class="brief">' + box(TX + 6, TY + 4, 9, 30, 22, 0.8, "paper", sw=0.5, crease=False) + "</g>")
for k, L in enumerate([20, 24, 16, 22, 12]):
    A(f'<g class="bl b{k}">' + line((TX + 9, TY + 7.5 + 3.6 * k, 9.9), (TX + 9 + L, TY + 7.5 + 3.6 * k, 9.9), LO, 0.6) + "</g>")
for k in range(4):
    cx, cy = TX + 40 + (k % 2) * 7, TY + 6 + (k // 2) * 13
    A(f'<g class="card c{k}">' + box(cx, cy, 9, 6, 9, 3.5, "lit", r=0.6, sw=0.4) + "</g>")
# pen
A(f'<g class="pen">' + box(TX + 30, TY + 10, 9.6, 12, 1.4, 1.4, "ink", r=0.6, sw=0.3) + "</g>")

# the pallet of modules (Deliver)
PX, PY = -20, 26
A(box(PX, PY, 0, 50, 40, 4, "mid", r=1.5, sw=0.6))
cubes = [(0, 0, 0), (1, 0, 0), (2, 0, 0), (0, 1, 0), (1, 1, 0), (2, 1, 0), (0, 0, 1), (1, 0, 1), (0, 1, 1)]
for k, (i, j, l) in enumerate(sorted(cubes, key=lambda c: (c[2], c[0] + c[1]))):
    x, y, z = PX + 4 + i * 15, PY + 4 + j * 16, 4 + l * 11
    A(f'<g class="cube k{k}"><g class="n">{box(x, y, z, 13, 13, 10.5, "paper", r=1, sw=0.5)}</g><g class="l">{box(x, y, z, 13, 13, 10.5, "lit", r=1, sw=0.5)}</g></g>')

# the binder that moves from our desk to your first desk, and the key that stays (Handover)
BX0, BY0 = OUR_X + 22, ROW_Y + 10
A(f'<g class="bnd"><g class="bm">{box(BX0, BY0, 14.6, 9, 7, 6, "lit", r=0.8, sw=0.5)}</g></g>')
KX, KY = ROW_X[0] + 25, ROW_Y + 13
key = (f'<g transform="{plane_top(KX, KY, 14.7)}"><circle cx="0" cy="0" r="2.4" fill="none" stroke="{LIT}" stroke-width="1.4"/>'
       f'<path d="M2.4 0 L8 0 M6 0 L6 1.8 M7.6 0 L7.6 1.4" stroke="{LIT}" stroke-width="1.4" fill="none" stroke-linecap="round"/></g>')
A(f'<g class="key">{key}</g>')

x0, y0, x1, y1 = iso.BOUNDS
pad = 14
W, H = x1 - x0 + 2 * pad, y1 - y0 + 2 * pad
svg = (f'<svg viewBox="{f(x0 - pad)} {f(y0 - pad)} {f(W)} {f(H)}" width="{f(W)}" height="{f(H)}" xmlns="http://www.w3.org/2000/svg" role="img" '
       f'aria-label="A bench with your team\'s row of desks. A brief is written, our desk joins the row, modules stack up, then a binder and a key move to your side and our desk leaves." '
       f'style="display:block;width:100%;height:auto;overflow:visible"><defs><filter id="sh" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="10"/></filter></defs>{"".join(o)}</svg>')
open(OUT, "w").write(svg)
mv = {"ourIn": [round(v, 1) for v in move_y(90)], "ourUp": [round(v, 1) for v in move_z(46)],
      "bnd": [round(a - b, 1) for a, b in zip(P(ROW_X[0] + 14, ROW_Y + 12, 14.6), P(BX0, BY0, 14.6))],
      "bndLift": [round(v, 1) for v in move_z(14)], "cubeDrop": [round(v, 1) for v in move_z(16)], "W": round(W), "H": round(H)}
json.dump(mv, open(OUT.replace(".svg", ".json"), "w"))
print(json.dumps(mv), len(svg))
