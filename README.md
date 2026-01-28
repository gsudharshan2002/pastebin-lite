**Here’s the exact code you can paste into your `README.md` file in the project root.**  

# Pastebin Lite

A simple Pastebin-like application that allows users to create text pastes and share a link to view them.  
Pastes can optionally expire after a given time (TTL) or after a maximum number of views.

This project was built as a take-home assignment.

---

## Features

- Create a paste with arbitrary text
- Generate a shareable URL
- View a paste via the shared link
- Optional time-based expiry (TTL)
- Optional view-count limit
- Deterministic expiry testing support
- Persistent storage for serverless deployment

---

## Tech Stack

- **Next.js (App Router)**
- **TypeScript**
- **Node.js**
- **Upstash Redis** (persistence layer)
- **Tailwind CSS**

---

## Running the Project Locally

### Prerequisites
- Node.js (v18 or later)
- npm
- Upstash Redis account

### Installation

```bash
npm install
```

Create a `.env.local` file in the project root:

```
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
NEXT_PUBLIC_BASE_URL=http://localhost:3000
TEST_MODE=0
```

Start the development server:

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## API Endpoints

### Health Check
**GET** `/api/healthz`

Response:
```json
{ "ok": true }
```

### Create a Paste
**POST** `/api/pastes`

Request Body:
```json
{
  "content": "string",
  "ttl_seconds": 60,
  "max_views": 5
}
```

Response:
```json
{
  "id": "string",
  "url": "https://your-app.vercel.app/p/id"
}
```

### Fetch a Paste (API)
**GET** `/api/pastes/:id`

Response:
```json
{
  "content": "string",
  "remaining_views": 4,
  "expires_at": "2026-01-01T00:00:00.000Z"
}
```

- Each successful fetch counts as a view  
- Returns **404** if expired, view limit exceeded, or missing

### View a Paste (HTML)
**GET** `/p/:id`

- Renders paste content as HTML  
- Returns **404** if unavailable  
- Paste content is rendered safely (no script execution)

---

## Deterministic Time Testing

If the environment variable `TEST_MODE=1` is set, the request header:

```
x-test-now-ms: <milliseconds since epoch>
```

is used as the current time for expiry logic.  
If the header is absent, system time is used.

---

## Persistence Layer

The application uses **Upstash Redis** as a persistence layer.  
This ensures data survives across requests in a serverless environment such as Vercel.

---

## Design Decisions

- TTL and view limits are enforced lazily on access to avoid background jobs.  
- Redis is used for atomic updates and persistence.  
- The UI is intentionally simple, focusing on functionality rather than styling.  
- All unavailable pastes consistently return HTTP 404 as required.

---

## Deployment

- The application is deployed on **Vercel**.  
- Environment variables are configured in the Vercel dashboard.

---

## Notes

- No secrets or credentials are committed to the repository.  
- No in-memory storage is used for persistence.  
- The project installs and runs using standard npm commands.
```

✅ Copy this entire block into your `README.md` file, and you’ll have the exact documentation you requested. Would you like me to also add **badges** (like build status, license, or deployment link) to make the README more polished?
