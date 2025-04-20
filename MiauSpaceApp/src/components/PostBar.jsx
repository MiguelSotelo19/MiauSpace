import { useState } from "react";
import sonidoLadrido from '../assets/wao1.mp3';
import axiosInstance from "../services/axiosInstace";
import perro from '../assets/perro.png';
import { BsImages } from "react-icons/bs";

export const PostBar = ({ user, posts, setPosts }) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const url = `${API_URL}/posts/api/`;
    const [contenido, setContenido] = useState('');
    const [imagenes, setImagenes] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDog, setShowDog] = useState(false);

    const handleImageChange = async (e) => {
        const files = e.target.files;
        const base64Images = [];

        for (let i = 0; i < files.length; i++) {
            const base64 = await convertToBase64(files[i]);
            base64Images.push(base64);
        }
        setImagenes(base64Images);
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async () => {
  
        const fechaActual = new Date().toISOString();
        setIsSubmitting(true);
        setUploadProgress(0);

        try {
            const responsePost = await axiosInstance.post(
                `${url}create_post_with_images/`,
                {
                    mascota: user.id,
                    titulo: "try post",
                    fecha_creacion: fechaActual,
                    contenido: contenido || "",
                    imagenes: imagenes,
                },
                {
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(progress);
                    }
                }
            );

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
                const response = await axiosInstance.get(`${url}?page=1`);
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

    return(
        <>
        {isSubmitting && <div className="overlay"></div>}
        <div className="card mb-4 rounded-5">
            <div className="card-body rounded-5">
                <div className="d-flex align-items-center justify-content-evenly">
                    <img src={user.foto_perfil} className="me-2 rounded-circle" width="45" height="40" alt="logo.jpg" />
                    <div className="input-group input-group-lg">
                        <input
                            id="inputGroup-sizing-default"
                            type="text"
                            className="form-control ms-2"
                            placeholder="¿En qué estás pensando?"
                            value={contenido}
                            onChange={(e) => setContenido(e.target.value)}
                        />
                    </div>
                </div>
                <div className="d-flex mt-4 justify-content-between">
                    <div>
                        <input type="file" id="image-upload" multiple accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                        <label htmlFor="image-upload" style={{ cursor: 'pointer' }}>
                            <BsImages className="ms-1 subirimagen" />
                        </label>
                    </div>
                    <div>
                        <button className="btn" style={{ backgroundColor: '#7B1FA2', color: 'white', fontSize:"18px" }} onClick={handleSubmit} disabled={isSubmitting}>
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
        {showDog && (
            <img src={perro} alt="Perro" className="dog-image"/>
        )}
        </>
    );
}