import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../assets/logo.png";
import banner from "../assets/banner_mascotas.jpg";
import axios from "axios";

export const RestablecerContrasena = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const { uid, token } = useParams();
    const navigate = useNavigate();
    const [nuevaContraseña, setNuevaContraseña] = useState("");
    const [confirmarContraseña, setConfirmarContraseña] = useState("");

    const handleSubmit = async () => {
        if (nuevaContraseña !== confirmarContraseña) {
            Swal.fire({
                icon: "error",
                title: "Las contraseñas no coinciden",
                text: "Por favor, asegúrate de que ambas contraseñas sean iguales.",
            });
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/mascotas/recuperar-contrasenia/${uid}/${token}/`, {
                nueva_contraseña: nuevaContraseña,
            });

            Swal.fire({
                icon: "success",
                title: "Contraseña Restablecida",
                text: "Tu contraseña ha sido restablecida con éxito.",
                timer: 2000,
                showConfirmButton: false,
            }).then(() => {
                navigate("/");
            });
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error al restablecer la contraseña",
                text: "Hubo un problema al intentar restablecer tu contraseña. Inténtalo nuevamente.",
            });
        }
    };

    return (
        <div className="d-flex vh-100">
            <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                <div className="card p-4 w-50 d-flex flex-column">
                    <div className="card-body d-flex flex-column align-items-center justify-content-center gap-3" style={{ flex: "1 0 auto" }}>
                        <div className="text-center mb-4">
                            <img
                                src={logo}
                                alt="Logo"
                                style={{ width: "100px", height: "auto" }}
                                className="mb-2"
                            />
                        </div>

                        <h2 className="card-title mb-3">Restablecer Contraseña</h2>

                        <label className="w-100">
                            Nueva Contraseña:
                            <input
                                type="password"
                                className="form-control mt-1"
                                placeholder="Ingresa tu nueva contraseña"
                                value={nuevaContraseña}
                                onChange={(e) => setNuevaContraseña(e.target.value)}
                            />
                        </label>
                        <label className="w-100 mt-4">
                            Confirmar Contraseña:
                            <input
                                type="password"
                                className="form-control mt-1"
                                placeholder="Confirma tu nueva contraseña"
                                value={confirmarContraseña}
                                onChange={(e) => setConfirmarContraseña(e.target.value)}
                            />
                        </label>
                        <button className="btn btn-success w-100" onClick={handleSubmit} disabled={!nuevaContraseña || !confirmarContraseña}>
                            Restablecer Contraseña
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-shrink-0" style={{ width: "30%" }}>
                <img src={banner} className="w-100 h-100" style={{ objectFit: "cover" }} />
            </div>
        </div>
    );
};
