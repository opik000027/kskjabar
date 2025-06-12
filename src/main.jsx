    import React from 'react';
    import ReactDOM from 'react-dom/client';
    import AppWrapper from './App.jsx'; // Mengimpor AppWrapper dari App.jsx
    import './index.css'; // Pastikan file ini ada di src/index.css

    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <AppWrapper />
      </React.StrictMode>,
    );
    
