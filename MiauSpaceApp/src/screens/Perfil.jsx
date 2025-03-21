import React, { useEffect, useState } from "react";
import axios from "axios";
import fotoPerfil from "../assets/skibidi.jpeg"
import { Header } from "../components/Header"
import { Navigation } from "../components/Navigation"
import { SideColumn } from "../components/SideColumn"
import { Post } from "../components/Post"
import { useParams } from "react-router-dom";

export const Perfil = ({username}) => {
    let urlUser="http://127.0.0.1:8000/mascotas/api/";
    let { username: paramUsername } = useParams();
    const user = JSON.parse(sessionStorage.getItem("usuario"));
    let loggeado = localStorage.getItem("username");
    const [edad, setEdad] = useState(0);
    const [esAdmin, setEsAdmin]= useState(false);
    const [especie, setEspecie]= useState("");
    const [fechaNac, setFechaNac] = useState("");
    const [fotoPerf, setFotoPerf] = useState("");
    const [id, setId] = useState("");
    const [isActive, setIsActive] = useState("");
    const [joinDate, setJoinDate] = useState("");
    const [lastLogin, setLastLogin] = useState("");
    const [nomUsuario, setNomUsuario] = useState("");
    const [preferencias, setPreferencias] = useState("");
    const [raza, setRaza] = useState("");
    const [sexo, setSexo] = useState("");
    const [ubicacion, setUbicacion] = useState("");
    const [btnEditar, setBtnEditar] = useState(false);

    useEffect(() =>{
        getUsers();
        
    },[paramUsername])
    
    const getUsers = async () => {
        try {
            const respuesta = await axios.get(urlUser);
            const usuarioEncontrado = respuesta.data.find(u => u.nombre_usuario === paramUsername);
            if (usuarioEncontrado) {
                console.log("Entcontrado: ",usuarioEncontrado)
                setUser(usuarioEncontrado);
            }
        } catch (error) {
            console.error("Error al obtener datos del usuario", error);
        }
    };

    const setUser = async (element) => {
        setEdad(element.edad || 0);
        
        setEspecie(element.especie || "");
        setFechaNac(element.fecha_nacimiento || "");
        setFotoPerf(element.foto_perfil || "");
        //setId(element.id || "");
        setIsActive(element.is_active || "");
        setJoinDate(element.join_date || "");
        setLastLogin(element.last_login || "");
        setNomUsuario(element.nombre_usuario || "");
        setPreferencias(element.preferencias || "");
        setRaza(element.raza || "");
        setSexo(element.sexo || "");
        setUbicacion(element.ubicacion || "");
        if (element.nombre_usuario == loggeado){
            setEsAdmin(element.es_admin || false);
            setBtnEditar(true)
        }
    };
    
    return (
        <div className="container-fluid principal">
            <div className="gradient-custom-2">
                <Header usuario={user} />
                <div className="container py-5 h-100">
                    <Navigation />
                    <div className="row justify-content-center align-items-center h-100">
                        <div className="col-lg-12 col-xl-12" style={{width:"50vw"}}>
                            <div className="card">
                                <div
                                    className="rounded-top text-white d-flex flex-row"
                                    style={{ backgroundColor: "#40007a", height: "20vh" }}
                                >
                                    <div className="ms-4 mt-5 d-flex flex-column" style={{ width: "15%" }}>
                                        <img src={fotoPerf} alt="Perfil" className="mt-4 mb-2 img-thumbnail" style={{ width: "100%", zIndex: "1"}}
                                        />
                                        {btnEditar && (
                                        <button className="btn btn-outline-light" style={{ height: "2.5rem" }}>
                                            Editar perfil
                                        </button>
                                    )}
                                    </div>
                                    <div className="ms-3" style={{ marginTop: "15vh" }}>
                                        <h5>{nomUsuario}</h5>
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
                                            <p className="font-italic mb-1">Vive en {ubicacion}</p>
                                            <p className="font-italic mb-1">{sexo}</p>
                                            <p className="font-italic mb-0">Especie: {especie}</p>
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
                            
                        </div>
                    </div>
                </div>
            </div>
            <SideColumn />
        </div>

    );
};
