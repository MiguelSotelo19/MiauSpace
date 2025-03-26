import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import img from "../assets/skibidi.jpeg"

const Amigos = () => {
    const [amigos, setAmigos] = useState([]);
    const usuario = JSON.parse(sessionStorage.getItem("usuario"));
    const usuarioId = usuario?.id;

    useEffect(() => {
        const fetchAmigos = async () => {
            if (!usuarioId) return;
            try {
                const response = await axios.get(`http://127.0.0.1:8000/amistades/api/${usuarioId}/obtener_amigos/`);
                setAmigos(response.data);
                console.log(response.data)
            } catch (error) {
                console.error("Error al obtener amigos:", error);
            }
        };

        fetchAmigos();
    }, [usuarioId]);

    return (
        <div className="container-fluid min-vh-100 p-0" style={{ backgroundColor: 'white', width: '100%', margin: 0, marginTop: '20px' }}>
            <div className="row">
                {amigos.length > 0 ? amigos.map(amigo => (
                    <div key={amigo.id} className="col-md-4 mb-4">
                        <div className="card h-100">
                            <img
                                src={amigo.foto_perfil || img}
                                className="card-img-top"
                                alt={`Foto de ${amigo.nombre}`}
                                style={{ height: "200px", objectFit: "cover" }}
                            />
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{amigo.nombre}</h5>
                                <small className="text-muted mb-3">0 amigos en común</small>
                                <div className="mt-auto d-grid gap-2">
                                    <Link to={`/MiauSpace/Perfil/${amigo.nombre}`}>
                                        <button className="btn btn-outline-primary">
                                            Ver perfil
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : <p className="text-center">No tienes amigos aún.</p>}
            </div>
        </div>
    );
};

export default Amigos;
