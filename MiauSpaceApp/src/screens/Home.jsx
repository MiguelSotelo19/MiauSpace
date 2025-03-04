import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle"

import logo from '../assets/logo.png'
import usuario from '../assets/usuario.png'
import usuario_ from '../assets/usuario_.png'
import salir from '../assets/salir.png'
import amigos from '../assets/amigos.png'
import inicio from '../assets/inicio.png'
import imagen from '../assets/imagen.png'
import cara_feliz from '../assets/feliz.png'
import skibidi from '../assets/skibidi.jpeg'

export const Home = () => {
    return(
    <> 
        <div className="container-fluid" style={{backgroundColor: '#f0f0f0', paddingTop: '80px'}}>
            <header className="ps-5 pe-5" style={{
                backgroundColor: 'white',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                zIndex: 9999,
                paddingTop: '10px',
                paddingBottom: '10px'
            }}>
                <div className="d-flex align-items-center justify-content-between mt-2 mb-2 p-2">
                    <div className="d-flex align-items-center justify-content-center">
                        <img src={logo} className="me-3 w-25" alt="logo.jpg"/>
                        <p style={{color: 'purple', fontSize: '20px'}}>MiauSpace</p>
                    </div>
                    <div className="d-flex align-items-center justify-content-center">
                        <img src={usuario} className="me-3 w-25" alt="logo.jpg"/>
                        <p>Nombre de Perfil</p>
                    </div>
                </div>
            </header>

            <div className="row" style={{margin: 0}}>
                <div 
                    className="col-lg-2 col-md-3 d-none d-md-flex flex-column justify-content-start" 
                    style={{
                        position: 'fixed', 
                        top: '80px',
                        left: 0, 
                        height: 'calc(97vh - 80px)',  
                        backgroundColor: 'white', 
                        zIndex: 9998, 
                        paddingTop: '20px', 
                        paddingRight: '0'
                    }}
                >
                    <ul className="list-group mt-5">
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
                    <div style={{overflowY: 'auto', maxHeight: 'calc(97vh - 80px)', padding: '1rem'}}>
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

                        <div className="card mt-3">
                            <div className="card-body">
                                <div className="d-flex align-items-center justify-content-start">
                                    <img src={usuario_} className="me-3" alt="logo.jpg"/>
                                    <p>Lauro Deidad</p>
                                </div>
                                <div className="d-flex flex-column">
                                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quae assumenda, totam accusamus iste distinctio, illum magni blanditiis eius corporis rerum a dolore numquam deserunt quisquam, asperiores ullam nobis ex consectetur ab aliquid voluptates? Quisquam voluptates in hic qui veritatis ipsa!</p>
                                    <img src={skibidi} className="align-self-center" />
                                </div>
                                <div className="acciones"></div>
                            </div>
                        </div>
                        
                        <div className="card mt-3">
                            <div className="card-body">
                                <div className="d-flex align-items-center justify-content-start">
                                    <img src={usuario_} className="me-3" alt="logo.jpg"/>
                                    <p>Lauro Deidad</p>
                                </div>
                                <div className="d-flex flex-column">
                                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quae assumenda, totam accusamus iste distinctio, illum magni blanditiis eius corporis rerum a dolore numquam deserunt quisquam, asperiores ullam nobis ex consectetur ab aliquid voluptates? Quisquam voluptates in hic qui veritatis ipsa!</p>
                                    <img src={skibidi} className="align-self-center" />
                                </div>
                                <div className="acciones"></div>
                            </div>
                        </div>

                        <div className="card mt-3">
                            <div className="card-body">
                                <div className="d-flex align-items-center justify-content-start">
                                    <img src={usuario_} className="me-3" alt="logo.jpg"/>
                                    <p>Lauro Deidad</p>
                                </div>
                                <div className="d-flex flex-column">
                                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quae assumenda, totam accusamus iste distinctio, illum magni blanditiis eius corporis rerum a dolore numquam deserunt quisquam, asperiores ullam nobis ex consectetur ab aliquid voluptates? Quisquam voluptates in hic qui veritatis ipsa!</p>
                                    <img src={skibidi} className="align-self-center" />
                                </div>
                                <div className="acciones"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-3 d-none d-lg-flex justify-content-center" style={{
                    backgroundColor: 'white',
                    position: 'fixed',
                    top: '80px',
                    right: 0,
                    height: 'calc(97vh - 80px)',
                    zIndex: 9997,
                    padding: '20px'
                }}>
                    <p>Barra lateral derecha</p>
                </div>

            </div>
        </div>
    </>
    );
}
