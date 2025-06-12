import React from 'react';
import ReactDOM from 'react-dom/client'; // Import dari 'react-dom/client'
import App from './App'; // Sesuaikan jalur impor jika App.jsx berada di direktori yang berbeda
import './index.css'; // Impor file CSS

// Temukan elemen root di HTML Anda (biasanya <div id="root">)
const rootElement = document.getElementById('root');

// Buat root React dan render aplikasi Anda ke dalamnya
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
