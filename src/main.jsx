import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Pastikan ekstensi .jsx
import './index.css';

const rootElement = document.getElementById('root');

// Pastikan root element ditemukan sebelum merender
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('Elemen HTML dengan id "root" tidak ditemukan.');
}
