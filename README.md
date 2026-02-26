# Sendbird UIKit React Example

A simple chat application built with [Sendbird UIKit for React](https://sendbird.com/docs/chat/uikit/v3/react/overview) and Vite.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm

## Getting Started

### 1. Install dependencies

```bash
cd uikit-react-example
npm install
```

### 2. Configure Sendbird credentials

In `src/App.tsx`, update the following props on the `<SendbirdApp />` component with your credentials:

```tsx
<SendbirdApp
  appId="YOUR_APP_ID"
  userId="YOUR_USER_ID"
  accessToken="YOUR_ACCESS_TOKEN"
/>
```

You can find your `appId` in the [Sendbird Dashboard](https://dashboard.sendbird.com).

### 3. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

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
