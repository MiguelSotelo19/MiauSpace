
import './css/Comment.css'

export const Comment = ({ usuario, comentario, perfil, fecha_comentario }) => {
    return(
        <>
        <div className="d-flex align-items-center justify-content-center w-100">
            <div className="d-flex align-items-start profile me-2">
                <img src={perfil} style={{width: '32px', height: '32px'}} alt="logo.jpg"/>
            </div>
            <div className="d-flex flex-column comment">
                <div className=" d-flex justify-content-between">
                    <p className='fw-bold'>{usuario}</p>
                    <p>{fecha_comentario}</p>
                </div>
                <div>{comentario}</div>
            </div>
        </div>
        </>
    );
}