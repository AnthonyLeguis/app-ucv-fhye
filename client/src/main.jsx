import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.jsx'
import './CSS/login.css'
import { HashRouter } from 'react-router-dom'
import { AuthProvider } from './hooks/AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <HashRouter>
    <React.StrictMode>
      <AuthProvider>
      <App />
      </AuthProvider>
    </React.StrictMode>
  </HashRouter>,
)
