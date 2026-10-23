import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure Google OAuth works seamlessly by routing 127.0.0.1 to localhost
if (typeof window !== 'undefined' && window.location.hostname === '127.0.0.1') {
  window.location.hostname = 'localhost';
}

createRoot(document.getElementById('root')!).render(<App />);
