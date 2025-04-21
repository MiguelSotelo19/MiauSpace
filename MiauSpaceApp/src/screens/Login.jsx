import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import banner from "../assets/banner_mascotas.jpg";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect } from "react";
import perfilGenerico from "../assets/perfilGenerico.jpg";
import { login } from "../services/authService";
import axiosInstance from "../services/axiosInstace";

export const Login = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    let urlUser = `${API_URL}/mascotas/api/`;
    const navigate = useNavigate();
    const [nombre_usuario, setNombreUsuario] = useState("");
    const [password, setPassword] = useState("");

    const isAuthenticated = () => {
        return !!sessionStorage.getItem("usuario_id");
    };

    useEffect(() => {
        if (isAuthenticated()) {
            navigate("/MiauSpace/Home", { replace: true });
        }
    }, []);

    const getUsers = async (nombre_usuario) => {
        let usuarioEncontrado = false;

        await axiosInstance
            .get(urlUser)
            .then((response) => {
                const respuesta = response.data;
                for (let i = 0; i < respuesta.length; i++) {
                    const element = respuesta[i];
                    if (element.nombre_usuario === nombre_usuario) {
                        usuarioEncontrado = true;
                        localStorage.setItem("username", nombre_usuario);
                        sessionStorage.setItem("usuario", JSON.stringify(element));
                        break;
                    }
                }

                if (!usuarioEncontrado) {
                    Swal.fire({
                        icon: "error",
                        title: "No se encontró usuario",
                        text: "El usuario ingresado no está registrado.",
                    });
                }
            })
            .catch((error) => {
                console.error("Error al obtener usuarios", error);
            });

        return usuarioEncontrado;
    };


    const validatePassword = (password) => {
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{5,}$/;
        return regex.test(password);
    };

    const validateUsername = (username) => {
        const regex = /^[a-zA-Z]+$/;
        return regex.test(username);
    };

    const handleLogin = async () => {
        if (!nombre_usuario || !password) {
            Swal.fire({
                icon: "warning",
                title: "Campos vacíos",
                text: "Por favor, ingresa tu usuario y contraseña.",
            });
            return;
        }

        if (!validateUsername(nombre_usuario)) {
            Swal.fire({
                icon: "error",
                title: "Usuario inválido",
                text: "El usuario solo debe contener letras (sin espacios ni números).",
            });
            return;
        }

        if (!validatePassword(password)) {
            Swal.fire({
                icon: "error",
                title: "Contraseña inválida",
                html: `
                    La contraseña debe contener al menos:<br/>
                    - Una letra mayúscula<br/>
                    - Un número<br/>
                    - Un símbolo<br/>
                    - Y tener mínimo 5 caracteres
                `,
            });
            return;
        }

        try {
            const response = await login(nombre_usuario, password);

            if (response) {
                const usuarioEncontrado = await getUsers(nombre_usuario);

                if (usuarioEncontrado) {
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
            }
        } catch (error) {
            console.error(error);
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
                        <div className="mt-1 text-center" style={{ fontSize: '16px' }}>
                            ¿Olvidaste tu contraseña?
                            <button
                                className="btn btn-link p-0 ms-2"
                                style={{ textDecoration: 'underline', color: '#0d6efd', fontWeight: 'bold' }}
                                onClick={() => navigate('/EnviarCodigo/')}
                            >
                                Recupérala aquí
                            </button>
                        </div>
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
