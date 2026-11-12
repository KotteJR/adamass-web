# Four service figures in the Anatomy style: real objects whose motion is the explanation.
# Writes v6/figs.json: {id: {svg, css, w, h}}.
import sys, json, math
sys.path.insert(0, "/private/tmp/claude-501/-Users-aleksandarkotevski-Library-Application-Support-Claude-scratch-workspaces-86fa8aec-a9c5-48c3-8ba3-d5783d7de619-e3116774-42dd-42bc-a238-1515e779fa24-scratch-2026-11-11-84e6d2/e3e40e52-5b1a-454d-bc1a-4f8ac9aa0348/scratchpad/v4")
import iso
from iso import *

SP = "/private/tmp/claude-501/-Users-aleksandarkotevski-Library-Application-Support-Claude-scratch-workspaces-86fa8aec-a9c5-48c3-8ba3-d5783d7de619-e3116774-42dd-42bc-a238-1515e779fa24-scratch-2026-11-11-84e6d2/e3e40e52-5b1a-454d-bc1a-4f8ac9aa0348/scratchpad"
iso.K = 1.45
OUT = {}


def reset():
    iso.BOUNDS[:] = [1e9, 1e9, -1e9, -1e9]


def bench(x, y, w, d):
    s = []
    hb = [P(px, py, -16) for px, py in rrect(x - 6, y - 6, w + 12, d + 12, 12)]
    s.append(f'<path d="{path(hull(hb))}" fill="#1c2a3a" opacity="0.09" filter="url(#hl)"/>')
    feet = [(x + 16, y + 16), (x + w - 16, y + 16), (x + 16, y + d - 16), (x + w - 16, y + d - 16)]
    for fx, fy in sorted(feet, key=lambda p: p[0] + p[1]):
        s.append(cyl(fx, fy, 6.5, -15, 1.5, "lo", 22, sw=0.55))
        s.append(cyl(fx, fy, 4.8, -13.5, 5.5, "mid", 22, sw=0.55))
    s.append(box(x, y, -8, w, d, 8, "lo", r=8, sw=0.85))
    s.append(poly3([(a, b, 0) for a, b in rrect(x + 6, y + 6, w - 12, d - 12, 4)], LO, 0.5, close=True))
    for sx, sy in [(x + 11, y + 11), (x + w - 11, y + 11), (x + 11, y + d - 11), (x + w - 11, y + d - 11)]:
        s.append(poly3(circ_z(sx, sy, 2, 0, 16), LO, 0.45, close=True)); s.append(dot((sx, sy, 0), 0.5, LO))
    return "".join(s)


def ruler(x0, x1, y):
    s = [box(x0, y, 0, x1 - x0, 6, 0.7, "paper", r=1, sw=0.5, crease=False)]
    for i, x in enumerate(range(int(x0) + 4, int(x1) - 2, 4)):
        L = 3.8 if i % 5 == 0 else 2.1
        s.append(line((x, y + 0.4, 0.7), (x, y + 0.4 + L, 0.7), LINE if i % 5 == 0 else LO, 0.45))
    return "".join(s)


def finish(fid, body, css, aria):
    x0, y0, x1, y1 = iso.BOUNDS
    pad = 8
    W, H = x1 - x0 + 2 * pad, y1 - y0 + 2 * pad
    svg = (f'<svg class="iso-{fid}" viewBox="{f(x0 - pad)} {f(y0 - pad)} {f(W)} {f(H)}" width="{f(W)}" height="{f(H)}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="{aria}" style="display:block;max-width:100%;height:auto">'
           f'<defs><filter id="hl" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="8"/></filter></defs>{body}</svg>')
    OUT[fid] = {"svg": svg, "css": css, "w": round(W), "h": round(H)}


def mv(dx=0, dy=0, dz=0):
    a = move_x(dx); b = move_y(dy); c = move_z(dz)
    return (round(a[0] + b[0] + c[0], 1), round(a[1] + b[1] + c[1], 1))


# ═════════ Fig 1 · Embedded delivery: our station joins your line ═════════
reset()
o = []
o.append(bench(-150, -74, 300, 168))
o.append(ruler(-120, 100, 80))
# your team's stations, behind the belt
def station(x, lit=False, tall=False):
    tone = "lit" if lit else "paper"
    h = 44 if tall else 28
    s = box(x, -52, 0, 40, 30, h, tone, r=1.5)
    s += poly3(face_y(x + 6, x + 34, 8, h - 6, -21.98), LINE if not lit else "#1b3656", 0.5, fill="#ffffff" if not lit else "#cfe0f2", close=True)
    s += line((x + 9, -21.97, h - 10), (x + 26, -21.97, h - 10), LO, 0.45, extra=' data-free=""')
    s += line((x + 9, -21.97, h - 14), (x + 20, -21.97, h - 14), LO, 0.45, extra=' data-free=""')
    s += dot((x + 31, -21.95, 4.5), 1.1, "#2f6fb0" if lit else FAINT)
    return s
for i, sx in enumerate([-118, -62, 2, 58]):
    o.append(station(sx, lit=(i == 2), tall=(i == 2)))
# conveyor: frame, belt, end caps, slats
o.append(box(-132, 10, 0, 264, 36, 12, "mid", r=1.5))
o.append(box(-130, 12, 12, 260, 32, 1.4, "lo", sw=0.55, crease=False))
for x in range(-122, 126, 12):
    o.append(line((x, 12.2, 13.4), (x, 43.8, 13.4), FAINT, 0.5))
o.append(box(-142, 8, 0, 10, 40, 17, "paper", r=2))
o.append(box(132, 8, 0, 10, 40, 17, "paper", r=2))
for ex in (-137, 137):
    o.append(poly3(circ_y(ex, 9, 3.2, 48.02, 14), LO, 0.45, close=True))
# parcels: work items riding the belt; the top turns blue after our station has stamped it
PX0, TRAVEL = -128, 236
def parcel():
    n = box(PX0, 20, 13.4, 16, 16, 12, "paper", r=1, sw=0.6)
    n += line((PX0 + 8, 20, 25.4), (PX0 + 8, 36, 25.4), LO, 0.45)
    l = poly3([(PX0 + a, 20 + b, 25.45) for a, b in rrect(0, 0, 16, 16, 1)], "#1b3656", 0.6, fill="#7aa2d2", close=True)
    return f'<g class="f1-p">{n}<g class="f1-done">{l}</g></g>'
o.append(f'<g class="f1-belt">{parcel()}{parcel()}{parcel()}</g>')
# our arm and stamp, drawn over the belt
o.append(box(16, -36, 44, 10, 64, 6, "lit", r=1, sw=0.6))
o.append(f'<g class="f1-stamp">' + box(13, 20, 30, 16, 16, 10, "lit", r=1.5, sw=0.6) + box(18.5, 25.5, 40, 5, 5, 4, "lit", sw=0.5) + '</g>')
o.append(box(16, 22, 47, 10, 10, 1.5, "lit", sw=0.5))
d1 = mv(dx=TRAVEL)
PRESS = round(iso.K * 3.2, 1)
css1 = f"""
.iso-f1 .f1-p{{animation:f1p 6s linear infinite}}
.iso-f1 .f1-p:nth-child(2){{animation-delay:-2s}}.iso-f1 .f1-p:nth-child(3){{animation-delay:-4s}}
@keyframes f1p{{0%{{transform:translate(0,0);opacity:0}}4%{{opacity:1}}94%{{opacity:1}}100%{{transform:translate({d1[0]}px,{d1[1]}px);opacity:0}}}}
.iso-f1 .f1-done{{animation:f1d 6s linear infinite;opacity:0}}
.iso-f1 .f1-p:nth-child(2) .f1-done{{animation-delay:-2s}}.iso-f1 .f1-p:nth-child(3) .f1-done{{animation-delay:-4s}}
@keyframes f1d{{0%,64%{{opacity:0}}67%,100%{{opacity:1}}}}
.iso-f1 .f1-stamp{{animation:f1s 2s ease-in-out infinite;animation-delay:-.08s}}
@keyframes f1s{{0%,78%{{transform:translate(0,0)}}88%{{transform:translate(0,{PRESS}px)}}96%,100%{{transform:translate(0,0)}}}}
"""
finish("f1", "".join(o), css1, "A line of workstations with a conveyor; our station stamps each piece of work as it passes.")

# ═════════ Fig 2 · Modernisation: worn pipe sections are swapped for new ones while the flow keeps moving ═════════
reset()
o = []
o.append(bench(-150, -80, 300, 176))
o.append(ruler(-120, 40, 82))
SEG, N = 52, 4
X0 = -SEG * N / 2 - 6
Y0, YD, Z0, ZH = -12, 24, 14, 22
# the pump at the inlet and the tank at the outlet
o.append(box(X0 - 30, -22, 0, 28, 44, 44, "paper", r=2))
o.append(poly3(face_y(X0 - 24, X0 - 8, 10, 34, 22.02), LO, 0.45, fill="#ffffff", close=True))
o.append(f'<g class="f2-led">' + poly3(circ_y(X0 - 16, 28, 2, 22.04, 14), LINE, 0.4, fill="#2f6fb0", close=True) + '</g>')
# supports under the line
for k in range(N + 1):
    sx = X0 + k * SEG
    o.append(box(sx - 4, -8, 0, 8, 16, Z0, "mid", r=1, sw=0.55))
def segment(x, state):
    tone = "lit" if state == "new" else ("lo" if state == "old" else "paper")
    s = box(x, Y0, Z0, SEG - 4, YD, ZH, tone, r=1.5, sw=0.7)
    if state == "old":
        # patches and straps: this part has been mended before
        s += poly3([(x + 10, Y0 + 5, Z0 + ZH + 0.05), (x + 22, Y0 + 5, Z0 + ZH + 0.05), (x + 22, Y0 + 15, Z0 + ZH + 0.05), (x + 10, Y0 + 15, Z0 + ZH + 0.05)], LO, 0.5, fill="#d8d6cf", close=True)
        s += line((x + 30, Y0 + YD + 0.03, Z0 + 2), (x + 36, Y0 + YD + 0.03, Z0 + ZH - 2), LO, 0.5)
        s += line((x + 34, Y0 + YD + 0.03, Z0 + 2), (x + 40, Y0 + YD + 0.03, Z0 + ZH - 2), LO, 0.5)
        for rx in (x + 4, x + SEG - 8):
            s += dot((rx, Y0 + YD + 0.04, Z0 + 4), 0.6, LINE)
    else:
        s += line((x + 4, Y0 + YD + 0.03, Z0 + ZH - 4), (x + SEG - 8, Y0 + YD + 0.03, Z0 + ZH - 4), "#1b3656", 0.45)
    # the window strip where the flow shows
    s += poly3(face_y(x + 3, x + SEG - 7, Z0 + 7, Z0 + 13, Y0 + YD + 0.02), "#1b3656" if state == "new" else LINE, 0.45, fill="#f4f7fb", close=True)
    return s
for k in range(N):
    x = X0 + k * SEG + 2
    o.append(f'<g class="f2-s f2-s{k}"><g class="f2-old">{segment(x, "old")}</g><g class="f2-new">{segment(x, "new")}</g></g>')
    o.append(box(x + SEG - 4, Y0 - 2, Z0 - 2, 4, YD + 4, ZH + 4, "mid", r=1, sw=0.55))     # flange
# the flow: dots travel through the window strip the whole time
L = SEG * N
fy = Y0 + YD + 0.06
dots = "".join(f'<circle class="f2-flow" cx="{f(P(X0 + 4, fy, Z0 + 10)[0])}" cy="{f(P(X0 + 4, fy, Z0 + 10)[1])}" r="1.7" fill="#2f6fb0"/>' for _ in range(6))
o.append(f'<g>{dots}</g>')
o.append(box(X0 + L + 2, -22, 0, 30, 44, 36, "paper", r=2))
o.append(cyl(X0 + L + 17, 0, 9, 36, 3, "mid", 28, sw=0.55))
flow = mv(dx=L - 8)
lift = mv(dz=14)
# each section: old until its phase, then it lifts away as the new one drops in
phases = [(8, 16), (30, 38), (52, 60), (74, 82)]
css2 = """
.iso-f2 .f2-flow{animation:f2f 3s linear infinite}
""" + "".join(f".iso-f2 .f2-flow:nth-child({i + 1}){{animation-delay:-{i * 0.5:.1f}s}}" for i in range(6)) + f"""
@keyframes f2f{{0%{{transform:translate(0,0);opacity:0}}6%,94%{{opacity:1}}100%{{transform:translate({flow[0]}px,{flow[1]}px);opacity:0}}}}
.iso-f2 .f2-led{{animation:f2l 1.2s ease-in-out infinite}}
@keyframes f2l{{50%{{opacity:.35}}}}
"""
for k, (a, b) in enumerate(phases):
    css2 += (f".iso-f2 .f2-s{k} .f2-old{{animation:f2o{k} 9s cubic-bezier(.45,0,.2,1) infinite}}"
             f"@keyframes f2o{k}{{0%,{a}%{{opacity:1;transform:translate(0,0)}}{b}%,95%{{opacity:0;transform:translate({lift[0]}px,{lift[1]}px)}}100%{{opacity:1;transform:translate(0,0)}}}}"
             f".iso-f2 .f2-s{k} .f2-new{{animation:f2n{k} 9s cubic-bezier(.45,0,.2,1) infinite}}"
             f"@keyframes f2n{k}{{0%,{a}%{{opacity:0;transform:translate({lift[0]}px,{lift[1]}px)}}{b}%,95%{{opacity:1;transform:translate(0,0)}}100%{{opacity:0;transform:translate(0,0)}}}}\n")
finish("f2", "".join(o), css2, "A pipeline of four sections between a pump and a tank; worn sections are swapped for new ones one at a time while the flow keeps moving.")

# ═════════ Fig 3 · Diligence: the asset goes through a scanner, then a report comes out ═════════
reset()
o = []
o.append(bench(-150, -84, 300, 184))
o.append(ruler(-120, 0, 86))
# conveyor
o.append(box(-134, -14, 0, 268, 34, 11, "mid", r=1.5))
o.append(box(-132, -12, 11, 264, 30, 1.4, "lo", sw=0.55, crease=False))
for x in range(-124, 128, 12):
    o.append(line((x, -11.8, 12.4), (x, 17.8, 12.4), FAINT, 0.5))
# back pillar of the scanner arch
o.append(box(-4, -30, 0, 8, 10, 74, "paper", r=1))
# the scan field
field = [(0, -18, 13), (0, 22, 13), (0, 22, 64), (0, -18, 64)]
o.append(f'<g class="f3-field">' + poly3(field, "none", 0, fill="#2f6fb0", close=True, op=0, extra=' fill-opacity="0.10"') + '</g>')
# the asset: closed, then seen through while it is inside the arch
AX = -112
def asset(xray=False):
    x0, y0, z0, w, d, h = AX - 13, -9, 12.4, 26, 26, 22
    if not xray:
        s = box(x0, y0, z0, w, d, h, "paper", r=1.5)
        s += line((x0, y0 + d + 0.02, z0 + h - 5), (x0 + w, y0 + d + 0.02, z0 + h - 5), LO, 0.45)
        s += poly3(face_y(x0 + 5, x0 + 15, z0 + 4, z0 + 10, y0 + d + 0.03), LO, 0.45, fill="#ffffff", close=True)
        return s
    s = poly3([(x0, y0, z0), (x0 + w, y0, z0), (x0 + w, y0 + d, z0), (x0, y0 + d, z0)], "#2f6fb0", 0.6, fill="#eaf1fa", close=True)
    for (a, b, c) in [(x0 + 4, y0 + 4, 0), (x0 + 15, y0 + 5, 0), (x0 + 6, y0 + 15, 0)]:
        pass
    # three parts inside: architecture, data, team
    s += box(x0 + 3, y0 + 3, z0, 9, 9, 15, "lit", r=1, sw=0.5)
    s += box(x0 + 14, y0 + 3, z0, 9, 9, 9, "lit", r=1, sw=0.5)
    s += box(x0 + 5, y0 + 14, z0, 16, 9, 6, "lit", r=1, sw=0.5)
    corners = [(x0, y0), (x0 + w, y0), (x0 + w, y0 + d), (x0, y0 + d)]
    s += poly3([(a, b, z0 + h) for a, b in corners], "#2f6fb0", 0.7, close=True)
    for a, b in corners[1:]:
        s += line((a, b, z0), (a, b, z0 + h), "#2f6fb0", 0.6)
    s += poly3([(x0, y0 + d, z0), (x0 + w, y0 + d, z0), (x0 + w, y0, z0)], "#2f6fb0", 0.7)
    return s
o.append(f'<g class="f3-a"><g class="f3-closed">{asset()}</g><g class="f3-xray">{asset(True)}</g></g>')
# the scan line sweeping down the field
sl = [P(0, -18, 64), P(0, 22, 64)]
o.append(f'<line class="f3-scan" x1="{f(sl[0][0])}" y1="{f(sl[0][1])}" x2="{f(sl[1][0])}" y2="{f(sl[1][1])}" stroke="#2f6fb0" stroke-width="1.6" stroke-linecap="round"/>')
# front pillar and the top beam with its scanner head
o.append(box(-4, 22, 0, 8, 10, 74, "paper", r=1))
o.append(box(-7, -33, 74, 14, 68, 9, "paper", r=1.5))
o.append(box(-5, -20, 70, 10, 44, 4, "mid", r=1, sw=0.55))
o.append(f'<g class="f3-led">' + poly3(circ_y(0, 78.5, 1.8, 35.04, 14), LINE, 0.4, fill="#2f6fb0", close=True) + '</g>')
# the report tray and the report that comes out
o.append(box(58, 40, 0, 56, 36, 4, "mid", r=1.5))
rep = box(62, 44, 4, 48, 28, 0.8, "paper", sw=0.5, crease=False)
for k, col in enumerate(["#24a26a", "#e0a33a", "#24a26a"]):
    yy = 50 + 8 * k
    rep += line((68, yy, 4.9), (92, yy, 4.9), LO, 0.5, extra=' data-free=""')
    rep += dot((100, yy, 4.9), 1.6, col)
o.append(f'<g class="f3-rep">{rep}</g>')
trav = mv(dx=224)
mid = mv(dx=112)
drop = mv(dz=-50)
css3 = f"""
.iso-f3 .f3-a{{animation:f3a 9s cubic-bezier(.45,0,.2,1) infinite}}
@keyframes f3a{{0%{{transform:translate(0,0);opacity:0}}4%{{opacity:1}}28%,56%{{transform:translate({mid[0]}px,{mid[1]}px);opacity:1}}80%{{transform:translate({trav[0]}px,{trav[1]}px);opacity:1}}86%,100%{{transform:translate({trav[0]}px,{trav[1]}px);opacity:0}}}}
.iso-f3 .f3-xray{{animation:f3x 9s ease infinite}}
@keyframes f3x{{0%,26%{{opacity:0}}31%,54%{{opacity:1}}59%,100%{{opacity:0}}}}
.iso-f3 .f3-closed{{animation:f3c 9s ease infinite}}
@keyframes f3c{{0%,26%{{opacity:1}}31%,54%{{opacity:0}}59%,100%{{opacity:1}}}}
.iso-f3 .f3-scan{{animation:f3s 9s cubic-bezier(.45,0,.55,1) infinite}}
@keyframes f3s{{0%,28%{{transform:translate(0,0);opacity:0}}30%{{opacity:1}}42%{{transform:translate(0,{drop[1]:.1f}px)}}54%{{transform:translate(0,0);opacity:1}}56%,100%{{opacity:0}}}}
.iso-f3 .f3-field{{animation:f3g 9s ease infinite}}
@keyframes f3g{{0%,26%{{opacity:.35}}31%,54%{{opacity:1}}59%,100%{{opacity:.35}}}}
.iso-f3 .f3-rep{{animation:f3r 9s cubic-bezier(.2,.7,.2,1) infinite}}
@keyframes f3r{{0%,60%{{opacity:0;transform:translate(0,-10px)}}68%,94%{{opacity:1;transform:translate(0,0)}}100%{{opacity:0;transform:translate(0,0)}}}}
.iso-f3 .f3-led{{animation:f3l 9s ease infinite}}
@keyframes f3l{{0%,28%{{opacity:.3}}31%,55%{{opacity:1}}58%,100%{{opacity:.3}}}}
"""
finish("f3", "".join(o), css3, "A closed box rides a conveyor through a scanner arch; inside, it turns see-through to show three parts, then a report with three verdict marks comes out.")

# ═════════ Fig 4 · GenAI: the model is seated into your board and wired to your systems ═════════
reset()
o = []
o.append(bench(-150, -96, 300, 196))
# traces from the socket to three systems, drawn on the board
routes = [[(-24, -6, 0.3), (-70, -6, 0.3), (-70, -50, 0.3), (-92, -50, 0.3)],
          [(24, -6, 0.3), (70, -6, 0.3), (70, -50, 0.3), (82, -50, 0.3)],
          [(-6, 24, 0.3), (-6, 52, 0.3), (-72, 52, 0.3)]]
for r in routes:
    o.append(poly3(r, LO, 1.1))
pulse = "".join(f'<path class="f4-pulse" d="{path([P(*q) for q in r], False)}" pathLength="100" stroke="#2f6fb0" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-dasharray="12 100" stroke-dashoffset="112"/>' for r in routes)
o.append(f'<g class="f4-pulses">{pulse}</g>')
def system(x, y, w=44, d=30, h=22):
    s = box(x, y, 0, w, d, h, "paper", r=1.5)
    s += poly3(face_y(x + 6, x + w - 14, 6, h - 6, y + d + 0.02), LO, 0.45, fill="#ffffff", close=True)
    s += dot((x + w - 7, y + d + 0.03, h / 2), 1.1, FAINT)
    for k in range(3):
        s += line((x + 8 + 8 * k, y + 4, h), (x + 8 + 8 * k, y + d - 4, h), FAINT, 0.45)
    return s
o.append(system(-136, -76))
o.append(system(82, -76))
# the socket
o.append(box(-26, -22, 0, 52, 44, 6, "mid", r=2))
for i in range(6):
    for j in range(5):
        o.append(dot((-17 + 7 * i, -14 + 7 * j, 6), 0.55, LO))
# the model module, lowered into the socket
chip = box(-19, -15, 6, 38, 30, 8, "lit", r=2, sw=0.7)
chip += poly3([(a, b, 14) for a, b in rrect(-13, -9, 26, 18, 1.5)], "#1b3656", 0.5, close=True)
for k in range(4):
    chip += line((-9 + 6 * k, -6, 14), (-9 + 6 * k, 6, 14), "#c9daf0", 0.5)
o.append(f'<g class="f4-chip">{chip}</g>')
o.append(system(-116, 40))
lift4 = mv(dz=34)
css4 = f"""
.iso-f4 .f4-chip{{animation:f4c 7s cubic-bezier(.45,0,.2,1) infinite}}
@keyframes f4c{{0%,10%{{transform:translate({lift4[0]}px,{lift4[1]}px)}}36%,88%{{transform:translate(0,0)}}100%{{transform:translate({lift4[0]}px,{lift4[1]}px)}}}}
.iso-f4 .f4-pulses{{animation:f4p 7s linear infinite}}
@keyframes f4p{{0%,36%{{opacity:0}}40%,86%{{opacity:1}}92%,100%{{opacity:0}}}}
.iso-f4 .f4-pulse{{animation:f4d 1.4s linear infinite}}
.iso-f4 .f4-pulse:nth-child(2){{animation-delay:-.45s}}.iso-f4 .f4-pulse:nth-child(3){{animation-delay:-.9s}}
@keyframes f4d{{from{{stroke-dashoffset:112}}to{{stroke-dashoffset:0}}}}
"""
finish("f4", "".join(o), css4, "A board with three systems; a model module is lowered into the socket and signals run out along the traces.")

json.dump(OUT, open(SP + "/v6/figs.json", "w"))
print({k: (v["w"], v["h"], len(v["svg"])) for k, v in OUT.items()})
