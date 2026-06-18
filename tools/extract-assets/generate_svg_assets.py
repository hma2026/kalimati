#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""يولّد أصول SVG كرتونية مستقلة لكل مفتاح في src/assets/images/<cat>/<key>.svg
ثم يكتب src/data/assetManifest.ts بالمخطط المطلوب. لا نص داخل الصور."""
import os
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
IMG = os.path.join(ROOT, "src", "assets", "images")
OUT = "#37306B"; SW = 8

def wrap(body):
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none">'
            f'<g stroke="{OUT}" stroke-width="{SW}" stroke-linecap="round" stroke-linejoin="round">{body}</g></svg>')

def eyes(kind="dot"):
    if kind == "dot":   return f'<circle cx="98" cy="116" r="9" fill="{OUT}" stroke="none"/><circle cx="158" cy="116" r="9" fill="{OUT}" stroke="none"/>'
    if kind == "happy": return '<path d="M86 118 Q98 104 110 118" fill="none"/><path d="M146 118 Q158 104 170 118" fill="none"/>'
    if kind == "wide":  return f'<circle cx="98" cy="114" r="16" fill="#fff"/><circle cx="98" cy="116" r="7" fill="{OUT}" stroke="none"/><circle cx="158" cy="114" r="16" fill="#fff"/><circle cx="158" cy="116" r="7" fill="{OUT}" stroke="none"/>'
    if kind == "sleepy":return '<path d="M86 118 Q98 126 110 118" fill="none"/><path d="M146 118 Q158 126 170 118" fill="none"/>'
    if kind == "flat":  return '<path d="M88 116 L110 116" fill="none"/><path d="M146 116 L168 116" fill="none"/>'
    if kind == "angry": return f'<path d="M86 108 L112 120" fill="none"/><path d="M170 108 L144 120" fill="none"/><circle cx="100" cy="124" r="8" fill="{OUT}" stroke="none"/><circle cx="156" cy="124" r="8" fill="{OUT}" stroke="none"/>'
    return ""

def mouth(kind="smile"):
    if kind == "smile": return '<path d="M96 150 Q128 184 160 150" fill="none"/>'
    if kind == "frown": return '<path d="M96 176 Q128 146 160 176" fill="none"/>'
    if kind == "open":  return f'<ellipse cx="128" cy="166" rx="20" ry="24" fill="{OUT}" stroke="none"/>'
    if kind == "flat":  return '<path d="M104 166 L152 166" fill="none"/>'
    if kind == "small": return '<path d="M114 166 Q128 176 142 166" fill="none"/>'
    return ""

def face(fill, ey, mo, extra=""):
    return f'<circle cx="128" cy="128" r="96" fill="{fill}"/>{eyes(ey)}{mouth(mo)}{extra}'

# ---------------- EMOTIONS ----------------
def e_happy():  return face("#FFD23F","happy","smile")
def e_sad():    return face("#9FC8F0","dot","frown",'<path d="M158 132 q6 18 0 30" stroke="#3B82F6" fill="none" stroke-width="6"/>')
def e_scared(): return face("#FBE7C6","wide","open",'<path d="M196 96 q14 22 0 40" stroke="#3B82F6" fill="#bfe0ff" stroke-width="5"/>')
def e_angry():  return face("#FF7A7A","angry","frown")
def e_tired():  return face("#FFD23F","sleepy","small",'<text x="176" y="78" font-size="34" fill="%s" stroke="none">z</text><text x="196" y="58" font-size="24" fill="%s" stroke="none">z</text>'%(OUT,OUT))
def e_bored():  return face("#E9D9A6","flat","flat")

# ---------------- PEOPLE ----------------
def p_mother():
    return ('<path d="M40 150 Q44 40 128 40 Q212 40 216 150 Q216 170 196 168 Q200 90 128 90 Q56 90 60 168 Q40 170 40 150 Z" fill="#7A4A2B"/>'
            '<circle cx="128" cy="138" r="78" fill="#F6C9A0"/>'+eyes("dot").replace("116","140")+mouth("small").replace("166","176")
            +'<circle cx="62" cy="156" r="9" fill="#EC4899" stroke="none"/><circle cx="194" cy="156" r="9" fill="#EC4899" stroke="none"/>')
def p_father():
    return ('<path d="M52 96 Q60 44 128 44 Q196 44 204 96 Q150 78 128 78 Q106 78 52 96 Z" fill="#5B3A22"/>'
            '<circle cx="128" cy="132" r="80" fill="#F6C9A0"/>'+eyes("dot").replace("116","132")
            +'<path d="M92 188 Q128 206 164 188" fill="none"/><path d="M150 168 q22 6 24 30" stroke="#5B3A22" fill="none" stroke-width="6"/><path d="M106 168 q-22 6 -24 30" stroke="#5B3A22" fill="none" stroke-width="6"/>')

# ---------------- ANIMALS ----------------
def a_cat():
    return ('<path d="M70 70 L60 30 L104 56 Z" fill="#F6A93B"/><path d="M186 70 L196 30 L152 56 Z" fill="#F6A93B"/>'
            '<circle cx="128" cy="136" r="92" fill="#F6A93B"/>'
            f'<circle cx="102" cy="128" r="9" fill="{OUT}" stroke="none"/><circle cx="154" cy="128" r="9" fill="{OUT}" stroke="none"/>'
            '<path d="M128 150 l-10 8 h20 z" fill="#E26D8A" stroke="none"/><path d="M128 158 v10" />'
            '<path d="M70 150 H30 M74 164 H36" /><path d="M186 150 H226 M182 164 H220" />')
def a_dog():
    return ('<ellipse cx="58" cy="120" rx="26" ry="44" fill="#9A6A3C"/><ellipse cx="198" cy="120" rx="26" ry="44" fill="#9A6A3C"/>'
            '<circle cx="128" cy="138" r="90" fill="#C68A4E"/>'
            f'<circle cx="104" cy="128" r="9" fill="{OUT}" stroke="none"/><circle cx="152" cy="128" r="9" fill="{OUT}" stroke="none"/>'
            f'<ellipse cx="128" cy="156" rx="16" ry="12" fill="{OUT}" stroke="none"/><path d="M128 168 q-14 14 -28 8" /><path d="M128 168 v18" />')
def a_cow():
    return ('<path d="M64 78 q-18 -22 -2 -40 q22 8 24 34 Z" fill="#E7E2DA"/><path d="M192 78 q18 -22 2 -40 q-22 8 -24 34 Z" fill="#E7E2DA"/>'
            '<ellipse cx="56" cy="128" rx="22" ry="30" fill="#F4D7E0"/><ellipse cx="200" cy="128" rx="22" ry="30" fill="#F4D7E0"/>'
            '<circle cx="128" cy="132" r="92" fill="#F4EEE6"/>'
            f'<path d="M84 92 q22 -6 30 14 q-20 12 -34 -2 Z" fill="{OUT}" stroke="none"/><path d="M176 150 q-18 -10 -4 -26 q22 4 18 24 Z" fill="{OUT}" stroke="none"/>'
            f'<circle cx="104" cy="120" r="8" fill="{OUT}" stroke="none"/><circle cx="152" cy="120" r="8" fill="{OUT}" stroke="none"/>'
            '<ellipse cx="128" cy="168" rx="44" ry="30" fill="#F4B8C6"/>'
            f'<circle cx="114" cy="166" r="6" fill="{OUT}" stroke="none"/><circle cx="142" cy="166" r="6" fill="{OUT}" stroke="none"/>')
def a_sheep():
    cl="".join(f'<circle cx="{128+int(70*__import__("math").cos(a))}" cy="{128+int(70*__import__("math").sin(a))}" r="30" fill="#F3F3F5"/>' for a in [0.3*i for i in range(12)])
    return (cl+'<circle cx="128" cy="132" r="62" fill="#5B5563"/>'
            '<ellipse cx="74" cy="120" rx="16" ry="22" fill="#46414f"/><ellipse cx="182" cy="120" rx="16" ry="22" fill="#46414f"/>'
            '<circle cx="108" cy="126" r="8" fill="#fff" stroke="none"/><circle cx="148" cy="126" r="8" fill="#fff" stroke="none"/>'
            '<path d="M112 156 q16 12 32 0" stroke="#fff" fill="none" stroke-width="6"/>')
def a_horse():
    return ('<path d="M150 44 q40 4 52 40 q-30 -8 -46 -22 Z" fill="#6E4A2A"/>'
            '<path d="M96 60 q-30 30 -34 110 q40 0 70 -16 q40 -18 44 -64 q4 -36 -34 -44 q-26 -4 -46 14 Z" fill="#A06A3C"/>'
            '<path d="M96 60 q-22 30 -22 70 q14 -4 22 -16 q-8 -30 8 -52 Z" fill="#6E4A2A" stroke="none"/>'
            f'<circle cx="120" cy="120" r="9" fill="{OUT}" stroke="none"/><ellipse cx="78" cy="150" rx="10" ry="7" fill="{OUT}" stroke="none"/>')
def a_chicken():
    return ('<circle cx="110" cy="50" r="14" fill="#E14B4B"/><circle cx="134" cy="42" r="14" fill="#E14B4B"/><circle cx="158" cy="50" r="14" fill="#E14B4B"/>'
            '<circle cx="128" cy="136" r="88" fill="#FBF7EE"/>'
            f'<circle cx="106" cy="126" r="9" fill="{OUT}" stroke="none"/><circle cx="150" cy="126" r="9" fill="{OUT}" stroke="none"/>'
            '<path d="M128 146 l30 14 l-30 12 z" fill="#F6A93B" stroke="none"/><path d="M120 186 q8 16 24 10" stroke="#E14B4B" fill="none" stroke-width="6"/>')
def a_duck():
    return ('<circle cx="128" cy="128" r="92" fill="#FFD23F"/>'
            f'<circle cx="150" cy="110" r="10" fill="{OUT}" stroke="none"/>'
            '<path d="M150 150 q70 -6 78 18 q-40 18 -78 2 Z" fill="#F6A93B"/>')
def a_bird():
    return ('<circle cx="128" cy="132" r="86" fill="#5AA9E6"/><path d="M120 50 q12 -16 24 0 q-12 6 -24 0 Z" fill="#3B82F6"/>'
            f'<circle cx="150" cy="118" r="10" fill="{OUT}" stroke="none"/>'
            '<path d="M150 140 l34 -8 l-34 22 z" fill="#F6A93B" stroke="none"/>'
            '<path d="M70 150 q26 26 56 12" stroke="#3B82F6" fill="#7CC0F0" stroke-width="6"/>')
def a_lion():
    import math
    mane="".join(f'<circle cx="{128+int(96*math.cos(a))}" cy="{128+int(96*math.sin(a))}" r="26" fill="#C9772E"/>' for a in [0.5*i for i in range(13)])
    return (mane+'<circle cx="128" cy="130" r="78" fill="#F6B65C"/>'
            f'<circle cx="104" cy="122" r="9" fill="{OUT}" stroke="none"/><circle cx="152" cy="122" r="9" fill="{OUT}" stroke="none"/>'
            f'<path d="M128 146 l-10 8 h20 z" fill="{OUT}" stroke="none"/><path d="M128 154 v8 M128 162 q-14 10 -26 2 M128 162 q14 10 26 2" />')
def a_elephant():
    return ('<ellipse cx="58" cy="120" rx="40" ry="52" fill="#A9B2BD"/><ellipse cx="198" cy="120" rx="40" ry="52" fill="#A9B2BD"/>'
            '<circle cx="128" cy="124" r="86" fill="#BCC4CE"/>'
            f'<circle cx="104" cy="112" r="9" fill="{OUT}" stroke="none"/><circle cx="152" cy="112" r="9" fill="{OUT}" stroke="none"/>'
            '<path d="M128 140 q-8 50 -34 70 q-18 -2 -10 -22 q18 -12 22 -48 Z" fill="#A9B2BD"/>')

# ---------------- DRINKS / FOOD ----------------
def d_water():  return '<path d="M128 36 C128 36 196 132 196 168 A68 68 0 0 1 60 168 C60 132 128 36 128 36 Z" fill="#4FB6F2"/><path d="M104 150 q4 28 30 36" stroke="#fff" fill="none" stroke-width="8"/>'
def d_milk():   return '<path d="M86 60 h84 v18 l10 18 v92 a14 14 0 0 1 -14 14 h-76 a14 14 0 0 1 -14 -14 v-92 l10 -18 Z" fill="#F2F6FF"/><path d="M82 150 h92 v52 a14 14 0 0 1 -14 14 h-64 a14 14 0 0 1 -14 -14 Z" fill="#DCEBFF"/>'
def d_juice():  return '<path d="M78 96 h100 l-12 108 a16 16 0 0 1 -16 14 h-44 a16 16 0 0 1 -16 -14 Z" fill="#FF9F1C"/><path d="M82 120 h92" /><path d="M150 96 l26 -52" stroke="#E14B4B" stroke-width="10"/><path d="M120 70 q16 -16 36 -8" stroke="#22C55E" fill="#7BD389" stroke-width="6"/>'
def f_bread():  return '<path d="M48 150 q0 -66 80 -66 q80 0 80 66 q0 18 -18 18 H66 q-18 0 -18 -18 Z" fill="#D89B53"/><path d="M48 168 h160 v18 a14 14 0 0 1 -14 14 H62 a14 14 0 0 1 -14 -14 Z" fill="#B97B38"/><path d="M96 120 q12 -14 24 0 M134 120 q12 -14 24 0" stroke="#fff" fill="none" stroke-width="5"/>'
def f_chips():  return '<path d="M70 92 l-6 -30 h40 l-6 30 M110 92 l-4 -40 h40 l-4 40 M150 92 l0 -34 h36 l-6 34" fill="#FFD23F"/><path d="M64 96 h128 l-14 104 a16 16 0 0 1 -16 14 H94 a16 16 0 0 1 -16 -14 Z" fill="#E14B4B"/><path d="M70 124 h116" stroke="#fff" stroke-width="6"/>'
def f_candy():  return '<path d="M52 128 l36 -20 v40 Z" fill="#F39DBD"/><path d="M204 128 l-36 -20 v40 Z" fill="#F39DBD"/><circle cx="128" cy="128" r="46" fill="#EC4899"/><path d="M112 116 q16 16 0 28 M144 116 q-16 16 0 28" stroke="#fff" fill="none" stroke-width="5"/>'
def x_eat():    return '<circle cx="128" cy="132" r="80" fill="#EAF0F6"/><circle cx="128" cy="132" r="52" fill="#fff"/><path d="M64 70 v60 M54 70 v44 a8 8 0 0 0 16 0 v-44" stroke="#9AA6B2" stroke-width="8"/><path d="M192 70 q14 0 14 40 q0 16 -14 16 v50" stroke="#9AA6B2" stroke-width="8"/>'

# ---------------- ACTIONS ----------------
def x_bathroom(): return '<rect x="150" y="60" width="46" height="70" rx="10" fill="#DDE6EE"/><path d="M70 120 h104 v18 a44 44 0 0 1 -44 44 h-16 a44 44 0 0 1 -44 -44 Z" fill="#F2F6FA"/><rect x="64" y="104" width="116" height="20" rx="10" fill="#CFE0EE"/><rect x="104" y="182" width="40" height="22" rx="8" fill="#DDE6EE"/>'
def x_play():     return '<circle cx="128" cy="128" r="92" fill="#FFD23F"/><path d="M128 36 a92 92 0 0 1 0 184" fill="#5AA9E6"/><path d="M36 128 q92 -40 184 0 q-92 40 -184 0 Z" fill="#E14B4B" opacity="0.85"/><circle cx="128" cy="128" r="20" fill="#22C55E"/>'
def x_sleep():    return '<rect x="40" y="120" width="176" height="70" rx="16" fill="#9FC8F0"/><rect x="40" y="150" width="176" height="40" rx="12" fill="#6EA8E0"/><rect x="56" y="100" width="64" height="44" rx="14" fill="#fff"/><text x="170" y="96" font-size="34" fill="%s" stroke="none">z</text><text x="196" y="72" font-size="22" fill="%s" stroke="none">z</text>'%(OUT,OUT)
def x_goOut():    return '<rect x="60" y="48" width="92" height="160" rx="12" fill="#C68A4E"/><rect x="74" y="64" width="64" height="128" rx="8" fill="#A6713B"/><circle cx="126" cy="132" r="8" fill="#FFD23F" stroke="none"/><path d="M168 128 h44 m-18 -18 l18 18 l-18 18" stroke="#22C55E" stroke-width="9"/>'
def x_help():     return '<circle cx="128" cy="132" r="92" fill="#FFE08A"/><path d="M108 92 q20 -26 40 0 q-20 12 -40 0 Z" fill="none"/><rect x="116" y="74" width="24" height="70" rx="12" fill="#F6C9A0"/><path d="M104 120 q-6 -30 18 -34 q-2 16 -2 30 M150 120 q8 -26 -14 -34" fill="#F6C9A0" stroke="none"/><path d="M96 130 q4 40 32 44 q28 -4 32 -44 q-32 14 -64 0 Z" fill="#F6C9A0"/>'
def x_come():     return '<path d="M150 70 q-30 -6 -30 30 v40 q0 40 30 46 q34 -6 34 -50 v-40 q0 -32 -34 -26 Z" fill="#F6C9A0"/><path d="M44 128 h70 m-22 -20 l-26 20 l26 20" stroke="#22C55E" stroke-width="9"/>'
def x_open():     return '<path d="M52 120 h152 l-12 70 a14 14 0 0 1 -14 12 H78 a14 14 0 0 1 -14 -12 Z" fill="#C68A4E"/><path d="M52 120 l24 -44 h104 l24 44 Z" fill="#A6713B"/><path d="M118 76 l20 -28 m-20 28 l-12 -22 m12 22 l30 -14" stroke="#FFD23F" stroke-width="6"/>'
def x_car():      return '<path d="M44 168 v-22 l24 -42 q6 -10 18 -10 h84 q12 0 18 10 l24 42 v22 Z" fill="#3B82F6"/><path d="M84 100 h88 l16 36 H68 Z" fill="#BFE0FF"/><circle cx="84" cy="172" r="20" fill="%s"/><circle cx="172" cy="172" r="20" fill="%s"/>'%(OUT,OUT)
def x_cold():     import math; sp="".join(f'<path d="M128 128 L{128+int(86*math.cos(math.radians(a)))} {128+int(86*math.sin(math.radians(a)))}"/>'+ "".join(f'<path d="M{128+int(50*math.cos(math.radians(a)))} {128+int(50*math.sin(math.radians(a)))} l{int(18*math.cos(math.radians(a+50)))} {int(18*math.sin(math.radians(a+50)))} M{128+int(50*math.cos(math.radians(a)))} {128+int(50*math.sin(math.radians(a)))} l{int(18*math.cos(math.radians(a-50)))} {int(18*math.sin(math.radians(a-50)))}"/>' for _ in [0]) for a in range(0,360,60)); return f'<g stroke="#4FB6F2" stroke-width="8">{sp}</g>'
def x_stop():     return '<path d="M96 44 h64 l44 44 v64 l-44 44 h-64 l-44 -44 v-64 Z" fill="#E14B4B"/><rect x="80" y="116" width="96" height="22" rx="8" fill="#fff" stroke="none"/>'

# ---------------- SENSORY ----------------
def s_loud():  return '<path d="M52 104 h34 l40 -34 v116 l-40 -34 H52 Z" fill="#FFB020"/><path d="M150 92 q26 36 0 72 M176 74 q44 54 0 108" stroke="#E14B4B" fill="none" stroke-width="9"/>'
def s_quiet(): return face("#BFE0FF","sleepy","small")+'<rect x="120" y="120" width="16" height="70" rx="8" fill="#F6C9A0"/><path d="M118 168 h20" stroke="%s"/>'%OUT
def s_notouch():return '<path d="M120 78 q-20 -4 -20 24 v50 q-30 6 -30 -22 q-14 30 14 50 q24 18 50 8 q26 -10 26 -44 v-66 q0 -28 -20 -22 q-2 16 -2 24 Z" fill="#F6C9A0"/><circle cx="128" cy="128" r="104" stroke="#E14B4B" stroke-width="12"/><path d="M58 58 L198 198" stroke="#E14B4B" stroke-width="12"/>'

# ---------------- DAILY (gestures) ----------------
def hand_wave(skin="#F6C9A0", motion="#FFB020"):
    return (f'<path d="M150 60 q-12 -2 -12 14 M132 56 q-12 -2 -12 14 M114 60 q-12 0 -12 14 M168 76 q-12 -4 -12 12" stroke="{skin}" stroke-width="18"/>'
            f'<path d="M96 92 q-26 4 -26 40 v22 q0 46 44 52 q44 4 50 -40 l4 -52 q2 -18 -16 -18 q-14 0 -14 16 Z" fill="{skin}"/>'
            f'<path d="M188 60 q18 8 18 30 M196 96 q14 8 14 26" stroke="{motion}" fill="none" stroke-width="8"/>')
def pray_hands():
    return ('<path d="M128 50 q-30 30 -40 90 q-6 36 16 50 q14 8 24 8 V60 q0 -8 -0 -10 Z" fill="#F6C9A0"/>'
            '<path d="M128 50 q30 30 40 90 q6 36 -16 50 q-14 8 -24 8 V60 q0 -8 0 -10 Z" fill="#EFC097"/>')
def d_yes():   return '<circle cx="128" cy="128" r="92" fill="#22C55E"/><path d="M90 132 l24 26 l52 -58" stroke="#fff" stroke-width="14" fill="none"/>'
def d_no():    return '<circle cx="128" cy="128" r="92" fill="#E14B4B"/><path d="M96 96 L160 160 M160 96 L96 160" stroke="#fff" stroke-width="14"/>'
def d_thanks():return pray_hands()
def d_finished():
    sq=""
    for r in range(5):
        for c in range(6):
            fill = OUT if (r+c)%2==0 else "#FFFFFF"
            sq += f'<rect x="{56+c*24}" y="{56+r*24}" width="24" height="24" fill="{fill}" stroke="none"/>'
    return f'<rect x="54" y="54" width="150" height="126" rx="10" fill="#FFFFFF" stroke="{OUT}"/>{sq}<rect x="54" y="54" width="150" height="126" rx="10" fill="none"/>'
def d_enough():return '<path d="M96 120 v-44 q0 -14 14 -14 q14 0 14 14 v40 M124 116 v-52 q0 -14 14 -14 q14 0 14 14 v52 M152 120 v-40 q0 -14 14 -14 q14 0 14 14 v52 q0 56 -48 56 q-40 0 -52 -34 l-14 -34 q-6 -16 10 -22 q12 -4 20 8 Z" fill="#F6C9A0"/>'
def d_okay():  return '<path d="M150 70 v-2 q0 -12 12 -12 q12 0 12 14 v44 q0 56 -48 56 H96 q-30 0 -30 -28 q0 -12 12 -16 l50 -16 q-18 -2 -36 -2 q-18 0 -18 -16 q0 -14 16 -14 h60 q-16 -10 -34 -16 q-14 -6 -6 -20 q8 -10 22 -2 l36 22 Z" fill="#F6C9A0"/><circle cx="128" cy="128" r="100" stroke="#22C55E" stroke-width="10" opacity=".5"/>'
def d_lala():  return '<path d="M70 150 q-4 40 36 48 M186 150 q4 40 -36 48" stroke="#F6C9A0" stroke-width="20"/><path d="M78 96 q-22 4 -22 36 v18 q0 40 38 46 M178 96 q22 4 22 36 v18 q0 40 -38 46" stroke="#F6C9A0" fill="none" stroke-width="18"/><path d="M52 70 L96 110 M204 70 L160 110" stroke="#E14B4B" stroke-width="8"/>'

DRAW = {
 "happy":e_happy,"sad":e_sad,"scared":e_scared,"angry":e_angry,"tired":e_tired,"bored":e_bored,
 "mother":p_mother,"father":p_father,
 "cat":a_cat,"dog":a_dog,"cow":a_cow,"sheep":a_sheep,"horse":a_horse,"chicken":a_chicken,"duck":a_duck,"bird":a_bird,"lion":a_lion,"elephant":a_elephant,
 "water":d_water,"milk":d_milk,"juice":d_juice,"bread":f_bread,"chips":f_chips,"candy":f_candy,"eat":x_eat,
 "bathroom":x_bathroom,"play":x_play,"sleep":x_sleep,"goOut":x_goOut,"help":x_help,"come":x_come,"open":x_open,"car":x_car,"cold":x_cold,"stop":x_stop,
 "loudSound":s_loud,"quietPlace":s_quiet,"doNotTouch":s_notouch,
 "yes":d_yes,"no":d_no,"thanks":d_thanks,"finished":d_finished,"enough":d_enough,"tayeb":d_okay,"lala":d_lala,
 # pain = body emphasis (reuse faces w/ ouch) handled below
}
# greetings & farewells -> wave (hue variants)
for k in ["salam","hello","hi","ahlan","salam_alaykum"]: DRAW[k]=lambda: hand_wave("#F6C9A0","#FFB020")
for k in ["bye","byebye","byeBye","goodbye","maa_salama"]: DRAW[k]=lambda: hand_wave("#F6C9A0","#5AA9E6")
for k in ["bismillah","alhamdulillah"]: DRAW[k]=pray_hands
DRAW["request_word"]=x_help
DRAW["khalas"]=d_finished

# pain: red throb circle on body region + small face wince
def pain(part_emoji_color="#E14B4B"):
    return face("#FBE7C6","sleepy","frown",f'<circle cx="196" cy="84" r="22" fill="none" stroke="#E14B4B" stroke-width="6"/><path d="M186 84 h20 M196 74 v20" stroke="#E14B4B" stroke-width="6"/>')
for k in ["stomachPain","headPain","toothPain","earPain","handPain","legPain"]: DRAW[k]=pain

CAT = {
 **{k:"emotions" for k in ["happy","sad","scared","angry","tired","bored"]},
 **{k:"people" for k in ["mother","father"]},
 **{k:"animals" for k in ["cat","dog","cow","sheep","horse","chicken","duck","bird","lion","elephant"]},
 **{k:"drinks" for k in ["water","milk","juice"]},
 **{k:"food" for k in ["bread","chips","candy"]},
 **{k:"actions" for k in ["eat","bathroom","play","sleep","goOut","help","come","open","car","cold","stop"]},
 **{k:"sensory" for k in ["loudSound","quietPlace","doNotTouch"]},
 **{k:"pain" for k in ["stomachPain","headPain","toothPain","earPain","handPain","legPain"]},
 **{k:"daily" for k in ["salam","hello","hi","ahlan","salam_alaykum","bye","byebye","byeBye","goodbye","maa_salama","bismillah","alhamdulillah","thanks","yes","no","finished","enough","request_word","tayeb","lala","khalas"]},
}

COLORS={"red":"#EF4444","blue":"#3B82F6","green":"#22C55E","yellow":"#FACC15","white":"#FFFFFF","black":"#1F2937","brown":"#92400E","pink":"#EC4899","orange":"#F97316","purple":"#7C3AED"}
SHAPES=["circle","square","triangle","rectangle","star","heart","arrow","line"]

def color_svg(hexv):
    border = "#CBD5E1" if hexv.upper()=="#FFFFFF" else hexv
    return wrap(f'<rect x="34" y="34" width="188" height="188" rx="40" fill="{hexv}" stroke="{border}" stroke-width="6"/><path d="M60 86 q40 -28 92 -16" stroke="#ffffff" stroke-width="10" opacity=".35" fill="none"/>')
def shape_svg(name):
    c="#64748B"; import math
    if name=="circle": b=f'<circle cx="128" cy="128" r="84" fill="{c}"/>'
    elif name=="square": b=f'<rect x="50" y="50" width="156" height="156" rx="18" fill="{c}"/>'
    elif name=="triangle": b=f'<path d="M128 48 L210 200 H46 Z" fill="{c}"/>'
    elif name=="rectangle": b=f'<rect x="40" y="84" width="176" height="88" rx="14" fill="{c}"/>'
    elif name=="star":
        pts=[];import math
        for i in range(10):
            a=-math.pi/2+i*math.pi/5; r=88 if i%2==0 else 38
            pts.append(f'{128+r*math.cos(a):.0f},{128+r*math.sin(a):.0f}')
        b=f'<polygon points="{" ".join(pts)}" fill="{c}"/>'
    elif name=="heart": b=f'<path d="M128 200 C40 140 60 64 104 64 q24 0 24 26 q0 -26 24 -26 c44 0 64 76 -24 136 Z" fill="{c}"/>'
    elif name=="arrow": b=f'<path d="M44 110 h96 v-30 l68 48 l-68 48 v-30 h-96 Z" fill="{c}"/>'
    else: b=f'<rect x="40" y="116" width="176" height="24" rx="12" fill="{c}"/>'
    return wrap(b)

EMOJI={"water":"💧","milk":"🥛","juice":"🧃","bread":"🍞","chips":"🍟","candy":"🍬","eat":"🍽️","bathroom":"🚽","sleep":"🛏️","goOut":"🚪","play":"🧸","help":"🆘","come":"👈","open":"🔓","car":"🚗","cold":"❄️","stop":"✋","loudSound":"🔊","quietPlace":"🤫","doNotTouch":"🙅","mother":"👩","father":"👨","happy":"😊","sad":"😢","scared":"😨","angry":"😡","tired":"😴","bored":"😑","stomachPain":"🤢","headPain":"🤕","toothPain":"🦷","earPain":"👂","handPain":"✋","legPain":"🦵","salam":"👋","ahlan":"🙋","hi":"✋","salam_alaykum":"🤲","bye":"👋","byebye":"🖐️","maa_salama":"🤚","bismillah":"🤲","alhamdulillah":"🙏","finished":"✅","enough":"✋","request_word":"🙋","yes":"✅","no":"❌","thanks":"🙏","khalas":"🛑","tayeb":"👌","lala":"🙅","hello":"👋","goodbye":"👋","byeBye":"👋","cat":"🐱","dog":"🐶","cow":"🐮","sheep":"🐑","horse":"🐴","chicken":"🐔","duck":"🦆","bird":"🐦","lion":"🦁","elephant":"🐘"}
USED={"emotions":["level4"],"people":["level3","level4"],"animals":["animals","games","report"],"drinks":["level2","level3","games"],"food":["level1","level2"],"actions":["level2","level3"],"sensory":["level4"],"pain":["level3","level4"],"daily":["level6"],"colors":["level5","games","report"],"shapes":["level5","report"],"ui":["navigation","practicePanel"],"avatars":["onboarding","childSelect","rewards"],"rewards":["rewardOverlay","games","report"]}

def kebab(k):
    o=[]
    for ch in k:
        if ch.isupper(): o+= ["-",ch.lower()]
        elif ch=="_": o.append("-")
        else: o.append(ch)
    return "".join(o)

def main():
    entries={}
    # build all keys
    for k,fn in DRAW.items():
        cat=CAT[k]; d=os.path.join(IMG,cat); os.makedirs(d,exist_ok=True)
        open(os.path.join(d,f"{k}.svg"),"w",encoding="utf-8").write(wrap(fn()))
        entries[k]=(cat,k)
    for k,hexv in COLORS.items():
        d=os.path.join(IMG,"colors"); os.makedirs(d,exist_ok=True)
        open(os.path.join(d,f"{k}.svg"),"w",encoding="utf-8").write(color_svg(hexv)); entries[k]=("colors",k)
    for k in SHAPES:
        d=os.path.join(IMG,"shapes"); os.makedirs(d,exist_ok=True)
        open(os.path.join(d,f"{k}.svg"),"w",encoding="utf-8").write(shape_svg(k)); entries[k]=("shapes",k)

    # manifest
    L=["// AUTO-GENERATED — tools/extract-assets/generate_svg_assets.py. لا تعدّله يدوياً.",
       "// كل عنصر له صورة SVG مستقلة. النص من dialects.ts (لا يُطبع داخل الصورة).",
       "import { getAsset, ALL_ASSET_PATHS } from '@/assets/assetRegistry'","",
       "export interface AssetEntry {",
       "  itemKey: string; fileName: string; imageUrl: string | null; category: string;",
       "  width: number; height: number; fallbackEmoji?: string; usedIn: string[]; required: boolean",
       "}","",
       "export const assetManifest: Record<string, AssetEntry> = {"]
    for k in sorted(entries):
        cat,fn=entries[k]; emo=EMOJI.get(k); used=USED.get(cat,[])
        kk = k if (k.replace('_','').isalnum() and not k[0].isdigit()) else f'"{k}"'
        emo_s = f' fallbackEmoji: "{emo}",' if emo else ""
        L.append(f'  {kk}: {{ itemKey: "{k}", fileName: "{fn}.svg", imageUrl: getAsset("{k}"), category: "{cat}", width: 256, height: 256,{emo_s} usedIn: {used}, required: true }},'.replace("'",'"'))
    L+=["}",""]
    def emit_extra(var, table, cat, w, h, used):
        out=[f"export const {var}: Record<string, AssetEntry> = {{"]
        for name in sorted(table):
            kk = name if (name.replace('_','').isalnum() and not name[0].isdigit()) else f'"{name}"'
            out.append(f'  {kk}: {{ itemKey: "{name}", fileName: "{name}.svg", imageUrl: ALL_ASSET_PATHS["{cat}/{name}.svg"] ?? null, category: "{cat}", width: {w}, height: {h}, usedIn: {used}, required: true }},'.replace("'",'"'))
        out+=["}",""]; return out
    L+=emit_extra("uiAssets", UI_ICONS, "ui", 64, 64, USED["ui"])
    L+=emit_extra("avatarAssets", AVATARS, "avatars", 512, 512, USED["avatars"])
    L+=emit_extra("rewardAssets", REWARDS, "rewards", 256, 256, USED["rewards"])
    L+=["// كل الأصول (بطاقات + واجهة + شخصيات + مكافآت) مربوطة بـ itemKey",
        "export const allAssets: Record<string, AssetEntry> = { ...assetManifest, ...uiAssets, ...avatarAssets, ...rewardAssets }","",
        "/** يحلّ أصلاً بمساره الكامل داخل images، مثل: assetByRef(\"ui/speaker\") أو assetByRef(\"animals/cat\"). */",
        "export const assetByRef = (ref: string): string | null => ALL_ASSET_PATHS[ref.endsWith('.svg') ? ref : ref + '.svg'] ?? null".replace("'", '"'),"",
        "export const getAssetUrl = (key: string): string | null => assetManifest[key]?.imageUrl ?? getAsset(key)",
        "export const hasManifestAsset = (key: string): boolean => key in assetManifest",
        "export const manifestKeys = (): string[] => Object.keys(assetManifest)",""]
    open(os.path.join(ROOT,"src","data","assetManifest.ts"),"w",encoding="utf-8").write("\n".join(L))
    extra = write_ui_avatars(IMG)
    print(f"generated {len(entries)} card svgs + {extra} ui/avatar svgs across {len(set(c for c,_ in entries.values()))+2} folders")


# ============================================================
#  v0.4.1 — أصول §10 الإضافية (people/sensory/daily + ui + avatars)
# ============================================================
import math as _m

# ---- people (boy / girl / teacher) ----
def p_boy():
    return ('<path d="M82 86 q2 -48 46 -48 q44 0 46 48 q-46 -22 -92 0 Z" fill="#5B3A22"/>'
            '<circle cx="128" cy="120" r="74" fill="#F6C9A0"/>'
            + eyes("dot").replace("116","120")
            + '<path d="M104 156 q24 18 48 0" fill="none"/>')
def p_girl():
    return ('<circle cx="62" cy="140" r="22" fill="#7A4A2B"/><circle cx="194" cy="140" r="22" fill="#7A4A2B"/>'
            '<path d="M78 92 q4 -52 50 -52 q46 0 50 52 q-50 -22 -100 0 Z" fill="#7A4A2B"/>'
            '<circle cx="128" cy="124" r="74" fill="#F6C9A0"/>'
            + eyes("dot").replace("116","124")
            + '<path d="M104 158 q24 16 48 0" fill="none"/>'
            '<circle cx="62" cy="120" r="9" fill="#EC4899" stroke="none"/><circle cx="194" cy="120" r="9" fill="#EC4899" stroke="none"/>')
def p_teacher():
    return ('<path d="M84 84 q4 -46 44 -46 q40 0 44 46 q-44 -20 -88 0 Z" fill="#3a3340"/>'
            '<circle cx="128" cy="122" r="74" fill="#F6C9A0"/>'
            '<circle cx="104" cy="120" r="18" fill="#fff"/><circle cx="152" cy="120" r="18" fill="#fff"/>'
            '<path d="M122 120 h12" /><path d="M170 116 h16" />'
            + '<circle cx="104" cy="120" r="6" fill="#37306B" stroke="none"/><circle cx="152" cy="120" r="6" fill="#37306B" stroke="none"/>'
            '<path d="M104 158 q24 14 48 0" fill="none"/>')

# ---- sensory (calm / rest) ----
def s_calm():
    return ('<circle cx="128" cy="128" r="104" fill="none" stroke="#8FD3B6" stroke-width="6"/>'
            + face("#BDEBD4","happy","small"))
def s_rest():
    return ('<path d="M196 70 a64 64 0 1 0 22 92 a52 52 0 0 1 -22 -92 Z" fill="#FFD23F"/>'
            '<text x="92" y="120" font-size="40" fill="%s" stroke="none">z</text>'
            '<text x="118" y="92" font-size="26" fill="%s" stroke="none">z</text>' % (OUT, OUT))

DRAW.update({"boy":p_boy,"girl":p_girl,"teacher":p_teacher,"calm":s_calm,"rest":s_rest,"okay":d_okay})
CAT.update({"boy":"people","girl":"people","teacher":"people","calm":"sensory","rest":"sensory","okay":"daily"})
EMOJI.update({"boy":"\U0001F466","girl":"\U0001F467","teacher":"\U0001F9D1","calm":"\U0001F60C","rest":"\U0001F634","okay":"\U0001F44C"})

# ---- UI icons (15) -> src/assets/images/ui/<name>.svg ----
def _star_pts(cx, cy, ro, ri):
    pts=[]
    for i in range(10):
        a=-_m.pi/2+i*_m.pi/5; r=ro if i%2==0 else ri
        pts.append(f"{cx+r*_m.cos(a):.0f},{cy+r*_m.sin(a):.0f}")
    return " ".join(pts)
def _gear():
    t="".join(f'<path d="M{128+44*_m.cos(_m.radians(a)):.0f} {128+44*_m.sin(_m.radians(a)):.0f} L{128+68*_m.cos(_m.radians(a)):.0f} {128+68*_m.sin(_m.radians(a)):.0f}"/>' for a in range(0,360,45))
    return f'<circle cx="128" cy="128" r="44"/><circle cx="128" cy="128" r="16"/>{t}'
UI_ICONS = {
 "home":   '<path d="M48 124 L128 52 L208 124"/><path d="M72 112 V196 H184 V112"/><path d="M108 196 V150 H148 V196"/>',
 "back":   '<path d="M154 60 L90 128 L154 196"/>',
 "next":   '<path d="M102 60 L166 128 L102 196"/>',
 "settings": _gear(),
 "report": '<rect x="64" y="44" width="128" height="168" rx="14" fill="#fff"/><path d="M96 152 V180 M128 122 V180 M160 100 V180" stroke-width="12"/>',
 "speaker":'<path d="M60 100 h32 l40 -34 v124 l-40 -34 H60 Z" fill="#FFD23F"/><path d="M150 96 q26 32 0 64 M176 78 q44 50 0 100" fill="none"/>',
 "mic":    '<rect x="104" y="48" width="48" height="92" rx="24" fill="#fff"/><path d="M76 124 a52 52 0 0 0 104 0 M128 176 v28 M100 208 h56" fill="none"/>',
 "play":   '<path d="M96 72 L184 128 L96 184 Z" fill="#22C55E"/>',
 "retry":  '<path d="M192 128 a64 64 0 1 1 -19 -45" fill="none"/><path d="M178 40 v44 h-44"/>',
 "correct":'<circle cx="128" cy="128" r="84" fill="#22C55E"/><path d="M92 130 l24 26 l52 -58" stroke="#fff" stroke-width="14" fill="none"/>',
 "star":   f'<polygon points="{_star_pts(128,130,86,36)}" fill="#FFC83D"/>',
 "reward": '<path d="M100 96 L74 44 M156 96 L182 44" stroke-width="12"/><circle cx="128" cy="150" r="56" fill="#FFC83D"/><path d="M106 150 l14 16 l30 -34" stroke="#fff" stroke-width="10" fill="none"/>',
 "clap":   '<path d="M150 78 l34 -22 M168 110 l40 -10 M154 150 l34 12" stroke="#FFB020" stroke-width="8"/><path d="M70 132 q-16 -28 8 -46 q12 -8 20 6 l22 36 q22 -10 30 8 q18 6 6 30 q-14 30 -52 30 q-34 0 -46 -34 Z" fill="#F6C9A0"/>',
 "menu":   '<path d="M56 92 H200 M56 128 H200 M56 164 H200"/>',
 "close":  '<path d="M80 80 L176 176 M176 80 L80 176"/>',
}

# ---- avatars (6) -> src/assets/images/avatars/<name>.svg ----
def _kid(skin="#F6C9A0", hair="#5B3A22", shirt="#5AA9E6", arms_up=False, ponytail=False, dress=False):
    el = ""
    if ponytail:
        el += f'<circle cx="74" cy="92" r="15" fill="{hair}"/><circle cx="182" cy="92" r="15" fill="{hair}"/>'
    el += f'<path d="M84 80 q4 -44 44 -44 q40 0 44 44 q-44 -20 -88 0 Z" fill="{hair}"/>'
    el += f'<circle cx="128" cy="92" r="46" fill="{skin}"/>'
    el += f'<circle cx="112" cy="92" r="6" fill="{OUT}" stroke="none"/><circle cx="144" cy="92" r="6" fill="{OUT}" stroke="none"/>'
    el += '<path d="M112 108 q16 14 32 0" fill="none"/>'
    if dress:
        el += f'<path d="M96 148 L160 148 L188 216 H68 Z" fill="{shirt}"/>'
    else:
        el += f'<rect x="92" y="146" width="72" height="68" rx="16" fill="{shirt}"/>'
    if arms_up:
        el += f'<path d="M98 156 L62 108 M158 156 L194 108" stroke="{skin}" stroke-width="16"/>'
    else:
        el += f'<path d="M96 162 L66 200 M160 162 L190 200" stroke="{skin}" stroke-width="16"/>'
    el += f'<path d="M112 214 V242 M144 214 V242" stroke="{OUT}" stroke-width="14"/>'
    return el
def _kid_star(body):
    return body + f'<polygon points="{_star_pts(128,30,20,8)}" fill="#FFC83D"/>'
def _helper(body_c, cheek="#F39DBD"):
    return (f'<rect x="58" y="68" width="140" height="128" rx="46" fill="{body_c}"/>'
            '<circle cx="104" cy="120" r="16" fill="#fff"/><circle cx="152" cy="120" r="16" fill="#fff"/>'
            '<circle cx="104" cy="122" r="7" fill="#37306B" stroke="none"/><circle cx="152" cy="122" r="7" fill="#37306B" stroke="none"/>'
            '<path d="M108 156 q20 18 40 0" fill="none"/>'
            f'<circle cx="80" cy="150" r="9" fill="{cheek}" stroke="none"/><circle cx="176" cy="150" r="9" fill="{cheek}" stroke="none"/>'
            f'<path d="M58 120 q-22 -4 -26 18 q18 8 30 -4" fill="{body_c}"/>'
            f'<path d="M198 120 q22 -4 26 18 q-18 8 -30 -4" fill="{body_c}"/>')
AVATARS = {
 "child_boy_01":  _kid(shirt="#3B82F6"),
 "child_girl_01": _kid(hair="#7A4A2B", shirt="#EC4899", ponytail=True, dress=True),
 "reward_boy":    _kid_star(_kid(shirt="#3B82F6", arms_up=True)),
 "reward_girl":   _kid_star(_kid(hair="#7A4A2B", shirt="#EC4899", ponytail=True, dress=True, arms_up=True)),
 "helper_character_01": _helper("#7B3FF2"),
 "helper_character_02": _helper("#22C55E", cheek="#FFD23F"),
}

def write_ui_avatars(img_root):
    # أصول أمثلة الحرف (شمس/شاي/شمعة) — تُستخدم في شاشة الحرف بدل emoji
    letters = {
        "sun": '<circle cx="128" cy="128" r="54" fill="#FFC83D"/>' + "".join(
            f'<path d="M{128+72*__import__("math").cos(__import__("math").radians(a)):.0f} {128+72*__import__("math").sin(__import__("math").radians(a)):.0f} L{128+98*__import__("math").cos(__import__("math").radians(a)):.0f} {128+98*__import__("math").sin(__import__("math").radians(a)):.0f}" stroke="#F6A93B" stroke-width="10"/>' for a in range(0,360,45)),
        "tea": '<path d="M70 110 h96 v40 a48 48 0 0 1 -48 48 h0 a48 48 0 0 1 -48 -48 Z" fill="#EAF0F6"/><path d="M166 120 q34 0 34 26 q0 24 -34 24" fill="none"/><rect x="62" y="196" width="116" height="16" rx="8" fill="#C68A4E"/><path d="M100 78 q-8 -16 6 -28 M128 78 q-8 -16 6 -28" stroke="#A9B2BD" fill="none" stroke-width="6"/>',
        "candle": '<rect x="104" y="96" width="48" height="108" rx="8" fill="#F4D7E0"/><rect x="96" y="196" width="64" height="16" rx="6" fill="#C68A4E"/><path d="M128 58 q18 22 0 38 q-18 -16 0 -38 Z" fill="#FFB020"/><path d="M128 96 v-4" stroke="#37306B"/>',
    }
    d = os.path.join(img_root, "letters"); os.makedirs(d, exist_ok=True)
    for name, body in letters.items():
        open(os.path.join(d, f"{name}.svg"), "w", encoding="utf-8").write(wrap(body))
    for sub, table in (("ui", UI_ICONS), ("avatars", AVATARS), ("rewards", REWARDS)):
        d = os.path.join(img_root, sub); os.makedirs(d, exist_ok=True)
        for name, body in table.items():
            open(os.path.join(d, f"{name}.svg"), "w", encoding="utf-8").write(wrap(body))
    return len(UI_ICONS) + len(AVATARS)

# ---- rewards (10) -> src/assets/images/rewards/<name>.svg ----
def _poly_star(cx, cy, ro, ri, fill):
    return f'<polygon points="{_star_pts(cx,cy,ro,ri)}" fill="{fill}"/>'
REWARDS = {
 "star":         _poly_star(128,132,86,36,"#FFC83D"),
 "star_burst":   "".join(f'<path d="M128 128 L{128+96*_m.cos(_m.radians(a)):.0f} {128+96*_m.sin(_m.radians(a)):.0f}" stroke="#FFB020" stroke-width="6"/>' for a in range(0,360,30))+_poly_star(128,130,70,30,"#FFC83D"),
 "trophy":       '<path d="M86 60 h84 v34 a42 42 0 0 1 -84 0 Z" fill="#FFC83D"/><path d="M86 70 q-34 0 -34 28 q0 22 30 26" fill="none"/><path d="M170 70 q34 0 34 28 q0 22 -30 26" fill="none"/><path d="M118 134 h20 v26 h-20 Z" fill="#E8A91C"/><rect x="98" y="160" width="60" height="16" rx="6" fill="#E8A91C"/><rect x="86" y="176" width="84" height="18" rx="8" fill="#C8881A"/>',
 "medal":        '<path d="M100 60 L74 132 M156 60 L182 132" stroke-width="12"/><circle cx="128" cy="158" r="54" fill="#FFC83D"/>'+_poly_star(128,158,28,12,"#fff"),
 "ribbon":       "".join(f'<path d="M128 128 L{128+72*_m.cos(_m.radians(a)):.0f} {128+72*_m.sin(_m.radians(a)):.0f} L{128+72*_m.cos(_m.radians(a+30)):.0f} {128+72*_m.sin(_m.radians(a+30)):.0f} Z" fill="{"#F6B43C" if (a//30)%2==0 else "#E89A1C"}"/>' for a in range(0,360,30))+'<circle cx="128" cy="128" r="34" fill="#FFD66B"/><path d="M108 156 l-12 48 l32 -20 l32 20 l-12 -48" fill="#E14B4B"/>',
 "crown":        '<path d="M50 180 L66 92 L100 138 L128 78 L156 138 L190 92 L206 180 Z" fill="#FFC83D"/><rect x="50" y="180" width="156" height="22" rx="8" fill="#E8A91C"/><circle cx="66" cy="92" r="10" fill="#E14B4B"/><circle cx="128" cy="78" r="10" fill="#E14B4B"/><circle cx="190" cy="92" r="10" fill="#E14B4B"/>',
 "confetti":     '<rect x="60" y="64" width="22" height="22" rx="4" fill="#7B3FF2" stroke="none"/><rect x="150" y="58" width="22" height="22" rx="4" fill="#22C55E" stroke="none" transform="rotate(20 161 69)"/><circle cx="196" cy="120" r="12" fill="#E14B4B" stroke="none"/><rect x="70" y="150" width="22" height="22" rx="4" fill="#FFC83D" stroke="none" transform="rotate(-15 81 161)"/><circle cx="120" cy="180" r="12" fill="#3B82F6" stroke="none"/><path d="M150 150 l24 24 M174 150 l-24 24" stroke="#EC4899" stroke-width="8"/><circle cx="100" cy="100" r="9" fill="#F97316" stroke="none"/>',
 "balloon":      '<ellipse cx="128" cy="110" rx="66" ry="78" fill="#E14B4B"/><path d="M118 184 l20 0 l-10 14 Z" fill="#E14B4B"/><path d="M128 198 q14 22 -6 40" stroke-width="5" fill="none"/><path d="M104 78 q10 -22 34 -16" stroke="#fff" stroke-width="8" fill="none" opacity=".5"/>',
 "thumbs_up":    '<rect x="52" y="120" width="40" height="84" rx="10" fill="#EFC097"/><path d="M100 204 V120 l34 -56 q8 -14 22 -6 q10 6 6 22 l-10 36 h44 q18 0 14 20 l-14 56 q-4 16 -22 16 H100 Z" fill="#F6C9A0"/>',
 "sticker_smile":'<circle cx="128" cy="128" r="92" fill="#FFD23F"/><circle cx="100" cy="116" r="11" fill="%s" stroke="none"/><circle cx="156" cy="116" r="11" fill="%s" stroke="none"/><path d="M88 150 q40 44 80 0" fill="none" stroke-width="10"/>' % (OUT, OUT),
}



if __name__=="__main__": main()
