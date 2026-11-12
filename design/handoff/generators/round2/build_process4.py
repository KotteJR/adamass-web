# How we work, interactive: pick a way in, step through its moments (or jump to a step), and the bar,
# the handle and the panel follow. The four steps sit on the bar at their real lengths. The board keeps
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
.pl{all:unset;box-sizing:border-box;cursor:pointer;height:44px;padding:0 16px;display:inline-flex;align-items:center;gap:10px;border-radius:999px;border:1px solid rgba(255,255,255,.2);color:rgba(255,255,255,.75);font-size:15px}
.pl small{font-family:'Geist Mono',ui-monospace,monospace;font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:rgba(255,255,255,.45)}
.pl:hover{border-color:rgba(255,255,255,.45);color:#fff}
.pl.on{background:#fff;color:#111214;border-color:#fff}.pl.on small{color:rgba(17,18,20,.5)}
.sg{position:absolute;top:44px;height:10px;transform:translateY(-50%);border-radius:99px;background:rgba(255,255,255,.14);transition:left .5s,width .5s,background-color .5s}
.sg.done{background:rgba(156,192,230,.4)}.sg.on{background:#9cc0e6}
.dt{position:absolute;top:44px;width:8px;height:8px;border-radius:99px;transform:translate(-50%,-50%);background:rgba(255,255,255,.35)}.dt.on{background:#fff}
.hd{position:absolute;top:24px;bottom:0;width:1px;background:rgba(255,255,255,.7);transform:translateX(-50%);transition:left .3s}
.knob{position:absolute;top:20px;left:50%;width:20px;height:20px;box-sizing:border-box;border-radius:99px;border:2px solid #fff;background:#0d1726;transform:translate(-50%,-50%);box-shadow:0 4px 16px rgba(0,0,0,.4)}
.bub{position:absolute;top:-4px;left:50%;white-space:nowrap;background:#fff;color:#111214;border-radius:6px;padding:4px 8px;font:10px/1 'Geist Mono',ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase}
.tk{position:absolute;top:0;white-space:nowrap}
.st{position:relative;display:flex;flex-direction:column;gap:4px;padding:0 0 28px 36px}
.st:last-child{padding-bottom:0}.st:last-child .ln{display:none}
.st .ind{position:absolute;left:0;top:4px;width:14px;height:14px;box-sizing:border-box;border-radius:99px;border:1.5px solid rgba(156,192,230,.45)}
.st.done .ind,.st.on .ind{background:#9cc0e6;border-color:#9cc0e6}.st.on .ind{box-shadow:0 0 0 4px rgba(156,192,230,.25)}
.st .ln{position:absolute;left:6.5px;top:30px;bottom:8px;width:1px;background:rgba(255,255,255,.2)}
.st button{all:unset;cursor:pointer;font-size:20px;font-weight:500;letter-spacing:-.02em;color:rgba(255,255,255,.5)}.st.on button{color:#fff}.st button:hover{color:rgba(255,255,255,.8)}
.ar{all:unset;box-sizing:border-box;cursor:pointer;width:44px;height:44px;border-radius:99px;border:1px solid rgba(255,255,255,.2);display:inline-flex;align-items:center;justify-content:center;color:rgba(255,255,255,.8)}.ar:hover{border-color:rgba(255,255,255,.5);color:#fff}
.pl:focus-visible,.ar:focus-visible,.st button:focus-visible{outline:2px solid #9cc0e6;outline-offset:2px}
"""
label = lambda t: f'<span style="{MONO}; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.6)">{E(t)}</span>'
pills = "".join(f'<button type="button" class="pl {{{{w{i}}}}}" onClick="{{{{pw{i}}}}}">{E(w["label"])}<small>{E(w["short"])}</small></button>' for i, w in enumerate(WAYS))
segs = "".join(f'<span class="sg {{{{sc{i}}}}}" style="left: {{{{sl{i}}}}}; width: {{{{sw{i}}}}}"></span>' for i in range(4))
dots = "".join(f'<span class="dt {{{{dc{k}}}}}" style="left: {{{{dl{k}}}}}; display: {{{{dd{k}}}}}"></span>' for k in range(7))
ticks = "".join(f'<span class="tk" style="left: {{{{tx{k}}}}}; transform: translateX(-{{{{tp{k}}}}}); display: {{{{td{k}}}}}">{{{{tl{k}}}}}</span>' for k in range(7))
steps = "".join(
    f'<div class="st {{{{c{i}}}}}"><span class="ind"></span><span class="ln"></span>'
    f'<span style="{MONO}; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.45)">{{{{r{i}}}}}</span>'
    f'<button type="button" onClick="{{{{j{i}}}}}">0{i + 1} {E(t)}</button></div>' for i, (t, _) in enumerate(PHASES))
AL = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"></path></svg>'
ARR = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>'
process = f'''<section id="process" style="position: relative; color: #ffffff">
  <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(11,20,33,0.92) 0%, rgba(11,20,33,0.86) calc(100% - 320px), rgba(11,20,33,0) 100%)"></div>
  <div style="position: relative; padding: 112px 32px 268px; display: flex; flex-direction: column; gap: 80px">
    <div style="max-width: 720px; display: flex; flex-direction: column; gap: 20px">{label("How we work")}
      <h2 style="margin: 0; font-size: 56px; line-height: 1.04; font-weight: 500; letter-spacing: -0.045em">Same four steps,<br><span style="color: rgba(255,255,255,0.45)">a week or two years.</span></h2>
      <p style="margin: 0; max-width: 560px; font-size: 18px; line-height: 1.55; color: rgba(255,255,255,0.75)">A three-week review and two years inside your team run the same way. Pick a way in and drag along the line to see what happens when.</p>
    </div>
    <div style="display: flex; flex-direction: column; gap: 48px">
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 32px">
        <div role="tablist" aria-label="Ways in" style="display: flex; flex-wrap: wrap; gap: 8px">{pills}</div>
        <p style="margin: 0; display: flex; align-items: baseline; gap: 12px; white-space: nowrap"><span style="{MONO}; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.5)">In all</span><span style="font-size: 18px">{{{{len}}}}</span><span style="{MONO}; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.4)">{{{{shown}}}}</span></p>
      </div>
      <div style="display: flex; flex-direction: column; gap: 12px">
        <div style="display: flex; flex-direction: column; gap: 8px">
          <div role="slider" aria-label="Where in the engagement" aria-valuetext="{{{{mwhen}}}}: {{{{mtext}}}}" style="position: relative; height: 68px">{segs}{dots}
            <span class="hd" style="left: {{{{hx}}}}%"><span class="knob"></span><span class="bub" style="transform: translate(-{{{{hx}}}}%, -100%)">{{{{hl}}}}</span></span>
          </div>
          <div style="position: relative; height: 16px; {MONO}; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.45)">{ticks}</div>
        </div>
        <p style="margin: 0; {MONO}; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.35)">Drag along the line, or use the arrow keys</p>
      </div>
      <div style="display: grid; grid-template-columns: minmax(0, 1fr) 720px; column-gap: 48px">
        <div>{steps}</div>
        <div style="display: flex; flex-direction: column; gap: 24px">
          <div aria-live="polite" style="display: flex; flex-direction: column; gap: 16px">
            <span style="{MONO}; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #9cc0e6">{{{{mwhen}}}} · {{{{mphase}}}}</span>
            <p style="margin: 0; max-width: 640px; font-size: 30px; line-height: 1.25; font-weight: 500; letter-spacing: -0.025em">{{{{mtext}}}}</p>
            <p style="margin: 0; max-width: 560px; font-size: 16px; line-height: 1.6; color: rgba(255,255,255,0.6)">{{{{pbody}}}}</p>
          </div>
          <div style="display: flex; align-items: center; gap: 8px"><button type="button" class="ar" aria-label="Earlier" onClick="{{{{prev}}}}">{AL}</button><button type="button" class="ar" aria-label="Later" onClick="{{{{next}}}}">{ARR}</button><span style="margin-left: 8px; {MONO}; font-size: 10px; letter-spacing: 0.08em; color: rgba(255,255,255,0.4)">{{{{mi}}}} / {{{{mn}}}}</span></div>
        </div>
      </div>
    </div>
    <p style="margin: 0; {MONO}; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.55)">Buying through AWS Marketplace? A private offer lands within a week.</p>
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
    const pct = (x) => (x / t * 100).toFixed(3) + '%';
    WAYS.forEach((x, i) => { v['w' + i] = i === way ? 'on' : ''; v['pw' + i] = () => this.setState({ way: i, week: WAYS[i].start }); });
    v.len = w.length; v.shown = w.shown;
    b.forEach((r, i) => {
      v['sl' + i] = 'calc(' + pct(r[0]) + ' + 2px)'; v['sw' + i] = 'calc(' + pct(r[1] - r[0]) + ' - 4px)';
      v['sc' + i] = i < cur ? 'done' : (i === cur ? 'on' : '');
      v['c' + i] = i < cur ? 'done' : (i === cur ? 'on' : '');
      v['r' + i] = rangeLabel(w, r);
      const first = w.moments.find((x) => x.week >= r[0] - 1e-6) || w.moments[0];
      v['j' + i] = () => this.setState({ week: first.week });
    });
    for (let k = 0; k < 7; k++) {
      const x = w.moments[k];
      v['dl' + k] = x ? pct(x.week) : '0%'; v['dd' + k] = x ? 'block' : 'none'; v['dc' + k] = x && x.week <= week + 1e-6 ? 'on' : '';
    }
    const ts = ticksOf(w);
    for (let k = 0; k < 7; k++) {
      const x = ts[k];
      v['tx' + k] = x ? pct(x.week) : '0%'; v['tp' + k] = x ? pct(x.week) : '0%'; v['td' + k] = x ? 'block' : 'none';
      v['tl' + k] = x ? (k === ts.length - 1 ? x.label + (w.unit === 'month' ? ' months' : ' weeks') : x.label) : '';
    }
    v.hx = (week / t * 100).toFixed(3); v.hl = pointLabel(w, week);
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
