import { Header } from "../components/Header";
import { Navigation } from "../components/Navigation";
import { SideColumn } from "../components/SideColumn";
import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstace";

export const Layout = ({ children }) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const urlUser = `${API_URL}/mascotas/api/`;
    const user = JSON.parse(sessionStorage.getItem("usuario"));
    const [usuario, setUsuario] = useState([]);
    useEffect(() => {
        getUsers();
    }, []);
    const getUsers = async () => {
        try {
            const respuesta = await axiosInstance.get(urlUser);
            setUsuario(respuesta.data.find(u => u.nombre_usuario === user.nombre_usuario));
        } catch (error) {
            console.error("Error al obtener datos del usuario", error);
        }
    };
    return (
        <div className="container-fluid principalDos">
            <Header usuario={usuario} />
            <div className="row m-0">
                <Navigation />
                <div className="col-lg-7 col-md-8 col-12 offset-lg-2 offset-md-3 pt-2">
                    {children}
                </div>
                <SideColumn />
            </div>
        </div>
    );
};