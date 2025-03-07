import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";

import { Comment } from './Comment';

import './css/Post.css';

import usuario_ from '../assets/usuario_.png';
import reaccion from '../assets/reaccion.png';
import comment from '../assets/comentario.png'

export const Post = ({ picUser, user, body, picsBody = [], postId }) => {
    let clase = 'd-flex flex-wrap mt-2';
    let imgClase = 'post-image';
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

    const modalId = "modalImages"+postId;

    return (
        <>
            <div className="card mt-3">
                <div className="card-body">
                    <div className="d-flex align-items-center justify-content-start">
                        <img src={picUser} className="me-3 rounded-circle" alt="Usuario" width="40" height="40" />
                        <p className="m-0">{user}</p>
                    </div>
                    <div className="d-flex flex-column mt-2">
                        <p>{body}</p>

                        {picsBody.length > 0 && (
                            <div className={clase} data-bs-toggle="modal" data-bs-target={"#"+modalId}>
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
                        <button className="btn d-flex align-items-center accion reaccion-selected">
                            <img src={reaccion} className="me-2 reaccion icono" alt="Me gusta" />
                            Me gusta
                        </button>

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
                                {/*Mapeo de comentarios*/}
                                <div className="">
                                    <Comment usuario="El cocker" comentario="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quae tenetur incidunt ratione amet facilis odit non saepe sequi labore repellat id quos ea commodi quidem illum quam animi sapiente ab provident optio rerum, nemo voluptate. Tempore fugit optio pariatur quaerat." perfil={usuario_} />
                                    <Comment usuario="El cocker" comentario="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quae tenetur incidunt ratione amet facilis odit non saepe sequi labore repellat id quos ea commodi quidem illum quam animi sapiente ab provident optio rerum, nemo voluptate. Tempore fugit optio pariatur quaerat." perfil={usuario_} />
                                </div>
                            </div>
                        </div>
                        <div className="d-flex ps-4 pe-5 mb-3 mt-3 w-100">
                            <img src={usuario_} alt="perfil" style={{width: '5%'}} />
                            <input type="text" className="form-control" placeholder="Comenta aquí" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
