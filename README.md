# Sendbird UIKit React Example

A chat application built with [Sendbird UIKit for React](https://sendbird.com/docs/chat/uikit/v3/react/overview) and Vite that demonstrates webhook-driven notifications.

## Features

- **Profanity filter** — browser notification when a message triggers the profanity filter, showing the censored text
- **Channel create** — browser notification with a Tolkien quote when a new group channel is created
- **Message notifications** — in-app toast notification when another user sends a message

All notifications are pushed in real time from the backend via SSE (Server-Sent Events).

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm
- The [sendbird-backend](https://github.com/mshnjffr/sendbird-backend) server running locally or deployed

## Getting Started

### 1. Install dependencies

```bash
cd uikit-react-example
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Update `.env` with your values:

```env
VITE_SENDBIRD_APP_ID=your_app_id_here
VITE_BACKEND_URL=http://localhost:3000
```

You can find your `appId` in the [Sendbird Dashboard](https://dashboard.sendbird.com).

### 3. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`. Enter any user ID on the login screen to connect.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

## Tech Stack

- [React 19](https://react.dev/)
- [Sendbird UIKit React v3](https://sendbird.com/docs/chat/uikit/v3/react/overview)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
