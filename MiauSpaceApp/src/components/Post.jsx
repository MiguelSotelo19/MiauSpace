import { useState, useEffect, useRef } from "react";
import { Comment } from "./Comment";
import { Reactions } from "./Reactions";
import { useNavigate } from "react-router-dom";

import "./css/Post.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";

import usuario_ from "../assets/usuario_.png";
import reaccion from "../assets/reaccion.png";
import reaccion1 from "../assets/reaccion1.png";
import reaccion2 from "../assets/reaccion2.png";
import reaccion3 from "../assets/reaccion3.png";
import reaccion4 from "../assets/reaccion4.png";
import reaccion5 from "../assets/reaccion5.png";
import reaccion6 from "../assets/reaccion6.png";
import commentIcon from "../assets/comentario.png";
import commentsIcon from "../assets/comentarios.png";
import enviar from "../assets/enviar.png";
import reaccionesImg from "../assets/reacciones.png";
import esperar from "../assets/esperar.png";
import axiosInstance from "../services/axiosInstace";

export const Post = ({ picUser, user, body, picsBody = [], postId }) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const urlReacciones = `${API_URL}/reacciones/api/`;
    const urlComments = `${API_URL}/comentarios/api/`;
    const urlMascota = `${API_URL}/mascotas/api/`;
    const urlAmigos= `${API_URL}/amistades/api/`;

    const imgreacciones = {
        "1": reaccion1,
        "2": reaccion2,
        "3": reaccion3,
        "4": reaccion4,
        "5": reaccion5,
        "6": reaccion6
    };

    const [visibleImages, setVisibleImages] = useState([]);
    const [hiddenImages, setHiddenImages] = useState([]);
    const [showMore, setShowMore] = useState(false);

    const [ idReaction, setIdReaction ] = useState(0);
    const [ reacted, setReacted ] = useState(false);
    const [ idUser, setIdUser ] = useState(0);
    const [ reacciones, setReacciones ] = useState(0);
    const [ cantReacciones, setCantReacciones ] = useState(0);
    const [ comentario, setComentario ] = useState("");
    const [ comments, setComments ] = useState([]);
    const [ cantComments, setCantComments ] = useState(0);
    const [ mascotas, setMascotas ] = useState([]);
    const [ selected, setSelected ] = useState(false);
    const [ showReactions, setShowReactions ] = useState(false);
    const [ reactionText, setReactionText ] = useState("");
    const [ reaction, setReaction ] = useState(null);
    const [ claseReaccion, setClaseReaccion ] = useState("");
    const [ amgEstado, setAmgEstado ] = useState("");
    const pressTimer = useRef(null);
    const navigate = useNavigate();

    let userStorage = JSON.parse(sessionStorage.getItem("usuario"));

    useEffect(() => {
        getData();
    }, [])


    useEffect(() => {
        if (Array.isArray(picsBody) && picsBody.length > 0) {
            setVisibleImages(picsBody.slice(0, 3));
            if (picsBody.length > 3) {
                setHiddenImages(picsBody.slice(3));
                setShowMore(true);
            }
        }
    }, [picsBody]);

    
    const getData = async () => {
        try {
            const [resM, resC, resR, resA] = await Promise.all([
                axiosInstance.get(urlMascota),
                axiosInstance.get(urlComments),
                axiosInstance.get(urlReacciones),
                axiosInstance.get(urlAmigos),
            ]);
    
            const comentarios = resC.data.filter(comment => comment.post == postId);
            const reacciones = resR.data.filter(reac => reac.post == postId);
            const reaccionUser = resR.data.filter(reac => reac.mascota == userStorage.id && reac.post == postId);
    
            const esAmigo = resA.data.find(amg =>
                (amg.mascota_receptora == user.id && amg.mascota_solicitante == userStorage.id) ||
                (amg.mascota_receptora == userStorage.id && amg.mascota_solicitante == user.id)
            )?.estado;
    
            if (esAmigo !== undefined) {
                setAmgEstado(esAmigo);
            }
    
            if (reaccionUser.length > 0) {
                setReactionUser(parseInt(reaccionUser[0].tipo_reaccion));
                setReacted(true);
                setIdReaction(reaccionUser[0].id);
            }
    
            setReacciones(reacciones);
            setCantReacciones(reacciones.length);
            setComments(comentarios);
            setCantComments(comentarios.length);
            setMascotas(resM.data);
            setIdUser(userStorage);
    
        } catch (e) {
            console.error("Error al cargar los datos", e);
        }
    };
    
    
    const registrarReaccion = (selected) => {
        let method = "POST";
        let url = urlReacciones;
        if(reacted && selected != 0){
            method = "PUT";
            url += idReaction + "/";
        }

        if (selected == 0){
            method = "DELETE";
            url += idReaction + "/";
        }
        
        const parametros = {
            post: postId,
            mascota: idUser.id,
            tipo_reaccion: selected.toString(),
            fecha_reaccion: new Date().toISOString()
        }

        enviarSolicitud(method, parametros, url, "Reaction");
    }

    const enviarComentario = async () => {
        if(comentario.trim() != ""){
            const parametros = {
                texto: ""+comentario,
                fecha_comentario: new Date().toISOString(),
                post: postId,
                mascota: userStorage.id
            }

            enviarSolicitud("POST", parametros, urlComments, "Comment");
        }
    }

    const enviarSolicitud = async (metodo, parametros, url, type) =>{
        await axiosInstance({
            method: metodo,
            url: url,
            data: parametros
        }).then(function (respuesta) {
            getData();
            if(type == "Reaction"){
                setReacted(true);
            } else {
                setComentario("");
            }

            if(metodo == "DELETE"){
                setReacted(false);
            }
        })
    }

    let clase = "d-flex flex-wrap mt-2";
    let imgClase = "post-image";
    if(picsBody != null){
        let visibleImages = picsBody.slice(0, 3);
        let hiddenImages = picsBody.slice(3);
        let showMore = hiddenImages.length > 1;

        if (picsBody.length === 4) {
            visibleImages = picsBody.slice(0, 4);
            hiddenImages = [];
            showMore = false;
        }

        if (picsBody.length === 1) {
            clase += " oneImage";
            imgClase = "post-one-image";
        } else {
            clase += " image-container";
        }
    }

    const reaccionSelect = () => {
        setSelected(!selected);

        if(!selected){
            handleSelectReaction(0);
        } else if(claseReaccion == "" ){
            handleSelectReaction(1);
        }
    };

    const handleMouseDown = () => {
        pressTimer.current = setTimeout(() => {
            setShowReactions(true);
        }, 500);
    };

    const handleMouseUp = () => {
        clearTimeout(pressTimer.current);
    };

    const setReactionUser = (reactionType) => {
        switch(reactionType){
            case 0:
                setReactionSelected(reaccion, "Me gusta", "");
            break;
            case 1: 
                setReactionSelected(reaccion1, "Me gusta", "reaccion-selected1");
            break;
            case 2: 
                setReactionSelected(reaccion2, "Me encanta", "reaccion-selected2");
            break;
            case 3: 
                setReactionSelected(reaccion3, "Me divierte", "reaccion-selected3");
            break;
            case 4: 
                setReactionSelected(reaccion4, "Me asombra", "reaccion-selected3");
            break;
            case 5: 
                setReactionSelected(reaccion5, "Me entristece", "reaccion-selected3");
            break;
            case 6: 
                setReactionSelected(reaccion6, "Me enoja", "reaccion-selected3");
            break;
        }
    } 

    const handleSelectReaction = (reactionType) => {
        setReactionUser(reactionType);
        registrarReaccion(reactionType);
        setShowReactions(false);
    };

    const setReactionSelected = (img, texto, clase) => {
        setReaction(img);
        setReactionText(texto);
        setClaseReaccion(clase);
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showReactions && !event.target.closest(".reactions-popup")) {
                setShowReactions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showReactions]);

    return (
    <>
        <div className="card mt-4 rounded-5">
            <div className="card-body rounded-5">
                <div className="d-flex align-items-center justify-content-start">
                    <img src={picUser} className="me-3 rounded-circle" alt="Usuario" width="50" height="50" />
                    <p className="m-0 pointer" onClick={() => navigate(`/MiauSpace/Perfil/${user.nombre_usuario}`)}>{user.nombre_usuario}</p>
                    { (amgEstado == "pendiente") ? 
                    (<div data-toggle="tooltip" data-placement="top" title="Solicitud pendiente" ><img src={esperar} className="ms-2" alt="pendiente.jpg" /></div>) 
                    : (<></>) }
                </div>
                <div className="d-flex flex-column mt-2">
                    <p>{body}</p>

                    {Array.isArray(picsBody) && picsBody.length > 0 && (
                        <div className={clase} data-bs-toggle="modal" data-bs-target={`#imageModal${postId}`}>
                            {visibleImages.map((img, index) => (
                                <img key={index} src={img} className={imgClase} alt={`Imagen ${index + 1}`} />
                            ))}
                            {showMore && (
                                <div className="more-images">
                                    <span>+{hiddenImages.length}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <hr />
                <div className="d-flex justify-content-between align-items-center">
                    <p className="accionesCount mb-1 ps-5" data-bs-toggle="modal" data-bs-target={`#modalReacciones${postId}`}>
                        {cantReacciones} reacciones
                    </p>
                    <p className="accionesCount mb-1 pe-5" data-bs-toggle="modal" data-bs-target={`#commentModal${postId}`}>{cantComments} comentarios</p>
                </div>
                <div className="d-flex justify-content-evenly align-items-center">
                    <div className="reaction-container" onMouseEnter={() => setShowReactions(true)} onMouseLeave={() => setShowReactions(false)}>
                        <button className={`btn d-flex align-items-center accion ${reaction ? claseReaccion : ""}`} 
                            onClick={reaccionSelect} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
                            <img src={reaction ? reaction : reaccion} className="me-2 reaccion icono" alt="Reacción" />
                            {reaction ? reactionText : "Me gusta"}
                        </button>

                        {showReactions && (
                            <div className="reactions-popup">
                                {[1, 2, 3, 4, 5, 6].map((type) => (
                                    <button key={type} onClick={() => handleSelectReaction(type)}>
                                        <img src={imgreacciones[type]} className="imgReaction" alt={`Reacción ${type}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button className="btn d-flex align-items-center accion" data-bs-toggle="modal" data-bs-target={`#commentModal${postId}`}>
                        <img src={commentIcon} className="me-2 icono" alt="Comentar" />
                        Comentar
                    </button>
                </div>
            </div>
        </div>

        <div className="modal fade" id={`modalReacciones${postId}`} tabIndex="-1" aria-hidden="true" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Reacciones</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {(Array.isArray(reacciones) && reacciones.length > 0) ? (
                            <Reactions mascotas={mascotas} reacciones={reacciones} />
                        ):(
                            <>
                            <div className="d-flex flex-column justify-content-center align-items-center">
                                <img src={reaccionesImg} width={'200px'} height={'200px'} />
                                <p>Sé el primero en reaccionar</p>
                            </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>

        <div className="modal fade" id={`imageModal${postId}`} tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content shadow-lg rounded-lg overflow-hidden d-flex justify-content-center" style={{ backgroundColor: "#1a1a1a", borderRadius: "12px", padding: "10px", height: '45vh' }}>
                    {picsBody.length > 0 && (
                        <div className="modal-body p-0 d-flex justify-content-center align-items-center">
                            <div id={`carousel-${postId}`} className="carousel slide" data-bs-ride="carousel">
                                <div className="carousel-inner">
                                    {picsBody.map((img, index) => (
                                        <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                                            <img 
                                                src={img} 
                                                className="d-block mx-auto" 
                                                alt={`Imagen ${index + 1}`} 
                                                style={{
                                                    objectFit: "contain",
                                                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                                                    transition: "opacity 0.5s ease-in-out",
                                                }} 
                                            />
                                        </div>
                                    ))}
                                </div>
                                
                                <button className="carousel-control-prev" type="button" data-bs-target={`#carousel-${postId}`} data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon bg-dark p-3 rounded-circle" aria-hidden="true"></span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target={`#carousel-${postId}`} data-bs-slide="next">
                                    <span className="carousel-control-next-icon bg-dark p-3 rounded-circle" aria-hidden="true"></span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
        

        <div className="modal fade" id={`commentModal${postId}`} tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Comentarios ({cantComments})</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {comments.length > 0 ? (
                            comments.map(comment => (
                                <Comment 
                                    key={comment.id} 
                                    usuario={mascotas.find(masc => masc.id == comment.mascota)?.nombre_usuario} 
                                    comentario={comment.texto} 
                                    perfil={mascotas.find(masc => masc.id == comment.mascota)?.foto_perfil} 
                                    fecha_comentario={comment.fecha_comentario} 
                                />
                            ))
                        ) : (
                            <div className="d-flex flex-column justify-content-center align-items-center">
                                <img src={commentsIcon} width={'200px'} height={'200px'} alt="Sin comentarios" />
                                <p>Aún no hay comentarios por mostrar</p>
                            </div>
                        )}
                    </div>
                    <div className="modal-footer">
                        <div className="d-flex align-items-center w-100 gap-2">
                            <img src={usuario_} alt="perfil" className="imgProfile" />
                            <input 
                                type="text" 
                                className="form-control" 
                                value={comentario} 
                                onChange={(e) => setComentario(e.target.value)} 
                                placeholder="Comenta aquí" 
                            />
                            <button className="btn btn-light" onClick={enviarComentario}>
                                <img src={enviar} alt="enviar" className="imgProfile" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
);
};
