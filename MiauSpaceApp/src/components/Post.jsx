import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";

import './css/Post.css';

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
                    </div>
                </div>
            </div>
        </>
    );
};
