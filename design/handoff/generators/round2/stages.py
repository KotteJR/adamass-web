# The three product stages, each in two shapes: 'card' (780 x 450, shown scaled on the page) and 'modal' (600 x 780).
# Murmur: its sky and clouds through the day. Morrow: Quint and Nib actually being played, with real puzzles from
# Morrow's content. Compliance SLM: the article being read and the bound risks coming out.
import re, math
SP = "/private/tmp/claude-501/-Users-aleksandarkotevski-Library-Application-Support-Claude-scratch-workspaces-86fa8aec-a9c5-48c3-8ba3-d5783d7de619-e3116774-42dd-42bc-a238-1515e779fa24-scratch-2026-11-11-84e6d2/e3e40e52-5b1a-454d-bc1a-4f8ac9aa0348/scratchpad"
PAINT = "/_blob/f79de23ce94fa1b72b32014588efd1f6"
WIDE = "/_blob/a46bd7c378594fe19fc854fa6b91b7bc"
PUFF = "/_blob/6c1b3c99150a5bcb1b35ef5ca22ecd1e"
MONO = "font-family: 'Geist Mono', ui-monospace, monospace"
FIG = "font-family: Figtree, ui-sans-serif, system-ui, sans-serif"

def mix(hexc, a):
    c = [int(hexc[i:i + 2], 16) for i in (1, 3, 5)]
    return "#%02x%02x%02x" % tuple(round(255 + (x - 255) * a) for x in c)

def pct(t, cyc):
    return f"{max(0.0, min(100.0, t / cyc * 100)):.3f}%"

def keyframes(name, cyc, stops):
    """stops: list of (time_s, css_body). Sorted, de-duplicated by time."""
    stops = sorted(stops, key=lambda s: s[0])
    out, last = [], None
    for t, body in stops:
        p = pct(t, cyc)
        if p == last:
            out[-1] = f"{p}{{{body}}}"
        else:
            out.append(f"{p}{{{body}}}")
        last = p
    return f"@keyframes {name}{{" + "".join(out) + "}"

MARK = open(SP + "/v8/src/logo/morrow-mark.svg").read()
MARK = re.sub(r'\swidth="\d+"\s+height="\d+"', "", MARK, count=1).replace("<svg ", '<svg aria-hidden="true" style="width: 26px; height: 26px; flex: none" ', 1)

# ------------------------------------------------------------------ Murmur
PH = [("linear-gradient(168deg, #7a4a22 0%, #b4713c 52%, #e6be95 100%)", "Morning.", "Slow start", "Piano · Focus · Vinyl", "2:00"),
      ("linear-gradient(168deg, #a35a2c 0%, #c47f48 50%, #e0b07a 100%)", "Afternoon.", "Deep work", "Rhodes · Focus · Rain", "4:00"),
      ("linear-gradient(165deg, #4f537a 0%, #7a7ea0 52%, #a6a8c0 100%)", "Evening.", "Winding down", "Guitar · Night · Cafe", "2:00"),
      ("linear-gradient(168deg, #1d2848 0%, #374472 54%, #7887ae 100%)", "Night.", "Falling asleep", "Brown noise · 32 dBA", "10 h")]
MS = 5.0
MC = MS * len(PH)

def ph_delay(i):
    return f"-{(MC - i * MS) % MC:.2f}s"

def wave(w, h, period, amp, phase=0.0):
    pts = []
    for k in range(int(w / 6) + 1):
        x = k * 6
        y = h / 2 + amp * math.sin(2 * math.pi * x / period + phase) * (0.75 + 0.25 * math.sin(2 * math.pi * x / (period * 2)))
        pts.append(f"{x} {y:.1f}")
    return "M" + " L".join(pts)

W1, W2 = wave(1600, 90, 400, 26), wave(1600, 90, 266.67, 14, 1.2)

def murmur(mode):
    card = mode == "card"
    pad = 36 if card else 40
    g = 66 if card else 82
    skies = "".join(f'<div class="mu-sky" style="background: {p[0]}; animation-delay: {ph_delay(i)}"></div>' for i, p in enumerate(PH))
    def cyc(fn):
        return "".join(f'<span class="mu-t" style="animation-delay: {ph_delay(i)}">{fn(p)}</span>' for i, p in enumerate(PH))
    return f'''<div class="mu" aria-hidden="true">
  {skies}
  <img class="mu-cl c1" src="{WIDE}" alt=""><img class="mu-cl c2" src="{PUFF}" alt=""><img class="mu-cl c3" src="{WIDE}" alt="">
  <div style="position: relative; height: 100%; box-sizing: border-box; padding: {pad}px; display: flex; flex-direction: column">
    <div style="height: 36px; display: flex; align-items: center; justify-content: space-between">
      <span style="font-family: Newsreader, ui-serif, Georgia, serif; font-size: 23px; letter-spacing: -0.01em">Murmur Studio</span>
      <span style="font-family: 'IBM Plex Mono', ui-monospace, monospace; font-size: 10.5px; letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.85">{{{{muDate}}}}</span>
    </div>
    <div style="position: relative; margin-top: {26 if card else 68}px; height: {round(g * 1.1)}px; font-family: Newsreader, ui-serif, Georgia, serif; font-size: {g}px; line-height: 1.1; letter-spacing: -0.02em">{cyc(lambda p: p[1])}</div>
    <div style="position: relative; margin-top: 8px; height: 24px; font-family: 'Hanken Grotesk', ui-sans-serif, system-ui, sans-serif; font-size: 16px; opacity: 0.9">{cyc(lambda p: "Pick up " + p[2] + " where you left it.")}</div>
    <div style="position: relative; flex: 1; min-height: 0; margin: 0 -{pad}px; overflow: hidden">
      <svg class="mu-w" viewBox="0 0 1600 90" width="1600" height="90" style="position: absolute; left: 0; top: 50%; margin-top: -45px"><path d="{W1}" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.95"></path></svg>
      <svg class="mu-w w2" viewBox="0 0 1600 90" width="1600" height="90" style="position: absolute; left: 0; top: 50%; margin-top: -45px"><path d="{W2}" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" opacity="0.5"></path></svg>
    </div>
    <div style="height: 44px; display: flex; align-items: center; justify-content: space-between; gap: 16px">
      <span style="display: inline-flex; align-items: center; gap: 10px; height: 44px; box-sizing: border-box; padding: 0 18px 0 14px; border-radius: 10px; background-color: #ffffff; color: #10131a; font-family: 'Hanken Grotesk', ui-sans-serif, system-ui, sans-serif; font-size: 15px; font-weight: 500">
        <span class="mu-eq"><i></i><i></i><i></i></span><span style="position: relative; display: inline-block; width: 112px; height: 20px">{cyc(lambda p: p[2])}</span></span>
      <span style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px">
        <span class="r" style="position: relative; display: block; width: 190px; height: 18px; font-family: 'Hanken Grotesk', ui-sans-serif, system-ui, sans-serif; font-size: 14px">{cyc(lambda p: p[3])}</span>
        <span class="r" style="position: relative; display: block; width: 120px; height: 14px; font-family: 'IBM Plex Mono', ui-monospace, monospace; font-size: 10.5px; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.8">{cyc(lambda p: p[4] + " loop")}</span>
      </span>
    </div>
  </div>
</div>'''

# ------------------------------------------------------------------ Morrow: Quint (today's answer STACK)
QUINT, QDEEP, QWASH = "#24A26A", "#06603A", "#E9F4EC"
NIB, NDEEP = "#E0577D", "#8C1237"
NWASH = mix(NIB, 0.12)
Q_ROWS = [("CRANE", "paxaa"), ("SLACK", "cxccc"), ("STACK", "ccccc")]  # c correct, p present, x/a absent
QC = 11.0
Q_START = [0.5, 3.1, 5.7]
Q_SOLVE = 8.15

def q_tile_kf(px="q", cyc=None):
    cyc = cyc or QC
    css = ""
    E = "background-color:#ffffff;color:rgba(6,96,58,0);box-shadow:0 0 0 0 rgba(6,96,58,0)"
    T = "background-color:#ffffff;color:#06603A;box-shadow:inset 0 0 0 2px rgba(6,96,58,.22)"
    for r, (word, st) in enumerate(Q_ROWS):
        for c in range(5):
            s = st[c]
            if s == "c":
                F = f"background-color:{QUINT};color:#ffffff;box-shadow:0 4px 0 0 {QDEEP}"
            elif s == "p":
                F = f"background-color:#ffffff;color:{QDEEP};box-shadow:0 4px 0 0 {QDEEP}"
            else:
                F = "background-color:#D5EBDD;color:rgba(6,96,58,.45);box-shadow:0 0 0 0 rgba(6,96,58,0)"
            t = Q_START[r] + c * 0.16
            f0 = Q_START[r] + 1.05 + c * 0.18
            stops = [(0, E + ";transform:none"), (t, E + ";transform:none"),
                     (t + 0.08, T + ";transform:scale(1.1)"), (t + 0.18, T + ";transform:none"),
                     (f0, T + ";transform:none"), (f0 + 0.24, T + ";transform:rotateX(90deg)"),
                     (f0 + 0.245, F + ";transform:rotateX(90deg)"), (f0 + 0.5, F + ";transform:none")]
            if r == 2:
                b0 = Q_SOLVE + c * 0.07
                stops += [(b0, F + ";transform:none"), (b0 + 0.13, F + ";transform:translateY(-10px)"), (b0 + 0.3, F + ";transform:none")]
            stops += [(10.2, F + ";transform:none"), (10.7, E + ";transform:none"), (cyc, E + ";transform:none")]
            css += keyframes(f"{px}{r}{c}", cyc, stops)
            if s == "p":
                css += keyframes(f"{px}m{r}{c}", cyc, [(0, "opacity:0"), (f0 + 0.245, "opacity:0"), (f0 + 0.25, "opacity:1"), (10.2, "opacity:1"), (10.7, "opacity:0"), (cyc, "opacity:0")])
    css += keyframes(f"{px}Toast", cyc, [(0, "opacity:0;transform:translate(-50%,8px)"), (Q_SOLVE + 0.4, "opacity:0;transform:translate(-50%,8px)"),
                                     (Q_SOLVE + 0.75, "opacity:1;transform:translate(-50%,0)"), (10.2, "opacity:1;transform:translate(-50%,0)"),
                                     (10.6, "opacity:0;transform:translate(-50%,0)"), (cyc, "opacity:0;transform:translate(-50%,8px)")])
    css += keyframes(f"{px}Seg", cyc, [(0, "transform:scaleX(0)"), (Q_SOLVE + 0.3, "transform:scaleX(0)"), (Q_SOLVE + 0.9, "transform:scaleX(1)"), (10.4, "transform:scaleX(1)"), (10.8, "transform:scaleX(0)"), (cyc, "transform:scaleX(0)")])
    css += keyframes(f"{px}Count", cyc, [(0, "opacity:1"), (Q_SOLVE + 0.5, "opacity:1"), (Q_SOLVE + 0.6, "opacity:0"), (10.5, "opacity:0"), (10.6, "opacity:1"), (cyc, "opacity:1")])
    css += keyframes(f"{px}Count2", cyc, [(0, "opacity:0"), (Q_SOLVE + 0.5, "opacity:0"), (Q_SOLVE + 0.6, "opacity:1"), (10.5, "opacity:1"), (10.6, "opacity:0"), (cyc, "opacity:0")])
    return css

def quint_board(tile, gap, px="q", cyc=None):
    cyc = cyc or QC
    cells = ""
    for r in range(6):
        for c in range(5):
            if r < 3:
                ch = Q_ROWS[r][0][c]
                cm = (f'<span style="position: absolute; right: 0; top: 0; width: 34%; height: 34%; background: linear-gradient(225deg, {QUINT} 50%, transparent 50%); border-top-right-radius: {round(tile*0.22)}px; opacity: 0; animation: {px}m{r}{c} {cyc}s linear infinite"></span>' if Q_ROWS[r][1][c] == "p" else "")
                cells += f'<span class="qt" style="animation: {px}{r}{c} {cyc}s linear infinite">{ch}{cm}</span>'
            else:
                cells += '<span class="qt e"></span>'
    return (f'<div style="--t: {tile}px; display: grid; grid-template-columns: repeat(5, {tile}px); gap: {gap}px; perspective: 600px; font-size: {round(tile*0.46)}px">{cells}</div>')

# ------------------------------------------------------------------ Morrow: Nib (a real mini crossword from Morrow's content)
NIB_GRID = ["ARE##", "LONG#", "LOTUS", "#MERE", "##RUT"]
NIB_ACROSS = {"1": "Exist, for more than one", "4": "Lengthy", "6": "Water lily of Asia", "8": "Nothing more than", "9": "Groove you get stuck in"}
NC = 36.0

def nib_layout():
    nums, n = {}, 0
    for r in range(5):
        for c in range(5):
            if NIB_GRID[r][c] == "#":
                continue
            a = (c == 0 or NIB_GRID[r][c - 1] == "#") and c < 4 and NIB_GRID[r][c + 1] != "#"
            d = (r == 0 or NIB_GRID[r - 1][c] == "#") and r < 4 and NIB_GRID[r + 1][c] != "#"
            if a or d:
                n += 1
                nums[(r, c)] = n
    words = []
    for r in range(5):
        c = 0
        while c < 5:
            if NIB_GRID[r][c] != "#" and (c == 0 or NIB_GRID[r][c - 1] == "#"):
                cs = [c]
                while cs[-1] + 1 < 5 and NIB_GRID[r][cs[-1] + 1] != "#":
                    cs.append(cs[-1] + 1)
                if len(cs) > 1:
                    words.append((nums[(r, c)], r, cs))
                c = cs[-1] + 1
            else:
                c += 1
    return nums, words

NUMS, WORDS = nib_layout()
N_STEP, N_GAPW = 0.28, 0.42
def nib_times():
    t, out = 0.5, []
    for num, r, cs in WORDS:
        ws = t
        lt = [ws + 0.25 + i * N_STEP for i in range(len(cs))]
        we = lt[-1] + N_STEP
        out.append((num, r, cs, ws, lt, we))
        t = we + N_GAPW
    return out, t + 0.2
NT, N_SOLVE = nib_times()

def nib_kf():
    css = ""
    W = "#ffffff"
    ACT = mix(NIB, 0.3)
    for num, r, cs, ws, lt, we in NT:
        for i, c in enumerate(cs):
            tl = lt[i]
            cur0 = ws + 0.05 if i == 0 else lt[i - 1] + 0.02
            sv = N_SOLVE + (r + c) * 0.06
            stops = [(0, f"background-color:{W};color:rgba(140,18,55,0)"),
                     (ws, f"background-color:{W};color:rgba(140,18,55,0)"),
                     (ws + 0.05, f"background-color:{ACT};color:rgba(140,18,55,0)"),
                     (cur0, f"background-color:{ACT};color:rgba(140,18,55,0)"),
                     (cur0 + 0.04, f"background-color:{NIB};color:rgba(255,255,255,0)"),
                     (tl, f"background-color:{NIB};color:rgba(255,255,255,0)"),
                     (tl + 0.03, f"background-color:{NIB};color:#ffffff"),
                     (tl + N_STEP - 0.02, f"background-color:{NIB};color:#ffffff"),
                     (tl + N_STEP + 0.02, f"background-color:{ACT};color:{NDEEP}"),
                     (we + 0.05, f"background-color:{ACT};color:{NDEEP}"),
                     (we + 0.2, f"background-color:{W};color:{NDEEP}"),
                     (sv, f"background-color:{W};color:{NDEEP}"),
                     (sv + 0.2, f"background-color:{mix(NIB, 0.42)};color:{NDEEP}"),
                     (10.9, f"background-color:{mix(NIB, 0.42)};color:{NDEEP}"),
                     (11.5, f"background-color:{W};color:rgba(140,18,55,0)"),
                     (NC, f"background-color:{W};color:rgba(140,18,55,0)")]
            css += keyframes(f"n{r}{c}", NC, stops)
    for k, (num, r, cs, ws, lt, we) in enumerate(NT):
        nxt = NT[k + 1][3] if k + 1 < len(NT) else N_SOLVE
        a0 = 0 if k == 0 else ws
        stops = [(0, "opacity:%d" % (1 if k == 0 else 0)), (a0, "opacity:%d" % (1 if k == 0 else 0)), (a0 + 0.15, "opacity:1"), (nxt, "opacity:1"), (nxt + 0.12, "opacity:0"), (NC, "opacity:0")]
        if k == 0:
            stops = [(0, "opacity:1"), (nxt, "opacity:1"), (nxt + 0.12, "opacity:0"), (11.6, "opacity:0"), (NC, "opacity:1")]
        css += keyframes(f"nc{k}", NC, stops)
    css += keyframes("ncS", NC, [(0, "opacity:0"), (N_SOLVE, "opacity:0"), (N_SOLVE + 0.2, "opacity:1"), (11.4, "opacity:1"), (11.6, "opacity:0"), (NC, "opacity:0")])
    return css

def nib_board(cell, gap):
    out = ""
    for r in range(5):
        for c in range(5):
            ch = NIB_GRID[r][c]
            if ch == "#":
                out += "<span></span>"
                continue
            num = NUMS.get((r, c))
            nm = f'<i style="position: absolute; left: 4px; top: 2px; font-style: normal; font-size: {max(8, round(cell*0.2))}px; font-weight: 600; color: rgba(140,18,55,0.6)">{num}</i>' if num else ""
            out += f'<span class="nc" style="animation-name: n{r}{c}">{nm}{ch}</span>'
    return f'<div style="display: grid; grid-template-columns: repeat(5, {cell}px); grid-auto-rows: {cell}px; gap: {gap}px; font-size: {round(cell*0.44)}px">{out}</div>'

def nib_clues():
    spans = "".join(f'<span class="ncl" style="animation-name: nc{k}"><b style="font-weight: 700; color: {NDEEP}">{num} Across</b>&nbsp;&nbsp;{NIB_ACROSS[str(num)]}</span>' for k, (num, r, cs, ws, lt, we) in enumerate(NT))
    spans += f'<span class="ncl" style="animation-name: ncS"><b style="font-weight: 700; color: {NDEEP}">Solved</b>&nbsp;&nbsp;The big answer was LOTUS.</span>'
    return spans

def morrow(mode):
    card = mode == "card"
    logo = f'<span style="display: inline-flex; align-items: center; gap: 9px">{MARK}<span style="{FIG}; font-weight: 700; font-size: 22px; letter-spacing: -0.02em; color: #111214">morrow</span></span>'
    timer = ('<span style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: #3d4a42"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>'
             'New set in <b style="font-weight: 600; color: #111214; font-variant-numeric: tabular-nums">{{cd}}</b></span>')
    segs_cols = ["#4B63E6", QUINT, "#EE8A2C", "#7A5DE8", "#E9B12A", NIB, "#1B9E93", "#3A90DA", "#BE56D4", "#76AE34", "#EC6753"]
    def segs(h=6):
        out = ""
        for i, col in enumerate(segs_cols):
            fill = ""
            if i == 0:
                fill = f'<span style="position: absolute; inset: 0; background-color: {col}"></span>'
            elif i == 1:
                fill = f'<span style="position: absolute; inset: 0; background-color: {col}; transform-origin: left center; animation: qSeg {QC}s linear infinite"></span>'
            out += f'<span style="position: relative; flex: 1; height: {h}px; border-radius: {h}px; overflow: hidden; background-color: {mix(col, .28)}">{fill}</span>'
        return f'<div style="display: flex; gap: 4px">{out}</div>'
    count = (f'<span style="position: relative; display: inline-block; width: 110px; height: 18px"><span style="position: absolute; left: 0; animation: qCount {QC}s linear infinite">1 of 11 solved</span>'
             f'<span style="position: absolute; left: 0; opacity: 0; animation: qCount2 {QC}s linear infinite">2 of 11 solved</span></span>')
    toast = (f'<span style="position: absolute; left: 50%; bottom: -14px; display: inline-flex; align-items: center; gap: 7px; height: 34px; padding: 0 14px; border-radius: 34px; background-color: #111214; color: #fff; {FIG}; font-size: 13.5px; font-weight: 600; white-space: nowrap; opacity: 0; animation: qToast {QC}s linear infinite">'
             f'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>Solved in 3</span>')
    if card:
        return f'''<div class="mo" aria-hidden="true" style="background-color: {QWASH}">
  <div style="position: relative; height: 100%; box-sizing: border-box; padding: 36px; display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 24px">
    <div style="display: flex; flex-direction: column">
      <div style="height: 36px; display: flex; align-items: center">{logo}</div>
      <div style="margin-top: auto; display: flex; flex-direction: column; gap: 6px">
        <span style="display: inline-flex; align-items: center; gap: 8px; font-size: 14px; color: #3d4a42"><i style="width: 9px; height: 9px; border-radius: 3px; background-color: {QUINT}"></i>Five letters · today’s puzzle</span>
        <span style="font-weight: 700; font-size: 52px; line-height: 1; letter-spacing: -0.035em; color: #111214">Quint</span>
      </div>
      <div style="margin-top: 22px; display: flex; flex-direction: column; gap: 9px">
        <div style="display: flex; justify-content: space-between; font-size: 13px; color: #3d4a42"><span>Today’s eleven</span>{count}</div>
        {segs()}
      </div>
    </div>
    <div style="position: relative; display: flex; align-items: center; justify-content: center">
      <div style="position: relative">{quint_board(46, 6)}{toast}</div>
    </div>
  </div>
</div>'''
    return MODAL_MORROW

# ------------------------------------------------------------------ Morrow modal: three rounds of two real games
# Round 1: Quint + Nib. Round 2: Sheaf + Orbit. Round 3: Nonet + Skein. 12 s each, 36 s in all.
# The "Today's eleven" bar fills as each game is solved. Puzzles from Morrow's content (2026-10-01 and 2026-11-10).
MR = 36.0
SHEAF_C, SHEAF_D = "#EE8A2C", "#8A4200"
ORBIT_C, ORBIT_D = "#E9B12A", "#6E4E00"
NONET_C, NONET_D = "#1B9E93", "#035C55"
SKEIN_C, SKEIN_D = "#7A5DE8", "#3E1FA0"

def rwin(name, r):
    a, b = 12 * r, 12 * r + 11.6
    if r == 0:
        st = [(0, "opacity:1"), (b, "opacity:1"), (b + 0.4, "opacity:0"), (MR - 0.4, "opacity:0"), (MR, "opacity:1")]
    else:
        st = [(0, "opacity:0"), (a - 0.4, "opacity:0"), (a, "opacity:1"), (b, "opacity:1"), (b + 0.4, "opacity:0"), (MR, "opacity:0")]
    return keyframes(name, MR, st)

def hold(name, t_on, t_end, on, off):
    """off until t_on, on until t_end, then off; times absolute in the 36 s cycle"""
    return keyframes(name, MR, [(0, off), (t_on, off), (t_on + 0.2, on), (t_end, on), (min(MR, t_end + 0.3), off), (MR, off)])

# ── Sheaf: sixteen words, four bundles ──
SHEAF = [("Morning drinks", ["Tea", "Cocoa", "Juice", "Latte"]), ("Has a shell", ["Egg", "Taco", "Turtle", "Pistachio"]),
         ("___cake", ["Cup", "Pan", "Cheese", "Sponge"]), ("Hides a bird", ["Wrench", "Bowl", "Lemur", "Crown"])]
SHEAF_ORDER = ["Turtle", "Cup", "Wrench", "Latte", "Pan", "Bowl", "Egg", "Juice", "Lemur", "Cheese", "Tea", "Taco",
               "Sponge", "Crown", "Pistachio", "Cocoa"]
TW, TH, TG = 56, 40, 5
def sheaf(off=12.0):
    css, html = "", ""
    pos = {w: i for i, w in enumerate(SHEAF_ORDER)}
    def xy(s):
        r, c = divmod(s, 4)
        return c * (TW + TG), r * (TH + TG)
    base = {w: xy(i) for i, w in enumerate(SHEAF_ORDER)}
    track = {w: [] for w in SHEAF_ORDER}           # (time, slot)
    sel = {}
    bands = []
    for g, (title, words) in enumerate(SHEAF):
        s = off + 0.6 + 2.6 * g
        for k, w in enumerate(words):
            sel[w] = (s + 0.18 * k, s + 1.45)
        targets = list(range(4 * g, 4 * g + 4))
        vac = [pos[w] for w in words if pos[w] not in targets]
        disp = [w for w in SHEAF_ORDER if pos[w] in targets and w not in words]
        free = [t for t in targets if t not in [pos[w] for w in words]]
        for w, t in zip([w for w in words if pos[w] not in targets], free):
            pos[w] = t; track[w].append((s + 0.9, t))
        for w, v in zip(disp, vac):
            pos[w] = v; track[w].append((s + 0.9, v))
        bands.append((g, title, words, s + 1.4))
    tiers = [mix(SHEAF_C, 0.32), mix(SHEAF_C, 0.6), SHEAF_C, SHEAF_D]
    for i, w in enumerate(SHEAF_ORDER):
        bx, by = base[w]
        stops = [(0, "transform:translate(0px,0px)")]
        cur = (0, 0)
        for t, slot in track[w]:
            nx, ny = xy(slot)
            d = (nx - bx, ny - by)
            stops += [(t, f"transform:translate({cur[0]}px,{cur[1]}px)"), (t + 0.45, f"transform:translate({d[0]}px,{d[1]}px)")]
            cur = d
        stops += [(off + 11.9, f"transform:translate({cur[0]}px,{cur[1]}px)"), (off + 12.0, "transform:translate(0px,0px)"), (MR, "transform:translate(0px,0px)")]
        css += keyframes(f"shM{i}", MR, stops)
        t_sel, t_hide = sel[w]
        css += keyframes(f"shS{i}", MR, [(0, f"background-color:#ffffff;color:#2A1500;opacity:1"), (t_sel, f"background-color:#ffffff;color:#2A1500;opacity:1"),
                                         (t_sel + 0.12, f"background-color:{SHEAF_C};color:#ffffff;opacity:1"), (t_hide, f"background-color:{SHEAF_C};color:#ffffff;opacity:1"),
                                         (t_hide + 0.1, f"background-color:{SHEAF_C};color:#ffffff;opacity:0"), (off + 12.0, "background-color:#ffffff;color:#2A1500;opacity:0"), (MR, "background-color:#ffffff;color:#2A1500;opacity:1")])
        html += (f'<span style="position: absolute; left: {bx}px; top: {by}px; width: {TW}px; height: {TH}px; animation: shM{i} {MR}s cubic-bezier(.45,0,.2,1) infinite">'
                 f'<span style="display: flex; width: 100%; height: 100%; align-items: center; justify-content: center; border-radius: 8px; font-size: 11px; font-weight: 600; letter-spacing: -0.01em; animation: shS{i} {MR}s ease infinite">{w}</span></span>')
    for g, title, words, t in bands:
        fg = "#ffffff" if g >= 2 else "#2A1500"
        css += keyframes(f"shB{g}", MR, [(0, "opacity:0;transform:scale(.94)"), (t, "opacity:0;transform:scale(.94)"), (t + 0.3, "opacity:1;transform:none"), (off + 11.9, "opacity:1;transform:none"), (off + 12.0, "opacity:0;transform:scale(.94)"), (MR, "opacity:0;transform:scale(.94)")])
        html += (f'<span style="position: absolute; left: 0; top: {g * (TH + TG)}px; width: {4 * TW + 3 * TG}px; height: {TH}px; border-radius: 8px; background-color: {tiers[g]}; color: {fg}; '
                 f'display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; opacity: 0; animation: shB{g} {MR}s ease infinite">'
                 f'<b style="font-size: 11.5px; font-weight: 700">{title}</b><span style="font-size: 10px; opacity: .85">{", ".join(words)}</span></span>')
    board = f'<div style="position: relative; width: {4 * TW + 3 * TG}px; height: {4 * TH + 3 * TG}px">{html}</div>'
    return board, css, off + 0.6 + 2.6 * 3 + 1.6

# ── Nonet: number place ──
N_GIV = "050000000004090000003600890405030010730080024090040706046001300000070100000000050"
N_SOL = "659718243184392675273654891465237918731986524892145736946521387528473169317869452"
def nonet(off=24.0):
    css, cells = "", ""
    blanks = [i for i, ch in enumerate(N_GIV) if ch == "0"]
    blanks.sort(key=lambda i: ((i // 9) // 3 * 3 + (i % 9) // 3, i))
    step = 8.6 / len(blanks)
    tmap = {i: off + 0.6 + step * k for k, i in enumerate(blanks)}
    done = off + 0.6 + step * len(blanks) + 0.2
    CL, LITE = mix(NONET_C, 0.35), mix(NONET_C, 0.18)
    for i in range(81):
        r, c = divmod(i, 9)
        x = c * 25 + (c // 3) * 3
        y = r * 25 + (r // 3) * 3
        wv = done + (r + c) * 0.03
        if N_GIV[i] != "0":
            css += keyframes(f"nnG{i}", MR, [(0, "background-color:#ffffff"), (wv, "background-color:#ffffff"), (wv + 0.2, f"background-color:{LITE}"), (off + 11.9, f"background-color:{LITE}"), (off + 12.0, "background-color:#ffffff"), (MR, "background-color:#ffffff")])
            cells += f'<span style="position: absolute; left: {x}px; top: {y}px; width: 24px; height: 24px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 12.5px; font-weight: 600; color: #6b7079; animation: nnG{i} {MR}s ease infinite">{N_GIV[i]}</span>'
        else:
            t = tmap[i]
            css += keyframes(f"nnB{i}", MR, [(0, "background-color:#ffffff;color:rgba(3,92,85,0)"), (t - 0.16, "background-color:#ffffff;color:rgba(3,92,85,0)"),
                                             (t - 0.1, f"background-color:{CL};color:rgba(3,92,85,0)"), (t, f"background-color:{CL};color:{NONET_D}"),
                                             (t + 0.14, f"background-color:#ffffff;color:{NONET_D}"), (wv, f"background-color:#ffffff;color:{NONET_D}"),
                                             (wv + 0.2, f"background-color:{LITE};color:{NONET_D}"), (off + 11.9, f"background-color:{LITE};color:{NONET_D}"),
                                             (off + 12.0, "background-color:#ffffff;color:rgba(3,92,85,0)"), (MR, "background-color:#ffffff;color:rgba(3,92,85,0)")])
            cells += f'<span style="position: absolute; left: {x}px; top: {y}px; width: 24px; height: 24px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 12.5px; font-weight: 700; animation: nnB{i} {MR}s linear infinite">{N_SOL[i]}</span>'
    board = f'<div style="position: relative; width: {9 * 24 + 6 + 6}px; height: {9 * 24 + 6 + 6}px">{cells}</div>'
    return board, css, done + 0.3

# ── Orbit: seven letters ──
O_CORE, O_RING = "v", ["d", "c", "e", "o", "i", "r"]
O_WORDS = [("dive", 1), ("cover", 3), ("voice", 3), ("driver", 5), ("divorced", 19)]
def orbit(off=12.0):
    css, html = "", ""
    cx, cy, R = 120, 146, 72
    t = off + 0.6
    uses = {ch: [] for ch in [O_CORE] + O_RING}
    words_html, chips, totals = "", "", []
    total = 0
    sub_times = []
    for wi, (w, pts) in enumerate(O_WORDS):
        letters = ""
        for li, ch in enumerate(w):
            tl = t + 0.2 * li
            uses[ch].append(tl)
            css += keyframes(f"orL{wi}_{li}", MR, [(0, "opacity:0"), (tl, "opacity:0"), (tl + 0.05, "opacity:1"), (t + 0.2 * len(w) + 0.35, "opacity:1"), (t + 0.2 * len(w) + 0.45, "opacity:0"), (MR, "opacity:0")])
            letters += f'<span style="opacity: 0; animation: orL{wi}_{li} {MR}s linear infinite">{ch.upper()}</span>'
        words_html += f'<span style="position: absolute; left: 0; right: 0; top: 0; display: flex; justify-content: center; gap: 2px">{letters}</span>'
        sub = t + 0.2 * len(w) + 0.4
        sub_times.append(sub)
        total += pts
        totals.append((sub, total))
        css += hold(f"orC{wi}", sub, off + 11.8, "opacity:1;transform:none", "opacity:0;transform:translateY(6px)")
        tag = " · full orbit" if pts > 9 else ""
        chips += (f'<span style="display: inline-flex; align-items: center; gap: 6px; height: 28px; padding: 0 10px; border-radius: 6px; background-color: #ffffff; font-size: 12.5px; font-weight: 600; color: {ORBIT_D}; opacity: 0; animation: orC{wi} {MR}s ease infinite">'
                  f'{w.upper()}<i style="font-style: normal; font-weight: 500; color: #8a7a4a">+{pts}{tag}</i></span>')
        t = sub + 0.45
    html += f'<div style="position: absolute; left: 0; right: 0; top: 14px; height: 30px; font-size: 22px; font-weight: 700; letter-spacing: 0.06em; color: {ORBIT_D}">{words_html}</div>'
    pts_ = [(cx + R * math.cos(math.radians(-90 + 60 * k)), cy + R * math.sin(math.radians(-90 + 60 * k))) for k in range(6)]
    html += f'<svg width="240" height="250" style="position: absolute; left: 0; top: 0" aria-hidden="true"><circle cx="{cx}" cy="{cy}" r="{R}" fill="none" stroke="{mix(ORBIT_C, .45)}" stroke-width="1.5" stroke-dasharray="3 5"/></svg>'
    def disc(ch, x, y, r, core):
        name = f"orP{ch}"
        base = f"background-color:{ORBIT_C};color:#ffffff;transform:scale(1)" if core else f"background-color:#ffffff;color:{ORBIT_D};transform:scale(1)"
        lit = f"background-color:{ORBIT_D};color:#ffffff;transform:scale(1.12)" if core else f"background-color:{ORBIT_C};color:#ffffff;transform:scale(1.12)"
        st = [(0, base)]
        for tu in uses[ch]:
            st += [(tu - 0.01, base), (tu + 0.05, lit), (tu + 0.22, base)]
        st.append((MR, base))
        return keyframes(name, MR, st), (f'<span style="position: absolute; left: {x - r:.0f}px; top: {y - r:.0f}px; width: {2 * r}px; height: {2 * r}px; border-radius: {2 * r}px; display: flex; align-items: center; justify-content: center; '
                                         f'font-size: {20 if core else 16}px; font-weight: 700; box-shadow: 0 2px 0 {mix(ORBIT_D, .5)}; animation: {name} {MR}s linear infinite">{ch.upper()}</span>')
    for k, ch in enumerate(O_RING):
        c_, h_ = disc(ch, pts_[k][0], pts_[k][1], 21, False)
        css += c_; html += h_
    c_, h_ = disc(O_CORE, cx, cy, 28, True)
    css += c_; html += h_
    board = f'<div style="position: relative; width: 240px; height: 250px">{html}</div>'
    st_spans = ""
    prev = 0
    seq = [(off, 0)] + totals
    for k, (ts, tot) in enumerate(seq):
        rank = "Glow" if tot >= 24 else "Spark"
        t_end = seq[k + 1][0] if k + 1 < len(seq) else off + 11.8
        css += keyframes(f"orS{k}", MR, [(0, "opacity:0"), (ts, "opacity:0"), (ts + 0.1, "opacity:1"), (t_end, "opacity:1"), (t_end + 0.1, "opacity:0"), (MR, "opacity:0")])
        st_spans += f'<span class="ncl" style="animation: orS{k} {MR}s linear infinite"><b style="font-weight: 700; color: {ORBIT_D}">Score {tot}</b>&nbsp;&nbsp;{rank}</span>'
    return board, chips, st_spans, css

# ── Skein: word threads, the knot spells the theme ──
SK_GRID = ["RDWERS", "IERIHC", "VRSRSC", "EEETOO", "MLILSA", "NMPLWS", "ANAHKC", "SPERAH"]
SK_PATHS = [("HAMMER", [[6, 3], [6, 2], [5, 1], [4, 0], [3, 0], [2, 1]]), ("PLIERS", [[5, 2], [5, 3], [4, 2], [3, 2], [2, 3], [2, 4]]),
            ("CHISEL", [[2, 5], [1, 4], [1, 3], [2, 2], [3, 1], [4, 1]]), ("SPANNER", [[7, 0], [7, 1], [6, 0], [5, 0], [6, 1], [7, 2], [7, 3]]),
            ("HACKSAW", [[7, 5], [7, 4], [6, 5], [6, 4], [5, 5], [4, 5], [5, 4]]),
            ("SCREWDRIVER", [[0, 5], [1, 5], [0, 4], [0, 3], [0, 2], [0, 1], [0, 0], [1, 0], [2, 0], [1, 1], [1, 2]])]
SK_KNOT = [[3, 3], [3, 4], [3, 5], [4, 3], [4, 4]]
def skein(off=24.0):
    css, cells, svg = "", "", ""
    S, G = 26, 3
    def cxy(r, c):
        return c * (S + G) + S / 2, r * (S + G) + S / 2
    t = off + 0.5
    when = {}
    status = ""
    word_times = []
    for wi, (w, path) in enumerate(SK_PATHS):
        dur = 0.11 * len(path)
        for k, (r, c) in enumerate(path):
            when[(r, c)] = t + 0.11 * k
        pts_ = " ".join(f"{cxy(r, c)[0]:.1f},{cxy(r, c)[1]:.1f}" for r, c in path)
        css += keyframes(f"skT{wi}", MR, [(0, "stroke-dashoffset:1"), (t, "stroke-dashoffset:1"), (t + dur, "stroke-dashoffset:0"), (off + 11.9, "stroke-dashoffset:0"), (off + 12.0, "stroke-dashoffset:1"), (MR, "stroke-dashoffset:1")])
        svg += f'<polyline points="{pts_}" pathLength="1" fill="none" stroke="{SKEIN_C}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" stroke-opacity=".55" stroke-dasharray="1" stroke-dashoffset="1" style="animation: skT{wi} {MR}s linear infinite"/>'
        word_times.append((t + dur, w))
        t = t + dur + 0.35
    knot_t = t + 0.3
    for r in range(8):
        for c in range(6):
            x, y = c * (S + G), r * (S + G)
            is_knot = [r, c] in SK_KNOT
            t_on = knot_t + 0.08 * SK_KNOT.index([r, c]) if is_knot else when[(r, c)]
            on = f"background-color:{SKEIN_D};color:#ffffff" if is_knot else f"background-color:{mix(SKEIN_C, .26)};color:{SKEIN_D}"
            css += hold(f"skC{r}_{c}", t_on, off + 11.85, on, f"background-color:#ffffff;color:{SKEIN_D}")
            cells += f'<span style="position: absolute; left: {x}px; top: {y}px; width: {S}px; height: {S}px; border-radius: {S}px; display: flex; align-items: center; justify-content: center; font-size: 12.5px; font-weight: 700; animation: skC{r}_{c} {MR}s ease infinite">{SK_GRID[r][c]}</span>'
    W_, H_ = 6 * S + 5 * G, 8 * S + 7 * G
    board = f'<div style="position: relative; width: {W_}px; height: {H_}px">{cells}<svg width="{W_}" height="{H_}" style="position: absolute; left: 0; top: 0; pointer-events: none" aria-hidden="true">{svg}</svg></div>'
    seq = word_times + [(knot_t + 0.4, None)]
    for k, (ts, w) in enumerate(seq):
        t_end = seq[k + 1][0] if k + 1 < len(seq) else off + 11.8
        css += keyframes(f"skS{k}", MR, [(0, "opacity:0"), (ts, "opacity:0"), (ts + 0.1, "opacity:1"), (t_end, "opacity:1"), (t_end + 0.1, "opacity:0"), (MR, "opacity:0")])
        txt = (f'<b style="font-weight: 700; color: {SKEIN_D}">{w}</b>&nbsp;&nbsp;{k + 1} of 6 threads' if w else f'<b style="font-weight: 700; color: {SKEIN_D}">Knot</b>&nbsp;&nbsp;TOOLS, in the workshop')
        status += f'<span class="ncl" style="animation: skS{k} {MR}s linear infinite">{txt}</span>'
    return board, status, css, knot_t + 0.5

# ── the modal stage ──
GAME_INFO = {
    "quint": (QUINT, "Five letters", "Quint", "Find the five-letter word in six tries."),
    "sheaf": (SHEAF_C, "Four bundles", "Sheaf", "Sixteen words hide four bundles of four."),
    "nonet": (NONET_C, "Number place", "Nonet", "Nine rows, nine columns, nine boxes, no repeats."),
    "nib": (NIB, "Mini crossword", "Nib", "A five-by-five crossword with a big middle."),
    "orbit": (ORBIT_C, "Seven letters", "Orbit", "Spin as many words as you can from seven letters."),
    "skein": (SKEIN_C, "Word threads", "Skein", "Trace six themed words through the letters."),
}
def header(key, ink="#3d4a42"):
    col, tag, name, line = GAME_INFO[key]
    return (f'<span style="display: inline-flex; align-items: center; gap: 8px; font-size: 14px; color: {ink}"><i style="width: 9px; height: 9px; border-radius: 3px; background-color: {col}"></i>{tag}</span>'
            f'<span style="margin-top: 6px; font-weight: 700; font-size: 44px; line-height: 1; letter-spacing: -0.035em; color: #111214">{name}</span>'
            f'<span style="margin-top: 10px; max-width: 250px; font-size: 14px; line-height: 1.5; color: {ink}">{line}</span>')

def morrow_modal():
    css = ""
    for r in range(3):
        css += rwin(f"mrA{r}", r)
    sh_board, sh_css, sh_done = sheaf(12.0)
    nn_board, nn_css, nn_done = nonet(24.0)
    or_board, or_chips, or_status, or_css = orbit(12.0)
    sk_board, sk_status, sk_css, sk_done = skein(24.0)
    css += sh_css + nn_css + or_css + sk_css
    # the bar fills as each game is solved
    segs_cols = ["#4B63E6", QUINT, SHEAF_C, SKEIN_C, ORBIT_C, NIB, NONET_C, "#3A90DA", "#BE56D4", "#76AE34", "#EC6753"]
    solved = {1: Q_SOLVE + 0.4, 5: N_SOLVE + 0.2, 2: sh_done, 4: 12.0 + 10.3, 6: nn_done, 3: sk_done}
    segs = ""
    for i, col in enumerate(segs_cols):
        fill = ""
        if i == 0:
            fill = f'<span style="position: absolute; inset: 0; background-color: {col}"></span>'
        elif i in solved:
            t = solved[i]
            css += keyframes(f"mrSeg{i}", MR, [(0, "transform:scaleX(0)"), (t, "transform:scaleX(0)"), (t + 0.5, "transform:scaleX(1)"), (MR - 0.5, "transform:scaleX(1)"), (MR - 0.1, "transform:scaleX(0)"), (MR, "transform:scaleX(0)")])
            fill = f'<span style="position: absolute; inset: 0; background-color: {col}; transform-origin: left center; animation: mrSeg{i} {MR}s linear infinite"></span>'
        segs += f'<span style="position: relative; flex: 1; height: 6px; border-radius: 6px; overflow: hidden; background-color: {mix(col, .28)}">{fill}</span>'
    times = sorted(solved.values())
    counts = ""
    seq = [(0.0, 1)] + [(t, k + 2) for k, t in enumerate(times)]
    for k, (ts, n) in enumerate(seq):
        t_end = seq[k + 1][0] if k + 1 < len(seq) else MR - 0.3
        if k == 0:
            st = [(0, "opacity:1"), (t_end, "opacity:1"), (t_end + 0.1, "opacity:0"), (MR - 0.3, "opacity:0"), (MR - 0.2, "opacity:1"), (MR, "opacity:1")]
        else:
            st = [(0, "opacity:0"), (ts, "opacity:0"), (ts + 0.1, "opacity:1"), (t_end, "opacity:1"), (t_end + 0.1, "opacity:0"), (MR, "opacity:0")]
        css += keyframes(f"mrN{k}", MR, st)
        counts += f'<span style="position: absolute; right: 0; top: 0; white-space: nowrap; opacity: {1 if k == 0 else 0}; animation: mrN{k} {MR}s linear infinite">{n} of 11 solved</span>'
    toast = (f'<span style="position: absolute; left: 50%; bottom: -14px; display: inline-flex; align-items: center; gap: 7px; height: 34px; padding: 0 14px; border-radius: 34px; background-color: #111214; color: #fff; {FIG}; font-size: 13.5px; font-weight: 600; white-space: nowrap; opacity: 0; animation: MqToast {MR}s linear infinite">'
             f'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>Solved in 3</span>')
    logo = f'<span style="display: inline-flex; align-items: center; gap: 9px">{MARK}<span style="{FIG}; font-weight: 700; font-size: 22px; letter-spacing: -0.02em; color: #111214">morrow</span></span>'
    timer = ('<span style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: #3d4a42"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>'
             'New set in <b style="font-weight: 600; color: #111214; font-variant-numeric: tabular-nums">{{cd}}</b></span>')
    def lane_bg(cols):
        return "".join(f'<div style="position: absolute; inset: 0; background-color: {c}; animation: mrA{r} {MR}s linear infinite"></div>' for r, c in enumerate(cols))
    def game(r, key, board, extra="", board_top=0, ink="#3d4a42"):
        return (f'<div style="position: absolute; inset: 0; opacity: {1 if r == 0 else 0}; animation: mrA{r} {MR}s linear infinite">'
                f'<div style="position: absolute; left: 40px; top: {board_top}px; width: 256px; display: flex; flex-direction: column">{header(key, ink)}{extra}</div>'
                f'<div style="position: absolute; right: 40px; top: {board_top}px; width: 240px; display: flex; justify-content: center">{board}</div></div>')
    top = (f'<div style="position: relative; height: 420px; overflow: hidden">{lane_bg([QWASH, mix(SHEAF_C, .13), mix(NONET_C, .12)])}'
           f'<div style="position: absolute; left: 40px; right: 40px; top: 40px; height: 36px; display: flex; align-items: center; justify-content: space-between">{logo}{timer}</div>'
           + game(0, "quint", f'<div style="position: relative">{quint_board(38, 5, "Mq", MR)}{toast}</div>', board_top=104)
           + game(1, "sheaf", sh_board, board_top=110)
           + game(2, "nonet", nn_board, board_top=100)
           + f'<div style="position: absolute; left: 40px; width: 256px; bottom: 40px; display: flex; flex-direction: column; gap: 9px">'
             f'<div style="position: relative; height: 18px; font-size: 13px; color: #3d4a42"><span>Today’s eleven</span>{counts}</div>'
             f'<div style="display: flex; gap: 4px">{segs}</div></div></div>')
    bottom = (f'<div style="position: relative; height: 360px; overflow: hidden">{lane_bg([NWASH, mix(ORBIT_C, .15), mix(SKEIN_C, .11)])}'
              + game(0, "nib", nib_board(40, 4), board_top=28, ink="#5a3a45")
              + game(1, "orbit", or_board, extra=f'<div style="margin-top: 18px; display: flex; flex-wrap: wrap; gap: 6px">{or_chips}</div>', board_top=28, ink="#5a4a1e")
              + game(2, "skein", sk_board, board_top=28, ink="#43386a")
              + f'<div style="position: absolute; left: 40px; width: 256px; bottom: 40px; height: 44px; font-size: 14px; line-height: 1.4; color: #3a2a30">'
                f'<div style="position: absolute; inset: 0; opacity: 1; animation: mrA0 {MR}s linear infinite">{nib_clues()}</div>'
                f'<div style="position: absolute; inset: 0; opacity: 0; animation: mrA1 {MR}s linear infinite">{or_status}</div>'
                f'<div style="position: absolute; inset: 0; opacity: 0; animation: mrA2 {MR}s linear infinite">{sk_status}</div></div></div>')
    return f'<div class="mo" aria-hidden="true" style="display: flex; flex-direction: column">{top}{bottom}</div>', css


MODAL_MORROW, MORROW_CSS = morrow_modal()

# ------------------------------------------------------------------ Compliance SLM (the regulatory model)
AC = 12.0
HL = [(0.8, 1.9), (3.0, 4.1), (5.2, 6.1)]
FD = [(1.8, 2.4), (4.0, 4.6), (6.0, 6.6)]
DONE = (7.2, 7.8)
def a_kf():
    css = ""
    for j, (a, b) in enumerate(HL):
        css += keyframes(f"hl{j}", AC, [(0, "background-size:0% 1.5px;color:rgba(255,255,255,.74)"), (a, "background-size:0% 1.5px;color:rgba(255,255,255,.74)"),
                                        (b, "background-size:100% 1.5px;color:#fff"), (10.9, "background-size:100% 1.5px;color:#fff"),
                                        (11.6, "background-size:0% 1.5px;color:rgba(255,255,255,.74)"), (AC, "background-size:0% 1.5px;color:rgba(255,255,255,.74)")])
    for j, (a, b) in enumerate(FD + [DONE]):
        css += keyframes(f"fd{j}", AC, [(0, "opacity:0;transform:translateY(10px)"), (a, "opacity:0;transform:translateY(10px)"), (b, "opacity:1;transform:none"),
                                        (10.9, "opacity:1;transform:none"), (11.5, "opacity:0;transform:translateY(-4px)"), (AC, "opacity:0;transform:translateY(10px)")])
    return css

FINDINGS = [("No documented risk process", "Risk register, reviewed each quarter"),
            ("Records not kept for the system’s life", "Retention policy on audit logs"),
            ("No named oversight", "A named reviewer signs each release")]

def auditor(mode):
    card = mode == "card"
    art = ('Providers shall <span class="hl" style="animation-name: hl0">establish and document a risk management process</span> for the system, '
           'and shall <span class="hl" style="animation-name: hl1">keep records of its operation for as long as it is in use</span>. '
           'A <span class="hl" style="animation-name: hl2">named person shall oversee</span> each release before it reaches users.')
    fds = "".join(f'<div class="fd" style="animation-name: fd{j}; display: flex; flex-direction: column; gap: 3px">'
                  f'<span style="font-size: 16px; font-weight: 500; letter-spacing: -0.01em">{r}</span>'
                  f'<span style="font-size: 14px; color: #dbe5f1">→ {c}</span></div>' for j, (r, c) in enumerate(FINDINGS))
    chip = ('<div class="fd" style="animation-name: fd3; height: 44px; display: flex; align-items: center; gap: 14px">'
            '<span style="display: inline-flex; align-items: center; gap: 8px; height: 44px; box-sizing: border-box; padding: 0 16px; border-radius: 8px; background-color: #ffffff; color: #111214; font-size: 14px; font-weight: 500">'
            '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#111214" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>Sent to the reviewer</span>'
            '<span style="font-size: 14px; color: #dbe5f1">3 risks, 3 controls</span></div>')
    lab = f'<span style="height: 36px; display: flex; align-items: center; {MONO}; font-size: 10.5px; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.85">'
    if card:
        body = f'''<div style="position: relative; height: 100%; box-sizing: border-box; padding: 36px; display: grid; grid-template-columns: minmax(0, 1.08fr) minmax(0, 1fr); column-gap: 40px; grid-template-rows: auto 1fr auto; color: #ffffff">
      {lab}Article 9 · Sample</span>{lab}Risks that bind</span>
      <p style="margin: 10px 0 0; font-size: 19px; line-height: 1.6; color: rgba(255,255,255,0.74)">{art}</p>
      <div style="margin-top: 10px; display: flex; flex-direction: column; gap: 16px">{fds}</div>
      <div style="display: flex; align-items: baseline; gap: 12px"><span style="font-size: 44px; line-height: 1; font-weight: 500; letter-spacing: -0.045em">94 in 100</span><span style="font-size: 13px; line-height: 1.35; color: #dbe5f1">match the<br>reviewer</span></div>
      {chip}</div>'''
    else:
        body = f'''<div style="position: relative; height: 100%; box-sizing: border-box; padding: 40px; display: flex; flex-direction: column; color: #ffffff">
      {lab}Article 9 · Sample</span>
      <p style="margin: 14px 0 0; font-size: 20px; line-height: 1.6; color: rgba(255,255,255,0.74)">{art}</p>
      <div style="margin-top: 36px; display: flex; flex-direction: column; gap: 18px">{lab}Risks that bind</span>{fds}</div>
      <div style="margin-top: auto">{chip}</div></div>'''
    return f'''<div class="au" aria-hidden="true">
  <img class="paint" src="{PAINT}" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover">
  <div style="position: absolute; inset: 0; background: linear-gradient(100deg, rgba(14,28,48,0.56) 0%, rgba(14,28,48,0.3) 60%, rgba(14,28,48,0.36) 100%)"></div>
  {body}
</div>'''

# ------------------------------------------------------------------ Library-backed extraction
# A policy is read; each binding phrase lights the control it maps to in a standard library.
EC = 12.0
EX_TEXT = [("Users get ", None), ("access only through a request their manager approves", 0), (", and every account is reviewed each quarter. Administrators hold ", None),
           ("only the rights their role needs", 1), (". ", None), ("Security logs are read every week", 2), (" by a named person.", None)]
EX_LIB = [("AC-2", "Account management", 0), ("AC-6", "Least privilege", 1), ("AU-6", "Audit record review", 2),
          ("CP-9", "System backup", None), ("IA-2", "Identification and authentication", None), ("IR-4", "Incident handling", None)]
EX_T = [0.8, 3.0, 5.2]
def ex_kf():
    css = ""
    for j, t in enumerate(EX_T):
        css += keyframes(f"exP{j}", EC, [(0, "background-size:0% 2px;color:#4a4f57"), (t, "background-size:0% 2px;color:#4a4f57"), (t + 1.0, "background-size:100% 2px;color:#111214"),
                                         (10.9, "background-size:100% 2px;color:#111214"), (11.5, "background-size:0% 2px;color:#4a4f57"), (EC, "background-size:0% 2px;color:#4a4f57")])
        css += keyframes(f"exR{j}", EC, [(0, "background-color:#ffffff"), (t + 0.8, "background-color:#ffffff"), (t + 1.1, "background-color:#dbe7f4"),
                                         (10.9, "background-color:#dbe7f4"), (11.5, "background-color:#ffffff"), (EC, "background-color:#ffffff")])
        css += keyframes(f"exK{j}", EC, [(0, "opacity:0;transform:scale(.6)"), (t + 0.9, "opacity:0;transform:scale(.6)"), (t + 1.2, "opacity:1;transform:none"),
                                         (10.9, "opacity:1;transform:none"), (11.5, "opacity:0;transform:scale(.6)"), (EC, "opacity:0;transform:scale(.6)")])
    css += keyframes("exChip", EC, [(0, "opacity:0;transform:translateY(8px)"), (7.4, "opacity:0;transform:translateY(8px)"), (7.9, "opacity:1;transform:none"),
                                    (10.9, "opacity:1;transform:none"), (11.5, "opacity:0;transform:none"), (EC, "opacity:0;transform:translateY(8px)")])
    css += keyframes("exDim", EC, [(0, "opacity:1"), (7.4, "opacity:1"), (7.9, "opacity:.45"), (10.9, "opacity:.45"), (11.5, "opacity:1"), (EC, "opacity:1")])
    return css

def extraction(mode):
    card = mode == "card"
    pad = 36 if card else 40
    lab = f'<span style="height: 36px; display: flex; align-items: center; {MONO}; font-size: 10.5px; letter-spacing: 0.12em; text-transform: uppercase; color: #6b7079">'
    txt = "".join(f'<span class="exp" style="animation: exP{j} {EC}s linear infinite">{s}</span>' if j is not None else s for s, j in EX_TEXT)
    rows = ""
    for code, name, j in EX_LIB:
        anim = f"exR{j} {EC}s ease infinite" if j is not None else f"exDim {EC}s ease infinite"
        tick = (f'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2f5b8c" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" '
                f'style="margin-left: auto; flex: none; opacity: 0; animation: exK{j} {EC}s ease infinite"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>') if j is not None else ""
        rows += (f'<div style="display: flex; align-items: center; gap: 12px; height: {38 if card else 42}px; padding: 0 12px; border-radius: 8px; background-color: #ffffff; animation: {anim}">'
                 f'<span style="{MONO}; font-size: 11px; color: #2f5b8c; width: 34px">{code}</span><span style="font-size: 14px; color: #111214; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{name}</span>{tick}</div>')
    chip = (f'<div style="opacity: 0; animation: exChip {EC}s ease infinite; display: flex; align-items: center; gap: 12px; height: 44px">'
            f'<span style="display: inline-flex; align-items: center; gap: 8px; height: 44px; box-sizing: border-box; padding: 0 16px; border-radius: 8px; background-color: #111214; color: #ffffff; font-size: 14px; font-weight: 500">'
            f'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>3 found</span>'
            f'<span style="font-size: 14px; color: #4a4f57">each one already in the library</span></div>')
    if card:
        body = (f'<div style="position: relative; height: 100%; box-sizing: border-box; padding: {pad}px; display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); column-gap: 36px; grid-template-rows: auto 1fr auto">'
                f'{lab}Policy · Access</span>{lab}Library · Standard controls</span>'
                f'<p style="margin: 10px 0 0; font-size: 19px; line-height: 1.6; color: #4a4f57">{txt}</p>'
                f'<div style="margin-top: 10px; display: flex; flex-direction: column; gap: 6px">{rows}</div>'
                f'<div style="grid-column: 1 / -1">{chip}</div></div>')
    else:
        body = (f'<div style="position: relative; height: 100%; box-sizing: border-box; padding: {pad}px; display: flex; flex-direction: column">'
                f'{lab}Policy · Access</span>'
                f'<p style="margin: 14px 0 0; font-size: 20px; line-height: 1.6; color: #4a4f57">{txt}</p>'
                f'<div style="margin-top: 32px; display: flex; flex-direction: column; gap: 6px">{lab}Library · Standard controls</span>{rows}</div>'
                f'<div style="margin-top: auto">{chip}</div></div>')
    return f'<div class="ex" aria-hidden="true">{body}</div>'


STAGE_CSS = """
.mu{position:absolute;inset:0;color:#fff;overflow:hidden}
.mu-sky{position:absolute;inset:0;animation:phOn @MC@s linear infinite}
@keyframes phOn{0%{opacity:1}22%{opacity:1}29%{opacity:0}96%{opacity:0}100%{opacity:1}}
.mu-t{position:absolute;left:0;top:0;white-space:nowrap;animation:phTxt @MC@s ease infinite}
.r > .mu-t{left:auto;right:0}
@keyframes phTxt{0%{opacity:1;transform:none}21%{opacity:1;transform:none}25%{opacity:0;transform:translateY(-8px)}96%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:none}}
.mu-cl{position:absolute;pointer-events:none;user-select:none}
.mu-cl.c1{width:78%;left:-22%;top:-8%;opacity:.75;animation:clA 46s ease-in-out infinite alternate}
.mu-cl.c2{width:36%;right:-6%;top:22%;opacity:.7;animation:clB 38s ease-in-out infinite alternate}
.mu-cl.c3{width:90%;right:-34%;bottom:-16%;opacity:.55;transform:scaleX(-1);animation:clC 54s ease-in-out infinite alternate}
@keyframes clA{from{transform:translateX(0) scale(1)}to{transform:translateX(14%) scale(1.06)}}
@keyframes clB{from{transform:translateX(0)}to{transform:translateX(-30%) translateY(6%)}}
@keyframes clC{from{transform:scaleX(-1) translateX(0)}to{transform:scaleX(-1) translateX(12%)}}
.mu-w{animation:wv 9s linear infinite}.mu-w.w2{animation-duration:13s}
@keyframes wv{from{transform:translateX(0)}to{transform:translateX(-800px)}}
.mu-eq{display:inline-flex;align-items:flex-end;gap:2px;height:14px}.mu-eq i{display:block;width:3px;height:100%;border-radius:2px;background:#b35c12;transform-origin:bottom;animation:eq .9s ease-in-out infinite alternate}
.mu-eq i:nth-child(2){animation-delay:-.4s}.mu-eq i:nth-child(3){animation-delay:-.7s}
@keyframes eq{from{transform:scaleY(.3)}to{transform:scaleY(1)}}
.mo{position:absolute;inset:0;font-family:Figtree,ui-sans-serif,system-ui,sans-serif;color:#111214;overflow:hidden}
.qt{position:relative;display:flex;align-items:center;justify-content:center;width:var(--t);height:var(--t);border-radius:calc(var(--t) * .22);background:#fff;font-family:'Bricolage Grotesque',ui-sans-serif,system-ui,sans-serif;font-weight:700;color:rgba(6,96,58,0);overflow:hidden;animation-duration:@QC@s;animation-timing-function:linear;animation-iteration-count:infinite}
.qt.e{animation:none}
.nc{position:relative;display:flex;align-items:center;justify-content:center;border-radius:6px;background:#fff;font-family:'Bricolage Grotesque',ui-sans-serif,system-ui,sans-serif;font-weight:700;color:rgba(140,18,55,0);animation-duration:@NC@s;animation-timing-function:linear;animation-iteration-count:infinite}
.ncl{position:absolute;left:0;top:0;right:0;bottom:0;display:flex;align-items:center;opacity:0;animation-duration:@NC@s;animation-timing-function:linear;animation-iteration-count:infinite}
.au{position:absolute;inset:0;overflow:hidden;font-family:Geist,ui-sans-serif,system-ui,sans-serif}
.paint{animation:drift 26s ease-in-out infinite alternate}
@keyframes drift{from{transform:scale(1.06) translateX(-1.2%)}to{transform:scale(1.06) translateX(1.2%)}}
.hl{background-image:linear-gradient(#fff,#fff);background-repeat:no-repeat;background-position:0 100%;background-size:0% 1.5px;padding-bottom:2px;animation-duration:@AC@s;animation-timing-function:linear;animation-iteration-count:infinite}
.fd{opacity:0;animation-duration:@AC@s;animation-timing-function:cubic-bezier(.2,.7,.2,1);animation-iteration-count:infinite}
""".replace("@MC@", f"{MC:.1f}").replace("@QC@", f"{QC:.1f}").replace("@NC@", f"{NC:.1f}").replace("@AC@", f"{AC:.1f}")
STAGE_CSS += q_tile_kf() + q_tile_kf("Mq", MR) + nib_kf() + a_kf() + MORROW_CSS + ex_kf()
STAGE_CSS += ".ex{position:absolute;inset:0;overflow:hidden;background:#f7f7f5;font-family:Geist,ui-sans-serif,system-ui,sans-serif}.exp{background-image:linear-gradient(#2f5b8c,#2f5b8c);background-repeat:no-repeat;background-position:0 100%;background-size:0% 2px;padding-bottom:2px}"

REDUCED = ("@media (prefers-reduced-motion: reduce){*,*::before,*::after{animation:none!important;transition-duration:.01ms!important}"
           ".mu-t~.mu-t,.mu-sky~.mu-sky,.ncl~.ncl{display:none}.ncl{opacity:1}.fd{opacity:1}.hl{color:#fff;background-size:100% 1.5px}"
           ".qt:not(.e){background:#24A26A;color:#fff}.nc{color:#8C1237}}")
