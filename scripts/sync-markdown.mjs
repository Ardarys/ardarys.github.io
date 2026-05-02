import { access, copyFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const publicDir = path.join(rootDir, 'public')
const markdownFiles = ['adl-ara-description.md', 'landing-page-content.md']

await mkdir(publicDir, { recursive: true })

const copiedFiles = []
const missingFiles = []

await Promise.all(
  markdownFiles.map(async (file) => {
    const source = path.join(rootDir, file)

    try {
      await access(source)
      await copyFile(source, path.join(publicDir, file))
      copiedFiles.push(file)
    } catch {
      missingFiles.push(file)
    }
  }),
)

if (missingFiles.length > 0) {
  console.warn(`Skipped missing markdown files: ${missingFiles.join(', ')}`)
}

console.log(`Synced ${copiedFiles.length} markdown file(s) into public/.`)
