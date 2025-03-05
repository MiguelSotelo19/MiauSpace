import { Post } from "../components/Post"

import logo from '../assets/logo.png'
import usuario from '../assets/usuario.png'
import usuario_ from '../assets/usuario_.png'
import salir from '../assets/salir.png'
import amigos from '../assets/amigos.png'
import inicio from '../assets/inicio.png'
import imagen from '../assets/imagen.png'
import cara_feliz from '../assets/feliz.png'
import skibidi from '../assets/skibidi.jpeg';


import './css/Home.css'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle"

export const Home = () => {
    const images = [skibidi, skibidi, skibidi, skibidi, skibidi, skibidi, skibidi];
    const images2 = [skibidi, skibidi, skibidi, skibidi];
    const images3 = [skibidi];

    return(
    <> 
        <div className="container-fluid principal">
            <header className="ps-5 pe-5">
                <div className="d-flex align-items-center justify-content-between mt-2 mb-2 p-2">
                    <div className="d-flex align-items-center justify-content-center">
                        <img src={logo} className="me-3 w-25" alt="logo.jpg"/>
                        <p className="logo">MiauSpace</p>
                    </div>
                    <div className="d-flex align-items-center justify-content-center">
                        <img src={usuario} className="me-3 w-25" alt="logo.jpg"/>
                        <p>Nombre de Perfil</p>
                    </div>
                </div>
            </header>

            <div className="row" style={{margin: 0}}>
                <div className="col-lg-2 col-md-3 d-none d-md-flex flex-column justify-content-start list">
                    <ul className="list-group mt-5 me-3">
                        <li className="list-group-item pt-3 pb-3">
                            <img src={inicio} className="me-3 w-20" alt="logo.jpg"/>
                            Inicio
                        </li>
                        <li className="list-group-item pt-3 pb-3">
                            <img src={usuario_} className="me-3 w-20" alt="logo.jpg"/>
                            Perfil
                        </li>
                        <li className="list-group-item pt-3 pb-3">
                            <img src={amigos} className="me-3 w-20" alt="logo.jpg"/>
                            Amigos
                        </li>
                    </ul>
                    <hr />
                    <ul className="list-group">
                        <li className="list-group-item pt-3 pb-3">
                            <img src={salir} className="me-3 w-20" alt="logo.jpg"/>
                            Cerrar sesión
                        </li>
                    </ul>
                </div>

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

                        <Post postId="1" picUser={usuario_} user={"Lauro Deidad"} body={"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quae assumenda, totam accusamus iste distinctio, illum magni blanditiis eius corporis rerum a dolore numquam deserunt quisquam, asperiores ullam nobis ex consectetur ab aliquid voluptates? Quisquam voluptates in hic qui veritatis ipsa!"} picsBody={images}/>
                        <Post postId="2"  picUser={usuario_} user={"Lauro Deidad"} body={"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quae assumenda, totam accusamus iste distinctio, illum magni blanditiis eius corporis rerum a dolore numquam deserunt quisquam, asperiores ullam nobis ex consectetur ab aliquid voluptates? Quisquam voluptates in hic qui veritatis ipsa!"} picsBody={images2} />
                        <Post postId="3"  picUser={usuario_} user={"Lauro Deidad"} body={"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quae assumenda, totam accusamus iste distinctio, illum magni blanditiis eius corporis rerum a dolore numquam deserunt quisquam, asperiores ullam nobis ex consectetur ab aliquid voluptates? Quisquam voluptates in hic qui veritatis ipsa!"} picsBody={images3} />
                        
                    </div>
                </div>

                <div className="col-lg-3 d-none d-lg-flex justify-content-center der">
                    <p>Barra lateral derecha</p>
                </div>

            </div>
        </div>
    </>
    );
}
