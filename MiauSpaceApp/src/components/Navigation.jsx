import { Navbar, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { FaPaw, FaBone, FaSignOutAlt } from 'react-icons/fa';
import { GiDogHouse } from 'react-icons/gi';

import './css/Navigation.css';
import axiosInstance from '../services/axiosInstace';

export const Navigation = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const user = JSON.parse(sessionStorage.getItem("usuario"));
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await axiosInstance.post(
                `${API_URL}/mascotas/logout/`,
                {},
                { withCredentials: true }
            );

            if (response.status === 200) {
                sessionStorage.removeItem("sessionid");
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
        { to: "/MiauSpace/Home", icon: <GiDogHouse />, text: "Inicio" },
        { to: `/MiauSpace/Perfil/${user.nombre_usuario}`, icon: <FaBone />, text: "Perfil" },
        { to: "/MiauSpace/Amigos", icon: <FaPaw />, text: "Amigos" },
    ];

    return (
        <div className="col-lg-2 col-md-3 d-none d-md-flex flex-column justify-content-start list columnColor ">
            <Navbar expand="md" className="flex-column align-items-start mt-5 p-3">
                <Nav className="flex-column w-100 align-items-center">
                    {navLinks.map((link, index) => (
                        <Nav.Link
                            key={index}
                            as={Link}
                            to={link.to}    
                            className="align-middle align-items-center p-3 navigation-navBar opciones"
                        >
                            <div className='col'>
                                <span className="align-middle align-items-center p-2 py-1 ">{link.icon}</span>
                                <span className="align-middle align-items-center p-2 py-1">{link.text}</span>
                            </div>
                        </Nav.Link>
                    ))}
                </Nav>
                <hr className="cerrardiv p-4 w-100" />
                <Nav className="flex-column w-100 align-items-center">
                    <Nav.Link onClick={handleLogout} className="d-flex align-items-center p-4 align-middle py-3 text navigation-navBar logout">
                        <div className='col align-middle align-items-center'>
                        <span className="align-middle align-items-center space"><FaSignOutAlt/></span>
                            <span className="align-middle align-items-center">Cerrar sesión</span>
                        </div>
                    </Nav.Link>
                </Nav>
            </Navbar>
        </div>
    );
};
