import React, { useEffect, useState } from "react";
import axios from "axios";
import fotoPerfil from "../assets/skibidi.jpeg";
import perfilGenerico from "../assets/perfilGenerico.jpg";
import { useParams } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Post } from "../components/Post";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Col, Container, Nav, Row } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Swal from "sweetalert2";
import { Link } from "react-router";
import { Bounce, ToastContainer, toast } from 'react-toastify';

export const Perfil = () => {
    const urlUser = "http://127.0.0.1:8000/mascotas/api/";
    const urlPost = 'http://127.0.0.1:8000/posts/api/';
    const urlAmigos= 'http://127.0.0.1:8000/amistades/api/';

    let { username: paramUsername } = useParams();
    const user = JSON.parse(sessionStorage.getItem("usuario"));
    let loggeado = localStorage.getItem("username");

    const [edad, setEdad] = useState(0);
    const [esAdmin, setEsAdmin] = useState(false);
    const [especie, setEspecie] = useState("");
    const [password, setPassword] = useState("");
    const [fechaNac, setFechaNac] = useState("");
    const [fotoPerf, setFotoPerf] = useState(null);
    const [id, setId] = useState("");
    const [isActive, setIsActive] = useState("");
    const [joinDate, setJoinDate] = useState("");
    const [lastLogin, setLastLogin] = useState("");
    const [nomUsuario, setNomUsuario] = useState("");
    const [preferencias, setPreferencias] = useState("");
    const [raza, setRaza] = useState("");
    const [sexo, setSexo] = useState("");
    const [ubicacion, setUbicacion] = useState("");
    const [btnEditar, setBtnEditar] = useState(false);
    const [idPerfil, setIdPerfil] = useState(null);


    const [posts, setPosts] = useState([]);
    const [imgPost, setImgPost] = useState(0);
    const [numImgs, setNumImgs] = useState(0);
    const [numPost, setnumPost] = useState(0);

    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const [amigos, setAmigos] = useState([]);
    const [misAmigos, setMisAmigos] = useState([]);
    const [numAmigos, setNumAmigos] = useState(0);
    const [solicPendiente, setSolicPendiente] = useState([]);
    const [solicPendientePropia, setSolicPendientePropia] = useState([]);

    const [modalActIsOpen, setActIsOpen] = React.useState(false);
    const [modalAmigos, setModalAmigos] = React.useState(false);

    useEffect(() => {
        getUsers();
        
    }, [paramUsername]);

    const limpiar = () =>{
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
        setIdPerfil([]);
        getPosts([]);
        getAmigos([])
        getAmigosPropio(0)
        setEsAdmin(false);
        setPassword("")
        setId(0)
        setBtnEditar(false);
    }
    const getUsers = async () => {
        try {
            const respuesta = await axios.get(urlUser);
            const usuarioEncontrado = respuesta.data.find(u => u.nombre_usuario === paramUsername);
            if (usuarioEncontrado) {
                setUser(usuarioEncontrado);

            } else {
                setFotoPerf(perfilGenerico);
                setNomUsuario("Perfil no encontrado");
            }
        } catch (error) {
            console.error("Error al obtener datos del usuario", error);
        }
    };

    const setUser = async (element) => {
        setEdad(element.edad || 0);
        setEspecie(element.especie || "No especificada");
        setFechaNac(element.fecha_nacimiento || "----");
        setFotoPerf(element.foto_perfil);
        setIsActive(element.is_active || "");
        setJoinDate(element.join_date || "----");
        setLastLogin(element.last_login || "----");
        setNomUsuario(element.nombre_usuario || "Nombre no encontrado");
        setPreferencias(element.preferencias || "No especificado");
        setRaza(element.raza || "No especificado");
        setSexo(element.sexo || "No especificado");
        setUbicacion(element.ubicacion || "");
        setIdPerfil(element.id);
        getPosts(element.id);
        getAmigos(element.id)
        getAmigosPropio(user.id)

        await getSolicitudesPendientesPropias(user.id, element.id) 
        if (element.nombre_usuario == loggeado) {
            setEsAdmin(element.es_admin || false);
            setPassword(element.password)
            setId(element.id)
            
            setBtnEditar(true);
        }
    };

    const getPosts = async (idUser) => {
        if (loading) return;
        setLoading(true);

        try {
            const respuesta = await axios.get(urlPost);

            const publicaciones = respuesta.data.filter(post => post.mascota === idUser);

            setPosts(publicaciones);
            setnumPost(publicaciones.length)
            
            const postFiltradoDescendente = publicaciones.sort((a, b) => b.id - a.id);
            const imagenesRecientes = postFiltradoDescendente.flatMap(post => post.imagenes)
                                              .slice(0, 4);

            setImgPost(imagenesRecientes);

            const totalImagenes = publicaciones.reduce((acc, post) => acc + post.imagenes.length, 0);

            setNumImgs(totalImagenes);
            /*
            let nuevosPosts = publicaciones;
            
            nuevosPosts = nuevosPosts.sort(() => Math.random() - 0.5);

            setPosts(prevPosts => [...prevPosts, ...nuevosPosts]);
            setPage(prevPage => prevPage + 1);*/
        } catch (error) {
            console.error("Error al obtener publicaciones:", error);
        } finally {
            setLoading(false);
        }
    };

    const getAmigos = async (idPerfil) => {
        try {
            const respuesta = await axios.get(urlAmigos+idPerfil+'/obtener_amigos/');
            setAmigos(respuesta.data)
            setNumAmigos(respuesta.data.length)
        } catch (error) {
            console.error("Error al obtener datos del usuario", error);
        }
    };

    const getAmigosPropio = async (idLoggeado) => {
        try {
            const respuesta = await axios.get(urlAmigos+idLoggeado+'/obtener_amigos/');
            
            setMisAmigos(respuesta.data)
        } catch (error) {
            console.error("Error al obtener datos del usuario", error);
        }
    };

    const getSolicitudesPendientes = async (idLoggeado, idReceptor) => {
        try {
            const respuesta = await axios.get(urlAmigos + idReceptor + "/obtener_solicitudes_pendientes/");
    
            const solicitudes = respuesta.data.filter(solicitud =>
                solicitud.mascota_solicitante_id === idLoggeado &&
                solicitud.mascota_receptora_id === idReceptor
            );
            console.log(solicitudes)
            setSolicPendiente(prev => [...prev, ...solicitudes]); 
    
        } catch (error) {
            console.error("Error al obtener solicitudes pendientes", error);
        }
    };

    const getSolicitudesPendientesPropias = async (idLoggeado, idReceptor) => {
        try {
            const respuesta = await axios.get(urlAmigos + idLoggeado + "/obtener_solicitudes_pendientes/");
    
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
            console.log("enviarSolicitud: ", parametros);
    
            const resp = await axios.post(urlAmigos + idLoggeado + "/enviar_solicitud/", parametros);
            console.log(resp);
    
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

    function openActModal(id_, nombre_, edad_, especie_, fecha_nac_, foto_per_, preferencias_,raza_,sexo_,ubicacion_) {
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

        setActIsOpen(true);
    }

    function closeModalAct() {
        setActIsOpen(false);
    }

    function openModalAmigos(amigos) {
        setAmigos(amigos);
        setModalAmigos(true);
        
        amigos.forEach(amigo => {
            getSolicitudesPendientes(user.id, amigo.id);
            getSolicitudesPendientesPropias(user.id, amigo.id);
        });
    }
    
    function closeModalAmigos() {
        setModalAmigos(false);
    }

    const actualizarMascota = async (event) => {
        event.preventDefault();

        if (!nomUsuario || nomUsuario.trim() === "") {
            Swal.fire("Nombre faltante","Escribe el nombre de la mascota", "warning");
        } else if (!edad || isNaN(edad) || edad <= 0) {
            Swal.fire("Edad faltante","Escribe una edad válida para la mascota", "warning");
        } else if (!especie || especie.trim() === "") {
            Swal.fire("Especie faltante","Escribe la especie de la mascota", "warning");
        } else if (!fechaNac || fechaNac.trim() === "") {
            Swal.fire("Fecha de nacimiento faltante","Selecciona una fecha de nacimiento válida", "warning");
        } else if (!fotoPerf || fotoPerf.trim() === "" || !fotoPerf.startsWith("http")) {
            Swal.fire("Foto de perfil no válida","Proporciona una URL válida para la foto de perfil", "warning");
        } else if (!preferencias || preferencias.trim() === "") {
            Swal.fire("Preferencia faltante","Escribe las preferencias de la mascota", "warning");
        } else if (!raza || raza.trim() === "") {
            Swal.fire("Raza faltante","Escribe la raza de la mascota", "warning");
        } else if (!sexo || sexo.trim() === "" || !["Macho", "Hembra","Prefiero no decirlo"].includes(sexo)) {
            Swal.fire("Sexo faltante","Selecciona un sexo válido", "warning");
        } else if (!ubicacion || ubicacion.trim() === "") {
            Swal.fire("Ubicación no válida","Escribe la ubicación de la mascota", "warning");
        } else if ((nuevaContrasena !== "" || confirmarContrasena !== "") && nuevaContrasena !== confirmarContrasena ) {
            Swal.fire("Nueva contraseña no es válida","Las contraseñas no pueden estar vacias y deben coincidir", "warning");
        } else {
            const urlActualizar= urlUser + id +"/"
            const parametros = {
                last_login: lastLogin,
                nombre_usuario: nomUsuario,
                password: nuevaContrasena !== "" ? nuevaContrasena : password,
                especie: especie,
                edad: parseInt(edad),
                raza: raza,               
                fecha_nacimiento: fechaNac,
                sexo: sexo,
                ubicacion: ubicacion,
                foto_perfil: fotoPerf,
                preferencias: preferencias,
                is_active: isActive,
                es_admin: esAdmin,
                join_date: joinDate
            };

            console.log(parametros)
            await axios({
                method: 'PUT',
                url: urlActualizar,
                data: parametros
            }).then(function (result) {
                if(result.data.status == "OK" && metodo=="PUT"){
                    Swal.fire("Perfil actualizado","El perfil se ha actualizado correctamente", "success");         
                }
                closeModalAct();
                getUsers();
            })
            .catch(function (error) {
                Swal.fire("Ha ocurrido un error","Algo ha ocurrido", "error");         
            });
        }
    };
    
    const [mostrar, setMostrar] = useState(false);
    const [nuevaContrasena, setNuevaContrasena] = useState("");
    const [confirmarContrasena, setConfirmarContrasena] = useState("");

    const mostrarCamposContra = () => {
        setMostrar(!mostrar);
        setNuevaContrasena("");
        setConfirmarContrasena("");
    };

    useEffect(() => {
        if (modalAmigos) {
            amigos.forEach(amigo => {
                getSolicitudesPendientes(user.id, amigo.id);
            });
        }
    }, [modalAmigos]); 

    useEffect(() => {
        if (idPerfil) {
            getSolicitudesPendientes(user.id, idPerfil);
            getSolicitudesPendientesPropias(user.id, idPerfil);
        }
    }, [idPerfil]);


    return (
        <Layout>
            <ToastContainer />
            <div className="gradient-custom-2">
                <div className="container py-5 h-100">
                    <div className="row justify-content-center align-items-center h-100">
                        <div className="col-lg-12 col-xl-12" style={{ width: "45vw" }}>
                            <div className="card">
                                <div
                                    className="rounded-top text-white d-flex flex-row"
                                    style={{ backgroundColor: "#40007a", height: "20vh" }}
                                >
                                    <div className="ms-4 mt-5 d-flex flex-column" style={{ width: "15%" }}>
                                        <img
                                            src={fotoPerf}
                                            alt="Perfil"
                                            className="mt-4 mb-2 img-thumbnail"
                                            draggable="false"
                                            style={{
                                                zIndex: "1",
                                                maxWidth: "10vw",
                                                maxHeight: "13vh",
                                                minHeight: "13vh"
                                            }}
                                        />
                                    </div>
                                    <div className="ms-3" style={{ marginTop: "15vh" }}>
                                        <h5>{nomUsuario}</h5>
                                    </div>
                                    {user.id === idPerfil ? (
                                            <span></span>
                                        ) :esAmigo(idPerfil) ? (
                                            <span>Amigo</span>
                                        ) : solicPendiente.some(solicitud => solicitud.mascota_receptora_id === idPerfil) ? (
                                            <span>Solicitud enviada</span>
                                        ) : solicPendientePropia.some(solicitud => solicitud.mascota_solicitante_id === idPerfil) ? (
                                            <span>Solicitud pendiente</span>
                                        ): (
                                            <button className="btn btn-outline-light ms-5 mt-5 " style={{ backgroundColor: '#7B1FA2', color: 'white' }} onClick={() => enviarSolicitud(user.id, idPerfil)}>
                                                Enviar solicitud
                                            </button>
                                        )}
                                </div>
                                <div className="p-2 pe-4 text-black" style={{ backgroundColor: "#f8f9fa" }}>
                                    
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
                                <div className="card-body text-black p-4 pt-2">
                                    <div className="mb-5">
                                        <p className="lead fw-normal mb-1">Detalles</p>
                                        <div className="p-4" style={{ backgroundColor: "#f8f9fa" }}>
                                            <p className="font-italic mb-1">Vive en: {ubicacion}</p>
                                            <p className="font-italic mb-1">Sexo: {sexo}</p>
                                            <p className="font-italic mb-0">Especie: {especie}</p>
                                        </div>
                                        {btnEditar && (
                                            <button
                                                className="btn btn-outline-dark"
                                                style={{ height: "2.5rem" }}
                                                onClick={() => openActModal(id,nomUsuario,edad,especie,fechaNac,fotoPerf,preferencias,raza,sexo,ubicacion)}>
                                                Editar perfil
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="card-body text-black p-4">
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
                                    {numPost > 0 && (
                                        <>
                                            <div className="d-flex justify-content-between align-items-center mt-5 mb-4">
                                                <p className="lead fw-normal mb-0">Publicaciones</p>
                                            </div>
                                            {posts
                                                .sort((a, b) => b.id - a.id) // Orden descendente
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

            <Modal show={modalActIsOpen} onHide={closeModalAct} size="lg" aria-labelledby="contained-modal-title-vcenter example-custom-modal-styling-title" centered backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Actualizar datos personales
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '60vh' }}>
                    <Container style={{ display: 'flex', flexDirection: 'column' }}>
                        <Row className="d-flex justify-content-center">
                            <Col md={6}>
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="ms-1">Nombre completo:</Form.Label><br />
                                        <Form.Label className="ms-1 mt-2" required readOnly>{nomUsuario}</Form.Label>
                                    </Form.Group>
                                </Form>
                            </Col>

                            <Col md={6}>
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="ms-1">Especie:</Form.Label>
                                        <Form.Control type="text" placeholder="Especie"
                                            value={especie} onChange={(e) => setEspecie(e.target.value)} maxLength="10" />
                                    </Form.Group>
                                </Form>
                            </Col>
                        </Row> <br />
                        <Row className="d-flex justify-content-center">
                            <Col md={6}>
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="ms-1">Sexo:</Form.Label>
                                        <Form.Select value={sexo} onChange={(e) => setSexo(e.target.value)}>
                                            <option value="">Selecciona tu sexo</option>
                                            <option value="Macho">Macho</option>
                                            <option value="Hembra">Hembra</option>
                                            <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Form>
                            </Col>
                            <Col md={6}>
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="ms-1">Fecha de nacimiento:</Form.Label>
                                        <Form.Control required type="date" value={fechaNac} onChange={(e) => setFechaNac(e.target.value)} />
                                    </Form.Group>
                                </Form>
                            </Col>
                        </Row><br />
                        <Row className="d-flex justify-content-center">
                            <Col md={6}>
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="ms-1">Preferencia:</Form.Label>
                                        <Form.Control type="text" placeholder="Preferencia" required value={preferencias} onChange={(e) => setPreferencias(e.target.value)} />
                                    </Form.Group>
                                </Form>
                            </Col>
                            <Col md={6}>
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="ms-1">Raza:</Form.Label>
                                        <Form.Control required type="text" value={raza} onChange={(e) => setRaza(e.target.value)} />
                                    </Form.Group>
                                </Form>
                            </Col>
                        </Row><br />
                        <Row className="d-flex justify-content-center">
                            <Col md={4}>
                                <Form>
                                    <Form.Group>
                                        <Form.Label className="ms-1">Ubicación:</Form.Label>
                                        <Form.Control type="text" placeholder="Ubicacion" required
                                            value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} />
                                    </Form.Group>
                                </Form>
                            </Col>
                            <Col md={8}>
                                <Form>
                                    <Form.Group>
                                        <Form.Label className="ms-1">Foto de perfil:</Form.Label>
                                        <Form.Control required type="url" value={fotoPerf} onChange={(e) => setFotoPerf(e.target.value)} />
                                    </Form.Group>
                                </Form>
                            </Col>
                        </Row><br />
                        <p className="ms-1" style={{ color: "black", cursor: "pointer" }} onClick={mostrarCamposContra}>
                            Cambiar contraseña
                        </p>
                        {mostrar && (
                            <Row className="d-flex justify-content-center">
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="ms-1">Nueva contraseña:</Form.Label>
                                        <Form.Control type="password" placeholder="Ingrese nueva contraseña" value={nuevaContrasena} onChange={(e) => setNuevaContrasena(e.target.value)}/>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="ms-1">Confirmar contraseña:</Form.Label>
                                        <Form.Control type="password" placeholder="Confirme nueva contraseña" value={confirmarContrasena} onChange={(e) => setConfirmarContrasena(e.target.value)}/>
                                    </Form.Group>
                                </Col>
                            </Row>
                        )}
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="" variant="danger" onClick={closeModalAct}>Cancelar</Button>{' '}
                    <Button className="fw-bold " variant="warning" onClick={(e) => actualizarMascota(e)}>Actualizar</Button>{' '}
                </Modal.Footer>
            </Modal>

            <Modal
                show={modalAmigos}
                onHide={closeModalAmigos}
                size="md"
                aria-labelledby="contained-modal-title-vcenter "
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {nomUsuario === loggeado ? 'Tus amigos' : `Amigos de ${nomUsuario}`}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '60vh' }}>
                    <Container style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="container d-flex flex-column w-100 justify-content-center">
                            {amigos.map(amigo => (
                                <div key={amigo.id} className="d-flex justify-content-between align-items-center border-bottom">
                                    <Nav>
                                        <Nav.Link to={`/MiauSpace/Perfil/${amigo.nombre}`} as={Link} onClick={() => { closeModalAmigos(); limpiar(); }}>
                                            <div className="d-flex align-items-center">
                                                <img src={amigo.foto_perfil} alt="Perfil" className="rounded-circle perfil-img ms-1" />
                                                <p className="mb-0 fw-bold nombre-usuario ms-2">{amigo.nombre}</p>
                                            </div>
                                        </Nav.Link>
                                    </Nav>

                                    {amigo.nombre === loggeado ? null : (
                                        esAmigo(amigo.id) ? (
                                            <span>Amigo</span>
                                        ) : solicPendiente.some(solicitud => solicitud.mascota_receptora_id === amigo.id) ? (
                                            <span>Solicitud enviada</span>
                                        ) : solicPendientePropia.some(solicitud => solicitud.mascota_solicitante_id === amigo.id) ? (
                                            <span>Solicitud pendiente</span>
                                        ): (
                                            <button className="btn" style={{ backgroundColor: '#7B1FA2', color: 'white' }} onClick={() => enviarSolicitud(user.id, amigo.id)}>
                                                Enviar solicitud
                                            </button>
                                        )
                                    )}
                                </div>
                            ))}
                        </div>
                    </Container>
                </Modal.Body>
            </Modal>
        </Layout>
        
    );
};