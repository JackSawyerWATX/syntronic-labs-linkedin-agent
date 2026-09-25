# Syntronic Labs LinkedIn Agent

An AI-assisted content workflow for drafting, reviewing, and managing posts for the Syntronic Labs LinkedIn Company Page. The application generates drafts with OpenAI, checks for duplicate content, and keeps posts in a local SQLite database until a reviewer approves or rejects them.

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Security](#security)
- [How to Contribute?](#how-to-contribute)
- [What's Next?](#whats-next)
- [License](#license)
- [Acknowledgements](#acknowledgements)
- [Author](#author)

## About

The Syntronic Labs LinkedIn Agent supports a human-in-the-loop publishing workflow. It produces a draft from a topic and optional category, presents it for review, and records approval or rejection. Rejected drafts can be regenerated while duplicate checks reduce the risk of posting substantially identical content.

## Features

- Generate LinkedIn post drafts from a topic and category.
- Compare generated content against stored posts using content hashes.
- View all drafts grouped by their workflow status.
- Approve or reject pending posts.
- Regenerate a rejected post with its original topic and category.
- Persist drafts and workflow metadata in SQLite.
- Provide a health endpoint at `GET /health`.

## Tech Stack

- **Frontend:** HTML, CSS, and vanilla JavaScript.
- **Backend:** Node.js, Express, and CORS.
- **AI:** OpenAI Responses API.
- **Storage:** SQLite through `better-sqlite3`.
- **Environment management:** `dotenv`.
- **Development:** Nodemon.

## Architecture

```text
┌───────────────────────────────────────┐
│              FRONT END                │
│                                       │
│  HTML / CSS / JavaScript              │
│  • View generated posts               │
│  • Approve                            │
│  • Reject                             │
│  • Regenerate                         │
└──────────────────┬────────────────────┘
                   │ REST API
                   ▼
┌───────────────────────────────────────┐
│              BACK END                 │
│                                       │
│  Node.js / Express                    │
│  • Generation endpoint                │
│  • Approval workflow                  │
│  • Rejection workflow                 │
│  • Regeneration                       │
│  • Duplicate checking                 │
└────────────┬──────────────┬───────────┘
             │              │
             ▼              ▼
       ┌──────────┐    ┌───────────┐
       │  SQLite  │    │  OpenAI   │
       │          │    │           │
       │ Memory   │    │ Reasoning │
       └──────────┘    └───────────┘

                   ↓
            LINKEDIN API
            (remaining)
```

The frontend is served as static content by Express. Requests to `/api/posts` create and manage post records, while generation requests use OpenAI and recent stored posts to avoid repetition. The SQLite database lives at `data/linkedin-agent.db` and uses write-ahead logging. LinkedIn publishing is shown as a remaining integration because no publishing client is implemented yet.

## Project Structure

```text
.
├── data/                       # Runtime SQLite database location
├── public/                     # Static frontend assets
│   ├── images/                  # Browser image assets and favicon
│   ├── app.js                   # Frontend behavior
│   ├── index.html               # Application page
│   └── styles.css               # Frontend styles
├── src/
│   ├── config/                  # Configuration modules
│   ├── controllers/             # Controller boundary
│   ├── db/                      # SQLite connection and repositories
│   ├── prompts/                 # LinkedIn generation instructions
│   ├── routes/                  # Express API routes
│   ├── services/                # AI, duplicate, and future LinkedIn services
│   ├── app.js                   # Express application configuration
│   └── server.js                # HTTP server entry point
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18 or later.
- An OpenAI API key with access to the configured model.

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root:

   ```env
   OPENAI_API_KEY=your_openai_api_key
   PORT=3000
   ```

3. Start the application:

   ```bash
   npm start
   ```

For development with automatic restarts, run:

```bash
npm run dev
```

Open `http://localhost:3000` in a browser. Confirm the service is running with `http://localhost:3000/health`.

## Configuration

Configuration is loaded from the root `.env` file.

| Variable | Required | Description |
| --- | --- | --- |
| `OPENAI_API_KEY` | Yes | API key used by the OpenAI client to generate post drafts. |
| `PORT` | No | HTTP port for the Express server. Defaults to `3000`. |

The generation model is currently set in `src/services/ai.service.js`. Update it there only after verifying that the chosen model is available to the configured API key.

## Security

- Keep `.env` private. It is ignored by Git and must never contain a committed API key.
- The application does not currently implement authentication or authorization. Do not expose it to the public internet without adding access controls.
- CORS is currently enabled for all origins. Restrict it to approved origins before deployment.
- The SQLite database can contain generated content and workflow history; protect the `data/` directory and back it up according to your retention policy.
- Review generated content before publishing. Approval currently changes local workflow state only and does not publish to LinkedIn.

## How to Contribute?

1. Create a branch for a focused change.
2. Keep changes consistent with the existing Express, service, and repository separation.
3. Test the affected API and frontend behavior locally.
4. Update this README when behavior, setup, or configuration changes.
5. Open a pull request that explains the user-visible change and validation performed.

## What's Next?

- Implement a LinkedIn API client and publishing workflow for approved posts.
- Add authentication and role-based reviewer access.
- Restrict CORS for deployed environments.
- Add automated tests for routes, repository operations, and duplicate detection.
- Add request validation, rate limiting, and structured logging.

## License

This project is currently declared under the ISC license in `package.json`. Add a repository `LICENSE` file before distributing the project externally.

## Acknowledgements

- [OpenAI](https://openai.com/) for the AI platform used to generate draft content.
- [Express](https://expressjs.com/) for the web application framework.
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) for SQLite access.

## Author

Jack Sawyer for Syntronic Labs.