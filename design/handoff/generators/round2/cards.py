# Selected work card faces: one painting family, a different accent per card, one static white feature each.
# Everything is drawn on a 600 x 780 stage. No motion.
import math, sys, json
MONO = "font-family: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace"
INK = "#111214"

def f(v): return f"{v:.1f}".rstrip("0").rstrip(".")

def loop_svg():
    # A seamless loop: a waveform wrapped into a ring, so its end meets its start at the top.
    n, r0 = 90, 112
    out = []
    for i in range(n):
        t = 2 * math.pi * i / n
        a = 0.5 + 0.28 * math.sin(5 * t + 0.7) + 0.16 * math.sin(11 * t + 2.1) + 0.06 * math.sin(23 * t)
        a = max(0.08, min(1, a))
        L = 10 + 58 * a
        c, sn = math.sin(t), -math.cos(t)
        x1, y1 = 300 + r0 * c, 390 + r0 * sn
        x2, y2 = 300 + (r0 + L) * c, 390 + (r0 + L) * sn
        out.append(f'<line x1="{f(x1)}" y1="{f(y1)}" x2="{f(x2)}" y2="{f(y2)}"/>')
    return (f'<svg width="600" height="780" viewBox="0 0 600 780" style="position:absolute;inset:0" aria-hidden="true">'
            f'<g stroke="#ffffff" stroke-width="3.4" stroke-linecap="round">{"".join(out)}</g>'
            f'<circle cx="300" cy="390" r="{r0 - 16}" fill="none" stroke="#ffffff" stroke-opacity=".35" stroke-width="1.5"/>'
            f'<circle cx="300" cy="{390 - r0 + 16}" r="5" fill="#ffffff"/></svg>')

def tiles():
    rows = [("CRANE", "ghost"), ("SLACK", "ghost"), ("STACK", "solid")]
    T, G = 72, 10
    W = 5 * T + 4 * G
    out = []
    for r, (word, kind) in enumerate(rows):
        for c, ch in enumerate(word):
            x, y = 300 - W / 2 + c * (T + G), 390 - (3 * T + 2 * G) / 2 + r * (T + G)
            if kind == "solid":
                st = f"background:#ffffff;color:{INK}"
            else:
                hit = word[c] == "STACK"[c]
                st = f"border:1.5px solid rgba(255,255,255,{.7 if hit else .32});color:rgba(255,255,255,{.95 if hit else .55})"
            out.append(f'<span style="position:absolute;left:{f(x)}px;top:{f(y)}px;width:{T}px;height:{T}px;box-sizing:border-box;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:600;letter-spacing:-0.01em;{st}">{ch}</span>')
    return "".join(out)

def dots():
    out = []
    S, R = 32, 8.5
    x0, y0 = 300 - 4.5 * S, 390 - 4.5 * S
    for i in range(100):
        cx, cy = x0 + (i % 10) * S, y0 + (i // 10) * S
        if i < 94: out.append(f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{R}" fill="#ffffff"/>')
        else: out.append(f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{R - .75}" fill="none" stroke="#ffffff" stroke-opacity=".55" stroke-width="1.5"/>')
    return f'<svg width="600" height="780" viewBox="0 0 600 780" style="position:absolute;inset:0" aria-hidden="true">{"".join(out)}</svg>'

def library():
    chip = lambda code, name, solid, y: (
        f'<div style="position:absolute;left:84px;right:84px;top:{y}px;height:56px;box-sizing:border-box;border-radius:10px;display:flex;align-items:center;gap:16px;padding:0 18px;'
        + (f'background:#ffffff;color:{INK}' if solid else 'border:1.5px solid rgba(255,255,255,.32);color:rgba(255,255,255,.62)')
        + f'"><span style="{MONO};font-size:15px;letter-spacing:.04em;{"color:#2f5b8c" if solid else ""}">{code}</span><span style="font-size:19px;font-weight:500">{name}</span>'
        + ('<svg style="margin-left:auto" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2f5b8c" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>' if solid else "")
        + "</div>")
    text = ('<div style="position:absolute;left:84px;right:84px;top:226px;font-size:27px;line-height:1.42;letter-spacing:-0.015em;color:rgba(255,255,255,.72)">'
            'Users get <span style="color:#ffffff;text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:7px">access only through a request</span> their manager approves.</div>')
    link = '<div style="position:absolute;left:236px;top:360px;width:2px;height:62px;background:#ffffff"></div>'
    return text + link + chip("AC-2", "Account management", True, 422) + chip("AC-6", "Least privilege", False, 490) + chip("AU-6", "Audit record review", False, 558)

def nda():
    lock = ('<svg style="position:absolute;left:272px;top:248px" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">'
            '<rect x="5" y="11" width="14" height="9" rx="2"></rect><path d="M8 11V8a4 4 0 0 1 8 0v3"></path></svg>')
    bars = "".join(f'<span style="position:absolute;left:{300 - w / 2}px;top:{360 + k * 34}px;width:{w}px;height:16px;border-radius:4px;background:rgba(255,255,255,{.28 if k else .5})"></span>'
                   for k, w in enumerate([300, 236, 270, 184, 252]))
    return lock + bars

# Each card: which painting, where it sits, its accent (the colour the painting is recoloured to), the face and its caption.
CARDS = [
    dict(key="murmur", mark=True, paint="wide", pos="70% 50%", accent="#c58552", mix=.82, shade=(.04, .26), label="Murmur · Loop", face=loop_svg, cap="2:00 loop · no seam"),
    dict(key="morrow", mark=True, paint="diag", pos="60% 50%", accent="#4e8a6a", mix=.86, shade=(.06, .30), label="Morrow · Quint", face=tiles, cap="Solved in 3"),
    dict(key="auditor", paint="wide", pos="20% 50%", accent=None, mix=0, shade=(.10, .34), label="Compliance SLM · Held-out set", face=dots, cap="94 in 100 match the reviewer"),
    dict(key="extract", paint="wide", pos="85% 30%", accent="#62689c", mix=.72, shade=(.08, .32), label="Extraction · Library", face=library, cap="Bound to the library"),
    dict(key="ask", mark=True, paint="diag", pos="15% 60%", accent="#1b1d22", mix=1, shade=(.5, .66), label="Under NDA", face=nda, cap="Client work · under NDA"),
]

BRACKETS = ['M379.6 291.9L186.8 291.9', 'M202.8 275.9L202.8 872.2', 'M186.8 856.2L379.6 856.2', 'M363.6 866.9L363.6 786.2', 'M379.6 796.9L248.9 796.9', 'M264.9 812.9L264.9 335.1', 'M248.9 351.1L379.6 351.1', 'M363.6 361.8L363.6 281.2', 'M820.4 291.9L1013.2 291.9', 'M997.2 275.9L997.2 872.2', 'M1013.2 856.2L820.4 856.2', 'M836.4 866.9L836.4 786.2', 'M820.4 796.9L951.1 796.9', 'M935.1 812.9L935.1 335.1', 'M951.1 351.1L820.4 351.1', 'M836.4 361.8L836.4 281.2']
A_GLYPH = 'M283 -13Q202 -13 148.0 26.5Q94 66 67.0 137.0Q40 208 40 301Q40 395 67.5 465.5Q95 536 149.0 575.0Q203 614 283 614Q349 614 389.5 587.5Q430 561 448 522H472V600H595V0H472V78H448Q430 41 389.5 14.0Q349 -13 283 -13ZM313 89Q381 89 421.5 146.5Q462 204 462 300Q462 397 421.5 454.5Q381 512 313 512Q249 512 214.0 457.5Q179 403 179 300Q179 197 214.0 143.0Q249 89 313 89Z'
def drawn_mark(style):
    # Our [a], drawn: the bracket strokes and the outlined a, no construction lines.
    paths = ''.join(f'<path d="{d}" vector-effect="non-scaling-stroke"/>' for d in BRACKETS)
    return (f'<svg viewBox="176 266 848 616" fill="none" aria-hidden="true" style="position:absolute;{style};height:auto;color:rgba(255,255,255,.55)">'
            f'<g stroke="currentColor" stroke-width="1.4" stroke-linecap="round">{paths}<path d="{A_GLYPH}" transform="translate(425.625 760) scale(0.51666667 -0.51666667)" vector-effect="non-scaling-stroke"/></g></svg>')

def face(card, src):
    tint = (f'<div style="position:absolute;inset:0;background:{card["accent"]};mix-blend-mode:color;opacity:{card["mix"]}"></div>' if card["accent"] else "")
    a, b = card["shade"]
    return (f'<div style="position:absolute;inset:0;overflow:hidden;isolation:isolate;background:#4f6f93;font-family:Geist,ui-sans-serif,system-ui,sans-serif;color:#ffffff">'
            f'<img src="{src[card["paint"]]}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:{card["pos"]}">'
            f'{tint}<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,14,22,{a}) 0%,rgba(10,14,22,{b}) 100%)"></div>'
            f'{card["face"]()}'
            f'{drawn_mark("right:34px;bottom:34px;width:84px") if card.get("mark") else ""}'
            f'</div>')

if __name__ == "__main__":
    W = "/Users/aleksandarkotevski/Library/Application Support/Claude/scratch-workspaces/86fa8aec-a9c5-48c3-8ba3-d5783d7de619/e3116774-42dd-42bc-a238-1515e779fa24/scratch-2026-11-11-84e6d2/adamass-web/assets/paintings/"
    src = {k: "file://" + W + f"paint-{k}.webp" for k in ["wide", "tall", "diag"]}
    s = 262 / 600
    cards = "".join(f'<div style="position:relative;width:262px;height:{780 * s:.0f}px;border-radius:12px;overflow:hidden"><div style="position:absolute;left:0;top:0;width:600px;height:780px;transform:scale({s:.4f});transform-origin:0 0">{face(c, src)}</div></div>' for c in CARDS)
    open("proto.html", "w").write(f'<!doctype html><html><body style="margin:0;background:#fff;padding:40px 32px"><div style="display:flex;gap:16px">{cards}</div></body></html>')
    print("ok")

def nda_banner(src):
    # The ask card on phones: the same ink face, laid out wide and short (fluid width, 220 px tall).
    c = CARDS[4]
    lock = ('<svg style="position:absolute;left:50%;top:70px;margin-left:-15px" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">'
            '<rect x="5" y="11" width="14" height="9" rx="2"></rect><path d="M8 11V8a4 4 0 0 1 8 0v3"></path></svg>')
    bars = "".join(f'<span style="position:absolute;left:50%;margin-left:-{w / 2}px;top:{118 + k * 17}px;width:{w}px;height:8px;border-radius:3px;background:rgba(255,255,255,{.28 if k else .5})"></span>'
                   for k, w in enumerate([170, 130, 152]))
    a, b = c["shade"]
    return (f'<div style="position:absolute;inset:0;overflow:hidden;isolation:isolate;background:#22252b;font-family:Geist,ui-sans-serif,system-ui,sans-serif;color:#ffffff">'
            f'<img src="{src[c["paint"]]}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:{c["pos"]}">'
            f'<div style="position:absolute;inset:0;background:{c["accent"]};mix-blend-mode:color;opacity:{c["mix"]}"></div>'
            f'<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,14,22,{a}) 0%,rgba(10,14,22,{b}) 100%)"></div>'
            f'{lock}{bars}{drawn_mark("right:16px;bottom:16px;width:36px")}'
            f'</div>')
