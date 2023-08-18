import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

const element = document.getElementById('root')!;
ReactDOM.createRoot(element).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
