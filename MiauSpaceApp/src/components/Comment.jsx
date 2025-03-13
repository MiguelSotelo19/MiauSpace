
import './css/Comment.css'

export const Comment = ({ usuario, comentario, perfil }) => {
    return(
        <>
        <div className="d-flex align-items-center justify-content-center w-100">
            <div className="d-flex align-items-start profile me-2">
                <img src={perfil} alt="logo.jpg"/>
            </div>
            <div className="d-flex flex-column comment">
                <div className="fw-bold mb-2">{usuario}</div>
                <div>{comentario}</div>
            </div>
        </div>
        </>
    );
}