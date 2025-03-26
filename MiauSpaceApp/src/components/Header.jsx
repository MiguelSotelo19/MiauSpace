import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import './css/Header.css';

export const Header = ({ usuario }) => {
    return (
        <header className="header">
            <div className="header-container">
                <div className="logo-container">
                    <img src={logo} className="logo-img" alt="logo.jpg" />
                    <h1 className="logo-text">MiauSpace</h1>
                </div>

                {/* Enlace al perfil del usuario */}
                <Link to={`/MiauSpace/Perfil/${usuario.nombre_usuario}`} className="profile-link">
                    <div className="profile-container">
                        <img src={usuario.foto_perfil} className="profile-img" alt="perfil.jpg" />
                        <p className="profile-username">{usuario.nombre_usuario}</p>
                    </div>
                </Link>
            </div>
        </header>
    );
};