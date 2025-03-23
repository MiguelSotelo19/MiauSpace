import { useState, useEffect } from "react";
import { Post } from "../components/Post";
import axios from 'axios';

import usuario_ from '../assets/usuario_.png';
import imagen from '../assets/imagen.png';
import cara_feliz from '../assets/feliz.png';

import './css/Home.css';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import { Layout } from "../components/Layout"; 

export const Home = () => {
    const url = 'http://127.0.0.1:8000/posts/api/';
    const urlMascota = 'http://127.0.0.1:8000/mascotas/api/';
    const [posts, setPosts] = useState([]);
    const [mascotas, setMascotas] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(sessionStorage.getItem("usuario"));

    useEffect(() => {
        getPosts();
        getMascotas();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const getPosts = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const respuesta = await axios.get(`${url}?page=${page}`);
            let nuevosPosts = respuesta.data;

            nuevosPosts = nuevosPosts.sort(() => Math.random() - 0.5);

            setPosts(prevPosts => [...prevPosts, ...nuevosPosts]);
            setPage(prevPage => prevPage + 1);
        } catch (error) {
            console.error("Error al obtener publicaciones:", error);
        } finally {
            setLoading(false);
        }
    };

    const getMascotas = async () => {
        const respuesta = await axios.get(urlMascota);
        setMascotas(respuesta.data);
    };

    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.offsetHeight - 100
        ) {
            getPosts();
        }
    };

    return (
        <Layout> 
            <div className="col-lg-7 col-md-8 col-12 offset-lg-2 offset-md-3" style={{ paddingTop: '20px' }}>
                <div className="post">
                    <div className="card mb-4">
                        <div className="card-body">
                            <div className="d-flex align-items-center justify-content-evenly">
                                <img src={user.foto_perfil} className="me-3 rounded-circle" width="45" height="40" alt="logo.jpg" />                                
                                <input type="text" className="form-control ms-2" placeholder="¿En qué estás pensando?" />
                            </div>
                            <div className="d-flex mt-4 justify-content-between">
                                <div>
                                    <img src={imagen} alt="Imagen" />
                                    <img src={cara_feliz} className="ms-3" alt="Cara feliz" />
                                </div>
                                <div>
                                    <button className="btn" style={{backgroundColor: '#7B1FA2', color: 'white'}}>Publicar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {posts.map((post) => (
                        <Post
                            key={post.id}
                            postId={post.id}
                            picUser={mascotas.find(masc => masc.id == post.mascota)?.foto_perfil}
                            user={mascotas.find(masc => masc.id == post.mascota)?.nombre_usuario}
                            body={post.contenido}
                            picsBody={post.img}
                        />
                    ))}
                    {loading && <p className="text-center">Cargando más publicaciones...</p>}
                </div>
            </div>
        </Layout>
    );
};
