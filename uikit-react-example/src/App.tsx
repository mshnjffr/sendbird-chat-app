import { App as SendbirdApp } from '@sendbird/uikit-react';
import '@sendbird/uikit-react/dist/index.css';
import useNotifications from './hooks/useNotifications';

function App() {
  useNotifications();

  return (
    <div style={{ width:'100vw', height:'100vh' }}>
      <SendbirdApp
        appId={import.meta.env.VITE_SENDBIRD_APP_ID}
        userId={import.meta.env.VITE_SENDBIRD_USER_ID}
        accessToken={import.meta.env.VITE_SENDBIRD_ACCESS_TOKEN}
      />
    </div>
  )
}

export default App;