import React from 'react';
import { useEffect, useState } from 'react';
import './css/SideColumn.css';
import axiosInstance from '../services/axiosInstace';

import "./css/Comment.css";

export const SideColumn = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const url = `${API_URL}/comentarios/accioneslog/`;
    const urlUser = `${API_URL}/mascotas/api/`;
    const urlPost = `${API_URL}/posts/api/`;
    const [notis, setNotis] = useState([]);
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const user = JSON.parse(sessionStorage.getItem("usuario"));

    useEffect(() => {
        getUsers();
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            getUsers();
        }, 10000)
        return () => clearInterval(interval);
    }, []);

    const getNotis = async () => {
        try {
            const response = await axiosInstance.get(`${url}${user.id}/`);
            const rawNotis = response.data;
            const agrupadas = {};

            rawNotis.forEach((item) => {
                const clave = `${item.reaccion}-${item.post_id}`;
                if (!agrupadas[clave]) {
                    agrupadas[clave] = {
                        reaccion: item.reaccion,
                        post_id: item.post_id,
                        usuarios: [item.usuario2],
                        fecha: item.fecha,
                        lastUser: item.usuario2,
                    };
                } else {
                    agrupadas[clave].usuarios.push(item.usuario2);
                    if (new Date(item.fecha) > new Date(agrupadas[clave].fecha)) {
                        agrupadas[clave].fecha = item.fecha;
                        agrupadas[clave].lastUser = item.usuario2
                    }
                }
            });

            const notificacionesFinales = Object.values(agrupadas).sort(
                (a, b) => new Date(b.fecha) - new Date(a.fecha)
            );

            setNotis(notificacionesFinales);
        } catch (error) {
            console.error("Error al cargar los datos:", error);
        }
    };

    const getUsers = async () => {
        const response = await axiosInstance.get(`${urlUser}`);
        setUsers(response.data);
        
        getPosts();
    }

    const getPosts = async () => {
        const response = await axiosInstance.get(`${urlPost}`);
        setPosts(response.data);

        getNotis();
    }

    return (
        <div className="col-lg-3 d-none d-lg-flex justify-content-center der">
            <div>
                <p className="mb-2">🔔 Notificaciones</p>
                <br />
                {notis.length > 0 ? (
                    <div className="list-unstyled">
                        {notis.map((noti, index) => {
                            const usuariosStr =
                                noti.usuarios.length > 1
                                    ? `${noti.usuarios.length} personas`
                                    : '';
                            return (
                                <div key={`NotiKey${noti.id}`} className="card mt-4 rounded-5">
                                    <div className="card-body rounded-5">
                                        <div className="d-flex align-items-center justify-content-start">
                                            <img src={users.find(us => us.id == noti.lastUser).foto_perfil} className='me-3 rounded-circle' alt='Usuario' width="50" height="50" />
                                            {(noti.reaccion == "reaccion") ? (
                                                (noti.usuarios.length > 1) ? (
                                                    <p>{usuariosStr} reaccionaron a tu publicación <br />"<i className='notificacion'>{posts.find(po => po.id == noti.post_id).contenido}"</i></p>
                                                ): (
                                                    <p>{users.find(us => us.id == noti.lastUser).nombre_usuario} Reaccionó a tu publicación  <br />"<i className='notificacion'>{posts.find(po => po.id == noti.post_id).contenido}"</i></p>
                                                )
                                            ) : (
                                                (noti.usuarios.length > 1) ? (
                                                    <p>{usuariosStr} comentaron tu publicación  <br />"<i className='notificacion'>{posts.find(po => po.id == noti.post_id).contenido}"</i></p>
                                                ): (
                                                    <p>{users.find(us => us.id == noti.lastUser).nombre_usuario} comentó tu publicación  <br />"<i className='notificacion'>{posts.find(po => po.id == noti.post_id).contenido}"</i></p>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p>No hay notificaciones nuevas.</p>
                )}
            </div>
        </div>
    );
};
