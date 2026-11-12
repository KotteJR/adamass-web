# How we work: the same four steps on one timeline, dated for the way in you pick (GenAI development shown),
# with its length on a scale from a week to two years. Nothing moves on its own.
# One painting behind it and the end screen; the dark fades out over the last 320 px into the end screen.
import re, sys, os, html
SP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJ = SP + "/canvas/site/project/"
H = int(sys.argv[1]) if len(sys.argv) > 1 else 2210
closing = open(PROJ + "Closing.dc.html").read()
style = re.search(r"<style>(.*?)</style>", closing, re.S).group(1)
style += "\n.sky{-webkit-mask-image:linear-gradient(180deg,transparent 0%,#000 35%);mask-image:linear-gradient(180deg,transparent 0%,#000 35%)}\n"
script = re.search(r'(<script type="text/x-dc".*?</script>)', closing, re.S).group(1)
end = re.search(r'(<div style="position: absolute; left: 0; top: 0; width: 1440px; height: 780px;.*?)\n  <div class="foot"', closing, re.S).group(1)
end = end.replace('<div style="position: absolute; left: 0; top: 0; width: 1440px; height: 780px; overflow: hidden; background-color: #6f8fb3">',
                  '<div style="position: relative; width: 1440px; height: 780px; overflow: hidden">')
end = re.sub(r'\s*<img class="paint" src="[^"]+" alt="" style="[^"]+">', '', end, count=1)
foot = re.search(r'(<div class="foot".*?</div>\n)</div>\n</x-dc>', closing, re.S).group(1)
foot = foot.replace('position: absolute; left: 32px; right: 32px; top: 780px; bottom: 0;', 'position: relative; height: 120px; padding: 0 32px; background-color: #ffffff;')

MONO = "font-family: 'Geist Mono', ui-monospace, monospace"
E = html.escape
label = lambda t: f'<span style="{MONO}; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.6)">{E(t)}</span>'
STEPS = [
    ("Frame", "We write down the goal, what is in the way and how we will both know it worked, before real money is spent."),
    ("Join", "We work inside your team and your tools, with one person on our side who owns the direction."),
    ("Deliver", "Work lands in small pieces you can see and use every week. When we learn something, the plan changes with it."),
    ("Handover", "Everything we built, and the knowledge behind it, stays with your team, ready to run without us."),
]
WAYS = [("Diligence and advisory", False), ("Architect as a Service", False), ("GenAI development", True), ("Embedded delivery", False)]
WHEN = ["Weeks 1–2", "Week 2", "Weeks 3–12", "Weeks 12–14"]
import math
pos = lambda w: math.log(max(1, w)) / math.log(104) * 100
a, b = pos(8), pos(14)
SPLIT = "display: grid; grid-template-columns: minmax(0, 1fr) 720px; column-gap: 48px"
pills = "".join(
    f'<span style="height: 40px; padding: 0 16px; display: inline-flex; align-items: center; border-radius: 999px; font-size: 15px; '
    + ("background-color: #ffffff; color: #111214; border: 1px solid #ffffff" if on else "border: 1px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.7)")
    + f'">{E(t)}</span>' for t, on in WAYS)
items = "".join(
    f'<li style="position: relative; flex: 1; min-width: 0; padding: 44px {"32px" if k < 3 else "0"} 0 0">'
    + f'<span style="position: absolute; left: 0; top: 0; width: 14px; height: 14px; border-radius: 99px; background-color: #9cc0e6"></span>'
    + (f'<span style="position: absolute; left: 22px; right: 8px; top: 6.5px; height: 1px; background-color: rgba(255,255,255,0.2)"></span>' if k < 3 else "")
    + f'<span style="display: block; {MONO}; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #9cc0e6">{E(WHEN[k])}</span>'
    + f'<h3 style="margin: 6px 0 0; font-size: 24px; font-weight: 500; letter-spacing: -0.02em">{E(t)}</h3>'
    + f'<p style="margin: 8px 0 0; max-width: 300px; font-size: 16px; line-height: 1.6; color: rgba(255,255,255,0.75)">{E(body)}</p></li>'
    for k, (t, body) in enumerate(STEPS))
process = f"""<section id="process" style="position: relative; color: #ffffff">
  <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(11,20,33,0.92) 0%, rgba(11,20,33,0.86) calc(100% - 320px), rgba(11,20,33,0) 100%)"></div>
  <div style="position: relative; padding: 112px 32px 268px; display: flex; flex-direction: column; gap: 80px">
    <div style="{SPLIT}; align-items: end">
      <div style="display: flex; flex-direction: column; gap: 20px">{label("How we work")}
        <h2 style="margin: 0; font-size: 56px; line-height: 1.04; font-weight: 500; letter-spacing: -0.045em">Same four steps,<br><span style="color: rgba(255,255,255,0.45)">a week or two years.</span></h2></div>
      <p style="margin: 0; max-width: 560px; font-size: 18px; line-height: 1.55; color: rgba(255,255,255,0.75)">Whether it is a three-week review or two years inside your team, the work runs the same four steps. Only the length changes.</p>
    </div>
    <div style="display: flex; flex-direction: column; gap: 48px">
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 32px">
        <div role="tablist" aria-label="Ways in" style="display: flex; flex-wrap: wrap; gap: 8px">{pills}</div>
        <div style="display: flex; align-items: center; gap: 24px">
          <p style="margin: 0; display: flex; align-items: baseline; gap: 12px; white-space: nowrap"><span style="{MONO}; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.5)">In all</span><span style="font-size: 18px">8–14 weeks</span></p>
          <div style="display: flex; align-items: center; gap: 10px; {MONO}; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.45)"><span>1 wk</span><span style="position: relative; width: 160px; height: 4px; border-radius: 99px; background-color: rgba(255,255,255,0.15)"><span style="position: absolute; top: 0; bottom: 0; left: {a:.1f}%; width: {b - a:.1f}%; border-radius: 99px; background-color: #9cc0e6"></span></span><span>2 yr</span></div>
        </div>
      </div>
      <ol style="margin: 0; padding: 0; list-style: none; display: flex">{items}</ol>
    </div>
    <p style="margin: 0; {MONO}; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.55)">Buying through AWS Marketplace? A private offer lands within a week.</p>
  </div>
</section>"""
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
<style>{style}</style>
</helmet>
<div style="position: relative; width: 1440px; background-color: #ffffff; font-family: Geist, ui-sans-serif, system-ui, sans-serif; color: #111214">
  <div style="position: relative; isolation: isolate; overflow: hidden; background-color: #6f8fb3">
    <img class="paint" src="/_blob/b3ab9061ae8037d732ac20d50184b097" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: -1">
    {process}
    {end}
  </div>
  {foot}</div>
</x-dc>
{script.replace('"height":900', '"height":' + str(H))}
</body>
</html>'''
open(PROJ + "Process.dc.html", "w").write(board)
print("ok", len(board))
