import React from "react";
import img from "../assets/skibidi.jpeg"

const Solicitudes = () => {
    const amigos = [
        {
            id: 1,
            nombre: "Juan Pérez",
            imagen: img,
            mutuales: 5
        },
        {
            id: 2,
            nombre: "María García",
            imagen: img,
            mutuales: 12
        },
        {
            id: 3,
            nombre: "Carlos López",
            imagen: img,
            mutuales: 8
        }
    ];

    return (
        <div className="container-fluid min-vh-100 p-0" style={{ backgroundColor: 'white', width: '100%', margin: 0, marginTop: '20px' }}>
            <div className="row">
                {amigos.map(amigo => (
                    <div key={amigo.id} className="col-md-4 mb-4">
                        <div className="card h-100">
                            <img
                                src={amigo.imagen}
                                className="card-img-top"
                                alt={`Foto de ${amigo.nombre}`}
                                style={{ height: "200px", objectFit: "cover" }}
                            />
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{amigo.nombre}</h5>
                                <small className="text-muted mb-3">
                                    {amigo.mutuales} amigos en común
                                </small>
                                <div className="mt-auto d-grid gap-2">
                                    <button className="btn btn-outline-primary">
                                        Confirmar
                                    </button>
                                    <button className="btn btn-outline-danger">
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Solicitudes;
