#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
مولّد الأصول (Placeholders) + manifest.
ينشئ بنية public/assets، ويولّد صورة placeholder نظيفة (بدون أي نص) لكل مفتاح،
ثم يكتب src/data/assetManifest.ts و tools/extract-assets/assets.config.json.
شغّله من جذر المشروع:  python3 tools/extract-assets/generate_assets.py
"""
import os, json, math
from PIL import Image, ImageDraw

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
PUB = os.path.join(ROOT, "public", "assets")
SZ = 240
PAD = 22

COLOR_HEX = {
    "red": "#EF4444", "blue": "#3B82F6", "green": "#22C55E", "yellow": "#FACC15",
    "white": "#FFFFFF", "black": "#1F2937", "brown": "#92400E", "pink": "#EC4899",
    "orange": "#F97316", "purple": "#7C3AED",
}
SHAPES = ["circle", "square", "triangle", "rectangle", "star", "heart", "arrow", "line"]

CATS = {
    "drinks":        ("card",  "#DBEAFE"),
    "food":          ("card",  "#FFE8D6"),
    "animals":       ("animal", "#DCFCE7"),
    "colors":        ("color",  None),
    "shapes":        ("shape",  "#EEF2F7"),
    "emotions":      ("card",  "#FEF3C7"),
    "daily-phrases": ("card",  "#EDE9FE"),
    "people":        ("card",  "#FCE7F3"),
    "actions":       ("card",  "#CCFBF1"),
}

KEYS = {
    "animals":       ["cat","dog","cow","sheep","horse","chicken","duck","bird","lion","elephant"],
    "colors":        list(COLOR_HEX.keys()),
    "shapes":        SHAPES,
    "drinks":        ["water","milk","juice"],
    "food":          ["bread","chips","candy","eat"],
    "actions":       ["bathroom","sleep","goOut","play","help","come","open","car","cold",
                      "stop","loudSound","quietPlace","doNotTouch"],
    "people":        ["mother","father"],
    "emotions":      ["happy","sad","scared","angry","tired","bored",
                      "stomachPain","headPain","toothPain","earPain","handPain","legPain"],
    "daily-phrases": ["salam","ahlan","hi","salam_alaykum","bye","byebye","maa_salama",
                      "bismillah","alhamdulillah","finished","enough","request_word",
                      "yes","no","thanks","khalas","tayeb","lala"],
}

def kebab(key):
    out = []
    for ch in key:
        if ch.isupper(): out.append("-"); out.append(ch.lower())
        elif ch == "_": out.append("-")
        else: out.append(ch)
    return "".join(out)

def hex2rgb(h):
    h = h.lstrip("#"); return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def darken(rgb, f=0.72):
    return tuple(max(0, int(c * f)) for c in rgb)

def rrect(d, box, r, fill, outline=None, w=0):
    d.rounded_rectangle(box, radius=r, fill=fill, outline=outline, width=w)

def neutral_card(tint_hex):
    img = Image.new("RGBA", (SZ, SZ), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    tint = hex2rgb(tint_hex)
    rrect(d, [6, 6, SZ-6, SZ-6], 34, fill=tint + (255,), outline=darken(tint, .85) + (255,), w=3)
    ink = darken(tint, .55)
    cx, cy = SZ//2, SZ//2 + 6
    d.ellipse([cx-58, cy-50, cx-6, cy+2], fill=ink + (255,))
    d.polygon([(cx-66, cy+56), (cx-14, cy-2), (cx+30, cy+56)], fill=ink + (255,))
    d.polygon([(cx-6, cy+56), (cx+34, cy+10), (cx+70, cy+56)], fill=darken(tint, .68) + (255,))
    rrect(d, [PAD, PAD, SZ-PAD, SZ-PAD], 28, fill=None, outline=(255, 255, 255, 120), w=2)
    return img

def color_swatch(hexv):
    img = Image.new("RGBA", (SZ, SZ), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    rgb = hex2rgb(hexv)
    border = (203, 213, 225, 255) if hexv.upper() == "#FFFFFF" else darken(rgb, .80) + (255,)
    rrect(d, [PAD, PAD, SZ-PAD, SZ-PAD], 40, fill=rgb + (255,), outline=border, w=4)
    return img

def shape_png(name):
    img = Image.new("RGBA", (SZ, SZ), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    rrect(d, [8, 8, SZ-8, SZ-8], 34, fill=(248, 250, 252, 255), outline=(226, 232, 240, 255), w=3)
    c = (100, 116, 139, 255)
    m, M = 58, SZ-58
    cx, cy = SZ//2, SZ//2
    if name == "circle": d.ellipse([m, m, M, M], fill=c)
    elif name == "square": rrect(d, [m, m, M, M], 16, fill=c)
    elif name == "triangle": d.polygon([(cx, m), (m, M), (M, M)], fill=c)
    elif name == "rectangle": rrect(d, [44, 78, SZ-44, SZ-78], 14, fill=c)
    elif name == "star":
        pts = []
        for i in range(10):
            ang = -math.pi/2 + i*math.pi/5
            rad = 78 if i % 2 == 0 else 32
            pts.append((cx + rad*math.cos(ang), cy + rad*math.sin(ang)))
        d.polygon(pts, fill=c)
    elif name == "heart":
        d.ellipse([cx-58, cy-46, cx-2, cy+10], fill=c)
        d.ellipse([cx+2, cy-46, cx+58, cy+10], fill=c)
        d.polygon([(cx-56, cy-8), (cx+56, cy-8), (cx, cy+62)], fill=c)
    elif name == "arrow":
        d.polygon([(m, cy-22), (cx+10, cy-22), (cx+10, cy-46),
                   (M, cy), (cx+10, cy+46), (cx+10, cy+22), (m, cy+22)], fill=c)
    elif name == "line": rrect(d, [m, cy-16, M, cy+16], 16, fill=c)
    return img

def ensure_dirs():
    for sub in ["cards/" + c for c in CATS] + ["icons", "rewards", "game-cards"]:
        os.makedirs(os.path.join(PUB, sub), exist_ok=True)

def main():
    ensure_dirs()
    manifest, config = {}, []
    for cat, keys in KEYS.items():
        source_type, tint = CATS[cat]
        for key in keys:
            fname = kebab(key) + ".png"
            rel = f"cards/{cat}/{fname}"
            out = os.path.join(PUB, rel)
            if cat == "colors": im = color_swatch(COLOR_HEX[key])
            elif cat == "shapes": im = shape_png(key)
            else: im = neutral_card(tint)
            im.save(out, "PNG")
            url = f"/assets/{rel}"
            manifest[key] = {"imageUrl": url, "category": cat, "sourceType": source_type}
            config.append({"key": key, "category": cat, "sourceType": source_type,
                           "output": f"public/assets/{rel}", "sourceImage": None, "crop": None})

    lines = [
        "// AUTO-GENERATED بواسطة tools/extract-assets/generate_assets.py — لا تعدّله يدوياً.",
        "// كل عنصر مرتبط بمفتاح ثابت وصورة. النص يأتي من dialects.ts (ليس من الصورة).",
        "",
        "export type AssetSourceType = 'card' | 'animal' | 'color' | 'shape'",
        "export interface AssetEntry { imageUrl: string; category: string; sourceType: AssetSourceType }",
        "",
        "export const assetManifest: Record<string, AssetEntry> = {",
    ]
    for key in sorted(manifest.keys()):
        e = manifest[key]
        k = key if (key.replace("_", "").isalnum() and not key[0].isdigit()) else f'"{key}"'
        lines.append(f'  {k}: {{ imageUrl: "{e["imageUrl"]}", category: "{e["category"]}", sourceType: "{e["sourceType"]}" }},')
    lines += [
        "}",
        "",
        "export const getAssetUrl = (key: string): string | null => assetManifest[key]?.imageUrl ?? null",
        "export const hasManifestAsset = (key: string): boolean => key in assetManifest",
        "export const manifestKeys = (): string[] => Object.keys(assetManifest)",
        "",
    ]
    with open(os.path.join(ROOT, "src", "data", "assetManifest.ts"), "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    with open(os.path.join(os.path.dirname(__file__), "assets.config.json"), "w", encoding="utf-8") as f:
        json.dump({"size": SZ, "items": config}, f, ensure_ascii=False, indent=2)
    print(f"keys: {len(manifest)}  | manifest + config written")

if __name__ == "__main__":
    main()
