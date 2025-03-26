import React from "react";
import fotoPerfil from "../assets/skibidi.jpeg";
import { Link } from "react-router-dom";
import { Layout } from "../components/Layout"; // Importar Layout

export const Amigos = () => {
    const user = JSON.parse(sessionStorage.getItem("usuario"));
    let data = [
        { name: "Sotita (IA)", fotoPerfil: fotoPerfil, amigos: "15935 amigos" },
        { name: "Evil Sotita", fotoPerfil: fotoPerfil, amigos: "512 amigos" },
        { name: "Sotita 2", fotoPerfil: fotoPerfil, amigos: "25512 amigos" },
        { name: "Sotita (IA)", fotoPerfil: fotoPerfil, amigos: "15935 amigos" },
        { name: "Evil Sotita", fotoPerfil: fotoPerfil, amigos: "512 amigos" },
        { name: "Sotita 2", fotoPerfil: fotoPerfil, amigos: "25512 amigos" },
        { name: "Sotita (IA)", fotoPerfil: fotoPerfil, amigos: "15935 amigos" },
        { name: "Evil Sotita", fotoPerfil: fotoPerfil, amigos: "512 amigos" },
        { name: "Sotita 2", fotoPerfil: fotoPerfil, amigos: "25512 amigos" },
        { name: "Sotita (IA)", fotoPerfil: fotoPerfil, amigos: "15935 amigos" },
        { name: "Evil Sotita", fotoPerfil: fotoPerfil, amigos: "512 amigos" },
        { name: "Sotita 2", fotoPerfil: fotoPerfil, amigos: "25512 amigos" },
    ];

    return (
        <Layout>
            <div className="gradient-custom-2">
                <div className="container py-5 h-100">
                    <div className="bg-gray row justify-content-center align-items-center h-100">
                        <h1>Amigos</h1>
                        {data.map((amigo, index) => (
                            <div key={index} className="col-lg-9 col-xl-7 bg-white mt-4" style={{ borderRadius: '10px' }}>
                                <div className="container">
                                    <div className="d-flex align-items-center justify-content-between p-3">
                                        <div className="d-flex">
                                            <img src={amigo.fotoPerfil} alt={amigo.name}
                                                style={{ width: "5vw", height: "10vh", marginRight: "2vw", borderRadius: 55 }} draggable="false" />
                                            <div className="d-flex flex-column align-content-center justify-content-center">
                                                <div>
                                                    <Link to={`/MiauSpace/Perfil/${amigo.username}`} className="fw-semibold fs-5">
                                                        {amigo.name}
                                                    </Link>
                                                    <p>{amigo.amigos}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex">
                                            <button className="btn fw-semibold" style={{ borderColor: 'purple', backgroundColor: 'rgb(71, 135, 209)' }}>Enviar solicitud</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};