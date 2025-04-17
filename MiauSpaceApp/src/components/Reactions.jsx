import { useEffect, useState } from "react";
import reaccion1 from "../assets/reaccion1.png";
import reaccion2 from "../assets/reaccion2.png";
import reaccion3 from "../assets/reaccion3.png";
import reaccion4 from "../assets/reaccion4.png";
import reaccion5 from "../assets/reaccion5.png";
import reaccion6 from "../assets/reaccion6.png";
import { Bounce, ToastContainer, toast } from 'react-toastify';

import "./css/Reactions.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstace";

export const Reactions = ({ mascotas, reacciones }) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const urlAmistades = `${API_URL}/amistades/api/`;
    let loggeado = localStorage.getItem("username");
    const [ allReactions, setAllReactions ] = useState(reacciones);
    const [idLoggeado, setIdLoggeado] = useState(null);
    const [misAmigos, setMisAmigos] = useState([]);
    const [solicPendiente, setSolicPendiente] = useState([]);
    const [solicPendientePropia, setSolicPendientePropia] = useState([]);
    const imgreacciones = {
        "1": reaccion1,
        "2": reaccion2,
        "3": reaccion3,
        "4": reaccion4,
        "5": reaccion5,
        "6": reaccion6
    };

    const react1 = reacciones.filter(r => r.tipo_reaccion == '1');
    const react2 = reacciones.filter(r => r.tipo_reaccion == '2');
    const react3 = reacciones.filter(r => r.tipo_reaccion == '3');
    const react4 = reacciones.filter(r => r.tipo_reaccion == '4');
    const react5 = reacciones.filter(r => r.tipo_reaccion == '5');
    const react6 = reacciones.filter(r => r.tipo_reaccion == '6');
    const navigate = useNavigate();
    
    useEffect(() => {
        getAmistades(); 
        
    }, []);

    const getAmistades = async () => {
        const usuarioLoggeado = mascotas.find(u => u.nombre_usuario === loggeado);
        if (usuarioLoggeado) {
            setIdLoggeado(usuarioLoggeado.id);
            getAmigosPropio(usuarioLoggeado.id);
        }
    }

    const getAmigosPropio = async (idLoggeado) => {
        try {
            const respuesta = await axiosInstance.get(urlAmistades+idLoggeado+'/obtener_amigos/');
            setMisAmigos(respuesta.data)
        } catch (error) {
            console.error("Error al obtener datos del usuario", error);
        }
    };

    const getSolicitudesPendientes = async (idLoggeado, idReceptor) => {
            try {
                const respuesta = await axiosInstance.get(urlAmistades + idReceptor + "/obtener_solicitudes_pendientes/");
        
                const solicitudes = respuesta.data.filter(solicitud =>
                    solicitud.mascota_solicitante_id === idLoggeado &&
                    solicitud.mascota_receptora_id === idReceptor
                );
                setSolicPendiente(prev => [...prev, ...solicitudes]); 
        
            } catch (error) {
                console.error("Error al obtener solicitudes pendientes", error);
            }
        };
    
        const getSolicitudesPendientesPropias = async (idLoggeado, idReceptor) => {
            try {
                const respuesta = await axiosInstance.get(urlAmistades + idLoggeado + "/obtener_solicitudes_pendientes/");
        
                const solicitudes = respuesta.data.filter(solicitud =>
                    solicitud.mascota_solicitante_id === idReceptor &&
                    solicitud.mascota_receptora_id === idLoggeado
                );
        
                setSolicPendientePropia(prev => [...prev, ...solicitudes]); 
        
            } catch (error) {
                console.error("Error al obtener solicitudes pendientes", error);
            }
        };
    
        const enviarSolicitud = async (idLoggeado, idReceptor) => {
            try {
                const parametros = { mascota_receptora: idReceptor };        
                const resp = await axiosInstance.post(urlAmistades + idLoggeado + "/enviar_solicitud/", parametros);
        
                if (resp.data.mensaje === "Solicitud de amistad enviada con éxito") {
                    await getSolicitudesPendientes(idLoggeado, idReceptor);
                    toast.success("Solicitud enviada con éxito", {
                        position: "top-center",
                        autoClose: 3000,
                        hideProgressBar: true,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: true,
                        theme: "light",
                        transition: Bounce,
                    });
                }
            } catch (e) {
                toast.error("Ha ocurrido un error", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "dark",
                    transition: Bounce,
                });
            }
        };
    
        const esAmigo = (amigoId) => {
            return misAmigos.some(amigo => amigo.id === amigoId);
        };

        
        useEffect(() => {
            if (idLoggeado) {
                mascotas.forEach(mascota => {
                    getSolicitudesPendientes(idLoggeado, mascota.id);
                    getSolicitudesPendientesPropias(idLoggeado, mascota.id);
                });
            }
        }, [idLoggeado]);

    return(
        <>
        <ToastContainer />
        <div className="container d-flex flex-column w-100 justify-content-center">
            <div className="menu-reacciones mb-4">
                {reacciones.length > 0 ? (
                    <>
                    <button className="btn btn-reaction" onClick={() => setAllReactions(reacciones)}>Todos</button>
                    {react1.length > 0 ? (<button className="btn btn-reaction" onClick={() => setAllReactions(react1)}><img src={reaccion1} className="icon-reaction" alt="Me gusta"/>{react1.length}</button>) : (<></>)}
                    {react2.length > 0 ? (<button className="btn btn-reaction" onClick={() => setAllReactions(react2)}><img src={reaccion2} className="icon-reaction" alt="Me gusta"/>{react2.length}</button>) : (<></>)}
                    {react3.length > 0 ? (<button className="btn btn-reaction" onClick={() => setAllReactions(react3)}><img src={reaccion3} className="icon-reaction" alt="Me gusta"/>{react3.length}</button>) : (<></>)}
                    {react4.length > 0 ? (<button className="btn btn-reaction" onClick={() => setAllReactions(react4)}><img src={reaccion4} className="icon-reaction" alt="Me gusta"/>{react4.length}</button>) : (<></>)}
                    {react5.length > 0 ? (<button className="btn btn-reaction" onClick={() => setAllReactions(react5)}><img src={reaccion5} className="icon-reaction" alt="Me gusta"/>{react5.length}</button>) : (<></>)}
                    {react6.length > 0 ? (<button className="btn btn-reaction" onClick={() => setAllReactions(react6)}><img src={reaccion6} className="icon-reaction" alt="Me gusta"/>{react6.length}</button>) : (<></>)}
                    </> 
                ) : (<></>)}
            </div>

            {allReactions.map(reac => (
                <div key={reac.id} className="d-flex justify-content-between align-items-center gap-2 p-2 border-bottom">
                    <div className="d-flex align-items-center">
                        <img src={mascotas.find(mas => mas.id == reac.mascota)?.foto_perfil} alt="Perfil" className="rounded-circle perfil-img ms-1"/>
                        
                        <img src={imgreacciones[reac.tipo_reaccion]} alt="Reacción" className="reaccion-icon ms-1"/>
                        <p className="mb-0 nombre-usuario ms-2 pointer" data-bs-dismiss="modal" onClick={() => navigate(`/MiauSpace/Perfil/${mascotas.find(mas => mas.id == reac.mascota)?.nombre_usuario}`)}>{mascotas.find(mas => mas.id == reac.mascota)?.nombre_usuario}</p>
                    </div>
                    {mascotas.find(mas => mas.id == reac.mascota)?.id == idLoggeado ? null : (
                        esAmigo(mascotas.find(mas => mas.id == reac.mascota)?.id) ? (
                            <span>Amigo</span>
                        ) : solicPendiente.some(solicitud => solicitud.mascota_receptora_id === reac.mascota) ? (
                            <span>Solicitud enviada</span>
                        ) : solicPendientePropia.some(solicitud => solicitud.mascota_solicitante_id === reac.mascota) ? (
                            <span>Solicitud pendiente</span>
                        ) : (
                            <button className="btn" style={{ backgroundColor: '#7B1FA2', color: 'white' }} onClick={() => enviarSolicitud(idLoggeado, reac.mascota)}>
                                Enviar solicitud
                            </button>
                        )
                    )}
                    
                </div>
            ))}
        </div>
        </>
    );
}