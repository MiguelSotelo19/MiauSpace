import usuario_ from '../assets/usuario_.png';
import salir from '../assets/salir.png';
import amigos from '../assets/amigos.png';
import inicio from '../assets/inicio.png';
import { Navbar, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useEffect } from "react";

import './css/Navigation.css';

export const Navigation = () => {
    const user = JSON.parse(sessionStorage.getItem("usuario"));
    const navigate = useNavigate();
    let linkPerfil = "/MiauSpace/Perfil/" + user.nombre_usuario

    const handleLogout = async () => {
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/mascotas/logout/",
                {},
                { withCredentials: true }
            );

            if (response.status === 200) {
                sessionStorage.removeItem("sessionid");
                localStorage.removeItem("username")
                sessionStorage.removeItem("usuario")
                localStorage.removeItem("usuario")

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

    const navLinks = [
        { to: "/MiauSpace/Home", icon: inicio, text: "Inicio" },
        { to: `/MiauSpace/Perfil/${user.nombre_usuario}`, icon: usuario_, text: "Perfil" },
        { to: "/MiauSpace/Amigos", icon: amigos, text: "Amigos" },
    ];

    return (
        <div className="col-lg-2 col-md-3 d-none d-md-flex flex-column justify-content-start list columnColor">
            <Navbar expand="md" className="flex-column align-items-start mt-5 p-3">
                <Nav className="flex-column w-100">
                    {navLinks.map((link, index) => (
                        <Nav.Link 
                            key={index}
                            as={Link}
                            to={link.to}
                            className="d-flex align-items-center py-3 navigation-navBar opciones"
                        >
                            <img src={link.icon} className="me-3 icon" alt={link.text} />
                            {link.text}
                        </Nav.Link>
                    ))}
                </Nav>
                <hr className="cerrardiv p-3 w-100" />
                <Nav className="flex-column w-100">
                    <Nav.Link onClick={handleLogout} className="d-flex align-items-center py-3 text navigation-navBar logout">
                        <img src={salir} className="me-3" alt="Cerrar sesión" width="30" />
                        Cerrar sesión
                    </Nav.Link>
                </Nav>
            </Navbar>
        </div>
    );
};