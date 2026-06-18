#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""يبني design-handoff/: index.html + assets-map.json/csv + assets/<cat>/ + screens/.
يعرض كل أصل: itemKey + اسم الملف + المقاس + التصنيف + أماكن الاستخدام. لا يلمس الشاشات."""
import os, shutil, json, html

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
IMG = os.path.join(ROOT, "src", "assets", "images")
HO = os.path.join(ROOT, "design-handoff")
# مصدر الشاشات المرجعية (حزمة التسليم) — تُنسخ إن وُجدت
SCREEN_SRCS = [
    "/tmp/handoff/kalimati_split_image_handoff/03_SPLIT_SCREENS",
    "/tmp/handoff/kalimati_split_image_handoff/02_APPROVED_FULL_IMAGES",
]

USED = {
    "emotions": ["level4"], "people": ["level3", "level4"],
    "animals": ["animals", "games", "report"], "drinks": ["level2", "level3", "games"],
    "food": ["level1", "level2"], "actions": ["level2", "level3"], "sensory": ["level4"],
    "pain": ["level3", "level4"], "daily": ["level6"], "colors": ["level5", "games", "report"],
    "shapes": ["level5", "report"], "ui": ["navigation", "practicePanel"],
    "avatars": ["onboarding", "childSelect", "rewards"], "rewards": ["rewardOverlay", "games", "report"],
}
DIM = {"ui": (64, 64), "avatars": (512, 512)}  # الباقي 256×256

def dims(cat):
    return DIM.get(cat, (256, 256))

if os.path.isdir(HO):
    shutil.rmtree(HO)
os.makedirs(os.path.join(HO, "screens"))
os.makedirs(os.path.join(HO, "assets"))

rows = []
for cat in sorted(os.listdir(IMG)):
    cd = os.path.join(IMG, cat)
    if not os.path.isdir(cd):
        continue
    os.makedirs(os.path.join(HO, "assets", cat), exist_ok=True)
    w, h = dims(cat)
    for f in sorted(os.listdir(cd)):
        if not f.endswith(".svg"):
            continue
        shutil.copy(os.path.join(cd, f), os.path.join(HO, "assets", cat, f))
        rows.append({"itemKey": f[:-4], "fileName": f, "category": cat, "width": w, "height": h,
                     "usedIn": USED.get(cat, []), "required": True, "path": f"assets/{cat}/{f}"})

screens = []
for src in SCREEN_SRCS:
    if os.path.isdir(src):
        for f in sorted(os.listdir(src)):
            if f.lower().endswith((".png", ".jpg", ".jpeg", ".webp")):
                shutil.copy(os.path.join(src, f), os.path.join(HO, "screens", f))
                screens.append(f)

json.dump(rows, open(os.path.join(HO, "assets-map.json"), "w", encoding="utf-8"),
          ensure_ascii=False, indent=2)
with open(os.path.join(HO, "assets-map.csv"), "w", encoding="utf-8") as c:
    c.write("itemKey,fileName,category,width,height,usedIn,required,path\n")
    for r in rows:
        c.write(f'{r["itemKey"]},{r["fileName"]},{r["category"]},{r["width"]},{r["height"]},'
                f'{"|".join(r["usedIn"])},{str(r["required"]).lower()},{r["path"]}\n')

cats = {}
for r in rows:
    cats.setdefault(r["category"], []).append(r)
def esc(x):
    return html.escape(str(x))

P = ["""<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>كلمتي — Design Handoff</title>
<style>
:root{--bg:#F5F2FF;--card:#fff;--ink:#16162F;--muted:#6C6780;--line:#e7e2f5}
*{box-sizing:border-box}body{margin:0;font-family:system-ui,'Segoe UI',Tahoma,sans-serif;background:var(--bg);color:var(--ink)}
header{padding:28px 24px;background:linear-gradient(135deg,#7B3FF2,#2F78EA);color:#fff}
header h1{margin:0 0 6px;font-size:26px}header p{margin:0;opacity:.92}
.wrap{max-width:1180px;margin:auto;padding:24px}
h2{margin:34px 0 14px;font-size:20px;border-inline-start:6px solid #7B3FF2;padding-inline-start:10px}
h3{margin:22px 0 10px;font-size:16px;color:var(--muted);text-transform:capitalize}
.screens{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px}
.screens figure{margin:0;background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:hidden;box-shadow:0 8px 20px rgba(35,25,80,.06)}
.screens img{width:100%;display:block;background:#fff}
.screens figcaption{padding:8px 10px;font-size:12px;color:var(--muted);word-break:break-all}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:14px}
.asset{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:12px;text-align:center;box-shadow:0 6px 16px rgba(35,25,80,.05)}
.well{width:96px;height:96px;margin:0 auto 8px;border-radius:20px;background:linear-gradient(180deg,#fff,#eef2f7);display:grid;place-items:center;box-shadow:inset 0 0 0 1px rgba(15,23,42,.05)}
.well img{width:78px;height:78px}
.k{font-weight:800;font-size:14px}.m{font-size:11px;color:var(--muted);margin-top:2px}
.badge{display:inline-block;background:#efeaff;color:#7B3FF2;border-radius:8px;padding:1px 7px;font-size:10px;margin:2px 1px}
.count{font-size:13px;color:var(--muted);font-weight:600}
.note{background:#fff7e6;border:1px solid #f3d9a0;border-radius:12px;padding:10px 14px;font-size:13px;margin:14px 0}
</style></head><body>
<header><h1>كلمتي — Design Handoff</h1>
<p>الشاشات المرجعية + أصول مستقلة لكل عنصر. النص يأتي من نظام اللهجات (لا يُطبع داخل الصورة).</p></header>
<div class="wrap">
<div class="note">كل الأصول SVG متّجهة (تتكيّف مع أي مقاس). المقاس المعروض هو المقاس الموصى به للعرض: البطاقات 256×256، الشخصيات 512×512، أيقونات الواجهة 64×64.</div>"""]

P.append(f'<h2>الشاشات المرجعية <span class="count">({len(screens)})</span></h2><div class="screens">')
for f in screens:
    P.append(f'<figure><img loading="lazy" src="screens/{esc(f)}" alt="{esc(f)}"><figcaption>{esc(f)}</figcaption></figure>')
P.append('</div>')

P.append(f'<h2>الأصول المستقلة <span class="count">({len(rows)} ملف عبر {len(cats)} تصنيف)</span></h2>')
for cat in sorted(cats):
    items = cats[cat]
    P.append(f'<h3>{esc(cat)} <span class="count">({len(items)})</span></h3><div class="grid">')
    for r in items:
        used = "".join(f'<span class="badge">{esc(u)}</span>' for u in r["usedIn"])
        P.append(f'<div class="asset"><div class="well"><img loading="lazy" src="{esc(r["path"])}" alt="{esc(r["itemKey"])}"></div>'
                 f'<div class="k">{esc(r["itemKey"])}</div>'
                 f'<div class="m">{esc(r["fileName"])} · {r["width"]}×{r["height"]}</div>'
                 f'<div class="m">{esc(cat)}</div><div>{used}</div></div>')
    P.append('</div>')
P.append('</div></body></html>')
open(os.path.join(HO, "index.html"), "w", encoding="utf-8").write("".join(P))

size = sum(os.path.getsize(os.path.join(dp, f)) for dp, _, fs in os.walk(HO) for f in fs)
print(f"design-handoff: {len(rows)} assets across {len(cats)} categories, {len(screens)} screens, {size//1024} KB")
print("categories:", ", ".join(sorted(cats)))
