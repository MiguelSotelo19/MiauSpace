import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import banner from "../assets/banner_mascotas.jpg";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useEffect } from "react";


export const Login = () => {
    let urlUser="http://127.0.0.1:8000/mascotas/api/";
    const navigate = useNavigate();
    const [nombre_usuario, setNombreUsuario] = useState("");
    const [password, setPassword] = useState("");

    const isAuthenticated = () => {
        return !!sessionStorage.getItem("usuario_id"); 
    };
    
    const getUsers = async (nombre_usuario) => {
        const respuesta = (await axios({
            method: 'GET',
            url: urlUser 
        })).data;
        
        for (let i = 0; i < respuesta.length; i++) {  
            const element = respuesta[i];
            if (element.nombre_usuario == nombre_usuario) {
                console.log("Entro a if",element)
                return element
            }
        }
    }

    useEffect(() => {
        if (isAuthenticated()) {
            navigate("/MiauSpace/Home", { replace: true });
        }
    }, []);

    const handleLogin = async () => {
        if (!nombre_usuario || !password) {
            Swal.fire({
                icon: "warning",
                title: "Campos vacíos",
                text: "Por favor, ingresa tu usuario y contraseña.",
            });
            return;
        }
    
        try {
            const response = await axios.post("http://127.0.0.1:8000/mascotas/login/", {
                "nombre_usuario": nombre_usuario,
                "password": password,
            });
    
            if (response.status === 200) {
                // Guardar solo el sessionid en sessionStorage
                sessionStorage.setItem("sessionid", response.data.sessionid);
                
                const usuario = await getUsers(nombre_usuario);

                if (usuario) {
                    localStorage.setItem("usuario", JSON.stringify(usuario));
                }

                localStorage.setItem("username", nombre_usuario);
                sessionStorage.setItem("usuario", JSON.stringify(usuario));
    
                Swal.fire({
                    icon: "success",
                    title: "Inicio de sesión exitoso",
                    text: "Bienvenido a MiauSpace 🐱",
                    timer: 2000,
                    showConfirmButton: false,
                }).then(() => {
                    navigate("/MiauSpace/Home");
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error en el inicio de sesión",
                text: "Usuario o contraseña incorrectos.",
            });
        }
    };
    
    return (
        <div className="d-flex vh-100">
            <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                <div className="card p-4 w-50 d-flex flex-column">
                    <div className="card-body d-flex flex-column align-items-center justify-content-center gap-3" style={{ flex: "1 0 auto" }}>
                        <h2 className="card-title mb-3">MiauSpace</h2>
                        <label className="w-100">
                            Usuario:
                            <input
                                type="text"
                                className="form-control mt-1"
                                placeholder="Ingresa tu usuario"
                                value={nombre_usuario}
                                onChange={(e) => setNombreUsuario(e.target.value)}
                            />
                        </label>
                        <label className="w-100 mt-4">
                            Contraseña:
                            <input
                                type="password"
                                className="form-control mt-1"
                                placeholder="Ingresa tu contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </label>
                        <button className="btn btn-primary w-100" onClick={handleLogin}>
                            Iniciar Sesión
                        </button>
                    </div>

                    <div className="mt-4 text-center">
                        ¿No tienes una cuenta? <a href="/Registro/">¡Regístrate aquí!</a>
                    </div>
                </div>
            </div>

            <div className="flex-shrink-0" style={{ width: "30%" }}>
                <img src={banner} className="w-100 h-100" style={{ objectFit: "cover" }} />
            </div>
        </div>
    );
};

