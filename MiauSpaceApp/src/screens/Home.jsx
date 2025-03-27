import { useState, useEffect } from "react";
import { Post } from "../components/Post";
import axios from 'axios';
import imagen from '../assets/imagen.png';
import cara_feliz from '../assets/feliz.png';
import './css/Home.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import { Layout } from "../components/LayoutHome"; 

export const Home = () => {
    const url = 'http://127.0.0.1:8000/posts/api/';
    const urlMascota = 'http://127.0.0.1:8000/mascotas/api/';
    const [posts, setPosts] = useState([]);
    const [mascotas, setMascotas] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [contenido, setContenido] = useState('');
    const [imagenes, setImagenes] = useState([]);
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

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleImageChange = async (e) => {
        const files = e.target.files;
        const base64Images = [];

        for (let i = 0; i < files.length; i++) {
            const base64 = await convertToBase64(files[i]);
            base64Images.push(base64);
        }

        setImagenes(base64Images);
    };

    const handleSubmit = async () => {
        const fechaActual = new Date().toISOString();
    
        try {
            const responsePost = await axios.post(`${url}create_post_with_images/`, {
                mascota: user.id,
                titulo: "try post",
                fecha_creacion: fechaActual,
                contenido: contenido,
                imagenes: imagenes,
            });
    
            console.log("Publicación y imágenes creadas:", responsePost.data);
            const postId = responsePost.data.post_id;
    
            setPosts([responsePost.data, ...posts]);
            setContenido('');
            setImagenes();
        } catch (error) {
            console.error("Error al crear publicación e imágenes:", error.response?.data || error);
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
                    <input 
                        type="text" 
                        className="form-control ms-2" 
                        placeholder="¿En qué estás pensando?" 
                        value={contenido}
                        onChange={(e) => setContenido(e.target.value)}
                    />
                </div>
                <div className="d-flex mt-4 justify-content-between">
                    <div>
                        <input 
                            type="file" 
                            id="image-upload"
                            multiple 
                            accept="image/*" 
                            onChange={handleImageChange}
                            style={{display: 'none'}} 
                        />
                        <label htmlFor="image-upload" style={{cursor: 'pointer'}}>
                            <img 
                                src={imagen || "ruta-a-imagen-predeterminada.png"} 
                                alt="Subir imágenes" 
                                width="30" 
                                height="30"
                            />
                        </label>
                        <img src={cara_feliz} className="ms-3" alt="Cara feliz" />
                    </div>
                    <div>
                        <button 
                            className="btn" 
                            style={{backgroundColor: '#7B1FA2', color: 'white'}}
                            onClick={handleSubmit}
                        >
                            Publicar
                        </button>
                    </div>
                </div>
            </div>
        </div>
  
                  
                    {posts.map((post) => {
                        const images = post.imagenes 
                            ? post.imagenes.map(img => img.imagen_base64) 
                            : (post.img || []);

                        return (
                            <Post
                                key={post.id}
                                postId={post.id}
                                picUser={mascotas.find(masc => masc.id === post.mascota)?.foto_perfil}
                                user={mascotas.find(masc => masc.id === post.mascota)?.nombre_usuario}
                                body={post.contenido}
                                picsBody={images}
                            />
                        );
                    })}
                    
                    {loading && <p className="text-center">Cargando más publicaciones...</p>}
                </div>
            </div>
        </Layout>
    );
};