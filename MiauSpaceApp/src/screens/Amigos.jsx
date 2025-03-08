import React from "react";
import fotoPerfil from "../assets/skibidi.jpeg";
import { Header } from "../components/Header"
import { Navigation } from "../components/Navigation"
import { SideColumn } from "../components/SideColumn"

export const Amigos = () => {
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
        <div className="container-fluid principal">
            <div className="gradient-custom-2">
                <Header usuario={fotoPerfil} />
                <div className="container py-5 h-100">
                    <Navigation />
                    <div className="bg-gray row justify-content-center align-items-center h-100">
                        <div className="col-lg-9 col-xl-7 bg-white">
                            {data.map((amigo, index) => (

                                <div className="container" style={{ display: 'flex', flexDirection: 'row' }}>
                                    <div
                                        key={index}
                                        className="flex items-center p-3"
                                        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
                                    >
                                        <img src={amigo.fotoPerfil} alt={amigo.name} className="rounded-full object-cover"
                                            style={{ width: "5vw", height: "10vh", marginRight: "2vw", borderRadius: 55 }} draggable="false" />
                                        <div>
                                            <p className="font-bolder">{amigo.name}</p>
                                            <p className="text-sm text-gray-500">{amigo.amigos}</p>
                                        </div>
                                        <div className="ps-5" style={{ alignContent: 'center', marginLeft: '20vw' }}>
                                            <button className="btn btn-info">Enviar solicitud</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
            <SideColumn />
        </div>
    );
};
