"""Canvas: the language switch in Hero A's header, and a Language board (both
states, the Swedish header and hero, the phone menu). Matches
components/site/LanguageSwitch.tsx and components/brand/Flag.tsx."""
import json, sys
C = sys.argv[1]  # canvas/site/project
LOGO = "/_blob/f12db6b319a6e0459ade068198886e4c"
INK, SLATE, SOFT, MUTE = "#111214", "#6b7079", "#f3f2ee", "#8a8f98"

# Emoji One's monotone United Kingdom and Sweden flags (CC BY 4.0, https://github.com/EmojiTwo/emojitwo), unchanged.
PATHS = {
    "en": "M32 2C15.432 2 2 15.432 2 32s13.432 30 30 30s30-13.432 30-30S48.568 2 32 2M13.265 52.788a28 28 0 0 1-1.384-1.344l10.286-7.575v-2.036h-3.89l-8.938 6.585a28 28 0 0 1-2.751-4.682l2.584-1.903H5.787a28 28 0 0 1-1.156-3.934H26.1v21.47a28 28 0 0 1-3.933-1.156V46.227zM37.9 23.039V4.631q2.026.438 3.933 1.156v11.985l8.901-6.561q.715.648 1.384 1.344L41.833 20.13v2.036h3.888l8.939-6.584a28 28 0 0 1 2.751 4.68l-2.585 1.904h3.387a28 28 0 0 1 1.156 3.934H37.9zM13.239 11.234l8.926 6.559l.002-12.006A28 28 0 0 1 26.1 4.631V26.1H4.631q.438-2.026 1.156-3.934h3.387l-2.585-1.904c.249-.538.509-1.07.791-1.589l4.738 3.493l6.644-.001l-9.256-6.818a28 28 0 0 1 3.733-4.113m37.522 41.532l-8.926-6.56l-.002 12.007q-1.907.719-3.933 1.156v-21.47h21.469a28 28 0 0 1-1.156 3.934h-3.389l2.587 1.905a28 28 0 0 1-.791 1.588l-4.738-3.493l-6.646.001l9.258 6.818a28 28 0 0 1-3.733 4.114",
    "sv": "M32 2C15.432 2 2 15.432 2 32s13.432 30 30 30s30-13.432 30-30S48.568 2 32 2m28 30c0 2.375-.3 4.681-.858 6.884H31.017v21.091a27.8 27.8 0 0 1-13.767-4.189V38.884H4.858a28 28 0 0 1 0-13.767H17.25V8.215a27.8 27.8 0 0 1 13.767-4.189v21.092h28.125C59.7 27.32 60 29.626 60 32",
}

def flag(lang, w=16):
    """Round, one colour: the text colour, so ink when active and grey when not."""
    return (f'<svg viewBox="0 0 64 64" aria-hidden="true" style="width: {w}px; height: {w}px; display: block; flex: none">'
            f'<path fill="currentColor" d="{PATHS[lang]}"></path></svg>')

def switch(current, label="Language", full=False, extra=""):
    track = (f"height: {48 if full else 36}px; padding: 3px; box-sizing: border-box; display: {'flex' if full else 'inline-flex'}; "
             f"align-items: center; gap: 2px; border-radius: 6px; background-color: {SOFT}{extra}")
    parts = []
    for lang, name in (("en", "English"), ("sv", "Svenska")):
        on = lang == current
        look = f"background-color: #ffffff; box-shadow: 0 1px 2px rgba(13,23,38,.08); color: {INK}" if on else f"color: {SLATE}"
        if full:
            text = f"font-size: 16px; font-weight: 500; flex: 1; justify-content: center"
            inner = f"{flag(lang, 20)}{name}"
        else:
            text = "padding: 0 10px; font-family: 'Geist Mono', ui-monospace, monospace; font-size: 11px; letter-spacing: .06em; text-transform: uppercase"
            inner = f"{flag(lang)}{lang}"
        current_attr = ' aria-current="page"' if on else ""
        parts.append(f'<a href="#{lang}" lang="{lang}"{current_attr} style="height: 100%; display: inline-flex; align-items: center; gap: 8px; '
                     f'border-radius: 5px; text-decoration: none; {text}; {look}">{inner}</a>')
    return f'<span role="group" aria-label="{label}" style="{track}">{"".join(parts)}</span>'

def nav(lang):
    words = {"en": ["Work", "Services", "AWS", "Studio", "Contact", "Main", "Language"],
             "sv": ["Arbeten", "Tjänster", "AWS", "Om oss", "Kontakt", "Huvudmeny", "Språk"]}[lang]
    link = "height: 36px; padding: 0 12px; display: inline-flex; align-items: center; border-radius: 6px; text-decoration: none"
    return (f'<nav aria-label="{words[5]}" style="display: flex; align-items: center; gap: 4px; font-size: 13px">'
            f'<a href="#work" style="{link}; background-color: {SOFT}; color: {INK}; font-weight: 500">{words[0]}</a>'
            f'<a href="#services" style="{link}; color: {SLATE}">{words[1]}</a>'
            f'<a href="#aws" style="{link}; color: {SLATE}">{words[2]}</a>'
            f'<a href="#studio" style="{link}; color: {SLATE}">{words[3]}</a>'
            f'{switch(lang, words[6], extra="; margin-left: 8px")}'
            f'<a href="#contact" style="margin-left: 8px; {link}; padding: 0 14px; background-color: {INK}; color: #ffffff; font-weight: 500">{words[4]}</a>'
            '</nav>')

# ── Hero A: the switch between Studio and Contact ──
p = f"{C}/HeroA.dc.html"
s = open(p, encoding="utf-8").read()
if 'role="group"' not in s:
    anchor = '    <a href="#contact" style="margin-left: 8px;'
    assert anchor in s
    s = s.replace(anchor, "    " + switch("en", extra="; margin-left: 8px") + "\n" + anchor, 1)
    open(p, "w", encoding="utf-8").write(s)

# ── The Language board ──
label = f"font-family: 'Geist Mono', ui-monospace, monospace; font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: {MUTE}"
def bar(lang):
    return (f'<div style="height: 76px; padding: 0 32px; display: flex; align-items: center; justify-content: space-between; background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 0 1px rgba(17,18,20,.06)">'
            f'<img src="{LOGO}" alt="Adamass AB" style="height: 17px">{nav(lang)}</div>')

zoom = lambda lang: f'<div style="display: inline-flex; transform: scale(2); transform-origin: left center">{switch(lang)}</div>'

phone = f'''<div style="position: relative; width: 340px; height: 620px; border-radius: 28px; overflow: hidden; background-color: #ffffff; box-shadow: 0 0 0 1px rgba(17,18,20,.08), 0 24px 48px -24px rgba(13,23,38,.25); display: flex; flex-direction: column">
  <div style="height: 64px; padding: 0 20px; display: flex; align-items: center; justify-content: space-between">
    <img src="{LOGO}" alt="Adamass AB" style="height: 17px">
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="{INK}" stroke-width="1.5" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke-linecap="round"></path></svg>
  </div>
  <div style="flex: 1; padding: 8px 12px 0; display: flex; flex-direction: column">
    {''.join(f'<a href="#{a}" style="min-height: 56px; padding: 0 8px; display: flex; align-items: center; font-size: 24px; font-weight: 500; color: {INK}; text-decoration: none">{w}</a>' for a, w in (("work", "Arbeten"), ("services", "Tjänster"), ("aws", "AWS"), ("studio", "Om oss")))}
  </div>
  <div style="padding: 16px 20px 20px; display: flex; flex-direction: column; gap: 12px">
    {switch("sv", "Språk", full=True)}
    <a href="#contact" style="height: 48px; display: flex; align-items: center; justify-content: center; gap: 8px; border-radius: 8px; background-color: {INK}; color: #ffffff; font-size: 16px; font-weight: 500; text-decoration: none">Kontakt <span aria-hidden="true">→</span></a>
  </div>
</div>'''

board = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Language</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@300..700&amp;family=Geist+Mono:wght@400..500&amp;display=swap">
<style>
body{{margin:0}}
</style>
</helmet>
<div style="position: relative; width: 1440px; height: 900px; overflow: hidden; background-color: #f7f7f5; font-family: Geist, ui-sans-serif, system-ui, sans-serif; color: {INK}">
  <div style="position: absolute; left: 48px; top: 44px; right: 48px; display: flex; justify-content: space-between; align-items: flex-end">
    <div style="display: flex; flex-direction: column; gap: 10px">
      <span style="{label}">Language</span>
      <h2 style="margin: 0; font-size: 34px; line-height: 1.1; font-weight: 500; letter-spacing: -0.035em">English at adamass.se, Swedish at /sv.<br><span style="color: {MUTE}">One switch, two flags in one colour.</span></h2>
    </div>
    <p style="margin: 0; max-width: 380px; font-size: 14px; line-height: 1.55; color: {SLATE}">Two segments on a soft track: a round flag in one colour and the language’s code. The page’s own language is the white one. Each is a plain link to that language’s home page. On phones it sits in the menu with the languages’ names.</p>
  </div>

  <div style="position: absolute; left: 48px; width: 920px; top: 200px; display: flex; flex-direction: column; gap: 14px">
    <span style="{label}">English page</span>
    {bar("en")}
    <span style="{label}; margin-top: 14px">Swedish page</span>
    {bar("sv")}
    <div style="padding: 22px 32px 0">
      <h1 lang="sv" style="margin: 0; font-size: 44px; line-height: 1.1; font-weight: 450; letter-spacing: -0.04em"><span style="color: {MUTE}">Kom till oss med det som känns tungt.</span><br>Vi gör det lätt.</h1>
    </div>
  </div>

  <div style="position: absolute; left: 48px; top: 640px; display: flex; flex-direction: column; gap: 22px">
    <span style="{label}">At twice the size</span>
    <div style="display: flex; gap: 300px; height: 80px; align-items: center">{zoom("en")}{zoom("sv")}</div>
    <span style="font-size: 13px; color: {SLATE}">Flags 16 px, Emoji One monotone (CC BY 4.0), in the text colour · code in Geist Mono 11 px · track #f3f2ee · active white, in ink</span>
  </div>

  <div style="position: absolute; right: 48px; top: 226px">
    <span style="{label}; position: absolute; top: -26px">Phone menu, Swedish</span>
    {phone}
  </div>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":1440,"height":900}}}}'>
class Component extends DCLogic {{
  renderVals() {{
    return {{}};
  }}
}}
</script>
</body>
</html>
'''
open(f"{C}/Language.dc.html", "w", encoding="utf-8").write(board)

d = json.load(open(f"{C}/canvas.json"))
d["boards"]["HeroA.dc.html"]["title"] = "Hero A: headline over one wide painting; the links as quiet buttons, the language switch, Contact in ink"
d["boards"]["Language.dc.html"] = {"x": -1520, "y": -1360, "w": 1440, "h": 900,
    "title": "Language: English at /, Swedish at /sv; the switch in the header and the phone menu"}
if "Language.dc.html" not in d["order"]:
    d["order"].insert(d["order"].index("HeroA.dc.html") + 1, "Language.dc.html")
json.dump(d, open(f"{C}/canvas.json", "w"), ensure_ascii=False)
print("ok")
