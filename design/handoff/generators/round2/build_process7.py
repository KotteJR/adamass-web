# How we work, interactive: one timeline. Underlined tabs pick a way in (its length beside them); its four steps
# sit on the bar at their real lengths (never too thin to label), and what happens at the handle pops up under it. The board keeps
# the end screen under it, on the same painting, with the Malmö clock. Nothing moves on its own.
import re, sys, os, json, html
SP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJ = SP + "/canvas/site/project/"
H = int(sys.argv[1]) if len(sys.argv) > 1 else 2300
closing = open(PROJ + "Closing.dc.html").read()
style = re.search(r"<style>(.*?)</style>", closing, re.S).group(1)
style += "\n.sky{-webkit-mask-image:linear-gradient(180deg,transparent 0%,#000 35%);mask-image:linear-gradient(180deg,transparent 0%,#000 35%)}\n"
end = re.search(r'(<div style="position: absolute; left: 0; top: 0; width: 1440px; height: 780px;.*?)\n  <div class="foot"', closing, re.S).group(1)
end = end.replace('<div style="position: absolute; left: 0; top: 0; width: 1440px; height: 780px; overflow: hidden; background-color: #6f8fb3">',
                  '<div style="position: relative; width: 1440px; height: 780px; overflow: hidden">')
end = re.sub(r'\s*<img class="paint" src="[^"]+" alt="" style="[^"]+">', '', end, count=1)
foot = re.search(r'(<div class="foot".*?</div>\n)</div>\n</x-dc>', closing, re.S).group(1)
foot = foot.replace('position: absolute; left: 32px; right: 32px; top: 780px; bottom: 0;', 'position: relative; height: 120px; padding: 0 32px; background-color: #ffffff;')
paint = re.search(r'/_blob/[0-9a-f]{32}', open(PROJ + "Process.dc.html").read()).group(0)  # the shared tall painting

# The same content as the site (content/process.ts).
PHASES = [
    ("Frame", "We agree the goal, what is in the way and how we will both know it worked, and write it down."),
    ("Join", "Our people get access and start inside your team, your tools and your routines."),
    ("Deliver", "The work lands in small pieces you can see and use. When the evidence changes, so does the plan."),
    ("Handover", "Code, setup and know-how move to your team, so it all runs without us."),
]
WAYS = json.load(open(os.path.join(os.path.dirname(__file__), "ways.json")))

MONO = "font-family: 'Geist Mono', ui-monospace, monospace"
E = html.escape
CSS = """
.tbs{display:flex;gap:40px;border-bottom:1px solid rgba(255,255,255,.15)}
.tb2{all:unset;position:relative;cursor:pointer;display:flex;flex-direction:column;gap:6px;padding-bottom:16px;font-size:18px;color:rgba(255,255,255,.5);white-space:nowrap}
.tb2 small{font-family:'Geist Mono',ui-monospace,monospace;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.4)}
.tb2:hover{color:rgba(255,255,255,.85)}
.tb2.on{color:#fff}.tb2.on small{color:#9cc0e6}
.tb2::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:2px;background:#fff;opacity:0;transition:opacity .2s}.tb2.on::after{opacity:1}
.it{display:flex;flex-direction:column;justify-content:flex-end;flex-basis:0;min-width:0;transition:flex-grow .5s}
.it .rg{font-family:'Geist Mono',ui-monospace,monospace;font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.45)}
.it .ti{margin-top:4px;padding-bottom:16px;padding-right:12px;font-size:18px;font-weight:500;letter-spacing:-.01em;color:rgba(255,255,255,.45)}
.it .ti b{font-family:'Geist Mono',ui-monospace,monospace;font-size:10px;font-weight:400;letter-spacing:.08em;color:#9cc0e6;margin-right:6px}
.it.on .ti{color:#fff}
.it .bar{position:relative;height:16px;color:rgba(255,255,255,.25);transition:color .3s}
.it.done .bar{color:rgba(255,255,255,.55)}.it.on .bar{color:#9cc0e6}
.bar .ln{position:absolute;left:0;right:0;bottom:0;height:1px;background:currentColor}.it.on .bar .ln{height:2px}
.bar .tk{position:absolute;left:0;bottom:0;width:1px;height:16px;background:currentColor}.bar .te{position:absolute;right:0;bottom:0;width:1px;height:16px;background:currentColor}
.bar .mt{position:absolute;left:0;right:0;bottom:0;height:5px;opacity:.5;background-image:linear-gradient(to right,currentColor 1px,transparent 1px)}
.hd{position:absolute;bottom:0;transition:left .5s cubic-bezier(.2,.7,.2,1)}
.stem{position:absolute;bottom:-1px;left:0;width:1px;height:24px;background:#9cc0e6;transform:translateX(-50%)}
.dia{position:absolute;bottom:-5px;left:0;width:11px;height:11px;box-sizing:border-box;border:2px solid #0d1726;background:#9cc0e6;transform:translateX(-50%) rotate(45deg)}
.lead{position:absolute;top:0;width:1px;height:32px;background:rgba(156,192,230,.6);transform:translateX(-50%);transition:left .5s cubic-bezier(.2,.7,.2,1)}
.note{position:absolute;top:32px;width:100%;max-width:460px;border-color:rgba(156,192,230,.6);transition:left .5s cubic-bezier(.2,.7,.2,1),transform .5s cubic-bezier(.2,.7,.2,1)}
.note.nr{border-left:1px solid rgba(156,192,230,.6);padding-left:20px}.note.nl{transform:translateX(-100%);border-right:1px solid rgba(156,192,230,.6);padding-right:20px}
.ar{all:unset;box-sizing:border-box;cursor:pointer;width:44px;height:44px;border-radius:99px;border:1px solid rgba(255,255,255,.2);display:inline-flex;align-items:center;justify-content:center;color:rgba(255,255,255,.8)}.ar:hover{border-color:rgba(255,255,255,.5);color:#fff}
.tb2:focus-visible::after{opacity:1}.ar:focus-visible{outline:2px solid #9cc0e6;outline-offset:2px}
"""
label = lambda t: f'<span style="{MONO}; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.6)">{E(t)}</span>'
tabs = "".join(f'<button type="button" role="tab" class="tb2 {{{{w{i}}}}}" onClick="{{{{pw{i}}}}}">{E(w["label"])}<small>{E(w["short"])}</small></button>' for i, w in enumerate(WAYS))
END = '<span class="te"></span>'  # the tick where the last step ends
items = "".join(
    f'<div class="it {{{{c{i}}}}}" style="flex-grow: {{{{fg{i}}}}}"><span class="rg">{{{{r{i}}}}}</span>'
    f'<span class="ti"><b>0{i + 1}</b>{E(t)}</span><span class="bar"><span class="mt" style="background-size: {{{{tk{i}}}}}"></span><span class="ln"></span><span class="tk"></span>{END if i == 3 else ""}</span></div>' for i, (t, _) in enumerate(PHASES))
AL = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"></path></svg>'
ARR = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>'
process = f'''<section id="process" style="position: relative; color: #ffffff">
  <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(11,20,33,0.92) 0%, rgba(11,20,33,0.86) calc(100% - 320px), rgba(11,20,33,0) 100%)"></div>
  <div style="position: relative; padding: 112px 32px 268px; display: flex; flex-direction: column; gap: 80px">
    <div style="max-width: 720px; display: flex; flex-direction: column; gap: 20px">{label("How we work")}
      <h2 style="margin: 0; font-size: 56px; line-height: 1.04; font-weight: 500; letter-spacing: -0.045em">Same four steps,<br><span style="color: rgba(255,255,255,0.45)">a week or two years.</span></h2>
      <p style="margin: 0; max-width: 560px; font-size: 18px; line-height: 1.55; color: rgba(255,255,255,0.75)">A three-week review and two years inside your team run the same way. Pick a way in and drag along the line to see what happens when.</p>
    </div>
    <div style="display: flex; flex-direction: column; gap: 56px">
      <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 4px; border-bottom: 1px solid rgba(255,255,255,0.15)">
        <div role="tablist" aria-label="Ways in" class="tbs" style="border-bottom: 0">{tabs}</div>
        <p style="margin: 0; padding-bottom: 16px; display: flex; align-items: baseline; gap: 12px; white-space: nowrap"><span style="{MONO}; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.5)">In all</span><span style="font-size: 18px">{{{{len}}}}</span><span style="{MONO}; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.4)">{{{{shown}}}}</span></p>
      </div>
      <div style="display: flex; flex-direction: column; gap: 12px">
        <div role="slider" aria-label="Where in the engagement" aria-valuetext="{{{{mwhen}}}}: {{{{mtext}}}}" style="position: relative">
          <div style="display: flex">{items}</div>
          <div style="position: absolute; left: 0; right: 0; bottom: 0; height: 16px"><span class="hd" style="left: {{{{hx}}}}%"><span class="stem"></span><span class="dia"></span></span></div>
        </div>
        <div style="position: relative; height: 320px">
          <span class="lead" style="left: {{{{hx}}}}%"></span>
          <div class="note {{{{nh}}}}" style="left: {{{{hx}}}}%">
            <div aria-live="polite">
              <span style="{MONO}; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #9cc0e6">{{{{mwhen}}}} · {{{{mphase}}}}</span>
              <p style="margin: 12px 0 0; font-size: 24px; line-height: 1.3; font-weight: 500; letter-spacing: -0.02em">{{{{mtext}}}}</p>
              <p style="margin: 12px 0 0; font-size: 15px; line-height: 1.55; color: rgba(255,255,255,0.6)">{{{{pbody}}}}</p>
            </div>
        <div style="margin-top: 24px; display: flex; align-items: center; gap: 8px"><button type="button" class="ar" aria-label="Earlier" onClick="{{{{prev}}}}">{AL}</button><button type="button" class="ar" aria-label="Later" onClick="{{{{next}}}}">{ARR}</button><span style="margin-left: 6px; {MONO}; font-size: 10px; letter-spacing: 0.08em; color: rgba(255,255,255,0.4)">{{{{mi}}}} / {{{{mn}}}}</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>'''

JS = r'''
// The timeline: the same sums as the site (engagement-math.ts). Plus the end screen's Malmö clock.
const WAYS = __WAYS__;
const PHASES = __PHASES__;
const WPM = 52 / 12;
const total = (w) => w.phases.reduce((a, b) => a + b, 0);
const bounds = (w) => { let at = 0; return w.phases.map((d) => { const b = [at, at + d]; at += d; return b; }); };
const phaseAt = (w, wk) => { const i = bounds(w).findIndex((b) => wk < b[1] - 1e-6); return i < 0 ? 3 : i; };
const momentAt = (w, wk) => { let k = 0; w.moments.forEach((m, i) => { if (m.week <= wk + 1e-6) k = i; }); return k; };
const pointLabel = (w, wk) => {
  const on = w.moments.find((m) => Math.abs(m.week - wk) < 1e-6);
  if (on) return on.when;
  if (w.unit === 'month' && wk >= WPM) return 'Month ' + (Math.floor(wk / WPM + 1e-6) + 1);
  return 'Week ' + (Math.floor(wk + 1e-6) + 1);
};
const rangeLabel = (w, b) => {
  const months = w.unit === 'month' && (b[1] - b[0] >= WPM || b[0] >= WPM);
  const u = months ? WPM : 1, name = months ? 'Month' : 'Week';
  const from = Math.floor(b[0] / u + 1e-6) + 1, to = Math.max(from, Math.ceil(b[1] / u - 1e-6));
  return from === to ? name + ' ' + from : name + 's ' + from + '–' + to;
};
const MIN = 124 / 1376;
const layoutOf = (w) => {
  const t = total(w), real = w.phases.map((d) => d / t);
  let floored = real.map(() => false), shares = real;
  for (let pass = 0; pass < 4; pass++) {
    const fixed = floored.filter(Boolean).length * MIN;
    const free = real.reduce((a, s, i) => (floored[i] ? a : a + s), 0);
    shares = real.map((s, i) => (floored[i] ? MIN : (s / free) * (1 - fixed)));
    const next = shares.map((s, i) => floored[i] || s < MIN);
    if (next.every((f, i) => f === floored[i])) break;
    floored = next;
  }
  let at = 0; return shares.map((s) => { const r = [at, s]; at += s; return r; });
};
const placeOf = (w, wk, lay) => { const i = phaseAt(w, wk), b = bounds(w)[i], l = lay[i]; return l[0] + (Math.min(b[1], Math.max(b[0], wk)) - b[0]) / (b[1] - b[0]) * l[1]; };
const ticksOf = (w) => {
  const t = total(w);
  if (w.unit === 'month') { const m = Math.round(t / WPM); return Array.from({ length: Math.floor(m / 3) + 1 }, (_, i) => ({ week: i * 3 * WPM, label: String(i * 3) })); }
  const step = t <= 5 ? 1 : 2;
  return Array.from({ length: Math.floor(t / step) + 1 }, (_, i) => ({ week: i * step, label: String(i * step) }));
};
class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { time: '', hour: 12, way: 2, week: WAYS[2].start };
  }
  tick() {
    const now = new Date();
    let time = '';
    try { time = now.toLocaleTimeString('sv-SE', { timeZone: 'Europe/Stockholm', hour: '2-digit', minute: '2-digit' }); }
    catch (e) { time = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0'); }
    this.setState({ time, hour: parseInt(time.slice(0, 2), 10) });
  }
  componentDidMount() { this.tick(); this.timer = setInterval(() => this.tick(), 20000); }
  componentWillUnmount() { clearInterval(this.timer); }
  renderVals() {
    const h = this.state.hour;
    const phase = (h >= 21 || h < 5) ? 'night' : (h < 8 ? 'dawn' : (h >= 17 ? 'dusk' : 'day'));
    const greet = phase === 'night' ? 'Good night' : (phase === 'dawn' ? 'Good morning' : (phase === 'dusk' ? 'Good evening' : 'Hello'));
    const v = { time: this.state.time || '12:00', phase, greet };
    const { way, week } = this.state;
    const w = WAYS[way], t = total(w), b = bounds(w), cur = phaseAt(w, week), mi = momentAt(w, week), m = w.moments[mi];
    const lay = layoutOf(w);
    const pct = (x) => (placeOf(w, x, lay) * 100).toFixed(3) + '%';
    WAYS.forEach((x, i) => { v['w' + i] = i === way ? 'on' : ''; v['pw' + i] = () => this.setState({ way: i, week: WAYS[i].start }); });
    v.len = w.length; v.shown = w.shown;
    b.forEach((r, i) => {
      v['fg' + i] = lay[i][1].toFixed(4);
      v['tk' + i] = (100 / Math.max(1, Math.round(w.phases[i] / (w.unit === 'month' ? WPM : 1)))).toFixed(3) + '% 100%';
      v['c' + i] = i < cur ? 'done' : (i === cur ? 'on' : '');
      v['r' + i] = rangeLabel(w, r);
      const first = w.moments.find((x) => x.week >= r[0] - 1e-6) || w.moments[0];
      v['j' + i] = () => this.setState({ week: first.week });
    });
    for (let k = 0; k < 7; k++) {
      const x = w.moments[k];
      v['dl' + k] = x ? pct(x.week) : '0%'; v['dd' + k] = x ? 'block' : 'none'; v['dc' + k] = x && x.week <= week + 1e-6 ? 'on' : '';
    }
    v.hx = (placeOf(w, week, lay) * 100).toFixed(3);
    v.nh = placeOf(w, week, lay) * 1376 + 460 <= 1376 ? 'nr' : 'nl'; v.hl = pointLabel(w, week);
    v.mwhen = m.when; v.mtext = m.text; v.mphase = PHASES[cur][0]; v.pbody = PHASES[cur][1];
    v.mi = String(mi + 1); v.mn = String(w.moments.length);
    v.prev = () => this.setState({ week: w.moments[Math.max(0, mi - 1)].week });
    v.next = () => this.setState({ week: w.moments[Math.min(w.moments.length - 1, mi + 1)].week });
    return v;
  }
}
'''.replace("__WAYS__", json.dumps(WAYS, ensure_ascii=False)).replace("__PHASES__", json.dumps(PHASES, ensure_ascii=False))

board = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>How we work</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@300..700&amp;family=Geist+Mono:wght@400..500&amp;display=swap">
<style>{style}{CSS}</style>
</helmet>
<div style="position: relative; width: 1440px; background-color: #ffffff; font-family: Geist, ui-sans-serif, system-ui, sans-serif; color: #111214">
  <div style="position: relative; isolation: isolate; overflow: hidden; background-color: #6f8fb3">
    <img class="paint" src="{paint}" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: -1">
    {process}
    {end}
  </div>
  {foot}</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":1440,"height":{H}}}}}'>{JS}</script>
</body>
</html>'''
open(PROJ + "Process.dc.html", "w").write(board)
print("ok", len(board))
