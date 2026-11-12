# A small isometric kit in the spirit of Anatomy (github.com/wheresryan22/anatomy, MIT):
# solids with four-tone shading, painter's order, thin lines, one lit accent.
# True isometric: screen X = (x - y) cos30, Y = (x + y)/2 - z. Viewer looks along -(1,1,1).
import math

C = math.cos(math.pi / 6)
S = 0.5
K = 1.0
OX = 0.0
OY = 0.0

TONES = {
    #        top        +y face    +x face    line
    "paper": ("#ffffff", "#eef0f2", "#dde1e6", "#2b2f36"),
    "mid":   ("#fbfbfa", "#e8eaed", "#d4d8de", "#2b2f36"),
    "lo":    ("#f3f3f0", "#e3e4e1", "#cfd1d0", "#3a3e44"),
    "lit":   ("#7aa2d2", "#5683b8", "#386392", "#1b3656"),
    "ink":   ("#4a5059", "#30353d", "#1f2329", "#15181c"),
    "glass": ("#f6f9fc", "#e6edf5", "#d3deea", "#2b2f36"),
}
LINE = "#2b2f36"
LO = "#8d939c"
FAINT = "#c3c8cf"
LIT = "#2f6fb0"

BOUNDS = [1e9, 1e9, -1e9, -1e9]


def P(x, y, z):
    sx = (x - y) * C * K + OX
    sy = ((x + y) * S - z) * K + OY
    BOUNDS[0] = min(BOUNDS[0], sx); BOUNDS[1] = min(BOUNDS[1], sy)
    BOUNDS[2] = max(BOUNDS[2], sx); BOUNDS[3] = max(BOUNDS[3], sy)
    return (sx, sy)


def f(v):
    s = f"{v:.1f}"
    return s[:-2] if s.endswith(".0") else s


def pts(ps):
    return " ".join(f"{f(a)},{f(b)}" for a, b in ps)


def path(ps, close=True):
    d = "M" + " L".join(f"{f(a)} {f(b)}" for a, b in ps)
    return d + ("Z" if close else "")


def hexmix(a, b, t):
    a = [int(a[i:i + 2], 16) for i in (1, 3, 5)]
    b = [int(b[i:i + 2], 16) for i in (1, 3, 5)]
    return "#" + "".join(f"{round(a[i] + (b[i] - a[i]) * t):02x}" for i in range(3))


# ── plans ─────────────────────────────────────────────────────

def rrect(x, y, w, d, r=0, n=5):
    """Rounded rectangle, counter-clockwise when x right and y down-left."""
    if r <= 0:
        return [(x, y), (x + w, y), (x + w, y + d), (x, y + d)]
    out = []
    cs = [(x + w - r, y + r, -90), (x + w - r, y + d - r, 0), (x + r, y + d - r, 90), (x + r, y + r, 180)]
    for cx, cy, a0 in cs:
        for i in range(n + 1):
            a = math.radians(a0 + 90 * i / n)
            out.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return out


def circle(cx, cy, r, n=28):
    return [(cx + r * math.cos(2 * math.pi * i / n), cy + r * math.sin(2 * math.pi * i / n)) for i in range(n)]


def hull(ps):
    ps = sorted(set((round(a, 2), round(b, 2)) for a, b in ps))
    if len(ps) < 3:
        return ps
    def cross(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
    lo, up = [], []
    for p in ps:
        while len(lo) >= 2 and cross(lo[-2], lo[-1], p) <= 0:
            lo.pop()
        lo.append(p)
    for p in reversed(ps):
        while len(up) >= 2 and cross(up[-2], up[-1], p) <= 0:
            up.pop()
        up.append(p)
    return lo[:-1] + up[:-1]


# ── solids ────────────────────────────────────────────────────

def prism(plan, z0, z1, tone="paper", sw=0.8, crease=True, top=True, cls=None, extra=""):
    """A vertical prism over a convex plan. Visible sides shaded by facing, lighter top, hull outline."""
    t_top, t_y, t_x, ln = TONES[tone]
    n = len(plan)
    # orientation: make sure outward normals are right
    area = sum(plan[i][0] * plan[(i + 1) % n][1] - plan[(i + 1) % n][0] * plan[i][1] for i in range(n))
    sgn = 1 if area > 0 else -1
    sides = []
    for i in range(n):
        (ax, ay), (bx, by) = plan[i], plan[(i + 1) % n]
        ex, ey = bx - ax, by - ay
        nx, ny = ey * sgn, -ex * sgn
        L = math.hypot(nx, ny) or 1
        nx, ny = nx / L, ny / L
        if nx + ny <= 1e-6:
            continue
        if nx <= 0:
            col = t_y
        elif ny <= 0:
            col = t_x
        else:
            col = hexmix(t_x, t_y, (math.atan2(ny, nx) / (math.pi / 2)))
        q = [P(ax, ay, z0), P(bx, by, z0), P(bx, by, z1), P(ax, ay, z1)]
        sides.append((ax + ay + bx + by, q, col))
    sides.sort(key=lambda s: s[0])
    ca = ' class="%s"' % cls if cls else ""
    o = [f'<g{ca}{extra}>']
    for _, q, col in sides:
        o.append(f'<path d="{path(q)}" fill="{col}" stroke="{col}" stroke-width="0.6"/>')
    tp = [P(x, y, z1) for x, y in plan]
    if top:
        o.append(f'<path d="{path(tp)}" fill="{t_top}"/>')
    if crease and n == 4:
        # the near vertical edge, where +y meets +x
        i = max(range(n), key=lambda k: plan[k][0] + plan[k][1])
        x, y = plan[i]
        o.append(f'<path d="{path([P(x, y, z0), P(x, y, z1)], False)}" stroke="{ln}" stroke-width="{sw * 0.7:.2f}" stroke-opacity="0.55" fill="none"/>')
    if top:
        o.append(f'<path d="{path(tp)}" fill="none" stroke="{ln}" stroke-width="{sw:.2f}" stroke-linejoin="round"/>')
    h = hull([P(x, y, z0) for x, y in plan] + tp)
    o.append(f'<path d="{path(h)}" fill="none" stroke="{ln}" stroke-width="{sw:.2f}" stroke-linejoin="round"/>')
    o.append("</g>")
    return "".join(o)


def box(x, y, z, w, d, h, tone="paper", r=0, **kw):
    return prism(rrect(x, y, w, d, r), z, z + h, tone, **kw)


def cyl(cx, cy, r, z0, h, tone="paper", n=28, **kw):
    return prism(circle(cx, cy, r, n), z0, z0 + h, tone, crease=False, **kw)


# ── lines and marks ───────────────────────────────────────────

def line(a, b, col=LINE, sw=0.7, op=1, cap="round", extra=""):
    return f'<path d="{path([P(*a), P(*b)], False)}" stroke="{col}" stroke-width="{sw}" stroke-opacity="{op}" stroke-linecap="{cap}" fill="none"{extra}/>'


def poly3(ps, col=LINE, sw=0.7, fill="none", close=False, op=1, extra=""):
    return f'<path d="{path([P(*p) for p in ps], close)}" stroke="{col}" stroke-width="{sw}" fill="{fill}" stroke-opacity="{op}" stroke-linejoin="round" stroke-linecap="round"{extra}/>'


def dot(p, r=0.9, col=LINE, extra=""):
    x, y = P(*p)
    return f'<circle cx="{f(x)}" cy="{f(y)}" r="{r}" fill="{col}"{extra}/>'


def face_y(x0, x1, z0, z1, y):
    return [(x0, y, z0), (x1, y, z0), (x1, y, z1), (x0, y, z1)]


def face_x(y0, y1, z0, z1, x):
    return [(x, y0, z0), (x, y1, z0), (x, y1, z1), (x, y0, z1)]


def circ_y(cx, cz, r, y, n=28):
    return [(cx + r * math.cos(2 * math.pi * i / n), y, cz + r * math.sin(2 * math.pi * i / n)) for i in range(n)]


def circ_z(cx, cy, r, z, n=36):
    return [(cx + r * math.cos(2 * math.pi * i / n), cy + r * math.sin(2 * math.pi * i / n), z) for i in range(n)]


def slot_y(x0, x1, zc, y, h=1.6):
    """A closed vent slot on a +y face: a stadium shape."""
    r = h / 2
    ps = []
    for i in range(9):
        a = math.pi / 2 + math.pi * i / 8
        ps.append((x0 + r + r * math.cos(a), y, zc + r * math.sin(a)))
    for i in range(9):
        a = -math.pi / 2 + math.pi * i / 8
        ps.append((x1 - r + r * math.cos(a), y, zc + r * math.sin(a)))
    return ps


def slot_x(y0, y1, zc, x, h=1.6):
    r = h / 2
    ps = []
    for i in range(9):
        a = math.pi / 2 + math.pi * i / 8
        ps.append((x, y0 + r + r * math.cos(a), zc + r * math.sin(a)))
    for i in range(9):
        a = -math.pi / 2 + math.pi * i / 8
        ps.append((x, y1 - r + r * math.cos(a), zc + r * math.sin(a)))
    return ps


def plane_top(cx, cy, z):
    """SVG matrix that maps plane coords (u along +x, v along +y) at height z to the screen."""
    ex, ey = P(cx, cy, z)
    return f"matrix({f(C*K)} {f(S*K)} {f(-C*K)} {f(S*K)} {f(ex)} {f(ey)})"


def plane_y(cx, y, cz):
    """Plane coords on a +y face: u along +x, v along -z (screen-down)."""
    ex, ey = P(cx, y, cz)
    return f"matrix({f(C*K)} {f(S*K)} 0 {f(K)} {f(ex)} {f(ey)})"


def move_y(d):
    return (-C * K * d, S * K * d)


def move_z(d):
    return (0.0, -K * d)


def move_x(d):
    return (C * K * d, S * K * d)
