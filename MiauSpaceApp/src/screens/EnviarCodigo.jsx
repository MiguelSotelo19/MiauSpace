import React, { useState } from "react";
import Swal from "sweetalert2";
import logo from "../assets/logo.png";
import banner from "../assets/banner_mascotas.jpg";
import axiosInstance from "../services/axiosInstace";

export const EnviarCodigo = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [correo, setCorreo] = useState("");

    const enviarSolicitud = async () => {
        try {
            const response = await axiosInstance.post(`${API_URL}/mascotas/enviar_correo_recuperacion/`, {
                correo,
            });

            Swal.fire({
                icon: "success",
                title: "Correo Enviado",
                text: "Revisa tu bandeja de entrada (spam si es necesario)",
                timer: 2000,
                showConfirmButton: false,
            });

        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.response?.data?.error || "Error al enviar la solicitud.",
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

                        <h2 className="card-title mb-3">Recuperar Contraseña</h2>

                        <label className="w-100">
                            Correo Electrónico:
                            <input
                                type="email"
                                className="form-control mt-1"
                                placeholder="ejemplo@correo.com"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                            />
                        </label>

                        <button className="btn btn-primary w-100 mt-4" onClick={enviarSolicitud} disabled={!correo}>
                            Enviar Enlace de Recuperación
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
