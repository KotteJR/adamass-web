# How we work, interactive (white glass, still once filled, with a rippling edge; a marker per moment inside each box;
# the edge's inertia is on the site only): the ways in as a row of buttons; under them four boxes, one per step, each as wide as the
# step runs, with its name inside. As the playhead moves the boxes fill in like glass up to it (lit border, faint tint).
# The knob rides the boxes' bottom edge and one line drops from it past the note. The board keeps the end screen under
# it, on the same painting, with the Malmö clock. Nothing moves on its own.
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
.pills{display:flex;gap:6px}
.pl{all:unset;box-sizing:border-box;cursor:pointer;height:36px;padding:0 14px;display:inline-flex;align-items:center;border-radius:6px;background:rgba(255,255,255,.07);font-size:14px;color:rgba(255,255,255,.7);white-space:nowrap;transition:background-color .15s,color .15s}
.pl:hover{background:rgba(255,255,255,.13);color:#fff}
.pl.on{background:#fff;color:#111214}
.pl:focus-visible{outline:2px solid #9cc0e6;outline-offset:2px}
.bx{position:relative;height:120px;cursor:grab}
.bxs{position:absolute;inset:0;pointer-events:none}
.bxs>span{position:absolute;top:0;bottom:0;box-sizing:border-box;border-radius:8px;border:1px solid rgba(255,255,255,.12);transition:left .5s cubic-bezier(.2,.7,.2,1),width .5s cubic-bezier(.2,.7,.2,1)}
.bxs.lit>span{border-color:rgba(255,255,255,.3);box-shadow:inset 0 1px 0 rgba(255,255,255,.1);transition:--fill .5s cubic-bezier(.2,.7,.2,1),left .5s cubic-bezier(.2,.7,.2,1),width .5s cubic-bezier(.2,.7,.2,1)}
@property --fill {
  syntax: "<length>";
  inherits: false;
  initial-value: -152px;
}

@property --wave {
  syntax: "<length>";
  inherits: false;
  initial-value: 0px;
}

/* The glass: frosted white with a still highlight. Once filled it stays
   still; only its edge lives. It is solid up to the edge, then flows out by
   --flow (64 px at rest, further when moving fast) and ends in a soft wave
   (a tile, --flow wide and 120 px tall, that repeats down the box; the solid
   part runs 2 px into it, so the two never leave a hairline between them).
   A box the edge has passed is filled to the end. */
.glass {
  background:
    radial-gradient(55% 140% at 30% 0%, rgb(255 255 255 / 0.1), transparent 70%),
    linear-gradient(180deg, rgb(255 255 255 / 0.09), rgb(255 255 255 / 0.03));
  -webkit-mask:
    linear-gradient(#000, #000) 0 0 / max(0px, var(--fill) + 2px) 100% no-repeat,
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='120' viewBox='0 0 64 120'%3E%3Cfilter id='s' x='-50%25' y='-50%25' width='200%25' height='200%25'%3E%3CfeGaussianBlur stdDeviation='5'/%3E%3C/filter%3E%3Cpath d='M-30 -40 L20.0 -40 L17.6 -36 L15.9 -32 L15.2 -28 L15.5 -24 L16.9 -20 L19.1 -16 L22.1 -12 L25.4 -8 L28.6 -4 L31.6 0 L33.9 4 L35.4 8 L36.1 12 L36.1 16 L35.6 20 L34.7 24 L33.8 28 L33.1 32 L32.6 36 L32.4 40 L32.5 44 L32.7 48 L32.7 52 L32.4 56 L31.6 60 L30.1 64 L28.1 68 L25.5 72 L22.7 76 L20.0 80 L17.6 84 L15.9 88 L15.2 92 L15.5 96 L16.9 100 L19.1 104 L22.1 108 L25.4 112 L28.6 116 L31.6 120 L33.9 124 L35.4 128 L36.1 132 L36.1 136 L35.6 140 L34.7 144 L33.8 148 L33.1 152 L32.6 156 L32.4 160 L-30 160 Z' fill='%23000' filter='url(%23s)'/%3E%3C/svg%3E") var(--fill) var(--wave) / var(--flow, 64px) 120px repeat-y;
  mask:
    linear-gradient(#000, #000) 0 0 / max(0px, var(--fill) + 2px) 100% no-repeat,
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='120' viewBox='0 0 64 120'%3E%3Cfilter id='s' x='-50%25' y='-50%25' width='200%25' height='200%25'%3E%3CfeGaussianBlur stdDeviation='5'/%3E%3C/filter%3E%3Cpath d='M-30 -40 L20.0 -40 L17.6 -36 L15.9 -32 L15.2 -28 L15.5 -24 L16.9 -20 L19.1 -16 L22.1 -12 L25.4 -8 L28.6 -4 L31.6 0 L33.9 4 L35.4 8 L36.1 12 L36.1 16 L35.6 20 L34.7 24 L33.8 28 L33.1 32 L32.6 36 L32.4 40 L32.5 44 L32.7 48 L32.7 52 L32.4 56 L31.6 60 L30.1 64 L28.1 68 L25.5 72 L22.7 76 L20.0 80 L17.6 84 L15.9 88 L15.2 92 L15.5 96 L16.9 100 L19.1 104 L22.1 108 L25.4 112 L28.6 116 L31.6 120 L33.9 124 L35.4 128 L36.1 132 L36.1 136 L35.6 140 L34.7 144 L33.8 148 L33.1 152 L32.6 156 L32.4 160 L-30 160 Z' fill='%23000' filter='url(%23s)'/%3E%3C/svg%3E") var(--fill) var(--wave) / var(--flow, 64px) 120px repeat-y;
}

/* The box the playhead is in: its edge ripples, like liquid against glass. */
.live {
  animation: wave 4.8s linear infinite;
}

@keyframes wave {
  to {
    --wave: 120px;
  }
}

.nm{position:absolute;inset:0;pointer-events:none}
.nm>div{position:absolute;top:0;bottom:0;box-sizing:border-box;padding:16px;display:flex;flex-direction:column;gap:4px;min-width:0;transition:left .5s cubic-bezier(.2,.7,.2,1),width .5s cubic-bezier(.2,.7,.2,1)}
.nm .ti{display:block;font-size:18px;font-weight:500;letter-spacing:-.01em;white-space:nowrap;overflow:hidden;color:rgba(255,255,255,.4)}
.nm .done .ti{color:rgba(255,255,255,.75)}.nm .on .ti{color:#fff}
.nm .rg{font-family:'Geist Mono',ui-monospace,monospace;font-size:10px;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;overflow:hidden;color:rgba(255,255,255,.4)}
.mk{all:unset;position:absolute;bottom:12px;height:24px;display:flex;align-items:center;gap:6px;cursor:pointer;z-index:4;font-size:12px;letter-spacing:-.005em;white-space:nowrap;color:rgba(255,255,255,.35)}
.mk i{display:block;flex:none;width:4px;height:4px;border-radius:9px;background:rgba(255,255,255,.25)}
.mk:hover{color:rgba(255,255,255,.7)}.mk:hover i{background:rgba(255,255,255,.6)}
.mk.done{color:rgba(255,255,255,.65)}.mk.done i{background:rgba(255,255,255,.7)}
.mk.on{color:#fff}.mk.on i{background:#9cc0e6}
.mk.l{transform:translateX(-100%);flex-direction:row-reverse}
.knob{position:absolute;top:119.5px;width:14px;height:14px;border-radius:99px;background:#fff;box-shadow:0 0 0 3px #0d1726;transform:translate(-50%,-50%);z-index:3;transition:left .5s cubic-bezier(.2,.7,.2,1)}
.pline{position:absolute;top:0;bottom:0;width:1px;background:rgba(156,192,230,.6);transition:left .5s cubic-bezier(.2,.7,.2,1)}
.note{position:absolute;top:32px;box-sizing:border-box;width:100%;max-width:460px;transition:left .5s cubic-bezier(.2,.7,.2,1),transform .5s cubic-bezier(.2,.7,.2,1)}
.note.nr{padding-left:20px}.note.nl{transform:translateX(-100%);padding-right:20px}
.ar{all:unset;box-sizing:border-box;cursor:pointer;width:44px;height:44px;border-radius:99px;border:1px solid rgba(255,255,255,.2);display:inline-flex;align-items:center;justify-content:center;color:rgba(255,255,255,.8)}.ar:hover{border-color:rgba(255,255,255,.5);color:#fff}
.ar:focus-visible{outline:2px solid #9cc0e6;outline-offset:2px}
"""
label = lambda t: f'<span style="{MONO}; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.6)">{E(t)}</span>'
tabs = "".join(f'<button type="button" role="tab" class="pl {{{{w{i}}}}}" onClick="{{{{pw{i}}}}}">{E(w["label"])}</button>' for i, w in enumerate(WAYS))
BOXES = "".join(f'<span style="left: {{{{bl{i}}}}}; width: {{{{bw{i}}}}}"></span>' for i in range(4))
GLASS = "".join(f'<span class="glass {{{{lv{i}}}}}" style="left: {{{{bl{i}}}}}; width: {{{{bw{i}}}}}; --fill: {{{{fl{i}}}}}"></span>' for i in range(4))
names = "".join(
    f'<div class="{{{{c{i}}}}}" style="left: {{{{bl{i}}}}}; width: {{{{bw{i}}}}}"><span class="ti">{E(t)}</span>'
    f'<span class="rg">{{{{r{i}}}}}</span></div>' for i, (t, _) in enumerate(PHASES))
X = "min({{hx}}%, 100% - 1px)"  # the playhead line's left edge, 1 px inside at the very end; the knob and the note use it too
AL = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"></path></svg>'
ARR = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>'
process = f'''<section id="process" style="position: relative; color: #ffffff">
  <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(11,20,33,0.92) 0%, rgba(11,20,33,0.86) calc(100% - 320px), rgba(11,20,33,0) 100%)"></div>
  <div style="position: relative; padding: 112px 32px 268px; display: flex; flex-direction: column; gap: 80px">
    <div style="max-width: 720px; display: flex; flex-direction: column; gap: 20px">{label("How we work")}
      <h2 style="margin: 0; font-size: 56px; line-height: 1.04; font-weight: 500; letter-spacing: -0.045em">Same four steps,<br><span style="color: rgba(255,255,255,0.45)">a week or two years.</span></h2>
      <p style="margin: 0; max-width: 560px; font-size: 18px; line-height: 1.55; color: rgba(255,255,255,0.75)">A three-week review and two years inside your team run the same way. Pick a way in and drag along the line to see what happens when.</p>
    </div>
    <div style="display: flex; flex-direction: column; gap: 40px">
      <div role="tablist" aria-label="Ways in" class="pills">{tabs}</div>
      <div style="position: relative">
        <div role="slider" aria-label="Where in the engagement" aria-valuetext="{{{{mwhen}}}}: {{{{mtext}}}}" class="bx">
          <span class="bxs">{BOXES}</span>
          <span class="bxs lit">{GLASS}</span>
          <div class="nm">{names}</div>
          <sc-for list="{{{{mk}}}}" as="m" hint-placeholder-count="7"><button type="button" class="mk {{{{m.cls}}}} {{{{m.side}}}}" style="left: {{{{m.x}}}}px" onClick="{{{{m.go}}}}"><i></i><span>{{{{m.name}}}}</span></button></sc-for>
          <span class="knob" style="left: calc({X} + 0.5px)"></span>
        </div>
        <div style="position: relative; height: 320px">
          <span class="pline" style="left: {X}"></span>
          <div class="note {{{{nh}}}}" style="left: {X}">
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
const MIN = 132 / 1376;
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
      const lead = i ? 3 : 0, tail = i < 3 ? 3 : 0;  // half the 6 px gap where boxes meet
      v['bl' + i] = 'calc(' + (lay[i][0] * 100).toFixed(3) + '% + ' + lead + 'px)';
      v['bw' + i] = 'calc(' + (lay[i][1] * 100).toFixed(3) + '% - ' + (lead + tail) + 'px)';
      // How far the glass reaches into this box, in px of the 1376 px row: to the playhead, never past the end.
      const left = lay[i][0] * 1376 + lead, wide = lay[i][1] * 1376 - lead - tail, x = placeOf(w, week, lay) * 1376;
      v['fl' + i] = Math.min(wide, Math.max(-152, x - left)).toFixed(1) + 'px';
      v['lv' + i] = i === cur ? 'live' : '';
      v['tk' + i] = (100 / Math.max(1, Math.round(w.phases[i] / (w.unit === 'month' ? WPM : 1)))).toFixed(3) + '% 100%';
      v['c' + i] = i < cur ? 'done' : (i === cur ? 'on' : '');
      v['r' + i] = rangeLabel(w, r);
      const first = w.moments.find((x) => x.week >= r[0] - 1e-6) || w.moments[0];
      v['j' + i] = () => this.setState({ week: first.week });
    });
    // One marker per moment inside its step's box: its name right of the dot if it fits, else left, else just the dot.
    const mk = [];
    for (let i = 0; i < 4; i++) {
      const lead = i ? 3 : 0, tail = i < 3 ? 3 : 0, bl = lay[i][0] * 1376 + lead, bw = lay[i][1] * 1376 - lead - tail;
      const local = (wk) => Math.min(bw - 16, Math.max(16, placeOf(w, wk, lay) * 1376 - bl));
      const inBox = w.moments.map((m, k) => ({ m, k })).filter((o) => phaseAt(w, o.m.week) === i);
      let taken = 8;
      inBox.forEach((o, j) => {
        const left = local(o.m.week), next = j + 1 < inBox.length ? local(inBox[j + 1].m.week) : bw - 6, room = o.m.label.length * 6.6 + 10;
        const side = left + room + 6 <= next ? 'r' : left - room - 6 >= taken ? 'l' : 'n';
        taken = side === 'r' ? left + room : left + 6;
        mk.push({ x: (bl + left + (side === 'l' ? 2 : -2)).toFixed(1), side, name: side === 'n' ? '' : o.m.label, cls: o.k < mi ? 'done' : (o.k === mi ? 'on' : ''), go: () => this.setState({ week: o.m.week }) });
      });
    }
    v.mk = mk;
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
