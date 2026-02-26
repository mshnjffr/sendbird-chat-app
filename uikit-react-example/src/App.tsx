import { useState, useCallback, useEffect } from 'react';
import { App as SendbirdApp } from '@sendbird/uikit-react';
import '@sendbird/uikit-react/dist/index.css';
import useNotifications from './hooks/useNotifications';
import type { MessageSendEvent } from './hooks/useNotifications';

// ─── Login ────────────────────────────────────────────────────────────────────

function Login({ onLogin }: { onLogin: (userId: string) => void }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userId = input.trim();
    if (userId) onLogin(userId);
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: '100vw', height: '100vh', background: '#f0f2f5',
    }}>
      <form onSubmit={handleSubmit} style={{
        background: '#fff', padding: '2.5rem', borderRadius: '12px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
        display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '300px',
      }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#1a1a1a' }}>Sign in to Chat</h2>
        <input
          autoFocus type="text" placeholder="Enter your user ID"
          value={input} onChange={(e) => setInput(e.target.value)}
          style={{
            padding: '0.65rem 0.9rem', border: '1px solid #d1d5db',
            borderRadius: '8px', fontSize: '0.95rem', outline: 'none',
          }}
        />
        <button type="submit" disabled={!input.trim()} style={{
          padding: '0.65rem', background: '#742ddd', color: '#fff',
          border: 'none', borderRadius: '8px', fontSize: '0.95rem',
          cursor: input.trim() ? 'pointer' : 'not-allowed',
          opacity: input.trim() ? 1 : 0.5,
        }}>
          Enter
        </button>
      </form>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

interface Toast extends MessageSendEvent {
  id: number;
  exiting: boolean;
}

const TOAST_DURATION = 4000;
const TOAST_EXIT_DURATION = 300;

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
  return (
    <div
      onClick={() => onDismiss(toast.id)}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
        background: '#1a1a1a', color: '#fff',
        padding: '0.85rem 1rem', borderRadius: '10px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
        cursor: 'pointer', minWidth: '280px', maxWidth: '340px',
        opacity: toast.exiting ? 0 : 1,
        transform: toast.exiting ? 'translateX(20px)' : 'translateX(0)',
        transition: `opacity ${TOAST_EXIT_DURATION}ms ease, transform ${TOAST_EXIT_DURATION}ms ease`,
      }}
    >
      <div style={{
        width: '36px', height: '36px', borderRadius: '8px',
        background: '#742ddd', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '1rem', flexShrink: 0,
      }}>
        💬
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
        <span style={{ fontSize: '0.72rem', color: '#a0a0a0', fontWeight: 500 }}>
          {toast.channelName}
        </span>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
          {toast.senderNickname || toast.senderId}
        </span>
        <span style={{
          fontSize: '0.82rem', color: '#d0d0d0',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {toast.message}
        </span>
      </div>
    </div>
  );
}

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  return (
    <div style={{
      position: 'fixed', top: '1.5rem', right: '1.5rem',
      display: 'flex', flexDirection: 'column', gap: '0.6rem',
      zIndex: 9999, pointerEvents: 'none',
    }}>
      {toasts.map((t) => (
        <div key={t.id} style={{ pointerEvents: 'auto' }}>
          <ToastItem toast={t} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

let toastIdCounter = 0;

function Chat({ userId }: { userId: string }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, TOAST_EXIT_DURATION);
  }, []);

  const addToast = useCallback((event: MessageSendEvent) => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { ...event, id, exiting: false }]);
    setTimeout(() => dismiss(id), TOAST_DURATION);
  }, [dismiss]);

  useNotifications(userId, addToast);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <SendbirdApp
        appId={import.meta.env.VITE_SENDBIRD_APP_ID}
        userId={userId}
      />
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

function App() {
  const [userId, setUserId] = useState<string | null>(null);

  if (!userId) return <Login onLogin={setUserId} />;
  return <Chat userId={userId} />;
}

export default App;
