# AWS explorer, round two: same cabinet, a real three-step motion per service, and the three steps named
# above the drawing, lighting up in time. Patches the live board so the founders' own edits stay.
import json, re, sys
SP = "/private/tmp/claude-501/-Users-aleksandarkotevski-Library-Application-Support-Claude-scratch-workspaces-86fa8aec-a9c5-48c3-8ba3-d5783d7de619-e3116774-42dd-42bc-a238-1515e779fa24-scratch-2026-11-11-84e6d2/e3e40e52-5b1a-454d-bc1a-4f8ac9aa0348/scratchpad"
mv = json.loads(open(SP + "/v10/cab.json").read())
svg = open(SP + "/v10/cab.svg").read().replace('role="img" aria-label="', 'role="img" style="display:block;max-width:100%;max-height:100%;width:auto;height:auto" aria-label="')
T = 9.0
LIT, FAINT = "#2f6fb0", "#c3c8cf"

def p(t):
    return f"{max(0, min(100, t / T * 100)):.2f}%"

def kf(name, stops):
    stops = sorted(stops, key=lambda s: s[0])
    out, last = [], None
    for t, body in stops:
        q = p(t)
        if q == last:
            out[-1] = f"{q}{{{body}}}"
        else:
            out.append(f"{q}{{{body}}}")
        last = q
    return f"@keyframes {name}{{" + "".join(out) + "}"

def tr(v, k=1.0):
    return f"translate({v[0] * k:.1f}px,{v[1] * k:.1f}px)"

def led_on(name, t_on, t_off=8.5):
    return kf(name, [(0, f"fill:{FAINT}"), (t_on, f"fill:{FAINT}"), (t_on + 0.2, f"fill:{LIT}"), (t_off, f"fill:{LIT}"), (t_off + 0.3, f"fill:{FAINT}"), (T, f"fill:{FAINT}")])

def vis(name, t_on, t_off=8.6, prop="opacity"):
    return kf(name, [(0, f"{prop}:0"), (t_on, f"{prop}:0"), (t_on + 0.3, f"{prop}:1"), (t_off, f"{prop}:1"), (t_off + 0.3, f"{prop}:0"), (T, f"{prop}:0")])

css = """
body{margin:0}
a{color:#111214}a:hover{color:#2f6fb0}
.tab{all:unset;box-sizing:border-box;cursor:pointer;display:flex;flex-direction:column;gap:6px;padding:18px 22px 20px;border-radius:12px 12px 0 0;text-align:left;font-family:Geist,ui-sans-serif,system-ui,sans-serif;transition:background-color .3s}
.tab .top{display:flex;align-items:center;gap:10px;min-height:18px;font-family:'Geist Mono',ui-monospace,monospace;font-size:11px;letter-spacing:.06em;color:#a3a8b0}
.tab .tag{height:18px;padding:0 6px;display:inline-flex;align-items:center;border-radius:4px;background:#f3f2ee;font-size:9.5px;letter-spacing:.08em;text-transform:uppercase;color:#8a8f98;transition:background-color .3s}
.tab .tag:empty{display:none}
.tab .ttl{font-size:16px;font-weight:500;letter-spacing:-.015em;color:#8a8f98;transition:color .25s}
.tab .sh{font-size:13.5px;line-height:1.4;color:#b4b8bf;transition:color .25s}
.tab:hover .ttl{color:#111214}
.tab{position:relative;z-index:1}
.tab.on .tag{background:#ffffff}
.tab.on .ttl{color:#111214}
.tab.on .sh{color:#6b7079}
.tab:focus-visible{outline:2px solid #2f6fb0;outline-offset:-2px}
.slide{position:absolute;top:0;bottom:0;width:20%;border-radius:12px 12px 0 0;background:#f7f7f5;transition:left .55s cubic-bezier(.2,.7,.2,1)}
.sa{animation:sa .6s cubic-bezier(.2,.7,.2,1) both}.sb{animation:sb .6s cubic-bezier(.2,.7,.2,1) both}
@keyframes sa{from{opacity:0;transform:translateX(18px)}}@keyframes sb{from{opacity:0;transform:translateX(18px)}}
.bt{display:inline-flex;align-items:center;gap:8px;color:#b4b8bf}
.bt i{font-style:normal;width:18px;height:18px;border-radius:4px;display:inline-flex;align-items:center;justify-content:center;background:#ebeae6;color:#8a8f98;font-size:9.5px}
.fig .l{opacity:0;transition:opacity .4s}.fig .n{transition:opacity .4s}
.fig .glass,.fig .cond,.fig .scan,.fig .prod,.fig .ext,.fig .sweep,.fig .tick,.fig .pulse{opacity:0}
.fig .hit{transform-box:view-box}
.fig .sq,.fig .sa1,.fig .sa2,.fig .sa3{transform-box:fill-box;transform-origin:left center}
@keyframes flow{to{stroke-dashoffset:-21}}
@keyframes pulse{from{stroke-dashoffset:114}to{stroke-dashoffset:0}}
@keyframes turn{from{transform:rotate(0)}to{transform:rotate(-90deg)}}
@keyframes sweepx{from{transform:translate(0,0)}to{transform:@SWEEP@}}
"""
css = css.replace("@SWEEP@", tr(mv["sweep"]))
TRAYS = [1, 2, 3, 4, 5]

# ── Landing Zone: accounts slide in one by one, the guardrail drops and locks, then every account's logs run down to one archive
for k, i in enumerate(TRAYS):
    t = 0.15 + 0.3 * k
    css += kf(f"lzIn{i}", [(0, f"transform:{tr(mv['slide'])};opacity:0"), (t, f"transform:{tr(mv['slide'])};opacity:0"), (t + 0.7, "transform:none;opacity:1"),
                           (8.5, "transform:none;opacity:1"), (8.9, f"transform:{tr(mv['slide'])};opacity:0"), (T, f"transform:{tr(mv['slide'])};opacity:0")])
    css += f".m-lz .si.s{i}{{animation:lzIn{i} 9s cubic-bezier(.2,.7,.2,1) infinite}}"
    css += led_on(f"lzL{i}", t + 0.6) + f".m-lz .led.l{i} path{{animation:lzL{i} 9s ease infinite}}"
css += kf("lzMig", [(0, "transform:translate(0,0)"), (1.6, "transform:translate(0,0)"), (2.6, f"transform:{tr(mv['mig'])}"), (8.5, f"transform:{tr(mv['mig'])};opacity:1"),
                    (8.8, f"transform:{tr(mv['mig'])};opacity:0"), (8.85, "transform:translate(0,0);opacity:0"), (T, "transform:translate(0,0);opacity:1")])
css += ".m-lz .migtray{animation:lzMig 9s cubic-bezier(.45,0,.2,1) infinite}"
css += led_on("lzL0", 2.5) + ".m-lz .led.l0 path{animation:lzL0 9s ease infinite}"
css += kf("lzLock", [(0, f"transform:{tr(mv['lock'])};opacity:0"), (2.9, f"transform:{tr(mv['lock'])};opacity:0"), (3.2, f"transform:{tr(mv['lock'])};opacity:1"), (4.1, "transform:translate(0,0);opacity:1"), (8.5, "transform:translate(0,0);opacity:1"), (8.9, "transform:translate(0,0);opacity:0"), (T, f"transform:{tr(mv['lock'])};opacity:0")])
css += ".m-lz .lockbar{animation:lzLock 9s cubic-bezier(.45,0,.2,1) infinite}"
css += vis("lzLockL", 3.6) + ".m-lz .lockbar .l{animation:lzLockL 9s ease infinite}"
css += vis("lzCond", 6.0) + ".m-lz .cond{animation:lzCond 9s ease infinite}.m-lz .logflow{animation:flow .8s linear infinite}"

# ── Architect as a Service: the 40-hour dial starts, a review bar goes down the accounts one by one, then a decision record prints
css += kf("aasNeedle", [(0, "transform:rotate(0)"), (0.3, "transform:rotate(0)"), (6.0, "transform:rotate(358deg)"), (8.5, "transform:rotate(358deg)"), (8.9, "transform:rotate(360deg)"), (T, "transform:rotate(360deg)")])
css += ".m-aas .needle{animation:aasNeedle 9s cubic-bezier(.45,0,.55,1) infinite}.m-aas .needle .l{opacity:1}.m-aas .needle .n{opacity:0}"
st = mv["step"]
stops = [(0, "transform:translate(0,0)")]
for k in range(5):
    t = 3.0 + 0.62 * k
    stops += [(t, f"transform:translate({st[0] * k:.1f}px,{st[1] * k:.1f}px)"), (t + 0.37, f"transform:translate({st[0] * k:.1f}px,{st[1] * k:.1f}px)")]
stops.append((T, f"transform:translate({st[0] * 4:.1f}px,{st[1] * 4:.1f}px)"))
css += kf("aasScan", stops) + ".m-aas .sc{animation:aasScan 9s cubic-bezier(.45,0,.2,1) infinite}"
css += vis("aasScanV", 2.7, 5.9) + ".m-aas .scan{animation:aasScanV 9s ease infinite}"
for k, i in enumerate([5, 4, 3, 2, 1]):
    css += led_on(f"aasL{i}", 3.1 + 0.62 * k) + f".m-aas .led.l{i} path{{animation:aasL{i} 9s ease infinite}}"
pa = mv["paper"]
css += kf("aasPrint", [(0, "transform:translate(0,0);opacity:1"), (6.2, "transform:translate(0,0);opacity:1"), (7.3, f"transform:{tr(pa)};opacity:1"), (8.5, f"transform:{tr(pa)};opacity:1"),
                       (8.8, f"transform:{tr(pa)};opacity:0"), (8.85, "transform:translate(0,0);opacity:0"), (T, "transform:translate(0,0);opacity:0")])
css += ".m-aas .paper{animation:aasPrint 9s ease infinite}.m-aas .paper .l{opacity:1}.m-aas .paper .n{opacity:0}"

# ── Sovereign AI Perimeter: glass walls come down around the account, questions arrive over the one private cable, a public call bounces off
css += kf("sapGlass", [(0, f"transform:{tr(mv['glass'])};opacity:0"), (0.2, f"transform:{tr(mv['glass'])};opacity:0"), (2.2, "transform:translate(0,0);opacity:1"),
                       (8.5, "transform:translate(0,0);opacity:1"), (8.9, "transform:translate(0,0);opacity:0"), (T, f"transform:{tr(mv['glass'])};opacity:0")])
css += ".m-sap .glass{animation:sapGlass 9s cubic-bezier(.2,.7,.2,1) infinite}"
css += vis("sapGate", 3.0) + ".m-sap .pulse{animation:pulse 1.4s linear infinite,sapGate 9s ease infinite}"
css += vis("sapVl", 3.4) + kf("sapVn", [(0, "opacity:1"), (3.4, "opacity:1"), (3.7, "opacity:0"), (8.6, "opacity:0"), (8.9, "opacity:1"), (T, "opacity:1")])
css += ".m-sap .vault .l{animation:sapVl 9s ease infinite}.m-sap .vault .n{animation:sapVn 9s ease infinite}.m-sap .vdial{animation:turn 1.6s cubic-bezier(.45,0,.55,1) infinite alternate}"
css += led_on("sapL1", 3.5) + ".m-sap .led.l1 path{animation:sapL1 9s ease infinite}"
css += ".m-sap .ext{opacity:1}"
css += kf("sapE1", [(0, "stroke-dashoffset:132;opacity:1"), (6.1, "stroke-dashoffset:132;opacity:1"), (6.9, "stroke-dashoffset:32;opacity:1"), (6.95, "stroke-dashoffset:32;opacity:0"), (T, "stroke-dashoffset:132;opacity:0")])
css += kf("sapE2", [(0, "stroke-dashoffset:110;opacity:0"), (6.9, "stroke-dashoffset:110;opacity:0"), (6.95, "stroke-dashoffset:110;opacity:1"), (7.9, "stroke-dashoffset:45;opacity:0"), (T, "stroke-dashoffset:45;opacity:0")])
css += kf("sapHit", [(0, "opacity:0;transform:scale(.4)"), (6.85, "opacity:0;transform:scale(.4)"), (6.95, "opacity:1;transform:scale(.7)"), (7.8, "opacity:0;transform:scale(1.7)"), (T, "opacity:0;transform:scale(1.7)")])
css += ".m-sap .e1{animation:sapE1 9s linear infinite}.m-sap .e2{animation:sapE2 9s ease-out infinite}.m-sap .hit{animation:sapHit 9s ease-out infinite}"

# ── Migration: the workload rolls half in, to staging; checks run until three ticks agree; then it goes all the way in, to production
mg = mv["mig"]
css += kf("migRoll", [(0, "transform:translate(0,0);opacity:1"), (0.3, "transform:translate(0,0);opacity:1"), (2.3, f"transform:{tr(mg, .55)};opacity:1"), (5.8, f"transform:{tr(mg, .55)};opacity:1"),
                      (6.9, f"transform:{tr(mg)};opacity:1"), (8.5, f"transform:{tr(mg)};opacity:1"), (8.8, f"transform:{tr(mg)};opacity:0"), (8.85, "transform:translate(0,0);opacity:0"), (T, "transform:translate(0,0);opacity:1")])
css += ".m-mig .migtray{animation:migRoll 9s cubic-bezier(.45,0,.2,1) infinite}"
css += vis("migSw", 2.7, 5.5) + ".m-mig .sweep{animation:migSw 9s ease infinite}.m-mig .sw{animation:sweepx .9s ease-in-out infinite alternate}"
for k in range(3):
    css += vis(f"migT{k}", 3.4 + 0.75 * k) + f".m-mig .tick.t{k}{{animation:migT{k} 9s ease infinite}}"
css += vis("migLit", 6.6) + ".m-mig .migtray .l{animation:migLit 9s ease infinite}"
css += led_on("migL0", 6.8) + ".m-mig .led.l0 path{animation:migL0 9s ease infinite}"

# ── GenAI on Bedrock: your product asks, the drawer opens and the right card lifts, the answer goes back with its card
css += vis("gaProd", 0.0, 8.6) + ".m-genai .prod{animation:gaProd 9s ease infinite}"
css += kf("gaQ", [(0, "transform:scaleX(0)"), (0.4, "transform:scaleX(0)"), (1.1, "transform:scaleX(1)"), (8.5, "transform:scaleX(1)"), (8.8, "transform:scaleX(0)"), (T, "transform:scaleX(0)")])
css += ".m-genai .sq{animation:gaQ 9s ease infinite}"
css += kf("gaReq", [(0, "stroke-dashoffset:128"), (1.2, "stroke-dashoffset:128"), (2.7, "stroke-dashoffset:14"), (T, "stroke-dashoffset:14")])
css += kf("gaAns", [(0, "stroke-dashoffset:128"), (6.0, "stroke-dashoffset:128"), (7.2, "stroke-dashoffset:14"), (T, "stroke-dashoffset:14")])
css += ".m-genai .req{animation:gaReq 9s linear infinite}.m-genai .ans{animation:gaAns 9s linear infinite}"
dr = mv["drawer"]
css += kf("gaDrawer", [(0, "transform:translate(0,0)"), (3.0, "transform:translate(0,0)"), (3.9, f"transform:{tr(dr)}"), (7.6, f"transform:{tr(dr)}"), (8.5, "transform:translate(0,0)"), (T, "transform:translate(0,0)")])
css += kf("gaLift", [(0, "transform:translate(0,0)"), (4.0, "transform:translate(0,0)"), (4.7, f"transform:translate(0,{mv['lift'][1]}px)"), (6.8, f"transform:translate(0,{mv['lift'][1]}px)"), (7.4, "transform:translate(0,0)"), (T, "transform:translate(0,0)")])
css += ".m-genai .drawer{animation:gaDrawer 9s cubic-bezier(.45,0,.2,1) infinite}.m-genai .card{animation:gaLift 9s cubic-bezier(.45,0,.2,1) infinite}"
css += vis("gaCard", 4.2, 8.0) + ".m-genai .card .l{animation:gaCard 9s ease infinite}"
css += led_on("gaL5", 3.6, 8.0) + ".m-genai .led.l5 path{animation:gaL5 9s ease infinite}"
for k, t in enumerate([7.2, 7.5, 7.8]):
    css += kf(f"gaA{k}", [(0, "transform:scaleX(0)"), (t, "transform:scaleX(0)"), (t + 0.4, "transform:scaleX(1)"), (8.5, "transform:scaleX(1)"), (8.8, "transform:scaleX(0)"), (T, "transform:scaleX(0)")])
    css += f".m-genai .sa{k + 1}{{animation:gaA{k} 9s ease infinite}}"
css += vis("gaCite", 8.0, 8.6) + ".m-genai .scite{animation:gaCite 9s ease infinite}"

# ── the three steps above the drawing, lit in time (named per mode so they restart with it)
for m in ["lz", "aas", "sap", "mig", "genai"]:
    for k in range(3):
        a, b = 3.0 * k, 3.0 * k + 3.0
        css += kf(f"{m}B{k}", [(0, "color:#b4b8bf"), (max(0, a - 0.01), "color:#b4b8bf"), (a + 0.15, "color:#111214"), (b - 0.15, "color:#111214"), (min(T, b + 0.01), "color:#b4b8bf"), (T, "color:#b4b8bf")])
        css += kf(f"{m}I{k}", [(0, "background-color:#ebeae6;color:#8a8f98"), (max(0, a - 0.01), "background-color:#ebeae6;color:#8a8f98"), (a + 0.15, f"background-color:{LIT};color:#ffffff"),
                                (b - 0.15, f"background-color:{LIT};color:#ffffff"), (min(T, b + 0.01), "background-color:#ebeae6;color:#8a8f98"), (T, "background-color:#ebeae6;color:#8a8f98")])
        css += f".bm-{m} .b{k + 1}{{animation:{m}B{k} 9s linear infinite}}.bm-{m} .b{k + 1} i{{animation:{m}I{k} 9s linear infinite}}"

css += ("@media (prefers-reduced-motion:reduce){.fig *,.bt,.bt i{animation:none!important}"
        ".m-sap .glass,.m-lz .cond,.m-genai .prod,.m-sap .pulse,.m-mig .tick{opacity:1}"
        ".m-lz .lockbar .l,.m-sap .vault .l,.m-aas .needle .l,.m-aas .paper .l,.m-genai .card .l,.m-mig .migtray .l{opacity:1}"
        ".m-lz .led path,.m-aas .led path{fill:" + LIT + "}.m-mig .migtray{transform:" + tr(mg) + "}.bt{color:#111214}}")

BEATS = {
    "lz": ["Accounts open", "Guardrails lock", "Logs land in one place"],
    "aas": ["The 40-hour clock starts", "Each account is reviewed", "A decision record comes out"],
    "sap": ["Walls close around your account", "Questions use one private cable", "Public calls stop at the wall"],
    "mig": ["Rolled into staging", "Checks run until they agree", "Into production"],
    "genai": ["Your product asks", "The right card is found", "The answer points to its card"],
}

live = open(SP + "/live/project/AwsExplorer.dc.html").read()
a = live.find("<svg"); b = live.rfind("</svg>") + 6
s = live[:a] + svg + live[b:]
s = re.sub(r"<style>.*?</style>", lambda m: "<style>" + css + "</style>", s, count=1, flags=re.S)
old_cap = re.search(r'<span style="position: absolute; right: 28px; top: 24px;[^"]*">Your AWS organisation, as a cabinet</span>', s)
assert old_cap, "caption not found"
beats = ('<div class="bm-{{mode}}" style="position: absolute; right: 28px; top: 20px; display: flex; gap: 22px; font-family: \'Geist Mono\', ui-monospace, monospace; font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase">'
         '<span class="bt b1"><i>1</i>{{b1}}</span><span class="bt b2"><i>2</i>{{b2}}</span><span class="bt b3"><i>3</i>{{b3}}</span></div>')
s = s[:old_cap.start()] + beats + s[old_cap.end():]
# script: steps per offer, 9 s per service
for m, bs in BEATS.items():
    key = f"{{ mode: '{m}',"
    assert s.count(key) == 1, m
    s = s.replace(key, key + " beats: " + json.dumps(bs, ensure_ascii=False) + ",")
assert "}, 8000);" in s
s = s.replace("}, 8000);", "}, 9000);")
assert "      mode: cur.mode,\n" in s
s = s.replace("      mode: cur.mode,\n", "      mode: cur.mode,\n      b1: cur.beats[0], b2: cur.beats[1], b3: cur.beats[2],\n")
open(SP + "/canvas/site/project/AwsExplorer.dc.html", "w").write(s)
print("ok", len(s), len(css))
