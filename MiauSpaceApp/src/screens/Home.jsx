import { useState, useEffect } from "react";
import { Post } from "../components/Post";
import axios from 'axios';
import imagen from '../assets/imagen.png';
import cara_feliz from '../assets/feliz.png';
import sonidoLadrido from '../assets/wao1.mp3';
import './css/Home.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import { Layout } from "../components/LayoutHome";
import perro from '../assets/perro.png';


export const Home = () => {
    const url = 'http://127.0.0.1:8000/posts/api/';
    const urlMascota = 'http://127.0.0.1:8000/mascotas/api/';
    const [posts, setPosts] = useState([]);
    const [mascotas, setMascotas] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [contenido, setContenido] = useState('');
    const [imagenes, setImagenes] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const user = JSON.parse(sessionStorage.getItem("usuario"));
    const [showDog, setShowDog] = useState(false);


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
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100) {
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
        setIsSubmitting(true);
        setUploadProgress(0);

        try {
            const responsePost = await axios.post(
                `${url}create_post_with_images/`,
                {
                    mascota: user.id,
                    titulo: "try post",
                    fecha_creacion: fechaActual,
                    contenido: contenido,
                    imagenes: imagenes,
                },
                {
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(progress);
                    }
                }
            );

            console.log("Publicación y imágenes creadas:", responsePost.data);

            const newPost = {
                ...responsePost.data,
                imagenes: imagenes.map((img) => ({ imagen_base64: img })),
            };

            setPosts([newPost, ...posts]);
            setContenido('');
            setImagenes([]);
            setUploadProgress(0);
            reproducirLadrido();

            try {
                const response = await axios.get(`${url}?page=1`);
                const actualizedPosts = response.data.sort(() => Math.random() - 0.5);
                setPosts(actualizedPosts);
            } catch (error) {
                console.error("Error al obtener publicaciones actualizadas:", error);
            }

        } catch (error) {
            console.error("Error al crear publicación e imágenes:", error.response?.data || error);
        } finally {
            setTimeout(() => setIsSubmitting(false), 1000);
        }
    };

   

    const reproducirLadrido = () => {
        const wao = new Audio(sonidoLadrido);
        wao.play();
        showDogAnimation();
    };

    const showDogAnimation = () => {
        setShowDog(true);
        setTimeout(() => {
            setShowDog(false);
        }, 8000);
    };

    return (

        <Layout>
            {isSubmitting && <div className="overlay"></div>}



            <div className="col-lg-12 col-md-8 col-12 offset-lg-2 offset-md-3" style={{ paddingTop: '20px', marginLeft: '8px' }}>
                {showDog && (
                    <img
                        src={perro}
                        alt="Perro"
                        className="dog-image"
                    />

                )}
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
                                        style={{ display: 'none' }}
                                    />
                                    <label htmlFor="image-upload" style={{ cursor: 'pointer' }}>
                                        <img src={imagen} alt="Subir imágenes" width="30" height="30" />
                                    </label>
                                    <img src={cara_feliz} className="ms-3" alt="Cara feliz" />
                                </div>
                                <div>
                                    <button
                                        className="btn"
                                        style={{ backgroundColor: '#7B1FA2', color: 'white' }}
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Publicando..." : "Publicar"}
                                    </button>
                                </div>
                            </div>



                            {imagenes.length > 0 && (
                                <div className="preview mt-3">
                                    <div className="small-image-wrapper">
                                        <img src={imagenes[0]} className="small-image" alt="Previsualización" />
                                        <span className="image-count">{imagenes.length} </span>
                                    </div>
                                    {isSubmitting && (
                                        <div className="progress mt-2">
                                            <div className="progress-bar" role="progressbar" style={{ width: `${uploadProgress}%` }}>
                                                {uploadProgress}%
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {posts.map((post) => (
                        <Post
                            key={post.id}
                            postId={post.id}
                            picUser={mascotas.find(masc => masc.id === post.mascota)?.foto_perfil}
                            user={mascotas.find(masc => masc.id === post.mascota)?.nombre_usuario}
                            body={post.contenido}
                            picsBody={post.imagenes.map(img => img.imagen_base64)}
                        />
                    ))}

                    {loading && <p className="text-center">Cargando más publicaciones...</p>}
                </div>
            </div>
        </Layout>
    );
};
