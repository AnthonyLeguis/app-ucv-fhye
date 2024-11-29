import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './hooks/AuthContext.jsx'
import './CSS/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <React.StrictMode>
      <AuthProvider>
      <App />
      </AuthProvider>
    </React.StrictMode>
  </BrowserRouter>,
)
