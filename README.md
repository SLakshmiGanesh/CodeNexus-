# CP-Mentor AI

AI-powered competitive programming mentor with weakness detection, DSA roadmaps, analytics, mock contests, and an AI tutor.

## Stack

- Frontend: React 18, Create React App, Recharts, Lucide React
- Local backend: Express API server at `backend/server.js`
- Deployment backend: Vercel serverless function at `api/chat.js`
- AI provider: Anthropic Messages API

## Project Structure

```text
.
├── api/
│   └── chat.js              # Vercel serverless backend endpoint
├── backend/
│   └── server.js            # Local Express backend
├── public/
│   └── index.html
├── src/
│   ├── data/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   ├── App.css
│   ├── App.js
│   └── index.js
├── package.json
└── vercel.json
```

## Local Setup

Install dependencies:

```bash
npm install
```

Create `.env` from `.env.example` and set your Anthropic key:

```bash
ANTHROPIC_API_KEY=sk-ant-your-key
ANTHROPIC_MODEL=claude-sonnet-4-20250514
```

Run the React development server:

```bash
npm start
```

Open `http://localhost:3000`.

For a production build served with the local backend:

```bash
npm run build
npm run server
```

The app still works without an API key, but AI responses will use a fallback message until `ANTHROPIC_API_KEY` is configured.

## Deployment

This repo is configured for a single Vercel deployment that serves:

- React frontend from `build/`
- Backend API from `/api/chat`

Required Vercel environment variables:

```bash
ANTHROPIC_API_KEY=sk-ant-your-key
ANTHROPIC_MODEL=claude-sonnet-4-20250514
```

Build command:

```bash
npm run build
```

Output directory:

```bash
build
```

## Features

- Weakness Detector: knowledge graph style gap analysis
- Roadmap: phased DSA plan with spaced repetition data
- AI Tutor: chat, concept explanations, hint engine, and code review
- Analytics: rating charts, radar chart, and progress insights
- Battle Arena: mock contest interface with sample problems
