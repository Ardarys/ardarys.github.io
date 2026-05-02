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
  hero: `${baseUrl}images/hero.png`,
}

const sections = [
  {
    key: 'description',
    fallback:
      'No description content is available yet. Add copy to adl-ara-description.md to populate this section automatically.',
  },
  {
    key: 'content',
    fallback:
      'No landing page content is available yet. Add copy to landing-page-content.md to populate this section automatically.',
  },
]

function splitContentIntoPanels(markdown) {
  if (!markdown) {
    return []
  }

  const parts = markdown.split('\n## ')

  if (parts.length <= 2) {
    return [markdown]
  }

  const intro = [parts[0], `## ${parts[1]}`].join('\n\n').trim()
  const core = parts
    .slice(2, 6)
    .map((part) => `## ${part}`)
    .join('\n\n')
    .trim()
  const closing = parts
    .slice(6)
    .map((part) => `## ${part}`)
    .join('\n\n')
    .trim()

  return [intro, core, closing].filter(Boolean)
}

function extractStrategicCards(markdown) {
  const headings = [
    '## Already delivering value',
    '## Built for scale',
    '## Competitive edge',
    '## A platform that improves over time',
  ]

  const valueStart = markdown.indexOf(headings[0])
  const scaleStart = markdown.indexOf(headings[1])
  const edgeStart = markdown.indexOf(headings[2])
  const afterCardsStart = markdown.indexOf(headings[3])

  if ([valueStart, scaleStart, edgeStart, afterCardsStart].some((index) => index === -1)) {
    return null
  }

  return {
    before: markdown.slice(0, valueStart).trim(),
    cards: [
      markdown.slice(valueStart, scaleStart).trim(),
      markdown.slice(scaleStart, edgeStart).trim(),
      markdown.slice(edgeStart, afterCardsStart).trim(),
    ],
    after: markdown.slice(afterCardsStart).trim(),
  }
}

function MarkdownSection({ id, body, error, loading }) {
  return (
    <section className="panel markdown-panel" id={id}>
      {loading ? (
        <p className="status">Loading markdown content...</p>
      ) : (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{error || body}</ReactMarkdown>
      )}
    </section>
  )
}

function MarkdownCardGrid({ id, cards, loading, error }) {
  return (
    <section className="cards-section" id={id}>
      {loading ? (
        <section className="panel markdown-panel">
          <p className="status">Loading markdown content...</p>
        </section>
      ) : (
        <div className="cards-grid">
          {cards.map((card, index) => (
            <article className="panel markdown-panel content-card" key={index}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{error || card}</ReactMarkdown>
            </article>
          ))}
        </div>
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
          <nav className="site-nav" aria-label="Primary">
            <a href="#description-section">About</a>
            <a href="#content-section">Platform</a>
          </nav>
        </header>

        <section
          className="hero hero-background"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(8, 10, 38, 0.000001), rgba(8, 10, 38, 0.82)), url(${brandAssets.hero})`,
          }}
        >
          <div className="hero-copy">
            <p className="eyebrow">AI-Powered Legal Decision Intelligence</p>
            <h1>AdlAra</h1>
            <p className="hero-text">
              Better legal decisions, with AI support and real expert input.
            </p>

            <div className="hero-actions">
              <a className="button button-primary" href="#content-section">
                Get legal help
              </a>
              <a className="button button-secondary" href="#description-section">
                Join as a lawyer
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

          if (section.key === 'content') {
            const split = extractStrategicCards(body)

            if (split) {
              return [
                <MarkdownSection
                  key={`${section.key}-intro`}
                  id="content-section"
                  body={split.before}
                  error={data.error}
                  loading={data.loading}
                />,
                <MarkdownCardGrid
                  key={`${section.key}-cards`}
                  id="content-highlights"
                  cards={split.cards}
                  error={data.error}
                  loading={data.loading}
                />,
                <MarkdownSection
                  key={`${section.key}-closing`}
                  id={`${section.key}-section-3`}
                  body={split.after}
                  error={data.error}
                  loading={data.loading}
                />,
              ]
            }

            const panels = splitContentIntoPanels(body)

            return panels.map((panel, index) => (
              <MarkdownSection
                key={`${section.key}-${index}`}
                id={index === 0 ? 'content-section' : `${section.key}-section-${index + 1}`}
                body={panel}
                error={data.error}
                loading={data.loading}
              />
            ))
          }

          return (
            <MarkdownSection
              key={section.key}
              id={`${section.key}-section`}
              body={body}
              error={data.error}
              loading={data.loading}
            />
          )
        })}
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <p>AdlAra brings decision intelligence to modern legal services.</p>
          <a href="#root">Back to top</a>
        </div>
      </footer>
    </div>
  )
}
