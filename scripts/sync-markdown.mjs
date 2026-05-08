import { access, copyFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const publicDir = path.join(rootDir, 'public')
const markdownFiles = ['adl-ara-description.md', 'landing-page-content.md']
const assetFiles = ['pitch_deck/Ardarys - Pitch Deck.pdf']

await mkdir(publicDir, { recursive: true })

const copiedFiles = []
const missingFiles = []

await Promise.all(
  [...markdownFiles, ...assetFiles].map(async (file) => {
    const source = path.join(rootDir, file)
    const destination = path.join(publicDir, file)

    try {
      await access(source)
      await mkdir(path.dirname(destination), { recursive: true })
      await copyFile(source, destination)
      copiedFiles.push(file)
    } catch {
      missingFiles.push(file)
    }
  }),
)

if (missingFiles.length > 0) {
  console.warn(`Skipped missing public source files: ${missingFiles.join(', ')}`)
}

console.log(`Synced ${copiedFiles.length} file(s) into public/.`)
