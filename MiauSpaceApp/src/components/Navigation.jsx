import usuario_ from '../assets/usuario_.png'
import salir from '../assets/salir.png'
import amigos from '../assets/amigos.png'
import inicio from '../assets/inicio.png'
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom"; // Para la navegación en React

export const Navigation = () => {
    return (
        <div className="col-lg-2 col-md-3 d-none d-md-flex flex-column justify-content-start list">
            <Navbar bg="light" expand="md" className="flex-column align-items-start mt-5 p-3">
                <Nav className="flex-column w-100">
                    <Nav.Link as={Link} to="/MiauSpace/Home" className="d-flex align-items-center py-3">
                        <img src={inicio} className="me-3" alt="Inicio" width="30" />
                        Inicio
                    </Nav.Link>
                    <Nav.Link as={Link} to="/MiauSpace/Perfil" className="d-flex align-items-center py-3">
                        <img src={usuario_} className="me-3" alt="Perfil" width="30" />
                        Perfil
                    </Nav.Link>
                    <Nav.Link as={Link} to="/MiauSpace/Amigos" className="d-flex align-items-center py-3">
                        <img src={amigos} className="me-3" alt="Amigos" width="30" />
                        Amigos
                    </Nav.Link>
                </Nav>
                <hr className="w-100" />
                <Nav className="flex-column w-100">
                    <Nav.Link as={Link} to="/logout" className="d-flex align-items-center py-3 text-danger">
                        <img src={salir} className="me-3" alt="Cerrar sesión" width="30" />
                        Cerrar sesión
                    </Nav.Link>
                </Nav>
            </Navbar>
        </div>

    );
};