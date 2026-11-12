# Selected work, round three: an index of three rows (name, line, tags, Learn more, a small live preview),
# and a 50/50 modal per product: the live stage on the left, and on the right a title, tabs
# (Overview, The model, Stack), charts, and buttons only. Top and bottom rows of both halves line up.
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from stages import *
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "v10"))
from models import all_figs
FIGS, FIG_CSS = all_figs()

def does(items):
    rows = "".join(f'<div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; min-height: 36px; padding: 0 12px; border-radius: 8px; background-color: #f7f7f5"><span style="font-size: 14px; color: #3d424a">{a}</span><span style="flex: none; {MONO}; font-size: 10.5px; letter-spacing: 0.08em; text-transform: uppercase; color: #2f5b8c">{b}</span></div>' for a, b in items)
    return f'<div style="display: flex; flex-direction: column; gap: 4px">{label("What the model does")}<div style="margin-top: 6px; display: flex; flex-direction: column; gap: 4px">{rows}</div></div>'

HL = "1px solid #e7e6e1"
def harness(key, steps, stats=None, rows=None):
    cols = 3 if len(steps) == 3 else 2
    cells = ""
    for k, t in enumerate(steps):
        bl = f"border-left: {HL};" if k % cols else ""
        bt = f"border-top: {HL};" if k >= cols else ""
        cells += (f'<li style="{bl}{bt} padding: 16px 18px 18px; display: flex; flex-direction: column; gap: 6px">'
                  f'<span style="{MONO}; font-size: 10.5px; letter-spacing: 0.08em; color: #2f5b8c">0{k + 1}</span>'
                  f'<span style="font-size: 14px; line-height: 1.4; color: #2a2d33">{t}</span></li>')
    out = (f'<div style="border: {HL}; border-radius: 12px; overflow: hidden">'
           f'<figure style="margin: 0"><div style="background-color: #f7f7f5; padding: 28px 28px 24px">{FIGS[key]}</div>'
           f'<figcaption><ol style="margin: 0; padding: 0; list-style: none; display: grid; grid-template-columns: repeat({cols}, minmax(0, 1fr)); border-top: {HL}">{cells}</ol></figcaption></figure>')
    if stats:
        sc = "".join(f'<div style="{"border-left: " + HL + ";" if k else ""} padding: 20px 18px 22px; display: flex; flex-direction: column; gap: 6px">'
                     f'<span style="font-size: 28px; line-height: 1.05; font-weight: 500; letter-spacing: -0.035em">{a}</span>'
                     f'<span style="font-size: 13px; line-height: 1.4; color: #6b7079">{b}</span></div>' for k, (a, b) in enumerate(stats))
        out += f'<div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border-top: {HL}">{sc}</div>'
    if rows:
        rs = "".join(f'<div style="border-top: {HL}; padding: 11px 18px; display: flex; align-items: center; justify-content: space-between; gap: 16px">'
                     f'<span style="font-size: 14px; color: #3d424a">{a}</span><span style="flex: none; {MONO}; font-size: 10.5px; letter-spacing: 0.08em; text-transform: uppercase; color: #2f5b8c">{b}</span></div>' for a, b in rows)
        out += f'<div style="border-top: {HL}"><div style="padding: 16px 18px 10px">{label("What the model does")}</div>{rs}</div>'
    return out + "</div>"

def model_fig(key, steps):
    caps = "".join(f'<span style="display: inline-flex; align-items: center; gap: 7px"><i style="font-style: normal; width: 17px; height: 17px; border-radius: 4px; background-color: #f3f2ee; display: inline-flex; align-items: center; justify-content: center; font-size: 9.5px; color: #4a4f57">{k + 1}</i>{t}</span>' for k, t in enumerate(steps))
    return (f'<figure style="margin: 0; display: flex; flex-direction: column; gap: 12px">{FIGS[key]}'
            f'<figcaption style="display: flex; flex-wrap: wrap; gap: 8px 18px; {MONO}; font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; color: #6b7079">{caps}</figcaption></figure>')

STEEL, PALE = "#2F5B8C", "#C9D5E3"
ARROW = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"></path></svg>'

def label(t, extra=""):
    return f'<span style="{MONO}; font-size: 10.5px; letter-spacing: 0.08em; text-transform: uppercase; color: #6b7079{extra}">{t}</span>'

def para(t):
    return f'<p style="margin: 0; font-size: 15.5px; line-height: 1.62; color: #3d424a">{t}</p>'

def stats(items):
    cells = "".join(f'<div style="display: flex; flex-direction: column; gap: 4px"><span style="font-size: 26px; line-height: 1.1; font-weight: 500; letter-spacing: -0.035em">{a}</span><span style="font-size: 13px; line-height: 1.4; color: #6b7079">{b}</span></div>' for a, b in items)
    return f'<div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px">{cells}</div>'

def stack(groups):
    gs = ""
    for name, chips in groups:
        cs = "".join(f'<span style="display: inline-flex; align-items: center; height: 26px; padding: 0 9px; border-radius: 6px; background-color: #f3f2ee; font-size: 12.5px; color: #2a2d33; white-space: nowrap">{c}</span>' for c in chips)
        gs += f'<div style="display: flex; flex-direction: column; gap: 10px">{label(name)}<div style="display: flex; flex-wrap: wrap; gap: 6px">{cs}</div></div>'
    return f'<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px 28px">{gs}</div>'

# ---------------------------------------------------------------- charts (one hue, direct labels, hover titles)
def chart_weights():
    return f'''<figure role="img" aria-label="About 90 percent of the model's weights post-trained by us, about 10 percent left as released" style="margin: 0; display: flex; flex-direction: column; gap: 10px">
  {label("Weights we retrained")}
  <div style="display: flex; gap: 2px; height: 14px"><span title="Post-trained by us: about 90%" style="flex: 90; background-color: {STEEL}; border-radius: 4px 0 0 4px"></span><span title="Left as released: about 10%" style="flex: 10; background-color: {PALE}; border-radius: 0 4px 4px 0"></span></div>
  <div style="display: flex; justify-content: space-between; font-size: 13px; color: #6b7079"><span><b style="font-weight: 500; color: #111214">~90%</b> post-trained by us</span><span>~10% as released</span></div>
</figure>'''

def chart_funnel():
    rows = [("Drafted", 4000), ("One answer", 1150), ("Fair and fun", 140), ("Shipped", 11)]
    import math
    mx = math.log10(4000)
    out = ""
    for name, v in rows:
        w = math.log10(v) / mx * 100
        out += (f'<div style="display: grid; grid-template-columns: 96px minmax(0, 1fr) 52px; align-items: center; gap: 12px; font-size: 13px">'
                f'<span style="color: #3d424a">{name}</span>'
                f'<span style="height: 12px; display: block"><span title="{name}: {v:,}" style="display: block; height: 12px; width: {w:.1f}%; border-radius: 0 4px 4px 0; background-color: {STEEL}"></span></span>'
                f'<span style="text-align: right; font-weight: 500; color: #111214; font-variant-numeric: tabular-nums">{v:,}</span></div>')
    return f'''<figure role="img" aria-label="One night of puzzles: 4,000 drafted, 1,150 with one answer, 140 fair and fun, 11 shipped" style="margin: 0; display: flex; flex-direction: column; gap: 10px">
  <div style="display: flex; justify-content: space-between">{label("One night, from drafts to today’s eleven")}{label("Log scale", "; color: #8a8f98")}</div>
  {out}
</figure>'''

def chart_params():
    sq = "".join(f'<span title="1 billion parameters" style="width: 14px; height: 14px; border-radius: 3px; background-color: {STEEL}"></span>' for _ in range(27))
    return f'''<figure role="img" aria-label="27 billion parameters, shown as 27 squares of one billion each" style="margin: 0; display: flex; flex-direction: column; gap: 10px">
  {label("Model size")}
  <div style="display: grid; grid-template-columns: repeat(9, 14px); gap: 3px">{sq}</div>
  <span style="font-size: 13px; color: #6b7079"><b style="font-weight: 500; color: #111214">27B</b> parameters, one square per billion</span>
</figure>'''

def chart_agree():
    dots = "".join(f'<span title="{"Matches the reviewer" if i < 94 else "Differs from the reviewer"}" style="width: 8px; height: 8px; border-radius: 8px; background-color: {STEEL if i < 94 else PALE}"></span>' for i in range(100))
    return f'''<figure role="img" aria-label="94 of 100 held-out answers match the reviewer" style="margin: 0; display: flex; flex-direction: column; gap: 10px">
  {label("Held-out test")}
  <div style="display: grid; grid-template-columns: repeat(20, 8px); gap: 3px">{dots}</div>
  <span style="font-size: 13px; color: #6b7079"><b style="font-weight: 500; color: #111214">94 in 100</b> answers match the reviewer</span>
</figure>'''

def pill(t, strong=False):
    bg = "#111214" if strong else "#f3f2ee"
    fg = "#ffffff" if strong else "#2a2d33"
    return f'<span style="display: flex; align-items: center; justify-content: center; min-height: 40px; box-sizing: border-box; padding: 6px 10px; border-radius: 6px; background-color: {bg}; color: {fg}; font-size: 12.5px; line-height: 1.3; text-align: center">{t}</span>'

def chart_pipeline():
    arr = '<svg width="14" height="10" viewBox="0 0 14 10" aria-hidden="true" style="flex: none"><path d="M1 5h11M8 1.5L12 5 8 8.5" fill="none" stroke="#8a8f98" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>'
    return f'''<figure role="img" aria-label="Two retrieval paths, one over the regulation and one over the library of risks and controls, feed an extraction step bound to the library, then a reviewer" style="margin: 0; display: flex; flex-direction: column; gap: 10px">
  {label("Two paths in, one answer out")}
  <div style="display: flex; align-items: center; gap: 6px">
    <div style="width: 74px">{pill("Article")}</div>{arr}
    <div style="flex: 1; display: flex; flex-direction: column; gap: 6px">{pill("Reads the regulation")}{pill("Searches the library")}</div>{arr}
    <div style="flex: 1">{pill("Extraction, bound to the library")}</div>{arr}
    <div style="width: 78px">{pill("Reviewer", True)}</div>
  </div>
</figure>'''

# ---------------------------------------------------------------- content
P = [
  dict(key="murmur", name="Murmur", kind="Our product", tags=["Our product", "Generative audio", "Coming soon"],
       line="Sound for focus and sleep. A music model we post-trained on lofi and noise writes every loop.",
       label="Our product · Web · Coming soon", h1="Sound you describe.", h2="Looped all night long.",
       overview=para("Murmur makes the sound for focus and sleep. Pick instruments, a mood and a texture, or shape a noise to the room you are in. It writes a loop that joins end to start without a seam, so it can play all night.")
                + stats([("12", "instruments, from piano to harp"), ("6", "textures: vinyl, rain, cafe, tape, wind, fire"), ("1 to 4 min", "loops, played for hours")]),
       fig="murmur", model=para("We took an open-source music model and rebuilt it for one job. About 90% of its weights are post-trained by us, on 14,000 hours of lofi and noise scored by ear for a single thing: nothing in it should pull your attention. It now writes a whole loop in 8 steps, and the last sample lands exactly where the first one began.")
             + harness("murmur", ["Lofi and noise in", "~90% of layers retrained", "A loop with no seam"], stats=[("14,000 h", "of lofi and noise it learned from"), ("8 steps", "to write a full loop"), ("0", "audible seams, all night")]),
       stack=stack([("Model", ["ACE-Step 1.5 Turbo base", "Post-training on lofi and noise", "8-step generation"]),
                    ("Audio", ["Pedalboard", "NumPy", "SciPy", "Web Audio AudioWorklet", "Seamless loop rendering"]),
                    ("Web app", ["Next.js", "React", "TypeScript", "Motion", "GSAP", "PixiJS", "Radix UI", "Zod"]),
                    ("API", ["FastAPI", "SQLAlchemy", "Pydantic", "Stripe", "JWT"]),
                    ("AWS", ["ECS Fargate", "RDS Postgres", "S3", "SQS workers", "AWS CDK"])]),
       cta=("Join the waitlist", "#contact")),
  dict(key="morrow", name="Morrow", kind="Our product", tags=["Our product", "In-house model", "Coming soon"],
       line="The daily puzzles people pay a subscription for, free every morning. A model we trained in house writes them.",
       label="Our product · Web · Coming soon", h1="The puzzles people pay for,", h2="free every morning.",
       overview=para("Morrow has the kinds of daily puzzles people usually pay a subscription for: a crossword and a mini, five-letter words, bundles, word threads, number place and more. AI writes them, which makes them cheap enough to give away, so at midnight the same eleven arrive for everyone, free. Eight Odds games, where you play against a language model’s guesses, a Wednesday special and a monthly Almanac sit around them.")
                + stats([("11", "new puzzles every day"), ("1 answer", "each, proved by a solver"), ("8 Odds", "games against a model")]),
       fig="morrow", model=para("Our puzzle model is trained in house to do what a puzzle editor does. Every night it drafts about 4,000 candidates. Solvers then play every one: any puzzle with a second answer, a dead end or a dull path is thrown out, and the rest are ranked by how they feel to solve. Eleven survive. Because the model is small and ours, a whole day of fresh puzzles costs less than a cent to make. That is the point: AI should make good entertainment cheaper for everyone, not another subscription.")
             + harness("morrow", ["4,000 drafts a night", "Solvers play each one", "Eleven make the morning"], stats=[("4,000", "drafts every night"), ("1 in 360", "makes it to the morning"), ("< 1¢", "to make a whole day")]),
       stack=stack([("Model", ["In-house puzzle model", "Language-model word odds", "Nightly generation"]),
                    ("Generators and solvers", ["Backtracking constructors", "Uniqueness solvers", "Breadth-first proofs", "Per-game validators"]),
                    ("Web app", ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "three.js", "TanStack Query"]),
                    ("API", ["FastAPI", "SQLAlchemy 2, async", "Alembic", "PostgreSQL 17", "Pydantic", "Stripe"]),
                    ("Quality", ["Playwright", "Vitest", "pytest", "mypy", "Ruff"]),
                    ("Hosting", ["Render"])]),
       cta=("Join the waitlist", "#contact")),
  dict(key="auditor", fig="slm", name="Compliance SLM", kind="Client work", tags=["Client work", "27B model", "Private cloud"],
       line="A first-pass regulatory auditor, private to the client’s cloud. 94 in 100 of its answers match the reviewer.",
       label="Client work · Regulatory model", h1="A compliance SLM,", h2="private to the client’s cloud.",
       overview=para("It reads one regulatory article and returns the risks and controls that bind, or nothing when the text does not. A reviewer still signs. Built for a client in a regulated industry, it runs inside their own AWS account.")
                + f'<div style="display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 36px; align-items: start">{chart_params()}{chart_agree()}</div>',
       model=para("A 27B specialist model, developed from an expert-labelled workflow and built with supervised fine-tuning and reinforcement learning. Synthetic data covers the rare labels. It is scored on a held-out gold set, with the expert labels withheld from training.")
             + harness("slm", ["Expert-labelled work", "Synthetic data for rare labels", "Fine-tuned, then reinforced", "Held-out gold set"], rows=[("Returns the risks a regulatory article creates", "94% match"), ("Maps every risk to the control that answers it", "93% match"),
                     ("Emits output the downstream system can parse", "100%"), ("Covers rare labels through synthetic data", "Synthetic"),
                     ("Returns nothing when the text does not bind", "Guardrail"), ("Leaves the client’s own AWS account", "Never"), ("Signs the compliance opinion", "Never")]),
       stack=stack([("Model", ["27B specialist model", "Supervised fine-tuning", "Reinforcement learning", "Synthetic data", "Held-out gold set"]),
                    ("AWS", ["Control Tower", "Organisations", "IAM", "Amazon S3", "SageMaker", "Amazon VPC", "CloudWatch", "Budgets"])]),
       cta=("Ask about a similar model", "#contact")),
  dict(key="extract", fig="extract", name="Library-backed extraction", kind="Client work", tags=["Client work", "Dual RAG", "Any domain"],
       line="Reads a document and returns only what a library of known controls already holds, in standardized domains or new ones.",
       label="Client work · AI architecture", h1="Library-backed extraction.", h2="Every answer is one you know.",
       overview=para("Two retrieval paths run side by side: one reads the document, the other searches a library of risks and controls. Extraction is bound to that library, so every answer is a control the reviewers already recognise, or nothing at all.")
                + stats([("2 paths", "the document and the library"), ("Bound", "every answer maps to the library"), ("Any domain", "standardized, or built with you")]),
       model=para("It works in standardized domains, where that library already exists, and in unstandardized ones, where we build the library with the client first and the same pipeline runs on it.")
             + harness("extract", ["Reads the document", "Searches the library", "Extracts, bound to it", "A reviewer signs"])
             + para("We design AI frameworks and architectures like this for other needs too: agent workflows with a person in the loop, document review, decision support. Each one is shaped around the job, and runs where the data already lives."),
       stack=stack([("Retrieval", ["Dual RAG", "Library-backed extraction", "Reranking"]),
                    ("Libraries", ["Standard control libraries", "Custom libraries built with the client"]),
                    ("Workflow", ["Human-in-the-loop review", "Agentic workflow engine"])]),
       cta=("Send a short brief", "#contact")),
]
STAGE = {"murmur": murmur, "morrow": morrow, "auditor": auditor, "extract": extraction}
N = len(P)

def row(i, p):
    tags = "".join(f'<span style="display: inline-flex; align-items: center; height: 26px; padding: 0 9px; border-radius: 5px; background-color: #f3f2ee; {MONO}; font-size: 10.5px; letter-spacing: 0.06em; text-transform: uppercase; color: #4a4f57">{t}</span>' for t in p["tags"])
    return f'''<div class="row">
  <div style="display: flex; flex-direction: column; min-width: 0">
    <div style="display: flex; align-items: baseline; gap: 20px"><span style="{MONO}; font-size: 12px; color: #a3a8b0">0{i + 1}</span><h3 class="nm" style="margin: 0; font-size: 56px; line-height: 1.02; font-weight: 500; letter-spacing: -0.045em">{p["name"]}</h3></div>
    <p style="margin: 18px 0 0 40px; max-width: 470px; font-size: 17px; line-height: 1.55; color: #6b7079">{p["line"]}</p>
    <div style="margin: 20px 0 0 40px; display: flex; flex-wrap: wrap; gap: 6px">{tags}</div>
    <div style="margin: auto 0 0 40px"><button type="button" class="lm" onClick="{{{{lm{i}}}}}">Learn more {ARROW}</button></div>
  </div>
  <button type="button" class="pv" aria-label="Learn more about {p["name"]}" onClick="{{{{lm{i}}}}}"><div class="pvs">{STAGE[p["key"]]("card")}</div></button>
</div>'''

def modal(i, p):
    prv, nxt = P[(i - 1) % N]["name"], P[(i + 1) % N]["name"]
    href = p["cta"][1]
    tabs = "".join(f'<button type="button" role="tab" class="tb" aria-selected="{{{{s{k}}}}}" aria-controls="pn{i}{k}" onClick="{{{{tb{k}}}}}">{t}</button>' for k, t in enumerate(["Overview", "The model", "Stack"]))
    panels = "".join(f'<div class="pn {{{{p{k}}}}}" id="pn{i}{k}" role="tabpanel">{c}</div>' for k, c in enumerate([p["overview"], p["model"], p["stack"]]))
    icon_l = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"></path></svg>'
    icon_r = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>'
    return f'''<div class="md {{{{o{i}}}}}" role="dialog" aria-modal="true" aria-labelledby="mt{i}">
  <div class="mv">{STAGE[p["key"]]("modal")}</div>
  <div class="mc">
    <div class="mi" style="--i: 0; height: 36px; display: flex; align-items: center; justify-content: space-between">
      {label(p["label"])}
      <span style="display: inline-flex; align-items: center; gap: 10px"><span style="{MONO}; font-size: 10px; letter-spacing: 0.08em; color: #8a8f98">ESC</span><button type="button" class="x" aria-label="Close" onClick="{{{{close}}}}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"></path></svg></button></span>
    </div>
    <h2 id="mt{i}" class="mi" style="--i: 1; margin: 26px 0 0; font-size: 38px; line-height: 1.08; font-weight: 500; letter-spacing: -0.04em">{p["h1"]}<br><span style="color: #a3a8b0">{p["h2"]}</span></h2>
    <div class="mi seg" style="--i: 2" role="tablist" aria-label="About {p["name"]}"><span class="ind {{{{ti}}}}"></span>{tabs}</div>
    <div class="mp mi" style="--i: 3">{panels}</div>
    <div class="mi" style="--i: 4; height: 44px; display: flex; align-items: center; justify-content: space-between; gap: 12px">
      <div style="display: flex; gap: 8px"><a class="ink" href="{href}">{p["cta"][0]}</a><a class="soft" href="mailto:aleksandar.kotevski@adamass.se">Write to Aleksandar</a></div>
      <div style="display: flex; align-items: center; gap: 6px"><button type="button" class="x" aria-label="Previous: {prv}" onClick="{{{{pv{i}}}}}">{icon_l}</button><span style="{MONO}; font-size: 11px; color: #8a8f98; width: 38px; text-align: center">{i + 1} / {N}</span><button type="button" class="x" aria-label="Next: {nxt}" onClick="{{{{nx{i}}}}}">{icon_r}</button></div>
    </div>
  </div>
</div>'''

GRID_CSS = """
.wc{display:flex;flex-direction:column;min-width:0}
.wp{all:unset;box-sizing:border-box;position:relative;display:block;width:100%;border-radius:12px;overflow:hidden;cursor:pointer;isolation:isolate;text-decoration:none}
.wp:focus-visible,.lk:focus-visible{outline:2px solid #2f5b8c;outline-offset:3px}
.wps{position:absolute;left:0;top:0;width:600px;height:780px;transform-origin:0 0}
.wps > *{transition:transform .9s cubic-bezier(.2,.7,.2,1)}
.wc:hover .wps > *{transform:scale(1.03)}
.ask{position:absolute;inset:0;overflow:hidden;font-family:Geist,ui-sans-serif,system-ui,sans-serif;background-color:#111214}
.ask b{display:block}
.rb{display:block;border-radius:3px;background-color:rgba(255,255,255,.1);animation:rbRead 4.16s ease-in-out infinite}
@keyframes rbRead{0%,100%{background-color:rgba(255,255,255,.1)}6%{background-color:rgba(207,224,242,.55)}18%{background-color:rgba(255,255,255,.1)}}
@media (prefers-reduced-motion: reduce){.rb{animation:none}}
.cn{transition:color .3s}.wc:hover .cn{color:#2f5b8c}
.lk{all:unset;cursor:pointer;align-self:flex-start;font-weight:500;color:#111214;text-decoration:none}
.lk:hover{color:#2f5b8c}
"""
CSS = STAGE_CSS + FIG_CSS + GRID_CSS + """
body{margin:0}
.row{display:grid;grid-template-columns:minmax(0,1fr) 520px;gap:56px;height:300px}
.pv{all:unset;box-sizing:border-box;position:relative;display:block;width:520px;height:300px;border-radius:12px;overflow:hidden;cursor:pointer;isolation:isolate}
.pv:focus-visible{outline:2px solid #2f5b8c;outline-offset:3px}
.pvs{position:absolute;left:0;top:0;width:780px;height:450px;transform:scale(.66667);transform-origin:0 0;transition:transform .8s cubic-bezier(.2,.7,.2,1)}
.pv:hover .pvs{transform:scale(.68)}
.nm{transition:color .3s}.row:hover .nm{color:#2f5b8c}
.lm{all:unset;box-sizing:border-box;flex:none;cursor:pointer;display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 16px;border-radius:8px;background:#f3f2ee;color:#111214;font-family:Geist,ui-sans-serif,system-ui,sans-serif;font-size:14px;font-weight:500;white-space:nowrap;transition:background-color .25s,color .25s}
.lm svg{transition:transform .3s cubic-bezier(.2,.7,.2,1)}
.lm:hover,.row:hover .lm{background:#111214;color:#fff}.lm:hover svg,.row:hover .lm svg{transform:translate(2px,-2px)}
.lm:focus-visible,.x:focus-visible,.tb:focus-visible,.ink:focus-visible,.soft:focus-visible,.scrim:focus-visible{outline:2px solid #2f5b8c;outline-offset:2px}
.ov{position:absolute;inset:0;z-index:50;display:none}
.ov.on{display:block}
.scrim{all:unset;position:absolute;inset:0;cursor:default;background:rgba(17,18,20,.36);backdrop-filter:blur(14px) saturate(1.05);-webkit-backdrop-filter:blur(14px) saturate(1.05);animation:fadeIn .4s ease both}
.md{display:none;position:absolute;left:50%;transform:translateX(-50%);width:1200px;height:780px;border-radius:12px;overflow:hidden;background:#fff;box-shadow:0 60px 120px -40px rgba(10,20,40,.55);grid-template-columns:1fr 1fr;font-family:Geist,ui-sans-serif,system-ui,sans-serif;color:#111214}
.md.on{display:grid;animation:pIn .6s cubic-bezier(.2,.7,.2,1) both}
.mv{position:relative;overflow:hidden;animation:vIn .9s cubic-bezier(.2,.7,.2,1) both}
.mc{display:flex;flex-direction:column;padding:40px 48px;min-height:0;box-sizing:border-box}
.seg{position:relative;margin-top:24px;align-self:flex-start;display:flex;padding:4px;border-radius:9px;background:#f3f2ee}
.seg .ind{position:absolute;left:4px;top:4px;width:112px;height:34px;border-radius:6px;background:#fff;box-shadow:0 1px 2px rgba(17,18,20,.06);transition:transform .4s cubic-bezier(.2,.7,.2,1)}
.seg .ind.t1{transform:translateX(112px)}.seg .ind.t2{transform:translateX(224px)}
.tb{all:unset;position:relative;box-sizing:border-box;width:112px;height:34px;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;font-family:Geist,ui-sans-serif,system-ui,sans-serif;font-size:14px;font-weight:500;color:#6b7079;transition:color .25s}
.tb[aria-selected="true"]{color:#111214}.tb:hover{color:#111214}
.mp{flex:1;min-height:0;overflow:auto;margin:24px -8px 24px 0;padding:0 8px 20px 0;-webkit-mask-image:linear-gradient(to bottom,#000 calc(100% - 28px),transparent);mask-image:linear-gradient(to bottom,#000 calc(100% - 28px),transparent)}
.pn{display:none;flex-direction:column;gap:28px}
.pn.on{display:flex;animation:mIn .45s cubic-bezier(.2,.7,.2,1) both}
.mi{animation:mIn .6s cubic-bezier(.2,.7,.2,1) both;animation-delay:calc(var(--i) * 55ms + 160ms)}
.x{all:unset;box-sizing:border-box;cursor:pointer;width:36px;height:36px;border-radius:8px;background:#f3f2ee;display:inline-flex;align-items:center;justify-content:center;color:#111214;transition:background-color .2s}.x:hover{background:#e9e8e3}
.ink,.soft{all:unset;box-sizing:border-box;cursor:pointer;display:inline-flex;align-items:center;height:44px;padding:0 18px;border-radius:8px;font-family:Geist,ui-sans-serif,system-ui,sans-serif;font-size:15px;font-weight:500;white-space:nowrap;text-decoration:none}
.ink{background:#111214;color:#fff}.ink:hover{background:#2a2c31}
.soft{background:#f3f2ee;color:#111214}.soft:hover{background:#e9e8e3}
@keyframes fadeIn{from{opacity:0}}
@keyframes pIn{from{opacity:0;transform:translateX(-50%) translateY(28px) scale(.98)}to{opacity:1;transform:translateX(-50%)}}
@keyframes vIn{from{clip-path:inset(6% 10% 6% 6% round 12px)}to{clip-path:inset(0 0 0 0 round 0)}}
@keyframes mIn{from{opacity:0;transform:translateY(10px)}}
""" + REDUCED

# ---------------------------------------------------------------- Selected work as a grid of cards
# Desktop: five in one row (the four pieces of work, then "Ask about other work").
# iPad and smaller laptops: two on top, three below. Phones: two by two, then the ask card full width.
# Each card's preview is the product's portrait stage (600 x 780) scaled to the card's width.
ASK = dict(name="Ask about other work", kind="More work",
           line="Most client work is under NDA. Tell us the problem and we’ll show you what fits.")
CARD_LINE = {
    "murmur": "Sound for focus and sleep. Every loop is written by our own music model.",
    "morrow": "The puzzles people pay for, free every morning. Written by our model.",
    "auditor": "A first-pass auditor in the client’s cloud. 94 in 100 match the reviewer.",
    "extract": "Returns only what a library of known controls holds, in any domain.",
}
# Under NDA: redacted lines on ink. A slow highlight moves down them, as if a page is being read.
REDACT = [(0, [.92, .78, .86, .52]), (1, [.88, .7, .81, .44]), (2, [.9, .62])]
def redacted(width, bar, gap, para, label_size, groups=2):
    out, k = [], 0
    for g, row in REDACT[:groups]:
        out.append(f'<span style="{MONO}; font-size: {label_size}px; letter-spacing: .12em; color: rgba(255,255,255,.38)">CLIENT WORK · 0{g + 5}</span>')
        for w in row:
            out.append(f'<i class="rb" style="width: {w * 100:.0f}%; height: {bar}px; animation-delay: {k * 0.32:.2f}s"></i>')
            k += 1
        out.append(f'<b style="height: {para}px"></b>')
    inner = "".join(out[:-1])
    return f'<div style="display: flex; flex-direction: column; gap: {gap}px; width: {width}">{inner}</div>'


def ask_stage():
    lock = ('<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
            '<rect x="5" y="11" width="14" height="9" rx="2"></rect><path d="M8 11V8a4 4 0 0 1 8 0v3"></path></svg>')
    return f'''<div class="ask" aria-hidden="true">
  <div style="position: relative; height: 100%; box-sizing: border-box; padding: 40px; display: flex; flex-direction: column; color: #ffffff">
    <div style="height: 36px; display: flex; align-items: center; justify-content: space-between"><span style="{MONO}; font-size: 13px; letter-spacing: .12em; text-transform: uppercase; opacity: .8">Under NDA</span>{lock}</div>
    <div style="margin-top: 44px">{redacted("100%", 16, 13, 22, 13)}</div>
    <div style="margin-top: auto; display: flex; flex-direction: column; gap: 28px">
      <span style="font-size: 64px; line-height: 1.02; font-weight: 500; letter-spacing: -0.045em">More we can<br>show on a call.</span>
      <span style="align-self: flex-start; display: inline-flex; align-items: center; gap: 10px; height: 64px; padding: 0 26px; border-radius: 10px; background-color: #ffffff; color: #111214; font-size: 22px; font-weight: 500">Ask about other work →</span>
    </div>
  </div>
</div>'''

sys.path.insert(0, os.path.join(SP, "v12"))
from cards import CARDS, face as card_face, nda_banner
PAINTS = {"wide": "/_blob/595d15bf5d77a8d1c4dd736d484073c3", "tall": "/_blob/b3ab9061ae8037d732ac20d50184b097", "diag": "/_blob/921cbc2092a867ecbf4227ce66768775"}

def card(i, p, w, size):
    s = w / 600
    h = round(780 * s)
    # One painting family, recoloured per card, with one still feature of the work on it. No motion.
    stage = card_face(CARDS[4] if p is None else next(c for c in CARDS if c["key"] == p["key"]), PAINTS)
    name = ASK["name"] if p is None else p["name"]
    kind = ASK["kind"] if p is None else p["kind"]
    line = ASK["line"] if p is None else CARD_LINE[p["key"]]
    act = 'href="#contact"' if p is None else f'onClick="{{{{lm{i}}}}}"'
    tag = "a" if p is None else "button"
    nm, ln = {"lg": (26, 15), "md": (22, 14), "sm": (17, 13)}[size]
    link = "Send a short brief →" if p is None else "Learn more ↗"
    return f'''<div class="wc">
  <{tag} {'type="button" ' if p is not None else ''}class="wp" style="height: {h}px" aria-label="{'Ask about other work' if p is None else 'Learn more about ' + name}" {act}><div class="wps" style="transform: scale({s:.4f})">{stage}</div></{tag}>
  <div style="flex: 1; display: flex; flex-direction: column; gap: 6px; padding: {16 if size != 'sm' else 12}px 2px 0">
    <span style="{MONO}; font-size: {10.5 if size != 'sm' else 9.5}px; letter-spacing: 0.08em; text-transform: uppercase; color: #8a8f98">0{i + 1} · {kind}</span>
    <h3 class="cn" style="margin: 0; font-size: {nm}px; line-height: 1.12; font-weight: 500; letter-spacing: -0.03em">{name}</h3>
    <p style="margin: 2px 0 0; font-size: {ln}px; line-height: 1.5; color: #6b7079">{line}</p>
    <{tag} {'type="button" ' if p is not None else ''}class="lk" {act} style="margin-top: auto; padding-top: 10px; font-size: {ln}px">{link}</{tag}>
  </div>
</div>'''

def ask_banner(w):
    return f'''<div class="wc" style="grid-column: 1 / -1">
  <a class="wp" href="#contact" aria-label="Ask about other work" style="height: 220px">
    <div class="ask" aria-hidden="true">{nda_banner(PAINTS)}</div>
  </a>
  <p style="margin: 12px 2px 0; font-size: 13px; line-height: 1.5; color: #6b7079">{ASK["line"]}</p>
  <a class="lk" href="#contact" style="margin: 10px 2px 0; font-size: 13px">Send a short brief →</a>
</div>'''

LAYOUTS = {
    "desk": dict(width=1440, pad="88px 56px 104px", head="row"),
    "tab": dict(width=834, pad="72px 24px 88px", head="stack"),
    "phone": dict(width=390, pad="56px 16px 72px", head="stack"),
}

def grid_section(layout="desk", top=0):
    L = LAYOUTS[layout]
    content = L["width"] - 2 * int(L["pad"].split()[1].rstrip("px"))
    items = list(enumerate(P)) + [(len(P), None)]
    if layout == "desk":
        w = (content - 4 * 16) / 5
        grid = f'<div style="display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 16px; align-items: stretch">{"".join(card(i, p, w, "md") for i, p in items)}</div>'
    elif layout == "tab":
        w2, w3 = (content - 16) / 2, (content - 32) / 3
        top_ = "".join(card(i, p, w2, "lg") for i, p in items[:2])
        bot = "".join(card(i, p, w3, "md") for i, p in items[2:])
        grid = (f'<div style="display: flex; flex-direction: column; gap: 40px">'
                f'<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; align-items: stretch">{top_}</div>'
                f'<div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; align-items: stretch">{bot}</div></div>')
    else:
        w = (content - 12) / 2
        cards = "".join(card(i, p, w, "sm") for i, p in items[:4])
        grid = f'<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 32px 12px; align-items: stretch">{cards}{ask_banner(content)}</div>'
    hs = 44 if layout == "desk" else 36 if layout == "tab" else 30
    head = (f'<div style="display: flex; {"align-items: flex-end; justify-content: space-between; gap: 40px" if L["head"] == "row" else "flex-direction: column; gap: 16px"}">'
            f'<h2 style="margin: 0; font-size: {hs}px; line-height: 1.06; font-weight: 500; letter-spacing: -0.04em">Selected work.<br><span style="color: #a3a8b0">Ours, and two we can show.</span></h2>'
            f'<p style="margin: 0; max-width: 400px; font-size: 15px; line-height: 1.55; color: #6b7079">Two are products we build and run ourselves. Two are AI systems we built for clients in regulated work.</p></div>')
    return (f'<div id="work" style="position: relative; top: {top}px; width: {L["width"]}px; box-sizing: border-box; padding: {L["pad"]}; display: flex; flex-direction: column; gap: {56 if layout == "desk" else 40}px; '
            f'background-color: #ffffff; font-family: Geist, ui-sans-serif, system-ui, sans-serif; color: #111214">{head}{grid}</div>')



def section(top=0):
    rows = "".join(row(i, p) for i, p in enumerate(P))
    return f'''<div id="work" style="position: relative; top: {top}px; width: 1440px; box-sizing: border-box; padding: 88px 56px 104px; display: flex; flex-direction: column; gap: 64px; background-color: #ffffff; font-family: Geist, ui-sans-serif, system-ui, sans-serif; color: #111214">
  <div style="display: flex; align-items: flex-end; justify-content: space-between; gap: 40px">
    <h2 style="margin: 0; font-size: 44px; line-height: 1.06; font-weight: 500; letter-spacing: -0.04em">Selected work.<br><span style="color: #a3a8b0">Ours, and two we can show.</span></h2>
    <p style="margin: 0; max-width: 400px; font-size: 15px; line-height: 1.55; color: #6b7079">Two are products we build and run ourselves. Two are AI systems we built for clients in regulated work.</p>
  </div>
  <div style="display: flex; flex-direction: column; gap: 72px">{rows}</div>
</div>'''

def board(init_open, init_tab, title, h, view_h=None, panel_top=110, sec_top=0, layout="desk"):
    modals = "".join(modal(i, p) for i, p in enumerate(P)) if layout == "desk" else ""
    bw = LAYOUTS[layout]["width"]
    root = f"position: relative; width: {bw}px; background-color: #ffffff" + (f"; height: {view_h}px; overflow: hidden" if view_h else "")
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>{title}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@300..700&amp;family=Geist+Mono:wght@400..500&amp;family=Bricolage+Grotesque:opsz,wght@12..96,500..700&amp;family=Figtree:wght@400..700&amp;family=Newsreader:opsz,wght@6..72,400..500&amp;family=Hanken+Grotesk:wght@400..600&amp;family=IBM+Plex+Mono:wght@400;500&amp;display=swap">
<style>{CSS}.md{{top:{panel_top}px}}</style>
</helmet>
<div style="{root}">
{grid_section(layout, sec_top)}
<div class="ov {{{{ov}}}}">
  <button type="button" class="scrim" aria-label="Close" onClick="{{{{close}}}}"></button>
  {modals}
</div>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":{bw},"height":{h}}}}}'>
class Component extends DCLogic {{
  constructor(props) {{
    super(props);
    this.state = {{ open: {init_open}, tab: {init_tab}, now: Date.now() }};
  }}
  componentDidMount() {{
    this.timer = setInterval(() => this.setState({{ now: Date.now() }}), 1000);
  }}
  componentWillUnmount() {{
    clearInterval(this.timer);
  }}
  renderVals() {{
    const {{ open, tab }} = this.state;
    const v = {{}};
    v.ov = open >= 0 ? 'on' : '';
    v.close = () => this.setState({{ open: -1 }});
    v.ti = 't' + tab;
    for (let k = 0; k < {N}; k++) {{
      v['o' + k] = open === k ? 'on' : '';
      v['lm' + k] = () => this.setState({{ open: k, tab: 0 }});
      v['pv' + k] = () => this.setState({{ open: (k + {N - 1}) % {N}, tab: 0 }});
      v['nx' + k] = () => this.setState({{ open: (k + 1) % {N}, tab: 0 }});
      v['tb' + k] = () => this.setState({{ tab: k }});
      v['s' + k] = tab === k ? 'true' : 'false';
      v['p' + k] = tab === k ? 'on' : '';
    }}
    let cd = '', muDate = '';
    try {{
      const d = new Date(this.state.now);
      const t = d.toLocaleTimeString('sv-SE', {{ timeZone: 'Europe/Stockholm', hour12: false }}).split(':').map(Number);
      const left = 86400 - (t[0] * 3600 + t[1] * 60 + t[2]);
      const pad = (n) => String(n).padStart(2, '0');
      cd = pad(Math.floor(left / 3600)) + ':' + pad(Math.floor(left / 60) % 60) + ':' + pad(left % 60);
      muDate = d.toLocaleDateString('en-GB', {{ timeZone: 'Europe/Stockholm', weekday: 'short', day: 'numeric', month: 'short' }});
    }} catch (e) {{}}
    v.cd = cd; v.muDate = muDate;
    return v;
  }}
}}
</script>
</body>
</html>
"""

OUT = SP + "/canvas/site/project/"
H = int(sys.argv[1]) if len(sys.argv) > 1 else 1400
open(OUT + "Work.dc.html", "w").write(board(-1, 0, "Selected work", H))
HT = int(sys.argv[2]) if len(sys.argv) > 2 else 1500
HP = int(sys.argv[3]) if len(sys.argv) > 3 else 1500
open(OUT + "WorkTablet.dc.html", "w").write(board(-1, 0, "Selected work, iPad", HT, layout="tab"))
open(OUT + "WorkPhone.dc.html", "w").write(board(-1, 0, "Selected work, phone", HP, layout="phone"))
for i, nm in enumerate(["Murmur", "Morrow", "Auditor", "Extraction"]):
    open(OUT + f"WorkModal{nm}.dc.html", "w").write(board(i, 1, f"Learn more: {P[i]['name']}", 900, view_h=900, panel_top=60, sec_top=-200))
print("ok", len(open(OUT + "Work.dc.html").read()))
