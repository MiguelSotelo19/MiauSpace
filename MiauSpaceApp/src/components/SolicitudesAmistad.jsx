import React, { useEffect, useState } from "react";
import axios from "axios";
import img from "../assets/skibidi.jpeg";

const Solicitudes = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const usuario = JSON.parse(sessionStorage.getItem("usuario")); // Obtener el usuario logueado
    const usuarioId = usuario?.id;

    useEffect(() => {
        const fetchSolicitudes = async () => {
            if (!usuarioId) return;
            try {
                const response = await axios.get(`http://127.0.0.1:8000/amistades/api/${usuarioId}/obtener_solicitudes_pendientes/`);
                setSolicitudes(response.data);
            } catch (error) {
                console.error("Error al obtener solicitudes de amistad:", error);
            }
        };

        fetchSolicitudes();
    }, [usuarioId]);

    const manejarSolicitud = async (id, accion) => {
        try {
            await axios.post(`http://127.0.0.1:8000/amistades/api/${id}/${accion}/`);
            setSolicitudes(solicitudes.filter(solicitud => solicitud.id !== id));
        } catch (error) {
            console.error(`Error al ${accion} solicitud:`, error);
        }
    };

    return (
        <div className="container-fluid min-vh-100 p-0" style={{ backgroundColor: 'white', width: '100%', margin: 0, marginTop: '20px' }}>
            <div className="row">
                {solicitudes.length > 0 ? solicitudes.map(solicitud => (
                    <div key={solicitud.id} className="col-md-4 mb-4">
                        <div className="card h-100">
                            <img
                                src={solicitud.mascota_solicitante_foto}
                                className="card-img-top"
                                alt={`Foto de ${solicitud.nombre}`}
                                style={{ height: "200px", objectFit: "cover" }}
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
