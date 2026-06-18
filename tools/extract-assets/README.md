# أداة إدارة الأصول (extract-assets)

طريقتان لتجهيز صور التطبيق. كلاهما يحفظ في `public/assets/...` ويُقرأ من
`src/data/assetManifest.ts` عبر المفتاح الداخلي (لا نص داخل الصورة).

## 1) توليد Placeholders + manifest (المعتمد حالياً)
```
python3 tools/extract-assets/generate_assets.py
```
- ينشئ بنية `public/assets/` كاملة.
- يولّد صورة placeholder نظيفة (بدون نص) لكل مفتاح: الألوان كمربّعات لونية،
  الأشكال مرسومة، والبقية بطاقة بلون التصنيف + أيقونة محايدة.
- يكتب `src/data/assetManifest.ts` (80 مفتاحاً) و`assets.config.json`.

## 2) القص من شيت صور فعلي (sharp)
```
npm i -D sharp tsx
# ضع الشيت في tools/extract-assets/sheets/
# عرّف الإحداثيات في asset-crops.json
npx tsx tools/extract-assets/extractAssets.ts
```
- يقصّ **الصورة الداخلية فقط** (لا تقصّ الكلمة العربية).
- يحفظ بنفس المسارات/الأسماء فيستبدل الـ placeholders تلقائياً.

## استبدال صورة لاحقاً
ضع ملفاً فعلياً بنفس المسار/الاسم الموجود في الـ manifest (مثل
`public/assets/cards/animals/cat.png`) — لا حاجة لأي تعديل في الشاشات.

## أصول تحتاج فناً حقيقياً (placeholders الآن)
كل البطاقات المرسومة (حيوانات/طعام/مشروبات/مشاعر/ألم/أشخاص/أفعال/عبارات يومية).
الألوان والأشكال مقبولة كما هي (مربّعات/أشكال نظيفة) إن لم ترغب برسمها.
