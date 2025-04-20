import { useState, useEffect } from "react";
import { Post } from "../components/Post";
import './css/Home.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import { Layout } from "../components/LayoutHome";
import axiosInstance from "../services/axiosInstace";
import { PostBar } from "../components/PostBar";


export const Home = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const url = `${API_URL}/posts/api/`;
    const urlMascota = `${API_URL}/mascotas/api/`;
    const [posts, setPosts] = useState([]);
    const [mascotas, setMascotas] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const user = JSON.parse(sessionStorage.getItem("usuario"));

    useEffect(() => {
        setPosts([]);
        getMascotas();
        getPosts();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !loading && hasMore) {
                getPosts();
            }
        };
    
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loading, hasMore, page]);

    const getPosts = () => {
        if (loading || !hasMore) return;
    
        setLoading(true);
    
        axiosInstance
            .get(`${url}?page=${page}`)
            .then((response) => {
                const nuevosPosts = response.data;
    
                if (nuevosPosts.length === 0) {
                    setHasMore(false);
                    return;
                }
    
                const mezclados = nuevosPosts.sort(() => Math.random() - 0.5);
                setPosts(prevPosts => [...prevPosts, ...mezclados]);
                setPage(prevPage => prevPage + 1);
            })
            .catch((error) => {
                console.error("Error al cargar los datos:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const getMascotas = async () => {
        axiosInstance
            .get(urlMascota)
            .then((response) => {
                setMascotas(response.data);
            })
            .catch((error) => {
                console.error("Error al cargar los datos:", error);
            });
    };

    return (

        <Layout>
            <div className="col-lg-12 col-md-8 col-12 offset-lg-2 offset-md-3" style={{ paddingTop: '20px', marginLeft: '8px' }}>
                <div className="post">
                    <PostBar user={user} posts={posts} setPosts={setPosts} />

                    {posts.map((post) => {
                        const mascotaData = mascotas.find(masc => masc.id === post.mascota);
                        if (!mascotaData) return null;

                        return (
                            <Post 
                                key={post.id}
                                postId={post.id}
                                picUser={mascotaData.foto_perfil}
                                user={mascotaData}
                                body={post.contenido}
                                picsBody={post.imagenes.map(img => img.imagen_base64)}
                            />
                        );
                    })}


                    {loading && <p className="text-center">Cargando más publicaciones...</p>}
                </div>
            </div>
        </Layout>
    );
};
