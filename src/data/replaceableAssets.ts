/**
 * الأصول القابلة للاستبدال من شاشة الإدارة (تبويب الأيقونات والصور).
 * كل عنصر: مفتاح assetRegistry + المسار الذي تُلتزم إليه الصورة في المستودع.
 * عند رفع صورة لمفتاح، تُلتزم إلى path → بعد إعادة النشر يلتقطها assetRegistry تلقائياً
 * وتحلّ محلّ البديل المؤقت دون أي تعديل في منطق الشاشات.
 */
export interface ReplaceableAsset {
  key: string
  label: string
  group: string
  path: string
}

export const replaceableAssets: ReplaceableAsset[] = [
  // حروف بلا صورة بعد (بديل SVG مؤقت)
  { key: 'apple', label: 'تفاح', group: 'حروف', path: 'src/assets/images/food/apple.png' },
  { key: 'carrot', label: 'جزر', group: 'حروف', path: 'src/assets/images/food/carrot.png' },
  { key: 'pomegranate', label: 'رمان', group: 'حروف', path: 'src/assets/images/food/pomegranate.png' },
  { key: 'fox', label: 'ثعلب', group: 'حروف', path: 'src/assets/images/animals/fox.png' },
  { key: 'wolf', label: 'ذئب', group: 'حروف', path: 'src/assets/images/animals/wolf.png' },
  { key: 'giraffe', label: 'زرافة', group: 'حروف', path: 'src/assets/images/animals/giraffe.png' },
  { key: 'fish', label: 'سمكة', group: 'حروف', path: 'src/assets/images/animals/fish.png' },
  { key: 'falcon', label: 'صقر', group: 'حروف', path: 'src/assets/images/animals/falcon.png' },
  { key: 'frog', label: 'ضفدع', group: 'حروف', path: 'src/assets/images/animals/frog.png' },
  { key: 'deer', label: 'ظبي', group: 'حروف', path: 'src/assets/images/animals/deer.png' },
  { key: 'cloud', label: 'غيمة', group: 'حروف', path: 'src/assets/images/extra/cloud.png' },
  { key: 'gift', label: 'هدية', group: 'حروف', path: 'src/assets/images/extra/gift.png' },
  { key: 'rose', label: 'وردة', group: 'حروف', path: 'src/assets/images/extra/rose.png' },
  { key: 'hand', label: 'يد', group: 'حروف', path: 'src/assets/images/extra/hand.png' },
]
