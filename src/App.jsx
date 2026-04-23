import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { loadMarkdown } from './utils/loadMarkdown'

const baseUrl = import.meta.env.BASE_URL

const markdownFiles = {
  description: `${baseUrl}adl-ara-description.md`,
  content: `${baseUrl}landing-page-content.md`,
}

const brandAssets = {
  logo: `${baseUrl}brand/logo.png`,
  hero: `${baseUrl}images/hero.png`,
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

function MarkdownSection({ id, eyebrow, title, body, error, loading }) {
  return (
    <section className="panel markdown-panel" id={id}>
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
        <header className="site-header">
          <a className="brand" href="#root" aria-label="Ardaris home">
            <img src={brandAssets.logo} alt="Ardaris logo" className="brand-logo" />
          </a>

          <nav className="site-nav" aria-label="Primary">
            <a href="#description-section">About</a>
            <a href="#content-section">Platform</a>
          </nav>
        </header>

        <section
          className="hero hero-background"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(8, 10, 38, 0.3), rgba(8, 10, 38, 0.82)), url(${brandAssets.hero})`,
          }}
        >
          <div className="hero-copy">
            <p className="eyebrow">AI-Powered Legal Decision Intelligence</p>
            <h1>Ardaris</h1>
            <p className="hero-text">
              Ardaris helps people and businesses navigate legal questions with
              more speed, clarity, and confidence through structured workflows,
              AI-assisted research, and input from multiple verified experts.
            </p>

            <div className="hero-actions">
              <a className="button button-primary" href="#content-section">
                Explore the platform
              </a>
              <a className="button button-secondary" href="#description-section">
                Learn how it works
              </a>
            </div>
          </div>

          <div className="hero-meta">
            <div>
              <span className="meta-label">Expert validation</span>
              <strong>Multiple verified legal perspectives</strong>
            </div>
            <div>
              <span className="meta-label">Decision quality</span>
              <strong>Performance-based scoring and accountability</strong>
            </div>
            <div>
              <span className="meta-label">Outcome</span>
              <strong>Faster, clearer, more reliable legal workflows</strong>
            </div>
          </div>

        </section>

        {sections.map((section) => {
          const data = state[section.key]
          const body = data.content || section.fallback

          return (
            <MarkdownSection
              key={section.key}
              id={`${section.key}-section`}
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
          <p>Ardaris brings decision intelligence to modern legal services.</p>
          <a href="#root">Back to top</a>
        </div>
      </footer>
    </div>
  )
}
