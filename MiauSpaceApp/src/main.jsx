import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Login } from './screens/Login.jsx';
import { Pagina404 } from './screens/404.jsx';
import { Home } from './screens/Home.jsx';
import { Perfil } from './screens/Perfil.jsx';
import { Amigos } from './screens/Amigos.jsx';

const isAuthenticated = () => {
    return sessionStorage.getItem("sessionid") !== null;
};

const ProtectedRoute = ({ element }) => {
    return isAuthenticated() ? element : <Navigate to="/" replace />;
};

const RedirectIfAuthenticated = ({ element }) => {
  return isAuthenticated() ? <Navigate to="/MiauSpace/Home" replace /> : element;
};


ReactDOM.createRoot(document.getElementById('root')).render(
    <Router>
        <Routes>
            <Route path='/' element={<RedirectIfAuthenticated element={<Login />} />} />
            <Route path='/MiauSpace/' element={<RedirectIfAuthenticated element={<Login />} />} />
            <Route path='/MiauSpace/Home' element={<ProtectedRoute element={<Home />} />} />
            <Route path="/MiauSpace/Perfil/:username" element={<ProtectedRoute element={<Perfil />} />} />
            <Route path='/MiauSpace/Amigos' element={<ProtectedRoute element={<Amigos />} />} />
            <Route path='/404' element={<Pagina404 />} />
            <Route path='/*' element={<Pagina404 />} />
        </Routes>
    </Router>
);