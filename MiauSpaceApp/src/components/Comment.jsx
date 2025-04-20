import { useNavigate } from 'react-router-dom';
import './css/Comment.css';

export const Comment = ({ usuario, comentario, perfil, fecha_comentario }) => {
    const navigate = useNavigate();
    const formatFecha = (fecha) => {
        const fechaObj = new Date(fecha);
        const hoy = new Date();
        const ayer = new Date();
        ayer.setDate(hoy.getDate() - 1);

        if (fechaObj.toDateString() === hoy.toDateString()) {
            return 'Hoy';
        }

        if (fechaObj.toDateString() === ayer.toDateString()) {
            return 'Ayer';
        }

        return new Intl.DateTimeFormat('es-ES', {
            day: '2-digit',
            month: 'long'
        }).format(fechaObj);
    };

    return (
        <div className="d-flex align-items-center justify-content-center w-100">
            <div className="d-flex align-items-start profile me-2">
                <img src={perfil} style={{ width: '40px', height: '40px', borderRadius: '15px' }} alt="perfil" />
            </div>
            <div className="d-flex flex-column comment">
                <div className="d-flex justify-content-between">
                    <p className='fw-bold accionesCount' data-bs-dismiss="modal" onClick={() => navigate(`/MiauSpace/Perfil/${usuario}`)}>{usuario}</p>
                    <p>{formatFecha(fecha_comentario)}</p>
                </div>
                <div>{comentario}</div>
            </div>
        </div>
    );
};
