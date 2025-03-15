import { useState, useEffect, useRef } from "react";
import { Comment } from "./Comment";
import axios from 'axios';

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

export const Post = ({ picUser, user, body, picsBody = [], postId }) => {
    const urlComments = 'http://127.0.0.1:8000/comentarios/api/';
    const urlMascota = 'http://127.0.0.1:8000/mascotas/api/';

    const [ comentario, setComentario ] = useState("");
    const [ comments, setComments ] = useState([]);
    const [ mascotas, setMascotas ] = useState([]);
    const [ selected, setSelected ] = useState(false);
    const [ showReactions, setShowReactions ] = useState(false);
    const [ reactionText, setReactionText ] = useState("");
    const [ reaction, setReaction ] = useState(null);
    const [ claseReaccion, setClaseReaccion ] = useState("");
    const pressTimer = useRef(null);

    useEffect(() => {
        getData();
    }, [])

    const getData = async () => {
        const respuestaM = await axios({
            method: "GET",
            url: urlMascota,
            /*headers: {
               Authorization: `Bearer ${token}` 
            }*/
        });

        const respuestaC = await axios({
            method: "GET",
            url: urlComments,
            /*headers: {
               Authorization: `Bearer ${token}` 
            }*/
        });

        setComments(respuestaC.data.filter(comment => comment.post == postId));
        setMascotas(respuestaM.data);

        console.log(respuestaC.data);
        console.log(respuestaM.data);
    }

    const enviarComentario = async () => {
        if(comentario.trim() == ""){
            console.log("HOLA")
        } else {
            const parametros = {
                texto: comentario,
                fecha_comentario: new Date().toISOString(),
                post: postId,
                mascota: 1
            }

            enviarSolicitud("POST", parametros, urlComments)
        }
    }

    const enviarSolicitud = async (metodo, parametros, url) =>{
        await axios({
            method: metodo,
            url: url,
            data: parametros
        }).then(function (respuesta) {
            console.log(respuesta);
            getData();
            setComentario("");
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

    const modalId = "modalImages" + postId;

    const reaccionSelect = () => {
        setSelected(!selected);

        if(!selected){
            setReactionSelected(reaccion, "Me gusta", "");
        } else if(claseReaccion == "" ){
            setReactionSelected(reaccion1, "Me gusta", "reaccion-selected1");
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

    const handleSelectReaction = (reactionType) => {
        switch(reactionType){
            case "1": 
                setReactionSelected(reaccion1, "Me gusta", "reaccion-selected1");
            break;
            case "2": 
                setReactionSelected(reaccion2, "Me encanta", "reaccion-selected2");
            break;
            case "3": 
                setReactionSelected(reaccion3, "Me divierte", "reaccion-selected3");
            break;
            case "4": 
                setReactionSelected(reaccion4, "Me asombra", "reaccion-selected3");
            break;
            case "5": 
                setReactionSelected(reaccion5, "Me entristece", "reaccion-selected3");
            break;
            case "6": 
                setReactionSelected(reaccion6, "Me enoja", "reaccion-selected3");
            break;
        }
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
            <div className="card mt-4">
                <div className="card-body">
                    <div className="d-flex align-items-center justify-content-start">
                        <img src={picUser} className="me-3 rounded-circle" alt="Usuario" width="40" height="40" />
                        <p className="m-0">{user}</p>
                        <p>{postId}</p>
                    </div>
                    <div className="d-flex flex-column mt-2">
                        <p>{body}</p>

                        {Array.isArray(picsBody) && picsBody.length > 0 && (
                            <div className={clase} data-bs-toggle="modal" data-bs-target={"#" + modalId}>
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
                    <div className="d-flex justify-content-evenly align-items-center py-2">
                        <div className="reaction-container" onMouseEnter={() => setShowReactions(true)} onMouseLeave={() => setShowReactions(false)}>
                            <button className={`btn d-flex align-items-center accion ${reaction ? claseReaccion : ""}`} onClick={reaccionSelect} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
                                <img src={reaction ? reaction : reaccion} id={`reaccion${postId}`} className="me-2 reaccion icono" alt="Reacción" />
                                {reaction ? reactionText : "Me gusta"}
                            </button>
    
                            {showReactions && (
                                <div className="reactions-popup">
                                    <button onClick={() => handleSelectReaction("1")}><img src={reaccion1} className="imgReaction" /></button>
                                    <button onClick={() => handleSelectReaction("2")}><img src={reaccion2} className="imgReaction" /></button>
                                    <button onClick={() => handleSelectReaction("3")}><img src={reaccion3} className="imgReaction" /></button>
                                    <button onClick={() => handleSelectReaction("4")}><img src={reaccion4} className="imgReaction" /></button>
                                    <button onClick={() => handleSelectReaction("5")}><img src={reaccion5} className="imgReaction" /></button>
                                    <button onClick={() => handleSelectReaction("6")}><img src={reaccion6} className="imgReaction" /></button>
                                </div>
                            )}
                        </div>
    
                        <button className="btn d-flex align-items-center accion" data-bs-toggle="modal" data-bs-target={`#${modalId}`}>
                            <img src={commentIcon} className="me-2 icono" alt="Comentar" />
                            Comentar
                        </button>
                    </div>
                </div>
            </div>
    
            <div className="modal fade" id={modalId} tabIndex="-1" aria-labelledby={`${modalId}Label`} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id={`${modalId}Label`}>Imágenes</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                        </div>
                        <div className="modal-body">
                            <div id={`carousel-${modalId}`} className="carousel carousel-fade" data-bs-ride="carousel">
                                <div className="carousel-inner">
                                    {Array.isArray(picsBody) && picsBody.map((img, index) => (
                                        <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                                            <img src={img} className="d-block w-100" alt={`Imagen ${index + 1}`} />
                                        </div>
                                    ))}
                                </div>
                                <button className="carousel-control-prev" type="button" data-bs-target={`#carousel-${modalId}`} data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Anterior</span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target={`#carousel-${modalId}`} data-bs-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Siguiente</span>
                                </button>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <div className="d-flex justify-content-start align-items-start w-100">
                                <h4>Comentarios</h4>
                            </div>
                            <div className="d-flex flex-column justify-content-center w-100">
                                <div>
                                    {Array.isArray(comments) && comments.length > 0 ? 
                                    (comments.map(comment => (
                                        <Comment key={comment.id} usuario={mascotas.find(masc => masc.id == comment.mascota)?.nombre_usuario} comentario={comment.texto} perfil={mascotas.find(masc => masc.id == comment.mascota)?.foto_perfil} fecha_comentario={comment.fecha_comentario} />
                                    ))) : (
                                        <div className="d-flex flex-column justify-content-center align-items-center">
                                            <img src={commentsIcon} width={'200px'} height={'200px'} />
                                            <p>Aún no hay comentarios por mostrar</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between ps-4 pe-5 mb-3 mt-3 w-100">
                            <img src={usuario_} alt="perfil" className="imgProfile" />
                            <input type="text" className="form-control ms-4" onInput={(e) => setComentario(e.target.value)} value={comentario} placeholder="Comenta aquí" />
                            <button className="btn btn-light ms-4 enviar"><img src={enviar} alt="enviar" className="imgProfile" onClick={() => enviarComentario()} /></button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
    
};
