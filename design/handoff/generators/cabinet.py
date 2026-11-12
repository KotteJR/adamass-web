# Fig. 1: an AWS organisation drawn as an equipment cabinet on a bench.
# Each tray is an account. The bar on the left is the guardrail. Blue is what a service sets up.
import sys, json, math
sys.path.insert(0, __import__("os").path.dirname(__file__))
import iso
from iso import *

iso.K = float(sys.argv[2]) if len(sys.argv) > 2 else 1.3
OUT = sys.argv[1]

TRAY_Z = [12 + 22 * i for i in range(6)]
TRAY_H = 18
MIG = 92        # how far the migrating tray sits out, on the trolley
DRAWER = 40     # how far the card drawer slides out

o = []
A = o.append

# ── halo under the bench ──
hb = [P(x, y, -22) for x, y in rrect(-166, -100, 268, 244, 14)]
A(f'<path d="{path(hull(hb))}" fill="#1c2a3a" opacity="0.10" filter="url(#halo)"/>')

# ── bench: feet, plate, groove, screws, ruler, label plate ──
feet = [(-136, -72), (72, -72), (-136, 112), (72, 112)]
for x, y in sorted(feet, key=lambda p: p[0] + p[1]):
    A(cyl(x, y, 8.5, -21, 1.8, "lo", 28, sw=0.6))
    A(cyl(x, y, 6.2, -19.2, 7.2, "mid", 28, sw=0.6))
A(box(-160, -96, -12, 256, 232, 12, "lo", r=10, sw=0.9))
A(poly3([(x, y, 0) for x, y in rrect(-153, -89, 242, 218, 6)], LO, 0.55, close=True))
for x, y in [(-148, -84), (84, -84), (-148, 124), (84, 124)]:
    A(poly3(circ_z(x, y, 2.4, 0, 18), LO, 0.5, close=True)); A(dot((x, y, 0), 0.55, LO))
# ruler strip along the front-left edge
A(box(-138, 122, 0, 196, 7, 0.8, "paper", r=1, sw=0.55, crease=False))
for i, x in enumerate(range(-134, 55, 4)):
    L = 4.4 if i % 5 == 0 else 2.4
    A(line((x, 122.4, 0.8), (x, 122.4 + L, 0.8), LINE if i % 5 == 0 else LO, 0.5))
# label plate, front right
A(box(62, 98, 0, 26, 18, 0.9, "paper", r=1.5, sw=0.55, crease=False))
A(poly3([(x, y, 0.9) for x, y in rrect(64, 100, 22, 14, 0.8)], FAINT, 0.45, close=True))
for k, (a, b) in enumerate([(66, 82), (66, 78), (66, 74)]):
    A(line((a, 104 + 3.4 * k, 0.9), (b, 104 + 3.4 * k, 0.9), LO, 0.5, extra=' data-free=""'))

# ── VPN appliance on the bench, left and back ──
A(box(-150, -46, 0, 36, 40, 18, "mid", r=2.2))
A(poly3([(x, y, 18) for x, y in rrect(-147, -43, 30, 34, 1.2)], FAINT, 0.45, close=True))
for k in range(5):
    A(poly3(slot_y(-146 + 5.4 * k, -142.2 + 5.4 * k, 9, -6.0, 1.4), LO, 0.45, close=True))
A('<g class="vpnled">' + poly3(circ_y(-122, 9, 1.4, -5.98, 14), LO, 0.4, fill=FAINT, close=True) + "</g>")
A(cyl(-132, -26, 3.6, 18, 3.2, "paper", 24, sw=0.55))          # keyed switch
A(box(-133.2, -26.6, 21.2, 2.4, 1.2, 3.2, "ink", sw=0.4))        # key
A(dot((-147, -43.5, 18), 0.5, LO)); A(dot((-117, -43.5, 18), 0.5, LO))

# cable, back half (hidden behind the left panel where it should be)
CB = [(-114, -26, 7), (-90, -26, 3), (-70, -26, 3), (-70, -26, 42), (-70, 8, 42)]
CF = [(-70, 8, 42), (-70, 20, 42), (-48, 20, 42), (-48, 16, 42)]
def cable(ps, cls=""):
    d = path([P(*p) for p in ps], False)
    return (f'<g class="{cls}"><path d="{d}" stroke="{LINE}" stroke-width="{4.2 * iso.K / 1.3:.2f}" fill="none" stroke-linejoin="round" stroke-linecap="round"/>'
            f'<path d="{d}" stroke="#e7e9ec" stroke-width="{2.9 * iso.K / 1.3:.2f}" fill="none" stroke-linejoin="round" stroke-linecap="round"/>'
            f'<path d="{d}" stroke="#ffffff" stroke-width="{0.8 * iso.K / 1.3:.2f}" stroke-opacity="0.9" fill="none" transform="translate(-0.6 -0.6)" stroke-linejoin="round"/></g>')
A(cable(CB))
A(box(-115.5, -29, 4, 1.5, 6, 6, "ink", sw=0.4))                  # port on the appliance

# ── cabinet: plinth, back and left panels, rails ──
A(box(-64, -72, 0, 128, 86, 8, "mid", sw=0.8))
A(line((-64, 14, 4), (64, 14, 4), LO, 0.5)); A(line((64, -72, 4), (64, 14, 4), LO, 0.5))
A(box(-62, -72, 8, 124, 4, 138, "paper"))
A(box(-64, -72, 8, 4, 86, 138, "paper"))
for z in TRAY_Z:
    A(line((-60, -68, z - 1.2), (-60, 12, z - 1.2), LO, 0.5))
    A(dot((-60, -64, z + 2), 0.5, LO)); A(dot((-60, 8, z + 2), 0.5, LO))

# guardrail bar, its brackets and lock
LB = box(-63.6, 14.4, 10, 3.6, 3.6, 136, "paper", r=0.6)
LBL = box(-63.6, 14.4, 10, 3.6, 3.6, 136, "lit", r=0.6)
A(f'<g class="lockbar"><g class="n">{LB}</g><g class="l">{LBL}</g>'
  + dot((-61.8, 18, 144), 0.5, LO) + "</g>")
for zb in (26, 116):
    A(box(-65.4, 18, zb, 7.2, 2.2, 7, "mid", r=0.5, sw=0.6))
    A(dot((-64.2, 20.2, zb + 3.5), 0.5, LINE)); A(dot((-59.4, 20.2, zb + 3.5), 0.5, LINE))
A(box(-66, 13, 1, 9, 9, 6, "mid", r=1, sw=0.6))                      # lock housing on the plinth
A(poly3(circ_y(-61.5, 4, 1.4, 22.02, 14), LINE, 0.5, close=True, fill="#ffffff"))


def tray_front(z0, y, kind, lit=False):
    """Details on a tray's front face (a +y plane at `y`)."""
    s = []
    s.append(dot((-55, y, z0 + 9), 0.6, LO)); s.append(dot((55, y, z0 + 9), 0.6, LO))
    if kind == "vault":
        s.append(poly3(face_y(-54, -42, z0 + 5, z0 + 13, y + 0.02), LINE, 0.5, fill="#30353d", close=True))
        ring = circ_y(-22, z0 + 9, 6.2, y + 0.02, 32)
        s.append(poly3(ring, LINE, 0.6, fill="#ffffff", close=True))
        for k in range(24):
            a = 2 * math.pi * k / 24
            s.append(line((-22 + 6.2 * math.cos(a), y + 0.03, z0 + 9 + 6.2 * math.sin(a)),
                          (-22 + 7.4 * math.cos(a), y + 0.03, z0 + 9 + 7.4 * math.sin(a)), LO, 0.4))
        s.append(poly3(circ_y(-22, z0 + 9, 7.4, y + 0.02, 32), LO, 0.45, close=True))
        s.append(f'<g transform="{plane_y(-22, y + 0.05, z0 + 9)}"><g class="vdial">'
                 f'<path d="M-1.6 0 L4.6 0" stroke="{LINE}" stroke-width="0.9" vector-effect="non-scaling-stroke" stroke-linecap="round"/>'
                 f'<circle r="1.3" fill="#ffffff" stroke="{LINE}" stroke-width="0.6" vector-effect="non-scaling-stroke"/></g></g>')
        for k in range(3):
            s.append(poly3(slot_y(2, 30, z0 + 5 + 4 * k, y + 0.02, 1.5), LO, 0.45, close=True))
    else:
        s.append(poly3(face_y(-42, -12, z0 + 4.5, z0 + 13.5, y + 0.02), LO, 0.5, fill="#ffffff", close=True))
        s.append(line((-39, y + 0.03, z0 + 10.5), (-21, y + 0.03, z0 + 10.5), LO, 0.5, extra=' data-free=""'))
        s.append(line((-39, y + 0.03, z0 + 7.5), (-28, y + 0.03, z0 + 7.5), LO, 0.5, extra=' data-free=""'))
        for k in range(2):
            s.append(poly3(slot_y(-4, 22, z0 + 7 + 4 * k, y + 0.02, 1.5), LO, 0.45, close=True))
    return "".join(s)


def led(z0, y, i, x=-48):
    return f'<g class="led l{i}">' + poly3(circ_y(x, z0 + 9, 1.7, y + 0.04, 16), LINE, 0.45, fill=FAINT, close=True) + "</g>"


def handle(z0, y, tone="mid"):
    s = box(30, y, z0 + 6, 2.2, 3.6, 6, tone, sw=0.5) + box(46, y, z0 + 6, 2.2, 3.6, 6, tone, sw=0.5)
    s += box(28.6, y + 3.4, z0 + 7.2, 21, 2.4, 3.6, tone, r=1.1, sw=0.6)
    return s


def tray(z0, kind="std", tone="paper", i=0):
    s = box(-58, -68, z0, 116, 78, TRAY_H, tone, sw=0.8)
    s += poly3([(x, y, z0 + TRAY_H) for x, y in rrect(-54, -64, 108, 70, 1)], FAINT, 0.45, close=True)
    s += tray_front(z0, 10, kind)
    s += led(z0, 10, i, x=-48 if kind != "vault" else -36)
    s += handle(z0, 10)
    return s


# ── trolley with the workload that is moving in ──
for x, y in sorted([(-46, 30), (46, 30), (-46, 106), (46, 106)], key=lambda p: p[0] + p[1]):
    A(cyl(x, y, 3.6, 0, 6, "ink", 20, sw=0.5))
A(box(-56, 22, 6, 112, 90, 6, "mid", r=2))
A(poly3([(x, y, 12) for x, y in rrect(-52, 26, 104, 82, 1.2)], FAINT, 0.45, close=True))
dx, dy = move_y(MIG)
mig_n = tray(TRAY_Z[0], "std", "paper", 0)
mig_l = box(-58, -68, TRAY_Z[0], 116, 78, TRAY_H, "lit", sw=0.8) + tray_front(TRAY_Z[0], 10, "std") + led(TRAY_Z[0], 10, 0) + handle(TRAY_Z[0], 10)
A(f'<g transform="translate({f(dx)} {f(dy)})"><g class="migtray"><g class="n">{mig_n}</g><g class="l">{mig_l}</g></g></g>')
for x in (-44, 44):
    A(cyl(x, 109, 1.7, 12, 34, "mid", 16, sw=0.5))
A(box(-47, 107.3, 44, 94, 3.4, 3.4, "mid", r=1.5, sw=0.6))

# ── trays 1 to 4, then the card drawer ──
A(f'<g class="vault"><g class="n">{tray(TRAY_Z[1], "vault", "paper", 1)}</g><g class="l">{tray(TRAY_Z[1], "vault", "lit", 1)}</g></g>')
for i in (2, 3, 4):
    A(tray(TRAY_Z[i], "std", "paper", i))

z0 = TRAY_Z[5]
dw = []
dw.append(box(-56, -66, z0, 112, 76, 2, "lo", sw=0.6))
dw.append(box(-56, -66, z0 + 2, 112, 2, 13, "paper", sw=0.6))
dw.append(box(-56, -64, z0 + 2, 2, 74, 13, "paper", sw=0.6))
CARDS = [-60 + 4.6 * k for k in range(14)]
LIFT = 9
for k, y in enumerate(CARDS):
    tab = (-46 + 18 * (k % 5))
    card = box(-50, y, z0 + 2, 100, 0.9, 11, "paper", sw=0.5, crease=False)
    card += box(tab, y, z0 + 13, 12, 0.9, 2.6, "paper", sw=0.45, crease=False)
    if k == LIFT:
        cardl = box(-50, y, z0 + 2, 100, 0.9, 11, "lit", sw=0.5, crease=False) + box(tab, y, z0 + 13, 12, 0.9, 2.6, "lit", sw=0.45, crease=False)
        dw.append(f'<g class="card"><g class="n">{card}</g><g class="l">{cardl}</g></g>')
    else:
        dw.append(card)
dw.append(box(54, -64, z0 + 2, 2, 74, 13, "paper", sw=0.6))
dw.append(box(-58, 10, z0, 116, 3, TRAY_H, "paper", sw=0.8))
y = 13
dw.append(poly3(face_y(-9, 9, z0 + 10, z0 + 15, y + 0.02), LINE, 0.5, fill="#ffffff", close=True))
dw.append(line((-6, y + 0.03, z0 + 12.5), (4, y + 0.03, z0 + 12.5), LO, 0.45, extra=' data-free=""'))
dw.append(box(-7, y, z0 + 4, 14, 3.4, 3.2, "mid", r=1.4, sw=0.55))
dw.append(dot((-55, y, z0 + 9), 0.6, LO)); dw.append(dot((55, y, z0 + 9), 0.6, LO))
dw.append(led(z0, y, 5))
A('<g class="drawer">' + "".join(dw) + "</g>")

# ── cable, front half, plug and the pulse that runs along it ──
A(cable(CF))
A(box(-51.5, 10, 38.6, 7, 6, 6.8, "ink", r=0.6, sw=0.5))
pd = path([P(*p) for p in CF], False)
A(f'<path class="pulse" d="{pd}" pathLength="100" stroke="{LIT}" stroke-width="{2.6 * iso.K / 1.3:.2f}" fill="none" stroke-linecap="round" stroke-dasharray="14 100" stroke-dashoffset="114"/>')

# ── right panel, header, top plate ──
A(box(60, -72, 8, 4, 86, 138, "paper"))
for k in range(9):
    A(poly3(slot_x(-58, -26, 100 + 4.4 * k, 64.03, 1.6), LO, 0.45, close=True))
A(line((64, -72, 78), (64, 14, 78), FAINT, 0.55)); A(line((60, 14, 78), (64, 14, 78), FAINT, 0.55))
for yy, zz in [(-66, 14), (8, 14), (-66, 140), (8, 140)]:
    A(dot((64.05, yy, zz), 0.6, LO))
A(poly3(face_x(-20, 4, 22, 34, 64.04), LO, 0.5, fill="#ffffff", close=True))
A(line((64.05, -17, 30), (64.05, -2, 30), LO, 0.45, extra=' data-free=""')); A(line((64.05, -17, 26.5), (64.05, -8, 26.5), LO, 0.45, extra=' data-free=""'))
A(box(-60, 10, 140, 120, 4, 6, "paper", sw=0.7))
A(box(-66, -74, 146, 132, 90, 6, "mid", r=2))
A(poly3([(x, y, 152) for x, y in rrect(-61, -69, 122, 80, 1.5)], FAINT, 0.45, close=True))
for x, y in [(-62, -70), (62, -70), (-62, 12), (62, 12)]:
    A(dot((x, y, 152), 0.6, LO))

# ── dial gauge on top: hours drawn down from a 40-hour block ──
DX, DY = 34, -40
A(cyl(DX, DY, 17, 152, 3, "mid", 40, sw=0.6))
A(box(DX + 15, DY - 3, 153.5, 6, 6, 5, "mid", r=0.8, sw=0.5))
A(cyl(DX, DY, 15, 155, 7, "paper", 48, sw=0.7))
A(poly3(circ_z(DX, DY, 13.2, 162, 48), LO, 0.5, close=True))
for k in range(40):
    a = -math.pi / 2 + 2 * math.pi * k / 40
    r1 = 9.6 if k % 5 == 0 else 11.0
    A(line((DX + r1 * math.cos(a), DY + r1 * math.sin(a), 162), (DX + 12.6 * math.cos(a), DY + 12.6 * math.sin(a), 162), LINE if k % 5 == 0 else LO, 0.45 if k % 5 else 0.6))
A(f'<g transform="{plane_top(DX, DY, 162.1)}"><g class="needle">'
  f'<g class="n"><path d="M-2.4 0 L10.6 0" stroke="{LINE}" stroke-width="1.1" vector-effect="non-scaling-stroke" stroke-linecap="round"/></g>'
  f'<g class="l"><path d="M-2.4 0 L10.6 0" stroke="{LIT}" stroke-width="1.5" vector-effect="non-scaling-stroke" stroke-linecap="round"/></g>'
  f'</g><circle r="1.5" fill="#ffffff" stroke="{LINE}" stroke-width="0.7" vector-effect="non-scaling-stroke"/></g>')

# ── printer on top: every block ends in something written ──
A(box(-46, -46, 152, 38, 34, 12, "paper", r=2))
A(poly3([(x, y, 164) for x, y in rrect(-43, -43, 32, 28, 1)], FAINT, 0.45, close=True))
A(poly3(slot_y(-42, -12, 160, -11.98, 1.3), LINE, 0.5, fill="#30353d", close=True))
A(box(-44, -12, 152, 34, 20, 5.4, "mid", r=1, sw=0.6))
clip = [P(x, y, 158) for x, y in [(-60, -12), (10, -12), (10, 30), (-60, 30)]]
paper = box(-40, -38, 157.6, 26, 24, 0.5, "paper", sw=0.5, crease=False)
for k, L in enumerate([18, 22, 14, 20]):
    paper += line((-37, -34 + 4.8 * k, 158.2), (-37 + L, -34 + 4.8 * k, 158.2), LO, 0.45, extra=' data-free=""')
paperl = box(-40, -38, 157.6, 26, 24, 0.5, "lit", sw=0.5, crease=False)
A(f'<clipPath id="pc"><path d="{path(clip)}"/></clipPath><g clip-path="url(#pc)"><g class="paper"><g class="n">{paper}</g><g class="l">{paperl}</g></g></g>')

# ── assemble ──
x0, y0, x1, y1 = iso.BOUNDS
pad = 10
W, H = x1 - x0 + 2 * pad, y1 - y0 + 2 * pad
body = "".join(o)
svg = (f'<svg viewBox="{f(x0 - pad)} {f(y0 - pad)} {f(W)} {f(H)}" width="{f(W)}" height="{f(H)}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="An equipment cabinet on a bench: trays for accounts, a guardrail bar, a card drawer, a dial and a printer on top, a trolley and a private cable.">'
       f'<defs><filter id="halo" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9"/></filter></defs>{body}</svg>')
open(OUT, "w").write(svg)
mv = {"mig": [round(-dx, 1), round(-dy, 1)], "drawer": [round(v, 1) for v in move_y(DRAWER)], "lift": [round(v, 1) for v in move_z(9)],
      "lock": [round(v, 1) for v in move_z(22)], "paper": [round(v, 1) for v in move_y(24)], "W": round(W), "H": round(H)}
print(json.dumps(mv), len(svg))
