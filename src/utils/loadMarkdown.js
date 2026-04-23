export async function loadMarkdown(path) {
  const res = await fetch(path)

  if (!res.ok) {
    throw new Error(`Failed to load markdown: ${path}`)
  }

  return res.text()
}

