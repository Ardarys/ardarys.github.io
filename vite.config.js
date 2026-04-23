import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function getBasePath() {
  const repo = process.env.GITHUB_REPOSITORY?.split('/')[1]

  if (repo) {
    return `/${repo}/`
  }

  return '/'
}

export default defineConfig({
  plugins: [react()],
  base: getBasePath(),
})

