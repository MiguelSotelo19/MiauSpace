import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import img from "../assets/skibidi.jpeg";

const Solicitudes = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const usuario = JSON.parse(sessionStorage.getItem("usuario")); 
    const usuarioId = usuario?.id;

    useEffect(() => {
        fetchSolicitudes();
    }, [usuarioId]);

    const fetchSolicitudes = async () => {
        if (!usuarioId) return;
        try {
            const response = await axios.get(`http://127.0.0.1:8000/amistades/api/${usuarioId}/obtener_solicitudes_pendientes/`);
            setSolicitudes(response.data);
        } catch (error) {
            console.error("Error al obtener solicitudes de amistad:", error);
        }
    };

    const manejarSolicitud = async (id, accion) => {
        try {
            await axios.post(`http://127.0.0.1:8000/amistades/api/${id}/${accion}/`);

            Swal.fire({
                icon: accion === "aceptar_solicitud" ? "success" : "error",
                title: accion === "aceptar_solicitud" ? "Solicitud aceptada" : "Solicitud rechazada",
                text: accion === "aceptar_solicitud"
                    ? "Has aceptado la solicitud de amistad."
                    : "Has rechazado la solicitud de amistad.",
                confirmButtonColor: "#3085d6",
            });

            fetchSolicitudes();
        } catch (error) {
            console.error(`Error al ${accion} solicitud:`, error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hubo un problema al procesar la solicitud.",
                confirmButtonColor: "#d33",
            });
        }
    };

    return (
        <div className="container-fluid min-vh-100 p-0" style={{ backgroundColor: 'white', width: '100%', margin: 0, marginTop: '20px' }}>
            <div className="row">
                {solicitudes.length > 0 ? solicitudes.map(solicitud => (
                    <div key={solicitud.id} className="col-md-4 mb-4">
                        <div className="card h-100">
                            <img
                                src={solicitud.mascota_solicitante_foto || img}
                                className="card-img-top"
                                alt={`Foto de ${solicitud.mascota_solicitante_nombre}`}
                                style={{ height: "200px"}}
                            />
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{solicitud.mascota_solicitante_nombre}</h5>
                                <small className="text-muted mb-3">Solicitud de amistad</small>
                                <div className="mt-auto d-grid gap-2">
                                    <button className="btn btn-outline-primary" onClick={() => manejarSolicitud(solicitud.id, 'aceptar_solicitud')}>
                                        Confirmar
                                    </button>
                                    <button className="btn btn-outline-danger" onClick={() => manejarSolicitud(solicitud.id, 'rechazar_solicitud')}>
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : <p className="text-center">No tienes solicitudes de amistad pendientes.</p>}
            </div>
        </div>
    );
};

export default Solicitudes;
