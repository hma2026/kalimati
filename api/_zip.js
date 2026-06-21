// api/_zip.js — فكّ ZIP في الذاكرة عبر fflate. ملف داخلي (بادئة _).
import { unzipSync } from 'fflate'

const toB64 = (u8) => Buffer.from(u8).toString('base64')

/**
 * يفكّ ZIP (Uint8Array) ويعيد قائمة ملفات: [{ path, contentBase64 }].
 * - يتجاهل المجلدات والملفات الفارغة وملفات الميتا (.DS_Store, __MACOSX).
 * - يزيل مجلد التغليف العلوي إن كان كل المحتوى داخل مجلد واحد.
 */
export function unzipToFiles(buffer) {
  const entries = unzipSync(buffer)
  let names = Object.keys(entries).filter(
    (n) => !n.endsWith('/') && !n.includes('__MACOSX') && !n.endsWith('.DS_Store'),
  )
  if (!names.length) throw new Error('ZIP فارغ أو غير صالح')

  // إزالة مجلد التغليف العلوي المشترك (مثل project/...) إن وُجد
  const top = names[0].split('/')[0]
  const hasWrapper = top && names.every((n) => n.startsWith(top + '/'))
  const strip = hasWrapper ? top.length + 1 : 0

  return names.map((n) => ({
    path: n.slice(strip),
    contentBase64: toB64(entries[n]),
  }))
}
