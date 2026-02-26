import { App as SendbirdApp } from '@sendbird/uikit-react';
import '@sendbird/uikit-react/dist/index.css';

function App() {
  return (
    
    <div style={{ width:'100vw', height:'100vh' }}>
      {/* 
        This super smart component serves as a drop-in chat solution
        
        For advanced 🚀 customizations, use SendbirdProvider:
        https://sendbird.com/docs/chat/uikit/v3/react/essentials/sendbirdprovider
      */}
      <SendbirdApp
        appId={import.meta.env.VITE_SENDBIRD_APP_ID}
        userId={import.meta.env.VITE_SENDBIRD_USER_ID}
        accessToken={import.meta.env.VITE_SENDBIRD_ACCESS_TOKEN}
      />
    </div>
  )
}

export default App;