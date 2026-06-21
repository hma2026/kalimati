#!/usr/bin/env python3
"""
كلمة كلمة — أنبوب استخراج الصور الغنية من الـsheets المرجعية (مُثبَت).
الاستخدام: عدّل المسارات والمربعات (boxes) ثم شغّل. يحتاج: pip install pillow

الفكرة:
  1) قص الخلية من الـsheet.
  2) إزالة الخلفية البيضاء بـ flood-fill من بذور الحواف (يحفظ الأبيض الداخلي).
  3) keep_largest: الإبقاء على أكبر مكوّن متّصل فقط (يحذف النصوص/الشظايا المنفصلة).
  4) deisland: حذف الجزر الصغيرة (شظايا).
  5) dedge_white / erode: إزالة الهالة البيضاء على الحواف.
  6) trim إلى صندوق المحتوى → حفظ PNG شفّاف.

نصائح:
  - أجسام/وجوه فاتحة (أبيض/كريمي): استخدم عتبة منخفضة (th=16..26) لئلا تأكل الفاتح.
  - هالة عنيدة: erode(2..3) أو remove_whiter_than(210) إن لم يكن في الجسم أبيض نقي.
  - تحقّق دائماً: ركّب الناتج على خلفية شطرنجية وشاهده قبل القول «نظيف».
"""
from PIL import Image, ImageDraw
from collections import deque
import os

# ---------- أدوات ----------
def keep_largest(rgba):
    w, h = rgba.size; px = rgba.load()
    seen = [[False]*w for _ in range(h)]; best = []
    for sy in range(h):
        for sx in range(w):
            if seen[sy][sx] or px[sx, sy][3] == 0:
                seen[sy][sx] = True; continue
            comp = []; q = deque([(sx, sy)]); seen[sy][sx] = True
            while q:
                x, y = q.popleft(); comp.append((x, y))
                for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):
                    nx, ny = x+dx, y+dy
                    if 0 <= nx < w and 0 <= ny < h and not seen[ny][nx] and px[nx, ny][3] > 0:
                        seen[ny][nx] = True; q.append((nx, ny))
            if len(comp) > len(best): best = comp
    out = Image.new("RGBA", (w, h), (0,0,0,0)); op = out.load()
    for (x, y) in best: op[x, y] = px[x, y]
    return out

def deisland(rgba, minsize):
    w, h = rgba.size; px = rgba.load()
    seen = [[False]*w for _ in range(h)]; comps = []
    for sy in range(h):
        for sx in range(w):
            if seen[sy][sx] or px[sx, sy][3] == 0:
                seen[sy][sx] = True; continue
            comp = []; q = deque([(sx, sy)]); seen[sy][sx] = True
            while q:
                x, y = q.popleft(); comp.append((x, y))
                for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):
                    nx, ny = x+dx, y+dy
                    if 0 <= nx < w and 0 <= ny < h and not seen[ny][nx] and px[nx, ny][3] > 0:
                        seen[ny][nx] = True; q.append((nx, ny))
            comps.append(comp)
    for comp in comps:
        if len(comp) < minsize:
            for (x, y) in comp: px[x, y] = (0,0,0,0)
    return rgba

def dedge_white(rgba, passes=2, near=200):
    px = rgba.load(); w, h = rgba.size
    for _ in range(passes):
        rem = []
        for y in range(h):
            for x in range(w):
                r, g, b, a = px[x, y]
                if a and min(r, g, b) >= near:
                    for dx, dy in ((1,0),(-1,0),(0,1),(0,-1),(1,1),(1,-1),(-1,1),(-1,-1)):
                        nx, ny = x+dx, y+dy
                        if not (0 <= nx < w and 0 <= ny < h) or px[nx, ny][3] == 0:
                            rem.append((x, y)); break
        for (x, y) in rem: px[x, y] = (0,0,0,0)
    return rgba

def erode(rgba, iters=1):
    w, h = rgba.size
    for _ in range(iters):
        px = rgba.load(); rem = []
        for y in range(h):
            for x in range(w):
                if px[x, y][3] == 0: continue
                for dx, dy in ((1,0),(-1,0),(0,1),(0,-1),(1,1),(1,-1),(-1,1),(-1,-1)):
                    nx, ny = x+dx, y+dy
                    if not (0 <= nx < w and 0 <= ny < h) or px[nx, ny][3] == 0:
                        rem.append((x, y)); break
        for (x, y) in rem: px[x, y] = (0,0,0,0)
    return rgba

def remove_whiter_than(rgba, mn):
    px = rgba.load(); w, h = rgba.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a and min(r, g, b) >= mn: px[x, y] = (0,0,0,0)
    return rgba

def trim(rgba):
    bb = rgba.getbbox(); return rgba.crop(bb) if bb else rgba

def extract(sheet, box, thresh=36, pad=8, island=120,
            keep_one=True, dering=2, erode_px=0, white_cut=None):
    """قص + إزالة خلفية + تنظيف. keep_one=False للعناوين متعددة الحروف."""
    x0, y0, x1, y1 = box
    crop = sheet.crop((x0-pad, y0-pad, x1+pad, y1+pad)).convert("RGB")
    work = crop.copy(); w, h = work.size; SENT = (0, 255, 1)
    seeds = [(1,1),(w-2,1),(1,h-2),(w-2,h-2),(w//2,1),(w//2,h-2),(1,h//2),(w-2,h//2),
             (w//4,1),(3*w//4,1),(w//4,h-2),(3*w//4,h-2),(1,h//4),(1,3*h//4),(w-2,h//4),(w-2,3*h//4)]
    for s in seeds:
        try: ImageDraw.floodfill(work, s, SENT, thresh=thresh)
        except Exception: pass
    wp = work.load(); cp = crop.load()
    out = Image.new("RGBA", (w, h), (0,0,0,0)); op = out.load()
    for y in range(h):
        for x in range(w):
            if wp[x, y] != SENT: op[x, y] = cp[x, y] + (255,)
    if white_cut: out = remove_whiter_than(out, white_cut)
    if keep_one:  out = keep_largest(out)
    out = deisland(out, island)
    if dering:    out = dedge_white(out, dering)
    if erode_px:  out = erode(out, erode_px)
    return trim(out)

def checker_preview(images_with_labels, path, cell=190, cols=5, s=18):
    """ركّب نتائج على خلفية شطرنجية مع تسميات — للتحقّق البصري."""
    rows = (len(images_with_labels) + cols - 1)//cols
    W, H = cols*cell, rows*cell + 22
    bg = Image.new("RGB", (W, H), (255,255,255)); d = ImageDraw.Draw(bg)
    for y in range(0, H, s):
        for x in range(0, W, s):
            if (x//s + y//s) % 2: d.rectangle([x, y, x+s, y+s], fill=(206,206,216))
    for i, (img, lbl) in enumerate(images_with_labels):
        t = img.copy(); t.thumbnail((cell-22, cell-44))
        cx = (i % cols)*cell + (cell - t.width)//2
        cy = (i//cols)*cell + 22 + (cell-44 - t.height)//2
        bg.paste(t, (cx, cy), t); d.text(((i%cols)*cell+5, (i//cols)*cell+4), lbl, fill=(0,0,0))
    bg.save(path)

# ---------- مثال: استخراج الحيوانات من 31_animals_grid (1008x1440) ----------
if __name__ == "__main__":
    SHEETS = "/path/to/kalimati_high_res_package/03_separated_screens_high_res"
    an = Image.open(f"{SHEETS}/31_animals_grid_screen_HIGH_RES_1008x1440.jpg").convert("RGB")
    # ⚠️ الصف الأول (يسار→يمين): cat(يسار), dog(وسط), cow(يمين)
    BOXES = {
        "cat":(40,185,300,400), "dog":(355,185,625,400), "cow":(700,185,965,400),
        "sheep":(40,525,300,738), "horse":(355,525,625,738), "chicken":(700,525,965,738),
        "duck":(40,855,300,1070), "bird":(355,855,625,1070), "lion":(700,855,965,1070),
        "elephant":(360,1172,620,1360),
    }
    os.makedirs("/tmp/out/animals", exist_ok=True); results = []
    for k, b in BOXES.items():
        # الأسد والوجوه الكريمية: عتبة أقل؛ هنا قيمة عامة 34
        im = extract(an, b, thresh=34, island=150)
        im.save(f"/tmp/out/animals/{k}.png"); results.append((im, k+".png"))
        print(k, im.size)
    checker_preview(results, "/tmp/out/_animals_check.png", cols=5)
    print("preview -> /tmp/out/_animals_check.png (شاهده قبل القول «نظيف»)")
