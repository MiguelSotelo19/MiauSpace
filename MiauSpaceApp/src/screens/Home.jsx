import { useState, useEffect, useRef } from "react";
import { Post } from "../components/Post";
import axios from 'axios';

import usuario from '../assets/usuario.png';
import usuario_ from '../assets/usuario_.png';
import imagen from '../assets/imagen.png';
import cara_feliz from '../assets/feliz.png';

import './css/Home.css';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import { Header } from "../components/Header";
import { Navigation } from "../components/Navigation";
import { SideColumn } from "../components/SideColumn";

export const Home = () => {
    const url = 'http://127.0.0.1:8000/posts/api/';
    const urlMascota = 'http://127.0.0.1:8000/mascotas/api/';
    const [ posts, setPosts ] = useState([]);
    const [ mascotas, setMascotas ] = useState([]);
    const user = JSON.parse(sessionStorage.getItem("usuario"));

    useEffect(() => {
        getPosts();
        getMascotas();
    }, [])

    const getPosts = async () => {
        const respuesta = await axios({
            method: "GET",
            url: url,
            /*headers: {
               Authorization: `Bearer ${token}` 
            }*/
        });
        setPosts(respuesta.data);
    }

    const getMascotas = async () => {
        const respuesta = await axios({
            method: "GET",
            url: urlMascota,
            /*headers: {
               Authorization: `Bearer ${token}` 
            }*/
        });
        setMascotas(respuesta.data);
    }

    return(
    <> 
        <div className="container-fluid principal">
            <Header usuario={user} />

            <div className="row" style={{margin: 0}}>
                <Navigation />

                <div className="col-lg-7 col-md-8 col-12 offset-lg-2 offset-md-3" style={{paddingTop: '20px'}}>
                    <div className="post">
                        <div className="card mb-4">
                            <div className="card-body">
                                <div className="d-flex align-items-center justify-content-evenly">
                                    <img src={usuario_} className="me-3" alt="logo.jpg"/>
                                    <input type="text" className="form-control ms-2" placeholder="¿En qué estás pensando?"/>
                                </div>
                                <div className="d-flex mt-4 justify-content-between">
                                    <div className="">
                                        <img src={imagen} />
                                        <img src={cara_feliz} className="ms-3" />
                                    </div>
                                    <div className="">
                                        <button className="btn btn-secondary">Publicar</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {posts.map((post, i) => (
                            <Post key={post.id} postId={post.id} picUser={usuario_} user={mascotas.find(masc => masc.id == post.mascota)?.nombre_usuario} body={post.contenido} picsBody={post.img} />
                        ))}

                        
                    </div>
                </div>

                <SideColumn />

            </div>
        </div>
    </>
    );
}
