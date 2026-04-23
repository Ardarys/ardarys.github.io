# React + Vite GitHub Pages Landing Page

This repository contains a production-ready React + Vite landing page that renders markdown content from repository files and deploys to GitHub Pages through GitHub Actions.

## Features

- React + Vite frontend with a lightweight dependency set
- Markdown rendering with `react-markdown` and `remark-gfm`
- Automated markdown syncing from the repository root into `public/`
- GitHub Pages-safe Vite base path derived from `GITHUB_REPOSITORY`
- GitHub Actions workflow for build and deployment

## Content source

Update these files in the repository root:

- `adl-ara-description.md`
- `landing-page-content.md`

Before `dev` and `build`, a sync script copies those files into `public/` so they can be fetched at runtime.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Deployment

The GitHub Actions workflow lives at `.github/workflows/deploy.yml` and deploys on pushes to `main` and `master`. This repository currently uses `master`, so deployment will work immediately without a branch rename.

### Manual step required (one-time)

Go to repository Settings -> Pages. Under `Source`, select `GitHub Actions`.

## Base path behavior

`vite.config.js` automatically uses:

- `/` for local development
- `/<repo-name>/` in GitHub Actions when `GITHUB_REPOSITORY` is available

That keeps asset and markdown fetch paths compatible with GitHub Pages project sites.
