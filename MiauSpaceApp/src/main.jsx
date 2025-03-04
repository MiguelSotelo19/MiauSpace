import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Login } from './screens/Login.jsx'
import { Pagina404 } from './screens/404.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path='/MiauSpace/' element={<Login />} />
      <Route path='/404' element={<Pagina404 />} />
      <Route path='/*' element={<Pagina404 />} />
    </Routes>
  </Router>
)
