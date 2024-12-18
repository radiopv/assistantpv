import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import './index.css'
import emailjs from '@emailjs/browser';

// Initialize EmailJS with public key
const emailjsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
if (!emailjsPublicKey) {
  console.error('EmailJS public key is missing. Please check your .env file.');
} else {
  emailjs.init(emailjsPublicKey);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)