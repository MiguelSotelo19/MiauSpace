import usuario_ from '../assets/usuario_.png';
import salir from '../assets/salir.png';
import amigos from '../assets/amigos.png';
import inicio from '../assets/inicio.png';
import { Navbar, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import './css/Navigation.css';

export const Navigation = () => {
    const navigate = useNavigate();
    let username = localStorage.getItem("username");
    let linkPerfil = "/MiauSpace/Perfil/"+username
    const handleLogout = async () => {
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/mascotas/logout/",
                {},
                { withCredentials: true }
            );
    
            if (response.status === 200) {
                sessionStorage.removeItem("sessionid");
    
                Swal.fire({
                    icon: "success",
                    title: "Sesión cerrada",
                    text: "Has cerrado sesión correctamente.",
                    timer: 2000,
                    showConfirmButton: false,
                }).then(() => {
                    navigate("/"); 
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo cerrar sesión. Inténtalo de nuevo.",
            });
        }
    };
    
    return (
        <div className="col-lg-2 col-md-3 d-none d-md-flex flex-column justify-content-start list">
            <Navbar expand="md" className="flex-column align-items-start mt-5 p-3">
                <Nav className="flex-column w-100">
                    <Nav.Link as={Link} to="/MiauSpace/Home" className="d-flex align-items-center py-3 navBar">
                        <img src={inicio} className="me-3" alt="Inicio" width="30" />
                        Inicio
                    </Nav.Link>
                    <Nav.Link as={Link} to={`/MiauSpace/Perfil/${username}`} className="d-flex align-items-center py-3 navBar">
                        <img src={usuario_} className="me-3" alt="Perfil" width="30" />
                        Perfil
                    </Nav.Link>
                    <Nav.Link as={Link} to="/MiauSpace/Amigos" className="d-flex align-items-center py-3 navBar">
                        <img src={amigos} className="me-3" alt="Amigos" width="30" />
                        Amigos
                    </Nav.Link>
                </Nav>
                <hr className="w-100" />
                <Nav className="flex-column w-100">
                    <Nav.Link onClick={handleLogout} className="d-flex align-items-center py-3 text-danger navBar logout">
                        <img src={salir} className="me-3" alt="Cerrar sesión" width="30" />
                        Cerrar sesión
                    </Nav.Link>
                </Nav>
            </Navbar>
        </div>
    );
};
