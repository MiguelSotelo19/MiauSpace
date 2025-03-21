import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'

export const Header  = ({ usuario }) => {

    return(
        <>
            <header className="ps-5 pe-5" style={{ borderBottom: '1px solid gray', height: '80px' }}>
                <div className="d-flex align-items-center justify-content-between p-2">
                    <div className="d-flex align-items-center justify-content-center">
                        <img src={logo} className="me-3" style={{ width: '35px', height: '35px' }} alt="logo.jpg" />
                        <p className="logo">MiauSpace</p>
                    </div>
                    <Link to={`/MiauSpace/Perfil/${usuario.nombre_usuario}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="d-flex align-items-center justify-content-center">
                            <img src={usuario.foto_perfil} className="me-3" style={{ width: '35px', height: '35px' }} alt="perfil.jpg" />
                            <p>{usuario.nombre_usuario}</p>
                        </div>
                    </Link>
                </div>
            </header>
        </>
    );
}