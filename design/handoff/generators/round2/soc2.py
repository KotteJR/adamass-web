# SOC 2 readiness, in the same isometric kit as the other ways in. One 9 s story:
# 0-3 s the control drawers light one by one; 3-6 s evidence sheets travel to the archive;
# 6-9 s the auditor's stamp comes down on the report and leaves a blue seal. Classes f5-*.
import sys, os, json
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "v10"))
import iso
from iso import *
iso.K = float(sys.argv[2]) if len(sys.argv) > 2 else 1.6
OUT = sys.argv[1]
o = []; A = o.append

# soft shadow under it all
hb = [P(x, y, -6) for x, y in rrect(-158, -44, 268, 92, 14)]
A(f'<path d="{path(hull(hb))}" fill="#1c2a3a" opacity="0.09" filter="url(#hl)"/>')

# the controls cabinet, drawers facing the way the evidence goes (+x)
CX, CY, CW, CD, CH = -150, -32, 46, 52, 82
A(box(CX, CY, 0, CW, CD, CH, "paper", r=1.5))
for k in range(5):
    z = 7 + k * 15
    A(box(CX + CW, CY + 7, z, 3, CD - 14, 11, "mid", r=0.6, sw=0.6))
    A(line((CX + CW + 3, CY + 20, z + 5.5), (CX + CW + 3, CY + 32, z + 5.5), LO, 0.6))
    A(f'<g class="f5-k f5-k{k}">' + box(CX + CW + 3, CY + 38, z + 3, 1, 6, 5, "lit", sw=0.4) + "</g>")

# the archive the evidence goes into
AX, AY = -40, -26
A(box(AX, AY, 0, 44, 40, 20, "mid", r=1.2))
A(poly3([(AX + 4, AY + 4, 20), (AX + 40, AY + 4, 20), (AX + 40, AY + 36, 20), (AX + 4, AY + 36, 20)], LO, 0.6, close=True))
# evidence sheets: start at the drawers, travel along +x, drop into the archive
SX = CX + CW + 6
for k in range(3):
    A(f'<g class="f5-ev f5-ev{k}"><g class="f5-ev-in">' + box(SX, -14 + k * 0.01, 26, 14, 10, 1.2, "paper", sw=0.5, crease=False)
      + line((SX + 3, -11, 27.3), (SX + 11, -11, 27.3), LO, 0.4) + line((SX + 3, -8, 27.3), (SX + 9, -8, 27.3), LO, 0.4) + "</g></g>")

# the report on its plinth, the seal, and the auditor's stamp above it
RX, RY = 46, -30
A(box(RX, RY, 0, 56, 48, 8, "lo", r=1.5))
A(box(RX + 6, RY + 6, 8, 44, 36, 0.9, "paper", sw=0.5, crease=False))
for j, L in enumerate([30, 24, 28, 16]):
    A(line((RX + 11, RY + 12 + j * 4.2, 8.95), (RX + 11 + L, RY + 12 + j * 4.2, 8.95), LO, 0.5))
SCX, SCY = RX + 34, RY + 28
A(f'<g class="f5-seal"><g transform="{plane_top(SCX, SCY, 8.95)}"><circle r="7.5" fill="#7aa2d2" fill-opacity="0.3" stroke="{LIT}" stroke-width="1.4"/>'
  f'<circle r="4.6" fill="none" stroke="{LIT}" stroke-width="0.9"/><circle r="1.6" fill="{LIT}"/></g></g>')
STAMP_UP = 18
st = box(SCX - 9, SCY - 9, 9 + STAMP_UP, 18, 18, 5, "lit", r=1.2, sw=0.6) + cyl(SCX, SCY, 3.2, 14 + STAMP_UP, 14, "ink", sw=0.5) + cyl(SCX, SCY, 6, 28 + STAMP_UP, 5, "ink", sw=0.5)
A(f'<g class="f5-st">{st}</g>')

x0, y0, x1, y1 = iso.BOUNDS
pad = 14
Wd, Ht = x1 - x0 + 2 * pad, y1 - y0 + 2 * pad
svg = (f'<svg class="iso-f5" viewBox="{f(x0 - pad)} {f(y0 - pad)} {f(Wd)} {f(Ht)}" width="{f(Wd)}" height="{f(Ht)}" xmlns="http://www.w3.org/2000/svg" role="img" '
       f'aria-label="Control drawers light up one by one, evidence sheets travel into an archive, and an auditor\'s stamp seals the report." '
       f'style="display:block;max-width:100%;height:auto"><defs><filter id="hl" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="8"/></filter></defs>{"".join(o)}</svg>')
open(OUT, "w").write(svg)
mv = {"evX": [round(v, 1) for v in move_x(AX + 14 - SX)], "evDrop": [round(v, 1) for v in move_z(-12)], "stamp": [round(v, 1) for v in move_z(-STAMP_UP)], "W": round(Wd), "H": round(Ht)}
json.dump(mv, open(OUT.replace(".svg", ".json"), "w"))
print(json.dumps(mv))
