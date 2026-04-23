import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { loadMarkdown } from './utils/loadMarkdown'

const baseUrl = import.meta.env.BASE_URL

const markdownFiles = {
  description: `${baseUrl}adl-ara-description.md`,
  content: `${baseUrl}landing-page-content.md`,
}

const sections = [
  {
    key: 'description',
    eyebrow: 'Description',
    title: 'Project overview',
    fallback:
      'No description content is available yet. Add copy to adl-ara-description.md to populate this section automatically.',
  },
  {
    key: 'content',
    eyebrow: 'Content',
    title: 'Landing page content',
    fallback:
      'No landing page content is available yet. Add copy to landing-page-content.md to populate this section automatically.',
  },
]

function MarkdownSection({ eyebrow, title, body, error, loading }) {
  return (
    <section className="panel markdown-panel">
      <div className="section-heading">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>

      {loading ? (
        <p className="status">Loading markdown content...</p>
      ) : (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{error || body}</ReactMarkdown>
      )}
    </section>
  )
}

export default function App() {
  const [state, setState] = useState({
    description: { content: '', loading: true, error: '' },
    content: { content: '', loading: true, error: '' },
  })

  useEffect(() => {
    let active = true

    async function fetchMarkdown(key, path) {
      try {
        const content = await loadMarkdown(path)

        if (!active) {
          return
        }

        setState((current) => ({
          ...current,
          [key]: {
            content: content.trim(),
            loading: false,
            error: '',
          },
        }))
      } catch {
        if (!active) {
          return
        }

        setState((current) => ({
          ...current,
          [key]: {
            content: '',
            loading: false,
            error: `Unable to load ${path.split('/').filter(Boolean).pop()}.`,
          },
        }))
      }
    }

    Object.entries(markdownFiles).forEach(([key, path]) => {
      fetchMarkdown(key, path)
    })

    return () => {
      active = false
    }
  }, [])

  return (
    <div className="page-shell">
      <div className="background-orb background-orb-one" />
      <div className="background-orb background-orb-two" />

      <main className="container">
        <section className="hero panel">
          <div className="hero-copy">
            <p className="eyebrow">Markdown-driven landing page</p>
            <h1>Ship a GitHub Pages landing page without touching the GitHub UI.</h1>
            <p className="hero-text">
              This Vite app reads repository-managed markdown, renders it with a
              lightweight React stack, and deploys automatically through GitHub
              Actions with a GitHub Pages-safe base path.
            </p>
          </div>

          <div className="hero-meta">
            <div>
              <span className="meta-label">Rendering</span>
              <strong>React Markdown + GFM</strong>
            </div>
            <div>
              <span className="meta-label">Deployment</span>
              <strong>GitHub Actions to Pages</strong>
            </div>
            <div>
              <span className="meta-label">Runtime source</span>
              <strong>`landing-page-content.md`</strong>
            </div>
          </div>
        </section>

        {sections.map((section) => {
          const data = state[section.key]
          const body = data.content || section.fallback

          return (
            <MarkdownSection
              key={section.key}
              eyebrow={section.eyebrow}
              title={section.title}
              body={body}
              error={data.error}
              loading={data.loading}
            />
          )
        })}
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <p>Built with React, Vite, and markdown sourced from this repository.</p>
          <a href="#root">Back to top</a>
        </div>
      </footer>
    </div>
  )
}
