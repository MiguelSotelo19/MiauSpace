import React from "react";

import fotoPerfil from "../assets/skibidi.jpeg"
import { Header } from "../components/Header"
import { Navigation } from "../components/Navigation"
import { SideColumn } from "../components/SideColumn"
import { Post } from "../components/Post"

export const Perfil = () => {
    let usuario = "Sotita"
    const imgPost = [fotoPerfil];
    return (

        <div className="container-fluid principal">
            <div className="gradient-custom-2">
                <Header usuario={fotoPerfil} />
                <div className="container py-5 h-100">
                    <Navigation />
                    <div className="row justify-content-center align-items-center h-100">
                        <div className="col-lg-9 col-xl-7">
                            <div className="card">
                                <div
                                    className="rounded-top text-white d-flex flex-row"
                                    style={{ backgroundColor: "#40007a", height: "20vh" }}
                                >
                                    <div className="ms-4 mt-5 d-flex flex-column" style={{ width: "15%" }}>
                                        <img src={fotoPerfil} alt="Perfil" className="mt-4 mb-2 img-thumbnail" style={{ width: "100%", zIndex: "1" }}
                                        />
                                        <button className="btn btn-outline-light" style={{ height: "2.5rem" }}>
                                            Editar perfil
                                        </button>
                                    </div>
                                    <div className="ms-3" style={{ marginTop: "15vh" }}>
                                        <h5>{usuario}</h5>
                                    </div>
                                </div>
                                <div className="p-2 pe-4 text-black" style={{ backgroundColor: "#f8f9fa" }}>
                                    <div className="d-flex justify-content-end text-center py-1">
                                        <div>
                                            <h5 className="mb-1">23</h5>
                                            <p className="small text-muted">Fotos</p>
                                        </div>
                                        <div className="px-3">
                                            <h5 className="mb-1">2</h5>
                                            <p className="small text-muted">Amigos</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body text-black p-4 pt-2">
                                    <div className="mb-5">
                                        <p className="lead fw-normal mb-1">Detalles</p>
                                        <div className="p-4" style={{ backgroundColor: "#f8f9fa" }}>
                                            <p className="font-italic mb-1">Vive en Temixyork</p>
                                            <p className="font-italic mb-1">Soltero</p>
                                            <p className="font-italic mb-0">Cumpleaños: 01 Enero</p>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <p className="lead fw-normal mb-0">Fotos recientes</p>
                                    </div>
                                    <div className="row  g-2">
                                        <div className="col mb-2">
                                            <img src={fotoPerfil} className="w-100 rounded-3"
                                            />
                                        </div>
                                        <div className="col mb-2">
                                            <img src={fotoPerfil} className="w-100 rounded-3"
                                            />
                                        </div>
                                    </div>
                                    <div className="row g-2">
                                        <div className="col mb-2">
                                            <img src={fotoPerfil} className="w-100 rounded-3"
                                            />
                                        </div>
                                        <div className="col mb-2">
                                            <img src={fotoPerfil} className="w-100 rounded-3"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Post postId="1" picUser={fotoPerfil} user={usuario} body={"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quae assumenda, totam accusamus iste distinctio, illum magni blanditiis eius corporis rerum a dolore numquam deserunt quisquam, asperiores ullam nobis ex consectetur ab aliquid voluptates? Quisquam voluptates in hic qui veritatis ipsa!"} picsBody={imgPost}/>
                            <Post postId="1" picUser={fotoPerfil} user={usuario} body={"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quae assumenda, totam accusamus iste distinctio, illum magni blanditiis eius corporis rerum a dolore numquam deserunt quisquam, asperiores ullam nobis ex consectetur ab aliquid voluptates? Quisquam voluptates in hic qui veritatis ipsa!"} picsBody={imgPost}/>

                        </div>
                    </div>
                </div>
            </div>
            <SideColumn />
        </div>

    );
};
