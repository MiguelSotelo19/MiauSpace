import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import img from "../assets/skibidi.jpeg";
import axiosInstance from "../services/axiosInstace";

const Sugerencias = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [sugerencias, setSugerencias] = useState([]);
    const usuario = JSON.parse(sessionStorage.getItem("usuario"));
    const usuarioId = usuario?.id;

    useEffect(() => {
        fetchSugerencias();
    }, [usuarioId]);

    const fetchSugerencias = async () => {
        if (!usuarioId) return;
        try {
            const response = await axiosInstance.get(`${API_URL}/amistades/api/${usuarioId}/sugerencias_amigos/`);
            setSugerencias(response.data);
        } catch (error) {
            console.error("Error al obtener sugerencias:", error);
        }
    };

    const enviarSolicitud = async (mascotaReceptoraId) => {
        try {
            await axiosInstance.post(`${API_URL}/amistades/api/${usuarioId}/enviar_solicitud/`, {
                mascota_receptora: mascotaReceptoraId
            });

            Swal.fire({
                icon: "success",
                title: "Solicitud enviada",
                text: "Tu solicitud de amistad fue enviada con éxito.",
                confirmButtonColor: "#3085d6",
            });

            fetchSugerencias();
        } catch (error) {
            console.error("Error al enviar solicitud:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hubo un problema al enviar la solicitud.",
                confirmButtonColor: "#d33",
            });
        }
    };

    return (
        <div className="container-fluid min-vh-100 p-0 rounded-4 mt-2" style={{ backgroundColor: 'white', width: '100%', margin: 0}}>
            <div className="row">
                {sugerencias.length > 0 ? sugerencias.map(amigo => (
                    <div key={amigo.id} className="col-md-3 mb-4">
                        <div className="card h-100 ms-3 me-3 mt-3">
                            <img
                                src={amigo.foto_perfil || img}
                                className="card-img-top"
                                alt={`Foto de ${amigo.nombre}`}
                                style={{ height: "200px"}}
                            />
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{amigo.nombre}</h5>
                                <div className="mt-auto d-grid gap-2">
                                    <button className="btn btn-outline-primary mt-2 w-100" onClick={() => enviarSolicitud(amigo.id)}>
                                        Enviar solicitud
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : <p className="text-center mt-2">No hay sugerencias de amigos.</p>}
            </div>
        </div>
    );
};

export default Sugerencias;
