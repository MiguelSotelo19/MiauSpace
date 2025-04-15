import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import React from 'react';
import { Login } from '../screens/Login.jsx';
import { Pagina404 } from '../screens/404.jsx';
import { Home } from '../screens/Home.jsx';
import { Perfil } from '../screens/Perfil.jsx';
import { Amigos } from '../screens/Amigos.jsx';
import { Registro } from '../screens/Registro.jsx';
import { EnviarCodigo } from '../screens/EnviarCodigo.jsx'
import { RestablecerContrasena } from '../screens/RestablecerContrasena.jsx'

const isAuthenticated = () => {
    return sessionStorage.getItem("usuario") !== null;
};

const ProtectedRoute = ({ element }) => {
    return isAuthenticated() ? element : <Navigate to="/" replace />;
};

const RedirectIfAuthenticated = ({ element }) => {
    return isAuthenticated() ? <Navigate to="/MiauSpace/Home" replace /> : element;
};
const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<RedirectIfAuthenticated element={<Login />} />} />
                <Route path='/MiauSpace/' element={<RedirectIfAuthenticated element={<Login />} />} />
                <Route path='/EnviarCodigo/' element={<RedirectIfAuthenticated element={<EnviarCodigo />} />} />
                <Route path="/recuperar-contraseña/:uid/:token" element={<RestablecerContrasena />} />
                <Route path='/MiauSpace/Home' element={<ProtectedRoute element={<Home />} />} />
                <Route path='/MiauSpace/Perfil/:username' element={<ProtectedRoute element={<Perfil />} />} />
                <Route path='/MiauSpace/Amigos' element={<ProtectedRoute element={<Amigos />} />} />
                <Route path='/Registro/' element={<Registro />} />
                <Route path='/404' element={<Pagina404 />} />
                <Route path='/*' element={<Pagina404 />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
