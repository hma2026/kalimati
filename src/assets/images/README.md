# صور التطبيق (assets/images)

ضع هنا الصور الفعلية. **اسم الملف = المفتاح الداخلي** للعنصر، والامتداد أحد: `.png` `.webp` `.svg` `.jpg`.

يكتشفها `src/assets/assetRegistry.ts` تلقائياً (عبر import.meta.glob)، فتُستبدل الرموز التعبيرية بالصور الفعلية **بدون تعديل أي شاشة**.

## أين أضع كل نوع

| المجلد | المفاتيح (أمثلة) |
|---|---|
| `animals/`        | cat, dog, cow, sheep, horse, chicken, duck, bird, lion, elephant |
| `colors/`         | red, blue, green, yellow, white, black, brown, pink, orange, purple |
| `shapes/`         | circle, square, triangle, rectangle, star, heart, arrow, line |
| `foods/`          | water, milk, juice, eat, chips, bread (كلمات الطعام/الطلب) |
| `emotions/`       | happy, sad, scared, angry, tired, bored |
| `daily-phrases/`  | salam, bye, thanks, yes, no … |
| `characters/`     | boy, girl, mascot … |

## مثال
```
src/assets/images/animals/cat.png    → المفتاح cat
src/assets/images/colors/red.webp    → المفتاح red
src/assets/images/shapes/circle.svg  → المفتاح circle
```

نفس الصورة تُستخدم في الدرس واللعبة لأن كليهما يقرأ من نفس السجل.
