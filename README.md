# URL Shortener API

A RESTful URL shortener built with Node.js, Express, Prisma, and PostgreSQL. It converts long HTTP or HTTPS URLs into short codes, tracks redirect clicks, and redirects visitors to the original URL.

## Features

- Create short URLs from valid HTTP and HTTPS links
- Generate collision-resistant seven-character short codes with Nano ID
- Redirect short URLs with HTTP 302 responses
- Track the number of times each short URL is opened
- Validate incoming URLs
- Return JSON responses for API and error cases
- Include security headers and request logging

## Tech Stack

- Node.js with ES modules
- Express 5
- Prisma ORM
- PostgreSQL
- Zod for environment validation
- Nano ID for short codes
- Vitest and Supertest for testing
- Helmet, CORS, and Morgan

## Project Structure

```text
src/
  app.js                    Express app configuration
  server.js                 HTTP server entry point
  config/env.js             Environment variable validation
  controllers/              HTTP request handlers
  middleware/               URL validation and error handling
  routes/                   API routes
  services/                 Database and URL operations
  tests/                    API tests
prisma/
  schema.prisma             Database schema
  migrations/               Database migrations
```

## Prerequisites

- Node.js 18 or newer
- npm
- A running PostgreSQL database

## Installation

1. Clone the repository and enter the project directory:

   ```bash
   git clone https://github.com/joyantaghosh/CodeAlpha_Simple_URL_Shortener.git
   ```
   ```bash
   cd url_shortner
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create an environment file:

   ```bash
   cp .env.example .env
   ```

   On Windows Command Prompt, use:

   ```cmd
   copy .env.example .env
   ```

4. Configure the variables in `.env`.

## Environment Variables

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `DATABASE_URL` | Yes | - | PostgreSQL connection string |
| `BASE_URL` | Yes | - | Public base URL used to build shortened links |
| `PORT` | No | `5000` | Port for the API server |
| `FRONTEND_URL` | No | `http://localhost:3000` | Allowed CORS origin |
| `NODE_ENV` | No | `development` | `development`, `production`, or `test` |

## Database Setup

Generate the Prisma client and apply the existing migration:

```bash
npx prisma generate
```
```bash
npx prisma migrate deploy
```

For local development, you can create and apply new migrations with:

```bash
npx prisma migrate dev
```

## Running the Application

Development mode with automatic restart:

```bash
npm run dev
```

Production-style start:

```bash
npm start
```

The API is available at `http://localhost:5000` by default.

## API

### Welcome

```http
GET /
```

Example response:

```json
{
  "message": "Welcome to the URL Shortener API",
  "version": "1.0.0"
}
```

### Create a Short URL

```http
POST /shorten
Content-Type: application/json

{
  "originalUrl": "https://example.com"
}
```

Example response:

```json
{
  "success": true,
  "message": "Short URL created successfully",
  "data": {
    "originalUrl": "https://example.com/",
    "shortCode": "abc1234",
    "shortUrl": "http://localhost:5000/abc1234"
  }
}
```

Status codes:

- `201 Created` - URL shortened successfully
- `400 Bad Request` - Missing or invalid URL
- `500 Internal Server Error` - Server or database failure

### Redirect to the Original URL

```http
GET /:shortCode
```

A valid short code returns `302 Found` and increments the stored click count before redirecting. An unknown code returns:

```json
{
  "success": false,
  "message": "Short URL not found"
}
```

Status code: `404 Not Found`

## Testing

Run the test suite once:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

The tests cover invalid URLs, URL creation, successful redirects, and missing short URLs.
