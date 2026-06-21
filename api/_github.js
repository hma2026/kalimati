// api/_github.js — الالتزام بملفات متعددة عبر Git Data API ثم تحديث الفرع.
// ملف داخلي (بادئة _) وليس endpoint. تحديث الفرع يُشغّل إعادة نشر Vercel تلقائياً.
const REPO = process.env.GITHUB_REPO || 'hma2026/kalimati'
const BRANCH = process.env.GITHUB_BRANCH || 'main'
const TOKEN = process.env.GITHUB_TOKEN
const API = 'https://api.github.com'

function headers() {
  if (!TOKEN) throw new Error('GITHUB_TOKEN missing')
  return {
    Authorization: `Bearer ${TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
    'User-Agent': 'kalima-update-tool',
  }
}
async function gh(path, opts = {}) {
  const res = await fetch(`${API}/repos/${REPO}${path}`, { ...opts, headers: headers() })
  const text = await res.text()
  const data = text ? JSON.parse(text) : {}
  if (!res.ok) throw new Error(`GitHub ${res.status} ${path}: ${data.message || text}`)
  return data
}

/**
 * files: [{ path, contentBase64 }]  — كل الملفات تُرفع كـ blobs (يدعم النصّي والثنائي).
 * يعيد { commitSha, commitUrl, branch }.
 */
export async function commitFiles(files, message) {
  if (!files.length) throw new Error('no files to commit')

  // 1) مرجع الفرع الحالي + شجرته الأساس
  const ref = await gh(`/git/ref/heads/${BRANCH}`)
  const baseSha = ref.object.sha
  const baseCommit = await gh(`/git/commits/${baseSha}`)
  const baseTreeSha = baseCommit.tree.sha

  // 2) إنشاء blob لكل ملف
  const tree = []
  for (const f of files) {
    const blob = await gh('/git/blobs', {
      method: 'POST',
      body: JSON.stringify({ content: f.contentBase64, encoding: 'base64' }),
    })
    tree.push({ path: f.path, mode: '100644', type: 'blob', sha: blob.sha })
  }

  // 3) شجرة جديدة فوق الأساس
  const newTree = await gh('/git/trees', {
    method: 'POST',
    body: JSON.stringify({ base_tree: baseTreeSha, tree }),
  })

  // 4) commit + 5) تحديث الفرع
  const commit = await gh('/git/commits', {
    method: 'POST',
    body: JSON.stringify({ message, tree: newTree.sha, parents: [baseSha] }),
  })
  await gh(`/git/refs/heads/${BRANCH}`, {
    method: 'PATCH',
    body: JSON.stringify({ sha: commit.sha, force: false }),
  })

  return { commitSha: commit.sha, commitUrl: commit.html_url, branch: BRANCH }
}
