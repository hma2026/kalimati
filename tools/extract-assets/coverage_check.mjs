import fs from 'fs'
const img = 'src/assets/images'
const reg = {}
for (const cat of fs.readdirSync(img)) {
  const p = `${img}/${cat}`
  if (!fs.statSync(p).isDirectory()) continue
  if (cat === 'ui' || cat === 'avatars') continue
  for (const f of fs.readdirSync(p)) if (f.endsWith('.svg')) reg[f.replace('.svg', '')] = cat
}
const animals = ['cat','dog','cow','sheep','horse','chicken','duck','bird','lion','elephant']
const colors = ['red','blue','green','yellow','white','black','brown','pink','orange','purple']
const shapes = ['circle','square','triangle','rectangle','star','heart','arrow','line']
const L2 = ['water','milk','juice','bathroom','eat','play','sleep','goOut','chips']
const L3 = ['water','car','bathroom','tired','stomachPain','mother','father','sleep']
const L4 = ['happy','sad','scared','angry','tired','bored','stomachPain','headPain','toothPain','earPain','handPain','legPain','loudSound','quietPlace','doNotTouch','mother','father','help','stop','goOut']
const L6 = ['salam','ahlan','hi','salam_alaykum','bye','byebye','maa_salama','bismillah','alhamdulillah','finished','enough','water','request_word','help','come','open','yes','no','thanks','khalas','tayeb','lala']
const all = [...new Set([...animals, ...colors, ...shapes, ...L2, ...L3, ...L4, ...L6])]
const missing = all.filter(k => !(k in reg))
console.log('app keys checked:', all.length, '| missing:', missing.length, missing.length ? missing.join(',') : '(none)')
console.log("getAsset('play') ->", reg['play'], "| getAsset('star') ->", reg['star'])
