import React, { useEffect, useState } from "react";
import perfilGenerico from "../assets/perfilGenerico.jpg";
import { useParams } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Post } from "../components/Post";
import Swal from "sweetalert2";
import { Link } from "react-router";
import { Bounce, ToastContainer, toast } from 'react-toastify';
import ubi from "../assets/ubicacion.png";
import huella from "../assets/huella.png";
import genero from "../assets/genero.png";
import preferencia from "../assets/preferencia.png";
import axiosInstance from "../services/axiosInstace";
import { PostBar } from "../components/PostBar";

import fondo1 from "../assets/bp.avif"

export const Perfil = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const urlUser = `${API_URL}/mascotas/api/`;
    const urlPost = `${API_URL}/posts/api/`;
    const urlAmigos = `${API_URL}/amistades/api/`;

    let { username: paramUsername } = useParams();
    const user = JSON.parse(sessionStorage.getItem("usuario"));
    let loggeado = localStorage.getItem("username");

    const [edad, setEdad] = useState(0);
    const [edadOrig, setEdadOrig] = useState(0);
    const [esAdmin, setEsAdmin] = useState(false);
    const [esAdminOrig, setEsAdminOrig] = useState(false);
    const [especie, setEspecie] = useState("");
    const [especieOrig, setEspecieOrig] = useState("");
    const [password, setPassword] = useState("");
    const [passwordOrig, setPasswordOrig] = useState("");
    const [fechaNac, setFechaNac] = useState("");
    const [fechaNacOrig, setFechaNacOrig] = useState("");
    const [fotoPerf, setFotoPerf] = useState(null);
    const [fotoPerfOrig, setFotoPerfOrig] = useState(null);
    const [id, setId] = useState("");
    const [idOrig, setIdOrig] = useState("");
    const [isActive, setIsActive] = useState("");
    const [isActiveOrig, setIsActiveOrig] = useState("");
    const [joinDate, setJoinDate] = useState("");
    const [joinDateOrig, setJoinDateOrig] = useState("");
    const [lastLogin, setLastLogin] = useState("");
    const [lastLoginOrig, setLastLoginOrig] = useState("");
    const [nomUsuario, setNomUsuario] = useState("");
    const [nomUsuarioOrig, setNomUsuarioOrig] = useState("");
    const [preferencias, setPreferencias] = useState("");
    const [preferenciasOrig, setPreferenciasOrig] = useState("");
    const [raza, setRaza] = useState("");
    const [razaOrig, setRazaOrig] = useState("");
    const [sexo, setSexo] = useState("");
    const [sexoOrig, setSexoOrig] = useState("");
    const [ubicacion, setUbicacion] = useState("");
    const [ubicacionOrig, setUbicacionOrig] = useState("");
    const [btnEditar, setBtnEditar] = useState(false); // Este usualmente no necesita copia
    const [idPerfil, setIdPerfil] = useState(null);
    const [correo, setCorreo] = useState("");
    const [correoOrig, setCorreoOrig] = useState("");


    const [esUsuaruioLog, setEsUsuarioLog] = useState(false)

    const [posts, setPosts] = useState([]);
    const [imgPost, setImgPost] = useState(0);
    const [numImgs, setNumImgs] = useState(0);
    const [numPost, setnumPost] = useState(0);

    const [loading, setLoading] = useState(false);

    const [amigos, setAmigos] = useState([]);
    const [misAmigos, setMisAmigos] = useState([]);
    const [numAmigos, setNumAmigos] = useState(0);
    const [solicPendiente, setSolicPendiente] = useState([]);
    const [solicPendientePropia, setSolicPendientePropia] = useState([]);

    const [modalActIsOpen, setActIsOpen] = React.useState(false);
    const [modalAmigos, setModalAmigos] = React.useState(false);

    const [reloadLayout, setReloadLayout] = useState(false);
    const [step, setStep] = useState(1);

    useEffect(() => {
        const cargarDatos = async () => {
            limpiar();

            const idObtenido = await getUsers();
            if (!idObtenido) return;

            if (amigos.length > 0) {
                await Promise.all(
                    amigos.map(async (amigo) => {
                        if (amigo?.id) {
                            await getSolicitudesPendientes(user.id, amigo.id);
                        }
                    })
                );
            }

            await Promise.all([
                getSolicitudesPendientes(user.id, idObtenido),
                getSolicitudesPendientesPropias(user.id, idObtenido)
            ]);

            setLoading(false);
        };

        cargarDatos();
    }, [paramUsername]);

    const limpiar = () => {
        setEdad(0);
        setEspecie("");
        setFechaNac("");
        setIsActive("");
        setJoinDate("");
        setLastLogin("");
        setNomUsuario("");
        setPreferencias("");
        setRaza("");
        setSexo("");
        setUbicacion("");
        setIdPerfil(null);
        getPosts([]);
        setAmigos([]);
        setMisAmigos([]);
        setEsAdmin(false);
        setPassword("");
        setCorreo("")
        setId(0);
        setStep(1);
        setConfirmarContrasena("")
        setNuevaContrasena("")
        setEsUsuarioLog(false);
        setBtnEditar(false);
        setAmigos([]);
        setNumAmigos(0);
        setSolicPendiente([]);
        setSolicPendientePropia([]);
        setNumImgs(0);
        setImgPost(0);
        setPosts([]);
    }

    const getUsers = async () => {
        try {
            const respuesta = await axiosInstance.get(urlUser);
            const usuarioEncontrado = respuesta.data.find(u => u.nombre_usuario === paramUsername);
            if (usuarioEncontrado) {
                console.log(usuarioEncontrado)
                setUser(usuarioEncontrado);
                setIdPerfil(usuarioEncontrado.id);
                return usuarioEncontrado.id;
            } else {
                setFotoPerf(perfilGenerico);
                setNomUsuario("Perfil no encontrado");
                return null;
            }
        } catch (error) {
            console.error("Error al obtener datos del usuario", error);
            return null;
        }
    };

    const setUser = async (element) => {
        setEdad(element.edad || 0);
        setEdadOrig(element.edad || 0);
        setEspecie(element.especie || "No especificada");
        setEspecieOrig(element.especie || "No especificada");
        setFechaNac(element.fecha_nacimiento || "----");
        setFechaNacOrig(element.fecha_nacimiento || "----");
        setFotoPerf(element.foto_perfil);
        setFotoPerfOrig(element.foto_perfil);
        setIsActive(element.is_active || "");
        setIsActiveOrig(element.is_active || "");
        setJoinDate(element.join_date || "----");
        setJoinDateOrig(element.join_date || "----");
        setLastLogin(element.last_login || "----");
        setLastLoginOrig(element.last_login || "----");
        setCorreo(element.correo || "");
        setCorreoOrig(element.correo || "");
        setNomUsuario(element.nombre_usuario || "Nombre no encontrado");
        setNomUsuarioOrig(element.nombre_usuario || "Nombre no encontrado");
        setPreferencias(element.preferencias || "No especificado");
        setPreferenciasOrig(element.preferencias || "No especificado");
        setRaza(element.raza || "No especificado");
        setRazaOrig(element.raza || "No especificado");
        setSexo(element.sexo || "No especificado");
        setSexoOrig(element.sexo || "No especificado");
        setUbicacion(element.ubicacion || "El arenero mas cercano");
        setUbicacionOrig(element.ubicacion || "El arenero mas cercano");
        setIdPerfil(element.id);
        getPosts(element.id);
        getAmigos(element.id);
        getAmigosPropio(user.id);

        await getSolicitudesPendientesPropias(user.id, element.id);

        if (element.nombre_usuario == loggeado) {
            setEsUsuarioLog(true);
            setEsAdmin(element.es_admin || false);
            setPassword(element.password);
            setId(element.id);
            setBtnEditar(true);
            console.log(btnEditar);
        }
    };

    const getPosts = async (idUser) => {
        if (loading) return;
        setLoading(true);

        try {
            const respuesta = await axiosInstance.get(urlPost);

            const publicaciones = respuesta.data.filter(post => post.mascota === idUser);

            setPosts(publicaciones);
            setnumPost(publicaciones.length)

            const postFiltradoDescendente = publicaciones.sort((a, b) => b.id - a.id);
            const imagenesRecientes = postFiltradoDescendente.flatMap(post => post.imagenes)
                .slice(0, 4);

            setImgPost(imagenesRecientes);

            const totalImagenes = publicaciones.reduce((acc, post) => acc + post.imagenes.length, 0);

            setNumImgs(totalImagenes);
        } catch (error) {
            console.error("Error al obtener publicaciones:", error);
        } finally {
            setLoading(false);
        }
    };

    const getAmigos = async (idPerfil) => {
        try {
            const respuesta = await axiosInstance.get(urlAmigos + idPerfil + '/obtener_amigos/');
            setAmigos(respuesta.data)
            setNumAmigos(respuesta.data.length)
        } catch (error) {
            console.error("Error al obtener datos del usuario", error);
        }
    };

    const getAmigosPropio = async (idLoggeado) => {
        try {
            const respuesta = await axiosInstance.get(urlAmigos + idLoggeado + '/obtener_amigos/');

            setMisAmigos(respuesta.data)
        } catch (error) {
            console.error("Error al obtener datos del usuario", error);
        }
    };

    const getSolicitudesPendientes = async (idLoggeado, idReceptor) => {
        try {

            if (!idLoggeado || !idReceptor) return;
            const respuesta = await axiosInstance.get(urlAmigos + idReceptor + "/obtener_solicitudes_pendientes/");

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
            const respuesta = await axiosInstance.get(urlAmigos + idLoggeado + "/obtener_solicitudes_pendientes/");

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

            const resp = await axiosInstance.post(urlAmigos + idLoggeado + "/enviar_solicitud/", parametros);

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

    function openActModal(id_, nombre_, edad_, especie_, fecha_nac_, foto_per_, preferencias_, raza_, sexo_, ubicacion_, correo_) {
        setEdad(edad_);
        setId(id_)
        setEspecie(especie_);
        setFechaNac(fecha_nac_);
        setFotoPerf(foto_per_);
        setNomUsuario(nombre_);
        setPreferencias(preferencias_);
        setRaza(raza_);
        setSexo(sexo_);
        setUbicacion(ubicacion_);
        setCorreo(correo_)
        setActIsOpen(true);
    }

    function closeModalAct() {
        setActIsOpen(false);
        setStep(1);
    }

    async function openModalAmigos(amigos) {
        setAmigos(amigos);

        await Promise.all(amigos.map(async (amigo) => {
            await getSolicitudesPendientes(user.id, amigo.id);
            await getSolicitudesPendientesPropias(user.id, amigo.id);
        }));

        setModalAmigos(true);
    }

    function closeModalAmigos() {
        setModalAmigos(false);
    }

    const actualizarMascota = async (event) => {
        event.preventDefault();

        // Validación para actualizar la contraseña
        const cambiandoContrasena = nuevaContrasena.trim() !== "" || confirmarContrasena.trim() !== "";
        if (cambiandoContrasena) {
            if(!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{5,}$/.test(nuevaContrasena)){
                Swal.fire("Nueva contraseña no válida", "Debe contener al menos 5 carácteres, una mayúscula, un número y un carácter especial", "warning");
                return;
            }
            else if (nuevaContrasena.trim() === "" || confirmarContrasena.trim() === "" || nuevaContrasena !== confirmarContrasena) {
                Swal.fire("Nueva contraseña no válida", "Las contraseñas no pueden estar vacías y deben coincidir", "warning");
                return;
            }

            const parametrosPassword = {
                password: nuevaContrasena
            };

            const urlActualizarPassword = `${urlUser}${id}/actualizar_contrasena/`;

            await axiosInstance({
                method: 'PUT',
                url: urlActualizarPassword,
                data: parametrosPassword
            }).then(function (result) {
                if (result.status === 200) {
                    Swal.fire("Contraseña actualizada", "La contraseña se actualizó correctamente", "success");
                    closeModalAct();
                    setStep(1);
                    getUsers();
                    limpiar()
                    triggerReload();
                }
            }).catch(function (error) {
                console.log(error);
                Swal.fire("Error al actualizar contraseña", "No se pudo actualizar la contraseña", "error");
            });

            return;
        }

        if (!nomUsuario || nomUsuario.trim() === "") {
            Swal.fire("Nombre faltante", "Escribe el nombre de la mascota", "warning");
            return;
        } else if (!correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            Swal.fire("Correo inválido", "Escribe un correo electrónico válido", "warning");
            return;
        } else if (!edad || isNaN(edad) || edad <= 0) {
            Swal.fire("Edad faltante", "Escribe una edad válida para la mascota", "warning");
            return;
        } else if (!especie || especie.trim() === "") {
            Swal.fire("Especie faltante", "Escribe la especie de la mascota", "warning");
            return;
        } else if (!fechaNac || fechaNac.trim() === "") {
            Swal.fire("Fecha de nacimiento faltante", "Selecciona una fecha de nacimiento válida", "warning");
            return;
        } else if (!fotoPerf || fotoPerf.trim() === "") {
            Swal.fire("Foto de perfil no válida", "Proporciona una URL válida para la foto de perfil", "warning");
            return;
        } else if (!preferencias || preferencias.trim() === "") {
            Swal.fire("Preferencia faltante", "Escribe las preferencias de la mascota", "warning");
            return;
        } else if (!raza || raza.trim() === "") {
            Swal.fire("Raza faltante", "Escribe la raza de la mascota", "warning");
            return;
        } else if (!sexo || sexo.trim() === "" || !["Macho", "Hembra", "Prefiero no decirlo"].includes(sexo)) {
            Swal.fire("Sexo faltante", "Selecciona un sexo válido", "warning");
            return;
        } else if (!ubicacion || ubicacion.trim() === "") {
            Swal.fire("Ubicación no válida", "Escribe la ubicación de la mascota", "warning");
            return;
        }

        // Llamada para actualizar los datos generales
        const parametros = {
            last_login: lastLogin,
            nombre_usuario: nomUsuario,
            especie: especie,
            edad: parseInt(edad),
            raza: raza,
            correo: correo,
            fecha_nacimiento: fechaNac,
            sexo: sexo,
            ubicacion: ubicacion,
            foto_perfil: fotoPerf,
            preferencias: preferencias,
            is_active: isActive,
            es_admin: esAdmin,
            join_date: joinDate
        };

        const urlActualizar = `${urlUser}${id}/`;

        console.log(parametros)
        console.log(urlActualizar)
        await axiosInstance({
            method: 'PATCH',
            url: urlActualizar,
            data: parametros
        }).then(function (result) {
            if (result.status === 200) {
                Swal.fire("Perfil actualizado", "El perfil se actualizó correctamente", "success");
            }
            closeModalAct();
            setStep(1);
            getUsers();
            limpiar();
            triggerReload();
        }).catch(function (error) {
            console.log(error);
            Swal.fire("Ha ocurrido un error", "Algo ha ocurrido", "error");
        });
    };



    const [mostrar, setMostrar] = useState(false);
    const [nuevaContrasena, setNuevaContrasena] = useState("");
    const [confirmarContrasena, setConfirmarContrasena] = useState("");

    const mostrarCamposContra = () => {
        setMostrar(!mostrar);
        setNuevaContrasena("");
        setConfirmarContrasena("");
    };

    const triggerReload = () => {
        setReloadLayout(prev => !prev);
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const base64Image = await convertToBase64(file);
                setFotoPerf(base64Image);
            } catch (error) {
                toast.error('Error al procesar la imagen');
                console.error(error);
            }
        }
    };

    if (loading) {
        return <Layout><div className="d-flex justify-content-center align-items-center"><p>Cargando usuarios...</p></div></Layout>;
    }


    const contenido = (
        <>
            <ToastContainer />
            <div className="d-flex justify-content-center align-items-center">
                <div className="py-4 h-100">
                    <div className="row justify-content-center align-items-center h-100">
                        <div className="col-lg-12 col-xl-12" style={{ width: "50vw" }}>
                            <div className="card rounded-5 rounded-bottom-5">
                                <div
                                    className="rounded-top-5 text-white d-flex flex-row border border-bottom-0"
                                    style={{
                                        backgroundImage: `url(${fondo1})`,
                                        height: "20vh",
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }}
                                >
                                    <div className="ms-4 mt-5 d-flex flex-column" style={{}}>
                                        <img
                                            src={fotoPerf}
                                            alt="Perfil"
                                            className="mt-4 mb-2 img-thumbnail rounded-5"
                                            draggable="false"
                                            style={{ zIndex: "1", height: "20vh", minHeight: "20vh", minWidth: "10vw", maxWidth: "10vw" }}
                                        />
                                    </div>
                                    <div className="ms-3" style={{ marginTop: "14vh" }}>
                                        <h5 style={{ color: "#000000", fontSize: "25px" }}>{nomUsuario}</h5>
                                    </div>
                                    <div className="flex-grow-1 d-flex justify-content-end p-2 ms-5 me-2 mt-5" >
                                        <div className="d-flex align-items-center pt-5" style={{ color: "black" }}>
                                            {user.id === idPerfil ? (
                                                <span className="text-gray mt-2 fs-6"></span>
                                            ) : esAmigo(idPerfil) ? (
                                                <span className="text-gray mt-2 fs-6">Amigo</span>
                                            ) : solicPendiente.some(solicitud => solicitud.mascota_receptora_id === idPerfil) ? (
                                                <span className=" text-gray mt-2 fs-6">Solicitud enviada</span>
                                            ) : solicPendientePropia.some(solicitud => solicitud.mascota_solicitante_id === idPerfil) ? (
                                                <span className=" text-gray mt-2 fs-6">Solicitud pendiente</span>
                                            ) : (
                                                <button className="btn btn-outline-light mb-3 text-gray mt-2 fs-6" style={{ backgroundColor: '#7B1FA2', color: 'white' }} onClick={() => enviarSolicitud(user.id, idPerfil)}>
                                                    Enviar solicitud
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-2 pe-4 text-black border border-bottom-0" style={{ backgroundColor: "#f8f9fa" }}>

                                    <div className="d-flex justify-content-end text-center py-1">
                                        <div>
                                            <h5 className="mb-1">{numImgs}</h5>
                                            <p className="small text-muted">Fotos</p>
                                        </div>
                                        <div className="px-3" onClick={() => openModalAmigos(amigos)}>
                                            <h5 className="mb-1">{numAmigos}</h5>
                                            <p className="small text-muted">Amigos</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body text-black p-4 pt-2 border-bottom-0 pb-2">
                                    <div className="mb-1 mt-1 ">
                                        <p className="lead fw-normal mb-1">Detalles</p>
                                        <div className="p-4 rounded-5 mt-3 mb-3" style={{ backgroundColor: "#f8f9fa" }}>
                                            <p className="font-italic mb-1 d-flex align-items-center">
                                                <img src={ubi} alt="Ubicación" style={{ marginRight: "6px" }} />
                                                {ubicacion}
                                            </p>
                                            <p className="font-italic mb-1 d-flex align-items-center">
                                                <img src={genero} alt="Genero" style={{ marginRight: "6px" }} />
                                                {sexo}
                                            </p>
                                            <p className="font-italic mb-1 d-flex align-items-center">
                                                <img src={huella} alt="Especie" style={{ marginRight: "6px" }} />
                                                {especie}
                                            </p>
                                            <p className="font-italic mb-1 d-flex align-items-center">
                                                <img src={preferencia} alt="Preferencia" style={{ marginRight: "6px" }} />
                                                {preferencias}
                                            </p>
                                        </div>
                                        <div className="d-flex justify-content-end">
                                            {btnEditar && (
                                                <button
                                                    className="me-2 btn"
                                                    style={{ height: "2.5rem", backgroundColor: '#7B1FA2', color: "white", border: 0, fontSize: "18px" }}
                                                    onClick={() => openActModal(id, nomUsuario, edad, especie, fechaNac, fotoPerf, preferencias, raza, sexo, ubicacion, correo)}>
                                                    Editar perfil
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body text-black p-4 rounded-bottom-5">
                                    {imgPost.length > 0 && (
                                        <>
                                            <div className="d-flex justify-content-between align-items-center mb-4">
                                                <p className="lead fw-normal mb-0">Fotos recientes</p>
                                            </div>
                                            <div className="row g-2">
                                                <div className="col mb-2">
                                                    {imgPost[0] && (
                                                        <img src={imgPost[0].imagen_base64} className="w-100 rounded-3" alt="Foto 1" />
                                                    )}
                                                </div>
                                                <div className="col mb-2">
                                                    {imgPost[1] && (
                                                        <img src={imgPost[1].imagen_base64} className="w-100 rounded-3" alt="Foto 2" />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="row g-2">
                                                <div className="col mb-2">
                                                    {imgPost[2] && (
                                                        <img src={imgPost[2].imagen_base64} className="w-100 rounded-3" alt="Foto 3" />
                                                    )}
                                                </div>
                                                <div className="col mb-2">
                                                    {imgPost[3] && (
                                                        <img src={imgPost[3].imagen_base64} className="w-100 rounded-3" alt="Foto 4" />
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <hr />
                                    {btnEditar == true && (
                                        <PostBar user={user} posts={posts} setPosts={setPosts} />
                                    )}
                                    {numPost > 0 && (
                                        <>
                                            <div className="d-flex justify-content-between align-items-center mt-5 mb-4">
                                                <p className="lead fw-normal mb-0">Publicaciones</p>
                                            </div>
                                            {posts
                                                .sort((a, b) => b.id - a.id)
                                                .map((post) => {
                                                    const images = post.imagenes ? post.imagenes.map((img) => img.imagen_base64) : (post.img || []);
                                                    return (
                                                        <Post
                                                            key={post.id}
                                                            postId={post.id}
                                                            picUser={fotoPerf}
                                                            user={nomUsuario}
                                                            body={post.contenido}
                                                            picsBody={images}
                                                        />
                                                    );
                                                })}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            <div
                className={`modal fade ${modalActIsOpen && step === 1 ? "show d-block" : ""}`}
                id="modalActualizar"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="modalActualizarLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="modalActualizarLabel">Actualizar datos personales</h5>
                            <button type="button" className="close" aria-label="Close" onClick={closeModalAct}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="container">
                                <div className="row mb-3">
                                    <div className="col-md-6 text-center">
                                        <label htmlFor="foto-perfil" className="d-block">
                                            <div className="profile-picture-container mx-auto">
                                                {fotoPerf ? (
                                                    <img
                                                        src={fotoPerf}
                                                        alt="Preview"
                                                        className="profile-picture rounded-circle"
                                                        style={{ objectFit: "cover", width: "150px", height: "150px" }}
                                                    />
                                                ) : (
                                                    <div
                                                        className="profile-picture-placeholder rounded-circle d-flex justify-content-center align-items-center"
                                                        style={{ width: "150px", height: "150px", backgroundColor: "#f0f0f0" }}
                                                    >
                                                        <i className="bi bi-camera fs-1 text-muted"></i>
                                                    </div>
                                                )}
                                            </div>
                                        </label>
                                        <input
                                            type="file"
                                            id="foto-perfil"
                                            className="d-none"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                        <div className="mb-3">
                                            <label>Nombre completo:</label>
                                            <p>{nomUsuario}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label>Correo electrónico:</label>
                                            <input type="email" className="form-control" value={correo} onChange={(e) => setCorreo(e.target.value)} />
                                        </div>
                                        <div className="mb-3">
                                            <label>Especie:</label>
                                            <input type="text" className="form-control" value={especie} onChange={(e) => setEspecie(e.target.value)} maxLength="10" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-light" onClick={() => setStep(3)}>Cambiar contraseña</button>
                            <button type="button" className="btn btn-secondary" onClick={closeModalAct}>Cancelar</button>
                            <button type="button" className="btn btn-primary" onClick={() => setStep(2)}>Siguiente</button>
                        </div>
                    </div>
                </div>
            </div>
            {modalActIsOpen && step === 1 && <div className="modal-backdrop fade show"></div>}




            <div
                className={`modal fade ${modalActIsOpen && step === 2 ? "show d-block" : ""}`}
                id="modalAdicionales"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="modalAdicionalesLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="modalAdicionalesLabel">Datos adicionales</h5>
                            <button type="button" className="close" aria-label="Close" onClick={closeModalAct}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="container">
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label>Sexo:</label>
                                            <select className="form-select" value={sexo} onChange={(e) => setSexo(e.target.value)}>
                                                <option value="">Selecciona tu sexo</option>
                                                <option value="Macho">Macho</option>
                                                <option value="Hembra">Hembra</option>
                                                <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label>Preferencia:</label>
                                            <input type="text" className="form-control" value={preferencias} onChange={(e) => setPreferencias(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label>Raza:</label>
                                            <input type="text" className="form-control" value={raza} onChange={(e) => setRaza(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label>Ubicación:</label>
                                            <input type="text" className="form-control" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label>Edad:</label>
                                            <input type="number" className="form-control" value={edad} onChange={(e) => setEdad(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label>Fecha de nacimiento:</label>
                                            <input type="date" className="form-control" value={fechaNac} onChange={(e) => setFechaNac(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-light" onClick={() => setStep(3)}>Cambiar contraseña</button>
                            <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>Anterior</button>
                            <button type="button" className="btn btn-success" onClick={actualizarMascota}>Actualizar</button>
                        </div>
                    </div>
                </div>
            </div>
            {modalActIsOpen && step === 2 && <div className="modal-backdrop fade show"></div>}





            <div
                className={`modal fade ${modalActIsOpen && step === 3 ? "show d-block" : ""}`}
                id="modalActualizarContraseña"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="modalActualizarContraseñaLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-md modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="modalActualizarContraseñaLabel">Actualizar contraseña</h5>
                            <button type="button" className="close" aria-label="Close" onClick={closeModalAct}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label>Nueva contraseña:</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                value={nuevaContrasena}
                                                onChange={(e) => setNuevaContrasena(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label>Confirmar contraseña:</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                value={confirmarContrasena}
                                                onChange={(e) => setConfirmarContrasena(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={closeModalAct}>
                                Cancelar
                            </button>
                            <button type="button" className="btn btn-primary" onClick={(e) => actualizarMascota(e)}>
                                Actualizar Contraseña
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {modalActIsOpen && step === 3 && <div className="modal-backdrop fade show"></div>}




            <div
                className={`modal fade ${modalAmigos ? "show d-block" : ""}`}
                id="modalAmigos"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="modalAmigosLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-md modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="modalAmigosLabel">
                                {nomUsuario === loggeado ? 'Tus amigos' : `Amigos de ${nomUsuario}`}
                            </h5>
                            <button type="button" className="close" aria-label="Close" onClick={closeModalAmigos}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="container d-flex flex-column">
                                <div className="d-flex flex-column w-100 justify-content-center">
                                    {amigos.map((amigo) => (
                                        <div
                                            key={amigo.id}
                                            className="d-flex m-2 justify-content-between align-items-center border-bottom"
                                        >
                                            <a
                                                href={`/MiauSpace/Perfil/${amigo.nombre}`}
                                                className="text-decoration-none"
                                                onClick={() => {
                                                    closeModalAmigos();
                                                    limpiar();
                                                }}
                                            >
                                                <div className="d-flex align-items-center">
                                                    <img
                                                        src={amigo.foto_perfil}
                                                        alt="Perfil"
                                                        className="rounded-circle perfil-img ms-1"
                                                        style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                                    />
                                                    <p className="mb-0 fw-bold nombre-usuario ms-2">{amigo.nombre}</p>
                                                </div>
                                            </a>

                                            {amigo.nombre === loggeado ? null : esAmigo(amigo.id) ? (
                                                <span>Amigo</span>
                                            ) : solicPendiente.some(
                                                (solicitud) =>
                                                    solicitud.mascota_receptora_id === amigo.id
                                            ) ? (
                                                <span>Solicitud enviada</span>
                                            ) : solicPendientePropia.some(
                                                (solicitud) =>
                                                    solicitud.mascota_solicitante_id === amigo.id
                                            ) ? (
                                                <span>Solicitud pendiente</span>
                                            ) : (
                                                <button
                                                    className="btn"
                                                    style={{ backgroundColor: "#7B1FA2", color: "white" }}
                                                    onClick={() => enviarSolicitud(user.id, amigo.id)}
                                                >
                                                    Enviar solicitud
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={closeModalAmigos}>
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Backdrop oscuro */}
            {modalAmigos && <div className="modal-backdrop fade show"></div>}
        </>
    )
    return (
        <Layout key={reloadLayout ? "v1" : "v2"}>
            {contenido}
        </Layout>

    );
};