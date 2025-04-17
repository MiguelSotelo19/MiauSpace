import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Swal from "sweetalert2";
import axiosInstance from "../services/axiosInstace";

const Amigos = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [amigos, setAmigos] = useState([]);
    const usuario = JSON.parse(sessionStorage.getItem("usuario"));
    const usuarioId = usuario?.id;

    useEffect(() => {
        const fetchAmigos = async () => {
            if (!usuarioId) return;
            try {
                const response = await axiosInstance.get(`${API_URL}/amistades/api/${usuarioId}/obtener_amigos/`);
                setAmigos(response.data);
            } catch (error) {
                console.error("Error al obtener amigos:", error);
            }
        };

        fetchAmigos();
    }, [usuarioId]);

    const handleEliminarAmigo = async (amigoId) => {
        const result = await Swal.fire({
            title: "¿Estás seguro de eliminar a tu amigo?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            try {
                const response = await axiosInstance.delete(`${API_URL}/amistades/api/${usuarioId}/eliminar_amigo/${amigoId}/`);
                if (response.status === 200) {
                    setAmigos(amigos.filter(amigo => amigo.id !== amigoId));
                    Swal.fire(
                        "Eliminado",
                        "Amigo eliminado correctamente",
                        "success"
                    );
                }
            } catch (error) {
                console.error('Error al eliminar amigo:', error);
                Swal.fire(
                    "Error",
                    "Hubo un problema al eliminar al amigo",
                    "error"
                );
            }
        }
    };

    return (
        <div className="container-fluid min-vh-100 p-0 rounded-4 mt-2" style={{ backgroundColor: 'white', width: '100%', margin: 0}}>
            <div className="row">
                {amigos.length > 0 ? amigos.map(amigo => (
                    <div key={amigo.id} className="col-md-3 mb-4">
                        <div className="card h-100 ms-3 me-3 mt-3">
                            <img
                                src={amigo.foto_perfil}
                                className="card-img-top"
                                alt={`Foto de ${amigo.nombre}`}
                                style={{ height: "200px" }} 
                            />
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{amigo.nombre}</h5>
                                <small className="text-muted mb-3">0 amigos en común</small>
                                <div className="mt-auto d-grid gap-2">
                                    <Link to={`/MiauSpace/Perfil/${amigo.nombre}`}>
                                        <button className="btn btn-outline-primary w-100">
                                            Ver perfil
                                        </button>
                                    </Link>
                                    <button
                                        className="btn btn-outline-danger mt-2 w-100"
                                        onClick={() => handleEliminarAmigo(amigo.id)}
                                    >
                                        Eliminar amigo
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : <p className="text-center mt-2">No tienes amigos aún.</p>}
            </div>
        </div>
    );
};

export default Amigos;
