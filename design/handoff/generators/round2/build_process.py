# How work runs, redone as one immersive dark section on our painting, in two chapters.
# 1. How long work runs: a time dial (1 week to 3 years, log scale). Each service is an arc on its own ring;
#    a sweep hand passes each arc and the centre names it.
# 2. How an engagement runs: one isometric bench that builds up phase by phase (Frame, Join, Deliver, Handover),
#    with a W0 to W12 ruler and the phase list beside it. On the board it plays by itself; on the site the
#    phases follow the scroll.
import json, math, os, subprocess, sys
SP = "/private/tmp/claude-501/-Users-aleksandarkotevski-Library-Application-Support-Claude-scratch-workspaces-86fa8aec-a9c5-48c3-8ba3-d5783d7de619-e3116774-42dd-42bc-a238-1515e779fa24-scratch-2026-11-11-84e6d2/e3e40e52-5b1a-454d-bc1a-4f8ac9aa0348/scratchpad"
PAINT = "/_blob/f79de23ce94fa1b72b32014588efd1f6"
MONO = "font-family: 'Geist Mono', ui-monospace, monospace"
PY = os.path.expanduser("~/.local/share/uv/tools/mflux/bin/python")
subprocess.run([PY, SP + "/v11/scene.py", SP + "/v11/scene.svg", "1.55"], check=True, capture_output=True)
SCENE = open(SP + "/v11/scene.svg").read()
MV = json.load(open(SP + "/v11/scene.json"))
SKY, ICE = "#9cc0e6", "#dbe7f4"

# ───────────────────────────── chapter 1: the dial
SERVICES = [("Private offer on AWS", 1, 7, "Within a week"), ("Diligence and advisory", 21, 35, "3–5 weeks"),
            ("Architect as a Service", 7, 61, "40 h over up to 2 months"), ("GenAI development", 56, 98, "8–14 weeks"),
            ("Embedded delivery", 91, 730, "3 months – 2 years")]
D0, D1, SPAN = 7, 1095, 300.0
def ang(d):
    d = max(d, D0)
    return SPAN * (math.log(d) - math.log(D0)) / (math.log(D1) - math.log(D0))
CX = CY = 330
R0, DR = 104, 34
def pol(r, a):
    t = math.radians(a - 90 + 30)          # the open gap sits at the top left
    return CX + r * math.cos(t), CY + r * math.sin(t)
def arc(r, a0, a1):
    a1 = max(a1, a0 + 1.5)
    x0, y0 = pol(r, a0); x1, y1 = pol(r, a1)
    large = 1 if a1 - a0 > 180 else 0
    return f"M{x0:.1f} {y0:.1f} A{r} {r} 0 {large} 1 {x1:.1f} {y1:.1f}"
SWEEP = 12.0
dial = []
for k in range(5):
    r = R0 + DR * k
    dial.append(f'<path d="{arc(r, 0, SPAN)}" fill="none" stroke="#ffffff" stroke-opacity=".08" stroke-width="16" stroke-linecap="round"/>')
TICKS = [(7, "1 wk"), (30, "1 mo"), (91, "3 mo"), (365, "1 yr"), (730, "2 yr"), (1095, "3 yr")]
rout = R0 + DR * 4 + 22
for d, t in TICKS:
    a = ang(d)
    x0, y0 = pol(rout, a); x1, y1 = pol(rout + 10, a); xl, yl = pol(rout + 30, a)
    dial.append(f'<path d="M{x0:.1f} {y0:.1f} L{x1:.1f} {y1:.1f}" stroke="#ffffff" stroke-opacity=".5" stroke-width="1.4" stroke-linecap="round"/>')
    dial.append(f'<text x="{xl:.1f}" y="{yl:.1f}" fill="#ffffff" fill-opacity=".62" font-size="12" text-anchor="middle" dominant-baseline="middle" style="{MONO}; letter-spacing: .06em">{t}</text>')
for d in [14, 60, 180, 540]:
    a = ang(d); x0, y0 = pol(rout + 2, a); x1, y1 = pol(rout + 7, a)
    dial.append(f'<path d="M{x0:.1f} {y0:.1f} L{x1:.1f} {y1:.1f}" stroke="#ffffff" stroke-opacity=".25" stroke-width="1"/>')
css1 = ""
centre = ""
for k, (name, a_, b_, lab) in enumerate(SERVICES):
    r = R0 + DR * k
    aa, bb = ang(a_), ang(b_)
    mid = (aa + bb) / 2
    t_hit = SWEEP * mid / SPAN
    dial.append(f'<path class="arcd a{k}" d="{arc(r, aa, bb)}" pathLength="1" fill="none" stroke="{SKY}" stroke-width="16" stroke-linecap="round" stroke-dasharray="1" stroke-dashoffset="1"/>')
    dial.append(f'<path class="arcg g{k}" d="{arc(r, aa, bb)}" fill="none" stroke="#ffffff" stroke-width="16" stroke-linecap="round"/>')
    def pc(t): return f"{max(0, min(100, t / SWEEP * 100)):.2f}%"
    on0, on1 = max(0.0, t_hit - 0.9), min(SWEEP - 0.3, t_hit + 1.6)
    css1 += f"@keyframes dA{k}{{0%{{stroke-dashoffset:1}}{pc(0.2 + 0.25 * k)}{{stroke-dashoffset:1}}{pc(1.2 + 0.25 * k)}{{stroke-dashoffset:0}}100%{{stroke-dashoffset:0}}}}"
    css1 += f"@keyframes dG{k}{{0%,{pc(on0)}{{opacity:0}}{pc(on0 + 0.3)},{pc(on1)}{{opacity:1}}{pc(on1 + 0.4)},100%{{opacity:0}}}}"
    css1 += f"@keyframes dC{k}{{0%,{pc(on0)}{{opacity:0;transform:translateY(6px)}}{pc(on0 + 0.3)},{pc(on1)}{{opacity:1;transform:none}}{pc(on1 + 0.4)},100%{{opacity:0;transform:translateY(-4px)}}}}"
    css1 += f".dial .a{k}{{animation:dA{k} {SWEEP}s ease-out infinite}}.dial .g{k}{{opacity:0;animation:dG{k} {SWEEP}s ease infinite}}.dial .c{k}{{opacity:0;animation:dC{k} {SWEEP}s ease infinite}}"
    centre += (f'<div class="dc c{k}" style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 6px">'
               f'<span style="{MONO}; font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: rgba(255,255,255,.62)">{name}</span>'
               f'<span style="font-size: 25px; line-height: 1.15; font-weight: 500; letter-spacing: -0.02em; color: #ffffff; max-width: 190px">{lab}</span></div>')
hx, hy = pol(R0 + DR * 4 + 14, 0)
hx0, hy0 = pol(R0 - 16, 0)
dial.append(f'<g class="hand" style="transform-origin: {CX}px {CY}px"><path d="M{hx0:.1f} {hy0:.1f} L{hx:.1f} {hy:.1f}" stroke="#ffffff" stroke-opacity=".75" stroke-width="1.4" stroke-linecap="round"/>'
            f'<circle cx="{hx:.1f}" cy="{hy:.1f}" r="4.5" fill="#ffffff"/></g>')
css1 += f"@keyframes hand{{from{{transform:rotate(0deg)}}to{{transform:rotate({SPAN}deg)}}}}.dial .hand{{animation:hand {SWEEP}s linear infinite}}"
DIAL = (f'<div class="dial" style="position: relative; width: 660px; height: 660px">'
        f'<svg viewBox="0 0 660 660" width="660" height="660" aria-hidden="true">{"".join(dial)}</svg>'
        f'<div style="position: absolute; left: {CX - 100}px; top: {CY - 70}px; width: 200px; height: 140px">{centre}</div></div>')
legend = "".join(f'<li style="display: flex; align-items: baseline; justify-content: space-between; gap: 16px; padding: 9px 0"><span style="font-size: 15px; color: rgba(255,255,255,.88)">{n}</span>'
                 f'<span style="{MONO}; font-size: 11px; letter-spacing: .06em; color: {SKY}; white-space: nowrap">{l}</span></li>' for n, _, _, l in SERVICES)

# ───────────────────────────── chapter 2: the engagement
PHASES = [("01", "Frame", "Write the brief first", "Objectives, constraints, assumptions and success criteria, written before delivery gets expensive.", "W0"),
          ("02", "Join", "Same systems, one owner", "We work in your systems with your people. One named lead owns the direction.", "W4"),
          ("03", "Deliver", "Work stays visible", "Progress, decisions and changes stay written down. We adjust when the evidence changes.", "W8"),
          ("04", "Handover", "Leave it in your hands", "Source, configuration, operating notes and context move to your team.", "W12")]
rows = ""
for k, (n, name, sub, body, w) in enumerate(PHASES):
    rows += (f'<li class="pr pr{k}" style="display: grid; grid-template-columns: 44px minmax(0, 1fr); column-gap: 8px; padding: 14px 0">'
             f'<span style="{MONO}; font-size: 12px; padding-top: 9px; color: inherit">{n}</span>'
             f'<div style="display: flex; flex-direction: column; gap: 4px"><span style="font-size: 28px; line-height: 1.15; font-weight: 500; letter-spacing: -0.025em">{name}</span>'
             f'<span style="font-size: 15px; color: rgba(255,255,255,.62)">{sub}</span>'
             f'<span class="pb" style="font-size: 15px; line-height: 1.55; color: rgba(255,255,255,.82); max-width: 380px">{body}</span></div></li>')
ruler_labels = "".join(f'<span style="position: absolute; left: {k * 33.333:.3f}%; top: 18px; transform: translateX({"0" if k == 0 else "-50%" if k < 3 else "-100%"}); {MONO}; font-size: 11px; letter-spacing: .06em; color: rgba(255,255,255,.6)">{w}</span>'
                       for k, (_, _, _, _, w) in enumerate(PHASES))
ruler_ticks = "".join(f'<span style="position: absolute; left: {k * 33.333:.3f}%; top: 2px; width: 2px; height: 10px; margin-left: -1px; border-radius: 2px; background: rgba(255,255,255,.4)"></span>' for k in range(4))
RULER = (f'<div style="position: relative; height: 34px">'
         f'<span style="position: absolute; left: 0; right: 0; top: 6px; height: 2px; border-radius: 2px; background: rgba(255,255,255,.16)"></span>'
         f'<span class="fill" style="position: absolute; left: 0; top: 6px; height: 2px; border-radius: 2px; background: #ffffff"></span>{ruler_ticks}'
         f'<span class="head" style="position: absolute; top: 2px; width: 10px; height: 10px; margin-left: -5px; border-radius: 10px; background: #ffffff; box-shadow: 0 0 0 5px rgba(255,255,255,.16)"></span>{ruler_labels}</div>')

PH = 4.0
mv = MV
def tr(v, k=1.0): return f"translate({v[0] * k:.1f}px,{v[1] * k:.1f}px)"
css2 = f"""
.pr{{color:rgba(255,255,255,.34);transition:color .5s ease}}
.pr .pb{{display:block;max-height:0;opacity:0;overflow:hidden;transition:max-height .6s cubic-bezier(.2,.7,.2,1),opacity .5s ease}}
.ph1 .pr0,.ph2 .pr1,.ph3 .pr2,.ph4 .pr3{{color:#ffffff}}
.ph1 .pr0 .pb,.ph2 .pr1 .pb,.ph3 .pr2 .pb,.ph4 .pr3 .pb{{max-height:90px;opacity:1}}
/* the scene */
.scn svg .bl,.scn svg .card,.scn svg .pen,.scn svg .our,.scn svg .cab,.scn svg .cube,.scn svg .bnd,.scn svg .key{{transition:opacity .6s ease,transform .9s cubic-bezier(.2,.7,.2,1)}}
.scn svg .card,.scn svg .cube{{transform-box:fill-box;transform-origin:center bottom}}
.scn svg .bl{{opacity:0}}.scn svg .card{{opacity:0;transform:scale(.4)}}.scn svg .pen{{opacity:0}}
.scn svg .our{{opacity:0;transform:{tr(mv['ourIn'])}}}.scn svg .cab{{opacity:0}}
.scn svg .cube{{opacity:0;transform:translateY(-14px)}}.scn svg .cube .l{{opacity:0;transition:opacity .5s}}
.scn svg .bnd{{opacity:0}}.scn svg .key{{opacity:0}}.scn svg .d0 .l{{opacity:0;transition:opacity .6s}}
/* Frame: the brief writes itself, four cards pop up; it all stays */
.ph1 svg .bl,.ph2 svg .bl,.ph3 svg .bl,.ph4 svg .bl{{opacity:1}}
.ph1 svg .card,.ph2 svg .card,.ph3 svg .card,.ph4 svg .card{{opacity:1;transform:none}}
.ph1 svg .pen{{opacity:1;animation:pen 1.6s ease-in-out infinite alternate}}
@keyframes pen{{from{{transform:translate(-14px,7px)}}to{{transform:translate(4px,-2px)}}}}
"""
for k in range(5):
    css2 += f".ph1 svg .b{k}{{transition-delay:{0.25 + 0.35 * k:.2f}s}}"
for k in range(4):
    css2 += f".ph1 svg .c{k}{{transition-delay:{2.0 + 0.2 * k:.2f}s}}"
css2 += f"""
/* Join: our desk slides into the row, the cable lights and carries a pulse */
.ph2 svg .our,.ph3 svg .our{{opacity:1;transform:none}}
.ph2 svg .cab,.ph3 svg .cab{{opacity:1;transition-delay:.8s}}
.ph2 svg .cabp,.ph3 svg .cabp{{animation:cabp 1.6s linear infinite}}
@keyframes cabp{{from{{stroke-dashoffset:106}}to{{stroke-dashoffset:0}}}}
/* Deliver: modules land one by one and light; they stay for the handover */
.ph3 svg .cube,.ph4 svg .cube{{opacity:1;transform:none}}
.ph3 svg .cube .l{{opacity:1}}
"""
for k in range(9):
    css2 += f".ph3 svg .k{k},.ph3 svg .k{k} .l{{transition-delay:{0.2 + 0.32 * k:.2f}s}}"
css2 += f"""
/* Handover: the binder lifts off our desk and lands on yours, the key appears there, our desk leaves */
.ph4 svg .our{{opacity:0;transform:{tr(mv['ourUp'])};transition:opacity .8s ease 2.4s,transform 1.2s cubic-bezier(.4,0,.2,1) 2.2s}}
.ph4 svg .bnd{{opacity:1;animation:bnd 2.2s cubic-bezier(.45,0,.2,1) .2s both}}
@keyframes bnd{{0%{{transform:none}}30%{{transform:{tr(mv['bndLift'])}}}75%{{transform:translate({mv['bnd'][0] + mv['bndLift'][0]:.1f}px,{mv['bnd'][1] + mv['bndLift'][1]:.1f}px)}}100%{{transform:{tr(mv['bnd'])}}}}}
.ph4 svg .key{{opacity:1;transition-delay:2.1s}}
.ph4 svg .d0 .l{{opacity:1;transition-delay:2s}}
"""
# the ruler: each phase runs the playhead across its own stretch (named per phase so it restarts on change)
for k, (a, b) in enumerate([(0, 33.333), (33.333, 66.667), (66.667, 100), (100, 100)]):
    css2 += f"@keyframes fillP{k + 1}{{from{{width:{a}%}}to{{width:{b}%}}}}@keyframes headP{k + 1}{{from{{left:{a}%}}to{{left:{b}%}}}}"
    css2 += f".ph{k + 1} .fill{{animation:fillP{k + 1} {PH}s linear both}}.ph{k + 1} .head{{animation:headP{k + 1} {PH}s linear both}}"

CSS = """
body{margin:0}
.paint{animation:drift 30s ease-in-out infinite alternate}
@keyframes drift{from{transform:scale(1.06) translateX(-1.2%)}to{transform:scale(1.06) translateX(1.2%)}}
.pbtn{all:unset;cursor:pointer}
.pbtn:focus-visible{outline:2px solid #ffffff;outline-offset:4px;border-radius:6px}
@media (prefers-reduced-motion: reduce){*{animation:none!important;transition:none!important}.dial .g4,.dial .c4{opacity:1}.dial .arcd{stroke-dashoffset:0}}
""" + css1 + css2

H = 1880
html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>How work runs</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@300..700&amp;family=Geist+Mono:wght@400..500&amp;display=swap">
<style>{CSS}</style>
</helmet>
<div id="process" style="position: relative; width: 1440px; height: {H}px; overflow: hidden; background-color: #0f1b2b; font-family: Geist, ui-sans-serif, system-ui, sans-serif; color: #ffffff">
  <img class="paint" src="{PAINT}" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: .55">
  <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(11,20,33,.78) 0%, rgba(11,20,33,.62) 45%, rgba(11,20,33,.8) 100%)"></div>

  <section style="position: relative; height: 900px; box-sizing: border-box; padding: 104px 56px 0; display: grid; grid-template-columns: minmax(0, 1fr) 660px; column-gap: 64px; align-items: start">
    <div style="display: flex; flex-direction: column; gap: 22px; padding-top: 40px">
      <span style="{MONO}; font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: rgba(255,255,255,.6)">How long work runs</span>
      <h2 style="margin: 0; font-size: 56px; line-height: 1.04; font-weight: 500; letter-spacing: -0.045em">From a week<br><span style="color: rgba(255,255,255,.45)">to about three years.</span></h2>
      <p style="margin: 0; max-width: 440px; font-size: 17px; line-height: 1.55; color: rgba(255,255,255,.75)">Every way in has its own length. A private offer lands within a week; embedded delivery runs for years. The dial reads clockwise, on a log scale.</p>
      <ul style="margin: 18px 0 0; padding: 0; list-style: none; max-width: 440px">{legend}</ul>
    </div>
    {DIAL}
  </section>

  <section class="scn {{{{ph}}}}" style="position: relative; height: 980px; box-sizing: border-box; padding: 72px 56px 0; display: grid; grid-template-columns: 440px minmax(0, 1fr); column-gap: 64px; align-items: start">
    <div style="display: flex; flex-direction: column; gap: 22px">
      <span style="{MONO}; font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: rgba(255,255,255,.6)">How an engagement runs</span>
      <h2 style="margin: 0; font-size: 56px; line-height: 1.04; font-weight: 500; letter-spacing: -0.045em">Structure without<br><span style="color: rgba(255,255,255,.45)">the consultancy theatre.</span></h2>
      <ol style="margin: 16px 0 0; padding: 0; list-style: none">{rows}</ol>
    </div>
    <div style="display: flex; flex-direction: column; gap: 28px; padding-top: 30px">
      {RULER}
      <div style="position: relative">{SCENE}</div>
    </div>
  </section>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":1440,"height":{H}}}}}'>
class Component extends DCLogic {{
  constructor(props) {{
    super(props);
    this.state = {{ p: 1 }};
  }}
  componentDidMount() {{
    this.timer = setInterval(() => this.setState({{ p: this.state.p % 4 + 1 }}), {int(PH * 1000)});
  }}
  componentWillUnmount() {{
    clearInterval(this.timer);
  }}
  renderVals() {{
    return {{ ph: 'ph' + this.state.p }};
  }}
}}
</script>
</body>
</html>
"""
open(SP + "/canvas/site/project/Process.dc.html", "w").write(html)
print("ok", len(html))
