# "The model" figures for the three modals, in the cabinet's isometric style: paper solids, thin lines, one lit blue.
# Objects sit along a screen-horizontal line: pos(u, v) puts u across the screen and v in depth.
# A: Compliance SLM, two retrieval paths into one extraction, then a reviewer signs.
# B: Murmur, lofi and noise in, ~90% of the layers retrained, a loop with no seam out.
# C: Morrow, drafts run through solvers, most drop out, eleven make the morning.
# D: Adamass Studio, a photo goes in, the model paints it flat, each colour is found in turn.
import math, sys, os
sys.path.insert(0, os.path.dirname(__file__))
import iso
from iso import box, cyl, prism, line, poly3, dot, face_y, face_x, circ_z, plane_top, path, P, rrect, LINE, LO, FAINT, LIT, f, hull

T = 9.0
def pc(t):
    return f"{max(0, min(100, t / T * 100)):.2f}%"
def kf(name, stops):
    stops = sorted(stops, key=lambda s: s[0])
    out, last = [], None
    for t, body in stops:
        q = pc(t)
        if q == last:
            out[-1] = f"{q}{{{body}}}"
        else:
            out.append(f"{q}{{{body}}}")
        last = q
    return f"@keyframes {name}{{" + "".join(out) + "}"

def pos(u, v=0.0):
    return (u + v, -u + v)

def sv(dx, dy, dz=0.0):
    """screen offset of a 3D displacement"""
    K = iso.K
    return ((dx - dy) * iso.C * K, ((dx + dy) * iso.S - dz) * K)

def tr(v):
    return f"translate({v[0]:.1f}px,{v[1]:.1f}px)"

def bx(u, v, z, w, d, h, tone="paper", r=0, **kw):
    x, y = pos(u, v)
    return box(x - w / 2, y - d / 2, z, w, d, h, tone, r=r, **kw)

def floor_line(a, b, z=0.3, cls="", col=FAINT, sw=1.1):
    pa, pb = P(*pos(*a), z), P(*pos(*b), z)
    c = f' class="{cls}"' if cls else ""
    return f'<path{c} d="M{f(pa[0])} {f(pa[1])} L{f(pb[0])} {f(pb[1])}" stroke="{col}" stroke-width="{sw}" stroke-linecap="round" fill="none"/>'

def pulse_line(a, b, cls, z=0.3):
    pa, pb = P(*pos(*a), z), P(*pos(*b), z)
    return (f'<path class="{cls}" d="M{f(pa[0])} {f(pa[1])} L{f(pb[0])} {f(pb[1])}" pathLength="100" stroke="{LIT}" stroke-width="2.4" '
            f'stroke-linecap="round" fill="none" stroke-dasharray="14 100" stroke-dashoffset="128"/>')

def halo(u0, u1, v0=-26, v1=26):
    return ""

def shadow(u, v, w, d):
    x, y = pos(u, v)
    pts = [P(x + a, y + b, 0) for a in (-w / 2 - 3, w / 2 + 3) for b in (-d / 2 - 3, d / 2 + 3)]
    return f'<path d="{path(hull(pts))}" fill="#1c2a3a" opacity="0.10" filter="url(#mh)"/>'

def wrap(body, cls, label):
    x0, y0, x1, y1 = iso.BOUNDS
    pad = 8
    W, H = x1 - x0 + 2 * pad, y1 - y0 + 2 * pad
    return (f'<svg class="{cls}" viewBox="{f(x0 - pad)} {f(y0 - pad)} {f(W)} {f(H)}" width="{f(W)}" height="{f(H)}" role="img" aria-label="{label}" '
            f'style="display:block;width:100%;height:auto;overflow:visible"><defs><filter id="mh" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="4"/></filter></defs>{body}</svg>')

def reset(K):
    iso.K = K
    iso.BOUNDS[:] = [1e9, 1e9, -1e9, -1e9]

# ───────────────────────────────────────────────────────── A: Compliance SLM
def fig_slm():
    reset(1.32)
    o = [halo(-14, 170)]
    A = o.append
    LU, LV = 6, -24        # library
    RU, RV = 0, 20         # regulation
    PU, PV = 92, 0         # extraction
    OU, OV = 150, 6        # output tray
    # floor lines with pulses
    A(floor_line((LU + 16, LV + 4), (PU - 18, PV - 6)))
    A(floor_line((RU + 16, RV - 4), (PU - 18, PV + 6)))
    A(pulse_line((LU + 16, LV + 4), (PU - 18, PV - 6), "pa"))
    A(pulse_line((RU + 16, RV - 4), (PU - 18, PV + 6), "pb"))
    A(shadow(LU, LV, 30, 24) + shadow(RU, RV, 28, 22) + shadow(PU, PV, 34, 34) + shadow(OU, OV, 32, 24))
    # library: a card cabinet, one card lifts
    lx, ly = pos(LU, LV)
    A(box(lx - 15, ly - 12, 0, 30, 24, 22, "paper", r=1))
    for k in range(2):
        A(poly3(face_y(lx - 12, lx + 12, 4 + 9 * k, 11 + 9 * k, ly + 12.02), LO, 0.5, close=True))
        A(box(lx - 4, ly + 12, 6.4 + 9 * k, 8, 1.6, 2, "mid", r=0.6, sw=0.4))
    A(poly3([(x, y, 22) for x, y in rrect(lx - 13, ly - 10, 26, 20, 1)], FAINT, 0.45, close=True))
    for k in range(6):
        yy = ly - 8 + 3.2 * k
        card = box(lx - 11, yy, 22, 22, 0.8, 8, "paper", sw=0.45, crease=False) + box(lx - 9 + 5 * (k % 3), yy, 30, 6, 0.8, 2, "paper", sw=0.4, crease=False)
        if k == 3:
            cl = box(lx - 11, yy, 22, 22, 0.8, 8, "lit", sw=0.45, crease=False) + box(lx - 9 + 5 * (k % 3), yy, 30, 6, 0.8, 2, "lit", sw=0.4, crease=False)
            A(f'<g class="libcard"><g class="n">{card}</g><g class="l">{cl}</g></g>')
        else:
            A(card)
    # regulation: a stack of pages, a scan line passes over the top one
    rx, ry = pos(RU, RV)
    for k in range(5):
        A(box(rx - 14 + 0.6 * k, ry - 11 - 0.4 * k, 1.3 * k, 28, 22, 1.3, "paper", sw=0.5, crease=False))
    zt = 6.5
    for k, L in enumerate([18, 22, 14, 20, 10]):
        A(line((rx - 10, ry - 9 + 3.6 * k, zt), (rx - 10 + L, ry - 9 + 3.6 * k, zt), LO, 0.45))
    A(f'<g class="scanA">{line((rx - 11, ry - 11.5, zt + 0.2), (rx - 11, ry + 9.5, zt + 0.2), LIT, 1.6)}</g>')
    # extraction press
    px, py = pos(PU, PV)
    A(box(px - 17, py - 17, 0, 34, 34, 24, "paper", r=1.2))
    A(poly3(face_y(px - 10, px + 10, 9, 17, py + 17.02), LINE, 0.5, fill="#ffffff", close=True))
    A(f'<g class="win">' + poly3(face_y(px - 10, px + 10, 9, 17, py + 17.03), LIT, 0, fill=LIT, close=True) + "</g>")
    A(poly3(face_x(py - 8, py + 8, 3, 6, px + 17.02), LINE, 0.5, fill="#30353d", close=True))
    A(cyl(px, py, 3, 24, 16, "mid", 20, sw=0.5))
    A(f'<g class="head">' + box(px - 11, py - 11, 30, 22, 22, 7, "mid", r=1, sw=0.6) + "</g>")
    # output tray, the card that comes out, the reviewer's stamp
    ox, oy = pos(OU, OV)
    A(box(ox - 16, oy - 12, 0, 32, 24, 3, "mid", r=1.4, sw=0.6))
    cd = box(ox - 11, oy - 8, 3, 22, 16, 0.9, "paper", sw=0.5, crease=False)
    for k, L in enumerate([12, 16, 9]):
        cd += line((ox - 8, oy - 5 + 3.6 * k, 3.95), (ox - 8 + L, oy - 5 + 3.6 * k, 3.95), LO, 0.45)
    ok = f'<g class="ok" transform="{plane_top(ox + 5, oy + 4, 3.96)}"><circle r="3.4" fill="none" stroke="{LIT}" stroke-width="1.3"/><path d="M-1.6 0.1 L-0.4 1.3 L1.8 -1.2" stroke="{LIT}" stroke-width="1.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>'
    A(f'<g class="outcard">{cd}{ok}</g>')
    st = cyl(ox + 5, oy + 4, 5.5, 20, 3, "lit", 24, sw=0.5) + cyl(ox + 5, oy + 4, 2.2, 23, 9, "mid", 16, sw=0.5) + cyl(ox + 5, oy + 4, 4, 32, 4.5, "paper", 20, sw=0.5)
    A(f'<g class="stamp">{st}</g>')
    body = "".join(o)
    css = ""
    dcard = sv(-30, 0)
    css += kf("slmScan", [(0, "transform:translate(0,0);opacity:0"), (0.2, "transform:translate(0,0);opacity:1"), (2.4, f"transform:{tr(sv(21, 0))};opacity:1"), (2.5, f"transform:{tr(sv(21, 0))};opacity:0"), (T, "transform:translate(0,0);opacity:0")])
    css += kf("slmLib", [(0, "transform:translate(0,0)"), (0.6, "transform:translate(0,0)"), (1.4, f"transform:{tr(sv(0, 0, 9))}"), (3.0, f"transform:{tr(sv(0, 0, 9))}"), (3.6, "transform:translate(0,0)"), (T, "transform:translate(0,0)")])
    css += kf("slmLibL", [(0, "opacity:0"), (0.8, "opacity:0"), (1.2, "opacity:1"), (3.4, "opacity:1"), (3.8, "opacity:0"), (T, "opacity:0")])
    css += kf("slmPulse", [(0, "stroke-dashoffset:128"), (2.0, "stroke-dashoffset:128"), (3.3, "stroke-dashoffset:14"), (T, "stroke-dashoffset:14")])
    css += kf("slmHead", [(0, "transform:translate(0,0)"), (3.3, "transform:translate(0,0)"), (3.7, f"transform:{tr(sv(0, 0, -5))}"), (4.1, "transform:translate(0,0)"), (T, "transform:translate(0,0)")])
    css += kf("slmWin", [(0, "opacity:0"), (3.4, "opacity:0"), (3.7, "opacity:.85"), (4.6, "opacity:0"), (T, "opacity:0")])
    css += kf("slmOut", [(0, f"transform:{tr(dcard)};opacity:0"), (4.1, f"transform:{tr(dcard)};opacity:0"), (4.3, f"transform:{tr(dcard)};opacity:1"), (5.3, "transform:translate(0,0);opacity:1"), (8.4, "transform:translate(0,0);opacity:1"), (8.8, "transform:translate(0,0);opacity:0"), (T, f"transform:{tr(dcard)};opacity:0")])
    css += kf("slmStamp", [(0, "transform:translate(0,0)"), (5.7, "transform:translate(0,0)"), (6.2, f"transform:{tr(sv(0, 0, -16.1))}"), (6.5, f"transform:{tr(sv(0, 0, -16.1))}"), (7.1, "transform:translate(0,0)"), (T, "transform:translate(0,0)")])
    css += kf("slmOk", [(0, "opacity:0"), (6.3, "opacity:0"), (6.5, "opacity:1"), (8.4, "opacity:1"), (8.7, "opacity:0"), (T, "opacity:0")])
    css += (".slm .scanA{animation:slmScan 9s ease-in-out infinite}.slm .libcard{animation:slmLib 9s cubic-bezier(.45,0,.2,1) infinite}"
            ".slm .libcard .l{opacity:0;animation:slmLibL 9s ease infinite}.slm .pa,.slm .pb{animation:slmPulse 9s linear infinite}"
            ".slm .head{animation:slmHead 9s cubic-bezier(.45,0,.2,1) infinite}.slm .win{opacity:0;animation:slmWin 9s ease infinite}"
            ".slm .outcard{animation:slmOut 9s cubic-bezier(.2,.7,.2,1) infinite}.slm .stamp{animation:slmStamp 9s cubic-bezier(.45,0,.2,1) infinite}"
            ".slm .ok{opacity:0;animation:slmOk 9s ease infinite}")
    return wrap(body, "mf slm", "The regulation is read on one path and the library of risks and controls is searched on the other; both feed one extraction, and a reviewer signs the result"), css

# ───────────────────────────────────────────────────────── B: Murmur
def fig_murmur():
    reset(1.32)
    o = [halo(-20, 182)]
    A = o.append
    TU, MU, LU = 0, 84, 162
    A(floor_line((TU + 20, 0), (MU - 18, 0)))
    A(floor_line((MU + 18, 0), (LU - 20, 0)))
    A(pulse_line((TU + 20, 0), (MU - 18, 0), "pin"))
    A(pulse_line((MU + 18, 0), (LU - 20, 0), "pout"))
    A(shadow(TU, 0, 40, 40) + shadow(MU, 0, 34, 34) + shadow(LU, 0, 40, 40))
    # a turntable: lofi and noise going in
    tx, ty = pos(TU)
    A(box(tx - 20, ty - 20, 0, 40, 40, 7, "mid", r=2))
    A(cyl(tx, ty, 17, 7, 2, "paper", 40, sw=0.6))
    A(cyl(tx, ty, 15.2, 9, 1.4, "ink", 40, sw=0.5))
    for r in (13, 11, 9):
        A(poly3(circ_z(tx, ty, r, 10.45, 40), "#5a616b", 0.4, close=True))
    A(poly3(circ_z(tx, ty, 5, 10.5, 30), LIT, 0, fill=LIT, close=True))
    A(f'<g transform="{plane_top(tx, ty, 10.5)}"><g class="spin"><path d="M5.6 0 L14.4 0" stroke="#ffffff" stroke-width="1.4" stroke-opacity="0.8" stroke-linecap="round" vector-effect="non-scaling-stroke"/></g></g>')
    A(box(tx + 12, ty - 18, 7, 4, 4, 9, "mid", r=1, sw=0.5) + box(tx + 2, ty - 17, 15.5, 13, 2.4, 2.4, "mid", r=1, sw=0.5))
    # the model: ten layers, nine retrained
    mx, my = pos(MU)
    A(cyl(mx, my, 3.6, 0, 62, "mid", 20, sw=0.5))
    for k in range(10):
        z = 2 + 6 * k
        n = box(mx - 17, my - 17, z, 34, 34, 3.4, "paper", r=1.2, sw=0.6)
        if k < 9:
            l = box(mx - 17, my - 17, z, 34, 34, 3.4, "lit", r=1.2, sw=0.6)
            A(f'<g class="ly ly{k}"><g class="n">{n}</g><g class="l">{l}</g></g>')
        else:
            A(n)
    # the loop: a ring with a dot that never meets a seam
    lx, ly = pos(LU)
    A(box(lx - 20, ly - 20, 0, 40, 40, 4, "mid", r=2))
    A(poly3(circ_z(lx, ly, 14, 4.05, 48), LO, 1.1, close=True))
    A(poly3(circ_z(lx, ly, 16.6, 4.05, 48), FAINT, 0.5, close=True))
    A(f'<g transform="{plane_top(lx, ly, 4.1)}"><g class="orbit"><circle cx="14" cy="0" r="2.6" fill="{LIT}" stroke="#ffffff" stroke-width="0.8"/></g></g>')
    css = ""
    css += kf("muPin", [(0, "stroke-dashoffset:128"), (0.2, "stroke-dashoffset:128"), (1.2, "stroke-dashoffset:14"), (1.3, "stroke-dashoffset:128"), (2.2, "stroke-dashoffset:128"), (3.2, "stroke-dashoffset:14"), (3.3, "stroke-dashoffset:128"), (4.0, "stroke-dashoffset:128"), (5.0, "stroke-dashoffset:14"), (T, "stroke-dashoffset:14")])
    css += kf("muPout", [(0, "stroke-dashoffset:128"), (5.4, "stroke-dashoffset:128"), (6.4, "stroke-dashoffset:14"), (T, "stroke-dashoffset:14")])
    for k in range(9):
        t = 0.9 + 0.48 * k
        css += kf(f"muL{k}", [(0, "opacity:0"), (t, "opacity:0"), (t + 0.35, "opacity:1"), (8.5, "opacity:1"), (8.85, "opacity:0"), (T, "opacity:0")])
        css += f".mur .ly{k} .l{{opacity:0;animation:muL{k} 9s ease infinite}}"
    css += kf("muOrbit", [(0, "opacity:0"), (6.0, "opacity:0"), (6.4, "opacity:1"), (8.6, "opacity:1"), (8.9, "opacity:0"), (T, "opacity:0")])
    css += (".mur .pin{animation:muPin 9s linear infinite}.mur .pout{animation:muPout 9s linear infinite}"
            ".mur .spin{animation:mspin 1.8s linear infinite}@keyframes mspin{to{transform:rotate(360deg)}}"
            ".mur .orbit{animation:mspin 2.4s linear infinite,muOrbit 9s ease infinite}")
    return wrap("".join(o), "mf mur", "Lofi and noise go into the model; nine of its ten layers light up as they are retrained; a loop comes out and goes round without a seam"), css

# ───────────────────────────────────────────────────────── C: Morrow
def fig_morrow():
    reset(1.32)
    o = [halo(-18, 186)]
    A = o.append
    HU, GU, EU, SU = 0, 74, 118, 166
    A(shadow(HU, 0, 34, 34) + shadow(SU, 0, 40, 34) + shadow(EU + 2, 22, 24, 24))
    # hopper of drafts
    hx, hy = pos(HU)
    A(box(hx - 17, hy - 17, 0, 34, 34, 20, "paper", r=1.2))
    for i in range(4):
        for j in range(4):
            A(box(hx - 14 + 7.2 * i, hy - 14 + 7.2 * j, 20, 5.6, 5.6, 3.2, "mid", r=0.8, sw=0.4))
    # belt along the flow, as a rotated slab
    def strip(u0, u1, v0, v1):
        return [pos(u0, v0), pos(u1, v0), pos(u1, v1), pos(u0, v1)]
    A(prism(strip(16, EU, -7, 7), 4, 8, "mid", crease=False, sw=0.6))
    for u in range(22, EU, 12):
        A(line((*pos(u, -7), 8.02), (*pos(u, 7), 8.02), FAINT, 0.5))
    # bin for the ones that fail, in front of the belt's end
    bx_, by_ = pos(EU + 2, 22)
    A(box(bx_ - 12, by_ - 12, 0, 24, 24, 6, "lo", r=1.5, sw=0.6))
    A(poly3([(x, y, 6) for x, y in rrect(bx_ - 9.5, by_ - 9.5, 19, 19, 1)], LO, 0.5, close=True, fill="#d9dbdc"))
    # the gate: back post, moving drafts, front post, beam
    def wall(v0, v1):
        return prism(strip(GU - 8, GU + 8, v0, v1), 0, 22, "paper", crease=False, sw=0.6)
    A(wall(-15, -11))
    T0 = pos(20); T1 = pos(EU - 4)
    run = sv(T1[0] - T0[0], T1[1] - T0[1])
    drop = sv(T1[0] - T0[0] + 6, T1[1] - T0[1] + 12, -8)
    for k in range(4):
        x, y = T0
        A(f'<g class="draft d{k}">' + box(x - 3.6, y - 3.6, 8, 7.2, 7.2, 7.2, "paper", r=0.8, sw=0.5) + "</g>")
    x, y = T0
    A(f'<g class="win">' + box(x - 3.6, y - 3.6, 8, 7.2, 7.2, 7.2, "lit", r=0.8, sw=0.5) + "</g>")
    A(wall(11, 15))
    A(prism(strip(GU - 8, GU + 8, -15, 15), 22, 26, "paper", crease=False, sw=0.6))
    A(f'<g class="gscan">' + poly3([(*pos(GU - 8, 15.02), 4), (*pos(GU + 8, 15.02), 4), (*pos(GU + 8, 15.02), 18), (*pos(GU - 8, 15.02), 18)], LIT, 0, fill=LIT, close=True, extra=' fill-opacity="0.9"') + "</g>")
    # the morning shelf: eleven slots
    sx, sy = pos(SU)
    A(box(sx - 20, sy - 17, 0, 40, 34, 3, "mid", r=1.5, sw=0.6))
    slots = [(i, j) for j in range(3) for i in range(4)][:11]
    for k, (i, j) in enumerate(slots):
        xx, yy = sx - 16 + 9 * i, sy - 13 + 9 * j
        n = box(xx, yy, 3, 6.4, 6.4, 5, "paper", r=0.8, sw=0.45)
        l = box(xx, yy, 3, 6.4, 6.4, 5, "lit", r=0.8, sw=0.45)
        A(f'<g class="sl sl{k}"><g class="n">{n}</g><g class="l">{l}</g></g>')
    css = ""
    css += kf("moRun", [(0, "transform:translate(0,0);opacity:0"), (0.05, "transform:translate(0,0);opacity:1"), (1.9, f"transform:{tr(run)};opacity:1"),
                        (2.35, f"transform:{tr(drop)};opacity:0"), (2.4, f"transform:{tr(drop)};opacity:0"), (2.6, "transform:translate(0,0);opacity:0"), (T, "transform:translate(0,0);opacity:0")])
    # winners: one per round reaches the shelf
    shelf = sv(pos(SU)[0] - T0[0], pos(SU)[1] - T0[1], -5)
    css += kf("moWin", [(0, "transform:translate(0,0);opacity:0"), (5.4, "transform:translate(0,0);opacity:0"), (5.5, "transform:translate(0,0);opacity:1"), (7.3, f"transform:{tr(run)};opacity:1"),
                        (8.0, f"transform:{tr(shelf)};opacity:1"), (8.2, f"transform:{tr(shelf)};opacity:0"), (T, f"transform:{tr(shelf)};opacity:0")])
    css += ".mor .draft{animation:moRun 2.6s linear infinite}.mor .d1{animation-delay:-.65s}.mor .d2{animation-delay:-1.3s}.mor .d3{animation-delay:-1.95s}"
    css += ".mor .win{opacity:0;animation:moWin 9s cubic-bezier(.4,0,.3,1) infinite}"
    css += "@keyframes moGate{0%,100%{opacity:.2}50%{opacity:1}}.mor .gscan{animation:moGate .65s ease-in-out infinite}"
    for k in range(11):
        t = 0.3 + 0.62 * k
        css += kf(f"moS{k}", [(0, "opacity:0"), (t, "opacity:0"), (t + 0.3, "opacity:1"), (8.5, "opacity:1"), (8.85, "opacity:0"), (T, "opacity:0")])
        css += f".mor .sl{k} .l{{opacity:0;animation:moS{k} 9s ease infinite}}"
    return wrap("".join(o), "mf mor", "Drafts leave a hopper on a belt and pass a solver gate; most drop into a bin, and the shelf of eleven fills up"), css

# ───────────────────────────────────────────────────────── A2: Compliance SLM, how it was trained
# Expert-labelled work and synthetic data for the rare labels go in; the model's layers light as it is fine-tuned;
# a held-out gold set lights 94 of 100; a loop runs back for reinforcement learning.
def fig_slm_train():
    reset(1.32)
    o = []
    A = o.append
    PU, PV = 0, 20          # expert-labelled pages
    GU, GV = 6, -24         # synthetic data generator
    MU, TU = 86, 162        # model, gold set
    A(shadow(PU, PV, 28, 22) + shadow(GU, GV, 26, 22) + shadow(MU, 0, 34, 34) + shadow(TU, 0, 40, 40))
    A(floor_line((PU + 16, PV - 4), (MU - 18, 6)))
    A(floor_line((GU + 15, GV + 4), (MU - 18, -6)))
    A(floor_line((MU + 18, 0), (TU - 20, 0)))
    A(pulse_line((PU + 16, PV - 4), (MU - 18, 6), "ta"))
    A(pulse_line((GU + 15, GV + 4), (MU - 18, -6), "tb"))
    A(pulse_line((MU + 18, 0), (TU - 20, 0), "tc"))
    # synthetic data: a small generator with cards coming out of its slot
    gx, gy = pos(GU, GV)
    A(box(gx - 13, gy - 11, 0, 26, 22, 16, "paper", r=1.2))
    A(poly3(face_x(gy - 7, gy + 7, 9, 12, gx + 13.02), LINE, 0.5, fill="#30353d", close=True))
    for k in range(3):
        A(f'<g class="syn s{k}">' + box(gx + 12, gy - 5, 10.5, 9, 10, 0.8, "lit", sw=0.4, crease=False) + "</g>")
    A(cyl(gx - 4, gy - 3, 3.2, 16, 2.5, "mid", 18, sw=0.5))
    # expert-labelled pages, each with a lit tab
    rx, ry = pos(PU, PV)
    for k in range(5):
        A(box(rx - 14 + 0.6 * k, ry - 11 - 0.4 * k, 1.3 * k, 28, 22, 1.3, "paper", sw=0.5, crease=False))
        A(box(rx + 9 + 0.6 * k, ry - 13.5 - 0.4 * k, 1.3 * k + 0.3, 4, 3, 1, "lit", sw=0.35, crease=False))
    for k, L in enumerate([18, 22, 14, 20]):
        A(line((rx - 10, ry - 8 + 3.8 * k, 6.5), (rx - 10 + L, ry - 8 + 3.8 * k, 6.5), LO, 0.45))
    # the model: eight layers, lit as it is fine-tuned
    mx, my = pos(MU)
    A(cyl(mx, my, 3.6, 0, 52, "mid", 20, sw=0.5))
    for k in range(8):
        z = 2 + 6 * k
        n = box(mx - 17, my - 17, z, 34, 34, 3.4, "paper", r=1.2, sw=0.6)
        l = box(mx - 17, my - 17, z, 34, 34, 3.4, "lit", r=1.2, sw=0.6)
        A(f'<g class="tl tl{k}"><g class="n">{n}</g><g class="l">{l}</g></g>')
    # the reinforcement loop: an arc from the gold set back over to the model
    a0, a1 = P(*pos(TU - 4, -6), 14), P(*pos(MU + 6, -6), 50)
    mxp = ((a0[0] + a1[0]) / 2, min(a0[1], a1[1]) - 34)
    arc = f"M{f(a0[0])} {f(a0[1])} Q{f(mxp[0])} {f(mxp[1])} {f(a1[0])} {f(a1[1])}"
    A(f'<path d="{arc}" fill="none" stroke="{FAINT}" stroke-width="1.1" stroke-dasharray="2 4" stroke-linecap="round"/>')
    A(f'<path class="rl" d="{arc}" pathLength="100" fill="none" stroke="{LIT}" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="14 100" stroke-dashoffset="128"/>')
    # the held-out gold set: 100 cells, 94 light, 6 the reviewer corrects
    tx, ty = pos(TU)
    A(box(tx - 20, ty - 20, 0, 40, 40, 4, "mid", r=2))
    misses = {7, 23, 41, 58, 76, 92}
    cells_n, cells_l = "", ""
    for i in range(100):
        r, c = divmod(i, 10)
        u, v = -16.2 + c * 3.4, -16.2 + r * 3.4
        cells_n += f'<rect x="{u:.1f}" y="{v:.1f}" width="2.6" height="2.6" rx="0.6" fill="#ffffff" stroke="{FAINT}" stroke-width="0.25"/>'
    rows = []
    for r in range(10):
        g = "".join(f'<rect x="{-16.2 + c * 3.4:.1f}" y="{-16.2 + r * 3.4:.1f}" width="2.6" height="2.6" rx="0.6" fill="{LIT}"/>' for c in range(10) if r * 10 + c not in misses)
        rows.append(f'<g class="gr gr{r}">{g}</g>')
    A(f'<g transform="{plane_top(tx, ty, 4.05)}">{cells_n}{"".join(rows)}</g>')
    css = ""
    css += kf("slT1", [(0, "stroke-dashoffset:128"), (0.3, "stroke-dashoffset:128"), (1.4, "stroke-dashoffset:14"), (T, "stroke-dashoffset:14")])
    css += kf("slT2", [(0, "stroke-dashoffset:128"), (5.0, "stroke-dashoffset:128"), (5.9, "stroke-dashoffset:14"), (T, "stroke-dashoffset:14")])
    css += kf("slRL", [(0, "stroke-dashoffset:128"), (7.6, "stroke-dashoffset:128"), (8.5, "stroke-dashoffset:14"), (T, "stroke-dashoffset:14")])
    for k in range(3):
        t = 0.2 + 0.45 * k
        css += kf(f"slS{k}", [(0, f"opacity:0;transform:translate(0,0)"), (t, "opacity:1;transform:translate(0,0)"), (t + 0.9, f"opacity:0;transform:{tr(sv(14, 0))}"), (T, f"opacity:0;transform:translate(0,0)")])
        css += f".slt .syn.s{k}{{opacity:0;animation:slS{k} 9s ease-out infinite}}"
    for k in range(8):
        t = 1.4 + 0.42 * k
        css += kf(f"slL{k}", [(0, "opacity:0"), (t, "opacity:0"), (t + 0.3, "opacity:1"), (8.5, "opacity:1"), (8.85, "opacity:0"), (T, "opacity:0")])
        css += f".slt .tl{k} .l{{opacity:0;animation:slL{k} 9s ease infinite}}"
    for r in range(10):
        t = 5.9 + 0.17 * r
        css += kf(f"slG{r}", [(0, "opacity:0"), (t, "opacity:0"), (t + 0.2, "opacity:1"), (8.5, "opacity:1"), (8.85, "opacity:0"), (T, "opacity:0")])
        css += f".slt .gr{r}{{opacity:0;animation:slG{r} 9s ease infinite}}"
    css += ".slt .ta,.slt .tb{animation:slT1 9s linear infinite}.slt .tc{animation:slT2 9s linear infinite}.slt .rl{animation:slRL 9s linear infinite}"
    return wrap("".join(o), "mf slt", "Expert-labelled work and synthetic data feed the model; its layers light as it is fine-tuned; a held-out gold set lights 94 of 100 cells, and a loop runs back for reinforcement learning"), css

# ───────────────────────────────────────────────────────── D: Adamass Studio, paint by numbers
# A framed photo slides into the model; its layers light in turn as it paints the picture flat;
# a scan bar crosses the flat board and the paint pots in front of it open one by one.
# The photo and the board lean back facing the viewer, so their pictures read undistorted.
R2 = math.sqrt(2)

def uv_plan(u0, u1, v0, v1, r=0):
    """A plan rectangle aligned with the flow (u across the screen, v in depth)."""
    return [pos(u, v) for u, v in rrect(u0, v0, u1 - u0, v1 - v0, r)]

def uv_shadow(u0, u1, v0, v1):
    pts = [P(*pos(u, v), 0) for u in (u0 - 2, u1 + 2) for v in (v0 - 2, v1 + 2)]
    return f'<path d="{path(hull(pts))}" fill="#1c2a3a" opacity="0.10" filter="url(#mh)"/>'

def pnb_pulse(a, b, cls, z=0.3):
    """pulse_line with a longer gap: the dash rests past both ends, so no cap shows between runs."""
    pa, pb = P(*pos(*a), z), P(*pos(*b), z)
    return (f'<path class="{cls}" d="M{f(pa[0])} {f(pa[1])} L{f(pb[0])} {f(pb[1])}" pathLength="100" stroke="{LIT}" stroke-width="2.4" '
            f'stroke-linecap="round" fill="none" stroke-dasharray="14 120" stroke-dashoffset="158"/>')

def leaning(uc, vb, zb, a):
    """Points on a card leaning back by angle a from the floor, facing the viewer.
    s runs across (physical units), l up the card from its bottom edge, n out of its face."""
    ca, sa = math.cos(a), math.sin(a)
    def q(s, l, n=0.0):
        x, y = pos(uc + s / R2, vb - l * ca / R2 + n * sa / R2)
        return (x, y, zb + l * sa + n * ca)
    return q

def card_slab(q, w, L, th, front, edge, sw=0.8):
    """The card's face, the sliver of its top edge, and its outline."""
    fq = [q(-w / 2, 0), q(w / 2, 0), q(w / 2, L), q(-w / 2, L)]
    tq = [q(-w / 2, L), q(w / 2, L), q(w / 2, L, -th), q(-w / 2, L, -th)]
    s = poly3(tq, edge, 0, fill=edge, close=True)
    s += poly3(fq, front, 0, fill=front, close=True)
    h = hull([P(*p) for p in fq + tq])
    s += f'<path d="{path(h)}" fill="none" stroke="{LINE}" stroke-width="{sw}" stroke-linejoin="round"/>'
    s += poly3([q(-w / 2, L), q(w / 2, L)], LINE, sw * 0.6, op=0.6)
    return s

def inset(q, w, L, m):
    """Maps the unit square (X right, Y down) onto a card's face, inside a margin m."""
    return lambda X, Y: q(-w / 2 + m + X * (w - 2 * m), L - m - Y * (L - 2 * m), 0.05)

def ring(q, s, l, r, n):
    return [q(s + r * math.cos(2 * math.pi * i / n), l + r * math.sin(2 * math.pi * i / n), 0.05) for i in range(n)]

def pnb_regions():
    """The picture, in the unit square (X right, Y down): sky, sun, far hill, near hill, field."""
    g = lambda X, m, w: math.exp(-((X - m) / w) ** 2)
    def band(fn):
        top = [(i / 32, fn(i / 32)) for i in range(33)]
        return top + [(1, 1), (0, 1)]
    far = band(lambda X: 0.53 - 0.2 * g(X, 0.27, 0.2) - 0.08 * g(X, 0.9, 0.15))
    near = band(lambda X: 0.73 - 0.15 * g(X, 0.7, 0.24))
    field = band(lambda X: 0.88 - 0.03 * g(X, 0.12, 0.3))
    return far, near, field

def fig_pnb():
    reset(1.32)
    o = []
    A = o.append
    PU, MU, BU = 0, 80, 170
    TILT = math.radians(66)
    # photo station: a low base, the framed photo leaning back on it
    PW, PL = 34, 25
    # board station: a low base, the board standing on a ledge, five pots in front
    BW, BL = 64, 40
    BB = (BU - 29, BU + 29, -18, 15)
    pots = [BU - 22 + 11 * k for k in range(5)]
    A(floor_line((PU + 17, 0), (MU - 18, 0)))
    A(floor_line((MU + 18, 0), (BB[0], 0)))
    A(pnb_pulse((PU + 17, 0), (MU - 18, 0), "pi"))
    A(pnb_pulse((MU + 18, 0), (BB[0], 0), "po"))
    A(uv_shadow(PU - 17, PU + 17, -10, 10) + shadow(MU, 0, 34, 34) + uv_shadow(*BB))
    far, near, field = pnb_regions()
    # gradients for the photo: continuous tone, no outlines
    A('<defs>'
      '<linearGradient id="pnbSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a9b1bb"/><stop offset="1" stop-color="#e8ebee"/></linearGradient>'
      '<linearGradient id="pnbFar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#99a0a9"/><stop offset="1" stop-color="#bcc2c9"/></linearGradient>'
      '<linearGradient id="pnbNear" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6c737d"/><stop offset="1" stop-color="#8d939c"/></linearGradient>'
      '<linearGradient id="pnbField" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4e555f"/><stop offset="1" stop-color="#626973"/></linearGradient>'
      '</defs>')
    # ── the photo
    A(prism(uv_plan(PU - 17, PU + 17, -10, 10, 4), 0, 3, "mid", crease=False, sw=0.6))
    A(poly3([(*pos(PU - PW / R2 / 2, 3.6), 3.02), (*pos(PU + PW / R2 / 2, 3.6), 3.02)], LO, 0.6))
    q = leaning(PU, 3, 3, TILT)
    m = 2.4
    ip = inset(q, PW, PL, m)
    ph = card_slab(q, PW, PL, 1.6, "#fbfbfa", "#e8eaed")
    ph += poly3([ip(0, 0), ip(1, 0), ip(1, 1), ip(0, 1)], LO, 0, fill="url(#pnbSky)", close=True)
    sc = (-PW / 2 + m + 0.72 * (PW - 2 * m), PL - m - 0.3 * (PL - 2 * m))
    for r, op in ((3.6, 0.35), (2.3, 1)):
        ph += poly3(ring(q, *sc, r, 28), LO, 0, fill="#ffffff", close=True, op=op, extra=f' fill-opacity="{op}"')
    for band_, grad in ((far, "pnbFar"), (near, "pnbNear"), (field, "pnbField")):
        ph += poly3([ip(X, Y) for X, Y in band_], LO, 0, fill=f"url(#{grad})", close=True)
    ph += poly3([ip(0, 0), ip(1, 0), ip(1, 1), ip(0, 1)], LO, 0.5, close=True)
    A(f'<g class="ph"><g class="phf">{ph}</g></g>')
    # ── the model: eight thin layers that light in turn
    mx, my = pos(MU)
    A(cyl(mx, my, 3.6, 0, 52, "mid", 20, sw=0.5))
    for k in range(8):
        z = 2 + 6 * k
        n = box(mx - 17, my - 17, z, 34, 34, 3.4, "paper", r=1.2, sw=0.6)
        l = box(mx - 17, my - 17, z, 34, 34, 3.4, "lit", r=1.2, sw=0.6)
        A(f'<g class="lz lz{k}"><g class="n">{n}</g><g class="l">{l}</g></g>')
    # ── the board: the same picture as flat, outlined regions
    A(prism(uv_plan(*BB, 4), 0, 3, "mid", crease=False, sw=0.6))
    vb = -2
    qb = leaning(BU, vb, 7, TILT)
    A(card_slab(qb, BW, BL, 2.4, "#ffffff", "#e8eaed"))
    mb = 2.6
    bp = inset(qb, BW, BL, mb)
    tones = ["#eef0f2", "#ffffff", "#dde1e6", "#cfd3d8", "#e6e7e3"]
    A(poly3([bp(0, 0), bp(1, 0), bp(1, 1), bp(0, 1)], LINE, 0.6, fill=tones[0], close=True))
    bsc = (-BW / 2 + mb + 0.72 * (BW - 2 * mb), BL - mb - 0.3 * (BL - 2 * mb))
    A(poly3(ring(qb, *bsc, 4.4, 32), LINE, 0.6, fill=tones[1], close=True))
    for band_, tone in ((far, tones[2]), (near, tones[3]), (field, tones[4])):
        A(poly3([bp(X, Y) for X, Y in band_], LINE, 0.6, fill=tone, close=True))
    A(poly3([bp(0, 0), bp(1, 0), bp(1, 1), bp(0, 1)], LINE, 0.7, close=True))
    # the scan bar, at the board's left edge; it crosses to the right edge
    s0 = -BW / 2 + mb
    A(f'<g class="scan">' + poly3([qb(s0, mb - 0.6, 0.3), qb(s0, BL - mb + 0.6, 0.3)], LIT, 2) + "</g>")
    # the ledge the board stands on
    A(prism(uv_plan(BU - BW / R2 / 2 - 1.5, BU + BW / R2 / 2 + 1.5, vb - 0.4, vb + 2.6, 0.6), 3, 9.2, "paper", crease=False, sw=0.5))
    # five pots, one colour each; a lid lifts and a dot lights as the bar passes
    for k, u in enumerate(pots):
        cx, cy = pos(u, 8.5)
        body = cyl(cx, cy, 5, 3, 7, "paper", 28, sw=0.6)
        body += poly3(circ_z(cx, cy, 4, 10.05, 28), LO, 0.45, fill=tones[k], close=True)
        lid = cyl(cx, cy, 5.4, 10, 1.6, "mid", 28, sw=0.6) + cyl(cx, cy, 1.4, 11.6, 1.1, "mid", 14, sw=0.45)
        fx, fy = cx + 5 / R2, cy + 5 / R2
        dt = dot((fx, fy, 6.5), 1.9, LIT, extra=' stroke="#ffffff" stroke-width="0.7"')
        A(f'<g class="pt pt{k}">{body}<g class="lid">{lid}</g><g class="l">{dt}</g></g>')
    # ── motion
    css = ""
    into = sv(MU - 12 - PU, -(MU - 12 - PU))
    back = sv(-22, 22)
    css += kf("pnPh", [(0, "transform:translate(0,0)"), (0.4, "transform:translate(0,0)"), (2.3, f"transform:{tr(into)}"),
                       (8.3, f"transform:{tr(back)}"), (8.95, "transform:translate(0,0)"), (T, "transform:translate(0,0)")])
    css += kf("pnPhF", [(0, "opacity:1"), (1.8, "opacity:1"), (2.25, "opacity:0"), (8.35, "opacity:0"), (8.9, "opacity:1"), (T, "opacity:1")])
    css += kf("pnPi", [(0, "stroke-dashoffset:158"), (0.2, "stroke-dashoffset:158"), (1.3, "stroke-dashoffset:24"), (T, "stroke-dashoffset:24")])
    css += kf("pnPo", [(0, "stroke-dashoffset:158"), (5.2, "stroke-dashoffset:158"), (6.1, "stroke-dashoffset:24"), (T, "stroke-dashoffset:24")])
    for k in range(8):
        t = 2.3 + 0.4 * k
        css += kf(f"pnL{k}", [(0, "opacity:0"), (t, "opacity:0"), (t + 0.3, "opacity:1"), (8.4, "opacity:1"), (8.8, "opacity:0"), (T, "opacity:0")])
        css += f".pnb .lz{k} .l{{opacity:0;animation:pnL{k} 9s ease infinite}}"
    S0, S1 = 6.1, 8.0
    span = BW - 2 * mb
    css += kf("pnScan", [(0, "transform:translate(0,0);opacity:0"), (S0 - 0.15, "transform:translate(0,0);opacity:0"), (S0, "transform:translate(0,0);opacity:1"),
                         (S1, f"transform:{tr(sv(span / R2, -span / R2))};opacity:1"), (S1 + 0.2, f"transform:{tr(sv(span / R2, -span / R2))};opacity:0"), (T, "transform:translate(0,0);opacity:0")])
    for k, u in enumerate(pots):
        t = S0 + (u - (BU + s0 / R2)) / (span / R2) * (S1 - S0)
        css += kf(f"pnLid{k}", [(0, "transform:translate(0,0)"), (t, "transform:translate(0,0)"), (t + 0.3, f"transform:{tr(sv(0, 0, 6.5))}"), (8.4, f"transform:{tr(sv(0, 0, 6.5))}"), (8.8, "transform:translate(0,0)"), (T, "transform:translate(0,0)")])
        css += kf(f"pnD{k}", [(0, "opacity:0"), (t + 0.1, "opacity:0"), (t + 0.3, "opacity:1"), (8.4, "opacity:1"), (8.8, "opacity:0"), (T, "opacity:0")])
        css += f".pnb .pt{k} .lid{{animation:pnLid{k} 9s cubic-bezier(.45,0,.2,1) infinite}}.pnb .pt{k} .l{{opacity:0;animation:pnD{k} 9s ease infinite}}"
    css += (".pnb .ph{animation:pnPh 9s cubic-bezier(.45,0,.2,1) infinite}.pnb .phf{animation:pnPhF 9s ease infinite}.pnb .pi{animation:pnPi 9s linear infinite}.pnb .po{animation:pnPo 9s linear infinite}"
            ".pnb .scan{opacity:0;animation:pnScan 9s linear infinite}")
    return wrap("".join(o), "mf pnb", "A framed photo slides into the model; its layers light in turn as it paints the picture flat; a scan bar crosses the board of flat, outlined regions and five paint pots open one by one"), css


def all_figs():
    a, ca = fig_slm()
    b, cb = fig_murmur()
    c, cc = fig_morrow()
    d, cd_ = fig_slm_train()
    base = ".mf .l{transition:opacity .3s}.mf{margin:0 auto}"
    reduced = "@media (prefers-reduced-motion: reduce){.mf *{animation:none!important}.mf .l,.mf .ok,.slt .gr{opacity:1}.mf .win{opacity:0}}"
    e, ce = fig_pnb()
    return {"extract": a, "murmur": b, "morrow": c, "slm": d, "pnb": e}, base + ca + cb + cc + cd_ + ce + reduced

if __name__ == "__main__":
    figs, css = all_figs()
    html = "<html><body style='margin:0;background:#fff'><style>" + css + "</style>" + "".join(f"<div style='width:504px;margin:30px'>{v}</div>" for v in figs.values()) + "</body></html>"
    open(os.path.join(os.path.dirname(__file__), "models.html"), "w").write(html)
    print({k: len(v) for k, v in figs.items()}, len(css))
