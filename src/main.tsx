import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import PreviewFrame from './preview/PreviewFrame.tsx';
import './index.css';

// Ensure Google OAuth works seamlessly by routing 127.0.0.1 to localhost
if (typeof window !== 'undefined' && window.location.hostname === '127.0.0.1') {
  window.location.hostname = 'localhost';
}

const isPreviewFrame =
  typeof window !== 'undefined' &&
  (window.location.pathname === '/preview-frame' || window.location.search.includes('preview=frame'));

const rootElement = document.getElementById('root')!;

if (isPreviewFrame) {
  createRoot(rootElement).render(<PreviewFrame />);
} else {
  createRoot(rootElement).render(<App />);
}

