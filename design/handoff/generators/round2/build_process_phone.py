"""How we work on phones: the chips, then the way in as a list to read (StepList.tsx). Writes ProcessPhone.dc.html."""
import json, re, sys
S = sys.argv[1]
C = f"{S}/canvas/site/project"
proc = open(f"{C}/Process.dc.html").read()
# The same data and sums as the desktop board.
ways = re.search(r"const WAYS = (\[.*?\]);\n", proc).group(1)
phases = re.search(r"const PHASES = (\[.*?\]);\n", proc).group(1)
assert json.loads(ways) and json.loads(phases)
paint = re.search(r'<img class="paint" src="([^"]+)"', proc).group(1)

steps = "".join(
    f"""<li class="st"><span class="dot"></span><div class="hd"><h3>{t}</h3><span class="rg">{{{{r{i}}}}}</span></div><ul><sc-for list="{{{{m{i}}}}}" as="m" hint-placeholder-count="2"><li><span class="wh">{{{{m.when}}}}</span><p>{{{{m.text}}}}</p></li></sc-for></ul></li>"""
    for i, t in enumerate(["Frame", "Join", "Deliver", "Handover"])
)
pills = "".join(
    f'<button type="button" role="tab" class="pl {{{{w{k}}}}}" onClick="{{{{pw{k}}}}}">{w["label"]}</button>' for k, w in enumerate(json.loads(ways))
)

html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>How we work, phone</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@300..700&amp;family=Geist+Mono:wght@400..500&amp;display=swap">
<style>
html,body{{height:100%}}
body{{margin:0}}
.paint{{animation:drift 30s ease-in-out infinite alternate}}
@keyframes drift{{from{{transform:scale(1.06) translateX(-1.4%)}}to{{transform:scale(1.06) translateX(1.4%)}}}}
.pills{{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;scroll-snap-type:x mandatory}}
.pills::-webkit-scrollbar{{display:none}}
.pl{{all:unset;box-sizing:border-box;flex:none;scroll-snap-align:start;cursor:pointer;height:36px;padding:0 12px;display:inline-flex;align-items:center;border-radius:6px;background:rgba(255,255,255,.07);font-size:13px;color:rgba(255,255,255,.7);white-space:nowrap;transition:background-color .15s,color .15s}}
.pl.on{{background:#fff;color:#111214}}
.pl:focus-visible{{outline:2px solid #9cc0e6;outline-offset:2px}}
.sl{{margin:0;padding:0;list-style:none;animation:swap .3s cubic-bezier(.2,.7,.2,1) both}}
@keyframes swap{{from{{opacity:.25;transform:translateY(4px)}}}}
.st{{position:relative;border-left:1px solid rgba(255,255,255,.15);padding:0 0 32px 20px}}
.st:last-child{{padding-bottom:0}}
.dot{{position:absolute;top:9px;left:-3.5px;width:6px;height:6px;border-radius:50%;background:#fff}}
.hd{{display:flex;align-items:baseline;justify-content:space-between;gap:12px}}
.hd h3{{margin:0;font-size:18px;line-height:1.375;font-weight:500;letter-spacing:-0.01em;color:#fff}}
.rg,.wh{{font-family:'Geist Mono',ui-monospace,monospace;font-size:10px;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap}}
.rg{{color:rgba(255,255,255,.45)}}
.wh{{color:#9cc0e6}}
.st ul{{margin:12px 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:16px}}
.st ul li{{display:flex;flex-direction:column;gap:4px}}
.st ul p{{margin:0;font-size:15px;line-height:1.5;color:rgba(255,255,255,.7)}}
@media (prefers-reduced-motion:reduce){{.paint,.sl{{animation:none}}}}
</style>
</helmet>
<div style="position: relative; width: 390px; min-height: 100%; isolation: isolate; overflow: hidden; background-color: #6f8fb3; font-family: Geist, ui-sans-serif, system-ui, sans-serif; color: #ffffff">
  <img class="paint" src="{paint}" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: -1">
  <section id="process" style="position: relative">
    <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(11,20,33,0.92) 0%, rgba(11,20,33,0.86) calc(100% - 320px), rgba(11,20,33,0) 100%)"></div>
    <div style="position: relative; padding: 80px 16px 240px; display: flex; flex-direction: column; gap: 56px">
      <div style="display: flex; flex-direction: column; gap: 20px"><span style="font-family: 'Geist Mono', ui-monospace, monospace; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.6)">How we work</span>
        <h2 style="margin: 0; font-size: 34px; line-height: 1.04; font-weight: 500; letter-spacing: -0.045em">Same four steps,<br><span style="color: rgba(255,255,255,0.45)">a week or two years.</span></h2>
        <p style="margin: 0; font-size: 18px; line-height: 1.55; color: rgba(255,255,255,0.75)">A three-week review and two years inside your team run the same way. Pick a way in to see what happens when.</p>
      </div>
      <div style="display: flex; flex-direction: column; gap: 28px">
        <div role="tablist" aria-label="Ways in" class="pills">{pills}</div>
        <ol class="sl" key="{{{{wid}}}}">{steps}</ol>
      </div>
    </div>
  </section>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":390,"height":1451}}}}'>
// Phones (under 640 px) read the way in as a list: the same data and sums as the site (StepList.tsx, engagement-math.ts).
const WAYS = {ways};
const PHASES = {phases};
const WPM = 52 / 12;
const bounds = (w) => {{ let at = 0; return w.phases.map((d) => {{ const b = [at, at + d]; at += d; return b; }}); }};
const phaseAt = (w, wk) => {{ const i = bounds(w).findIndex((b) => wk < b[1] - 1e-6); return i < 0 ? 3 : i; }};
const rangeLabel = (w, b) => {{
  const months = w.unit === 'month' && (b[1] - b[0] >= WPM || b[0] >= WPM);
  const u = months ? WPM : 1, name = months ? 'Month' : 'Week';
  const from = Math.floor(b[0] / u + 1e-6) + 1, to = Math.max(from, Math.ceil(b[1] / u - 1e-6));
  return from === to ? name + ' ' + from : name + 's ' + from + '–' + to;
}};
class Component extends DCLogic {{
  constructor(props) {{
    super(props);
    this.state = {{ way: 2 }};
  }}
  // As on the site: where the chip row scrolls, keep the chosen way in in view, sideways only.
  reveal() {{
    setTimeout(() => {{
      try {{
        const row = document.querySelector('.pills'), on = row && row.querySelector('.pl.on');
        if (row && on && row.scrollWidth > row.clientWidth) row.scrollTo({{ left: Math.max(0, on.offsetLeft - row.offsetLeft) }});
      }} catch (e) {{}}
    }}, 0);
  }}
  componentDidMount() {{ this.reveal(); }}
  componentDidUpdate() {{ this.reveal(); }}
  renderVals() {{
    const w = WAYS[this.state.way];
    const v = {{ wid: w.id }};
    WAYS.forEach((x, k) => {{
      v['w' + k] = k === this.state.way ? 'on' : '';
      v['pw' + k] = () => this.setState({{ way: k }});
    }});
    bounds(w).forEach((b, i) => {{
      v['r' + i] = rangeLabel(w, b);
      v['m' + i] = w.moments.filter((m) => phaseAt(w, m.week) === i).map((m) => ({{ when: m.when, text: m.text }}));
    }});
    return v;
  }}
}}
</script>
</body>
</html>
"""
open(f"{C}/ProcessPhone.dc.html", "w").write(html)
d = json.load(open(f"{C}/canvas.json"))
d["boards"]["ProcessPhone.dc.html"] = {"x": 4560, "y": 2625, "w": 390, "h": 1451, "is_interactive": True,
    "title": "How we work on phones: the chips, then the way in as a list to read; nothing to drag"}
if "ProcessPhone.dc.html" not in d["order"]:
    d["order"].insert(d["order"].index("Process.dc.html") + 1, "ProcessPhone.dc.html")
json.dump(d, open(f"{C}/canvas.json", "w"), ensure_ascii=False)
print("ok", len(html))
