import { useState } from 'react';
import { App as SendbirdApp } from '@sendbird/uikit-react';
import '@sendbird/uikit-react/dist/index.css';
import useNotifications from './hooks/useNotifications';

function Login({ onLogin }: { onLogin: (userId: string) => void }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userId = input.trim();
    if (userId) onLogin(userId);
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100vw',
      height: '100vh',
      background: '#f0f2f5',
    }}>
      <form onSubmit={handleSubmit} style={{
        background: '#fff',
        padding: '2.5rem',
        borderRadius: '12px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        minWidth: '300px',
      }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#1a1a1a' }}>Sign in to Chat</h2>
        <input
          autoFocus
          type="text"
          placeholder="Enter your user ID"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            padding: '0.65rem 0.9rem',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '0.95rem',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={!input.trim()}
          style={{
            padding: '0.65rem',
            background: '#742ddd',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.95rem',
            cursor: input.trim() ? 'pointer' : 'not-allowed',
            opacity: input.trim() ? 1 : 0.5,
          }}
        >
          Enter
        </button>
      </form>
    </div>
  );
}

function Chat({ userId }: { userId: string }) {
  useNotifications(userId);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <SendbirdApp
        appId={import.meta.env.VITE_SENDBIRD_APP_ID}
        userId={userId}
      />
    </div>
  );
}

function App() {
  const [userId, setUserId] = useState<string | null>(null);

  if (!userId) return <Login onLogin={setUserId} />;
  return <Chat userId={userId} />;
}

export default App;
