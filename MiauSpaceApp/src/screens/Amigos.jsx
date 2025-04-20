import React, { useState } from "react";
import { Layout } from "../components/Layout";
import ListaAmigos from "../components/ListaAmigos";
import Sugerencias from "../components/SugerenciasAmistad";
import Solicitudes from "../components/SolicitudesAmistad";
import Buscador from "../components/Buscador";

export const Amigos = () => {
    const [seccionActiva, setSeccionActiva] = useState("listaAmigos");

    const secciones = [
        { id: "listaAmigos", label: "Amigos" },
        { id: "solicitudesAmigos", label: "Solicitudes" },
        { id: "sugerenciasAmigos", label: "Sugerencias" }
    ];

    return (
        <Layout>
            <div className="gradient-custom-2">
                <div className="row g-0 py-2">
                    <div className="col-12">
                        <div className="row g-0 text-white p-3 rounded-5 d-flex justify-content-center align-items-center" style={{ backgroundColor: "white" }}>
                            {secciones.map((seccion) => (
                                <div key={seccion.id} className="col d-flex justify-content-center align-items-center">
                                    <div>
                                        <button
                                            className={`btn ${seccionActiva === seccion.id ? 'btn-morado' : 'btn-secondary'}`}
                                            onClick={() => setSeccionActiva(seccion.id)}
                                            style={{fontSize:"20px"}}
                                        >
                                            {seccion.label}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="my-3 bg-white rounded-4">
                        <Buscador />
                    </div>

                    <div className="col-12 ">
                        {seccionActiva === "listaAmigos" && <ListaAmigos />}
                        {seccionActiva === "solicitudesAmigos" && <Solicitudes />}
                        {seccionActiva === "sugerenciasAmigos" && <Sugerencias />}
                    </div>
                </div>
            </div>
        </Layout>
    );
};
