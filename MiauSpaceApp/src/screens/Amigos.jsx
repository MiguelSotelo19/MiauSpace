import React, { useState } from "react";
import { Layout } from "../components/Layout";
import ListaAmigos from "../components/ListaAmigos";
import Sugerencias from "../components/SugerenciasAmistad";
import Solicitudes from "../components/SolicitudesAmistad";

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
                <div className="row g-0">
                    <div className="col-12">
                        <div className="row g-0 bg-dark text-white p-3 rounded-0">
                            {secciones.map((seccion) => (
                                <div key={seccion.id} className="col">
                                    <button
                                        className={`btn w-50 ms-5 ${seccionActiva === seccion.id ? 'btn-morado' : 'btn-secondary'}`}
                                        onClick={() => setSeccionActiva(seccion.id)}
                                    >
                                        {seccion.label}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-12">
                        {seccionActiva === "listaAmigos" && <ListaAmigos />}
                        {seccionActiva === "solicitudesAmigos" && <Solicitudes />}
                        {seccionActiva === "sugerenciasAmigos" && <Sugerencias />}
                    </div>
                </div>
            </div>
        </Layout>
    );
};