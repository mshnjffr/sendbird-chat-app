/**
 * Application entry point.
 * Mounts the React app into the #root element in index.html.
 */
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <App />
)
