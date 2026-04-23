import { copyFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const publicDir = path.join(rootDir, 'public')
const markdownFiles = ['adl-ara-description.md', 'landing-page-content.md']

await mkdir(publicDir, { recursive: true })

await Promise.all(
  markdownFiles.map((file) =>
    copyFile(path.join(rootDir, file), path.join(publicDir, file)),
  ),
)

console.log(`Synced ${markdownFiles.length} markdown files into public/.`)

