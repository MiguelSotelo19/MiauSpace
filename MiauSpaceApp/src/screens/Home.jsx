import { Post } from "../components/Post"


import usuario from '../assets/usuario.png'
import usuario_ from '../assets/usuario_.png'
import imagen from '../assets/imagen.png'
import cara_feliz from '../assets/feliz.png'
import skibidi from '../assets/skibidi.jpeg';


import './css/Home.css'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle"
import { Header } from "../components/Header"
import { Navigation } from "../components/Navigation"
import { SideColumn } from "../components/SideColumn"

export const Home = () => {
    const images = [skibidi, skibidi, skibidi, skibidi, skibidi, skibidi, skibidi];
    const images2 = [skibidi, skibidi, skibidi, cara_feliz];
    const images3 = [skibidi];

    return(
    <> 
        <div className="container-fluid principal">
            <Header usuario={usuario} />

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

                        <Post postId="1" picUser={usuario_} user={"Lauro Deidad"} body={"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quae assumenda, totam accusamus iste distinctio, illum magni blanditiis eius corporis rerum a dolore numquam deserunt quisquam, asperiores ullam nobis ex consectetur ab aliquid voluptates? Quisquam voluptates in hic qui veritatis ipsa!"} picsBody={images} />
                        <Post postId="2"  picUser={usuario_} user={"Lauro Deidad"} body={"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quae assumenda, totam accusamus iste distinctio, illum magni blanditiis eius corporis rerum a dolore numquam deserunt quisquam, asperiores ullam nobis ex consectetur ab aliquid voluptates? Quisquam voluptates in hic qui veritatis ipsa!"} picsBody={images2} />
                        <Post postId="3"  picUser={usuario_} user={"Lauro Deidad"} body={"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quae assumenda, totam accusamus iste distinctio, illum magni blanditiis eius corporis rerum a dolore numquam deserunt quisquam, asperiores ullam nobis ex consectetur ab aliquid voluptates? Quisquam voluptates in hic qui veritatis ipsa!"} picsBody={images3} />
                        
                    </div>
                </div>

                <SideColumn />

            </div>
        </div>
    </>
    );
}
