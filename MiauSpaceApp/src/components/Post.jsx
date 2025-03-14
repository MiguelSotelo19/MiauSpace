import { useState, useEffect, useRef, use } from "react";
import { Comment } from "./Comment";

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
import comment from "../assets/comentario.png";

export const Post = ({ picUser, user, body, picsBody = [], postId }) => {
    const [ selected, setSelected ] = useState(false);
    const [ showReactions, setShowReactions ] = useState(false);
    const [ reactionText, setReactionText ] = useState("");
    const [ reaction, setReaction ] = useState(null);
    const [ claseReaccion, setClaseReaccion ] = useState("");
    const pressTimer = useRef(null);

    let clase = "d-flex flex-wrap mt-2";
    let imgClase = "post-image";
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
                    </div>
                    <div className="d-flex flex-column mt-2">
                        <p>{body}</p>

                        {picsBody.length > 0 && (
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
                            <img src={comment} className="me-2 icono" alt="Comentar" />
                            Comentar
                        </button>
                    </div>
                </div>
            </div>

            <div className="modal fade" id={modalId} tabIndex="-1" aria-labelledby={`${modalId}Label`} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="modalImagesLabel">Imágenes</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                        </div>
                        <div className="modal-body">
                            {picsBody.map((img, index) => (
                                <img key={index} src={img} className="post-one-image mt-4 mb-3" alt={`Imagen ${index + 1}`} />
                            ))}
                        </div>
                        <div className="modal-footer">
                            <div className="d-flex justify-content-start align-items-start w-100">
                                <h4>Comentarios</h4>
                            </div>
                            <div className="d-flex flex-column justify-content-center align-items-center w-100">
                                <div>
                                    <Comment usuario="El cocker" comentario="Comentario de prueba" perfil={usuario_} />
                                    <Comment usuario="El cocker" comentario="Otro comentario de prueba Otro comentario de prueba Otro comentario de prueba" perfil={usuario_} />
                                </div>
                            </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between ps-4 pe-5 mb-3 mt-3 w-100">
                            <img src={usuario_} alt="perfil" className="imgProfile" />
                            <input type="text" className="form-control ms-4" placeholder="Comenta aquí" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
