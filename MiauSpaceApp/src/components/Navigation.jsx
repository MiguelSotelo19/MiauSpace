import usuario_ from '../assets/usuario_.png'
import salir from '../assets/salir.png'
import amigos from '../assets/amigos.png'
import inicio from '../assets/inicio.png'

export const Navigation = () => {
    return(
        <>
        <div className="col-lg-2 col-md-3 d-none d-md-flex flex-column justify-content-start list">
            <ul className="list-group mt-5 me-3">
                <li className="list-group-item pt-3 pb-3">
                    <img src={inicio} className="me-3 w-20" alt="logo.jpg"/>
                    Inicio
                </li>
                <li className="list-group-item pt-3 pb-3">
                    <img src={usuario_} className="me-3 w-20" alt="logo.jpg"/>
                    Perfil
                </li>
                <li className="list-group-item pt-3 pb-3">
                    <img src={amigos} className="me-3 w-20" alt="logo.jpg"/>
                    Amigos
                </li>
            </ul>
            <hr />
            <ul className="list-group">
                <li className="list-group-item pt-3 pb-3">
                    <img src={salir} className="me-3 w-20" alt="logo.jpg"/>
                    Cerrar sesión
                </li>
            </ul>
        </div>
        </>
    );
}