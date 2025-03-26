import { use, useEffect, useState } from "react";
import reaccion1 from "../assets/reaccion1.png";
import reaccion2 from "../assets/reaccion2.png";
import reaccion3 from "../assets/reaccion3.png";
import reaccion4 from "../assets/reaccion4.png";
import reaccion5 from "../assets/reaccion5.png";
import reaccion6 from "../assets/reaccion6.png";

import "./css/Reactions.css";
import axios from "axios";

export const Reactions = ({ mascotas, reacciones }) => {
    const urlAmistades = "http://127.0.0.1:8000/amistades/api/"
    let user = JSON.parse(sessionStorage.getItem("usuario"));
    console.log(user);
    
    const [ allReactions, setAllReactions ] = useState(reacciones);
    const imgreacciones = {
        "1": reaccion1,
        "2": reaccion2,
        "3": reaccion3,
        "4": reaccion4,
        "5": reaccion5,
        "6": reaccion6
    };

    const react1 = reacciones.filter(r => r.tipo_reaccion == '1');
    const react2 = reacciones.filter(r => r.tipo_reaccion == '2');
    const react3 = reacciones.filter(r => r.tipo_reaccion == '3');
    const react4 = reacciones.filter(r => r.tipo_reaccion == '4');
    const react5 = reacciones.filter(r => r.tipo_reaccion == '5');
    const react6 = reacciones.filter(r => r.tipo_reaccion == '6');
    
    useEffect(async () => {
        const respuesta = await axios({
            method: "GET",
            url: urlAmistades,
            /*headers: {
               Authorization: `Bearer ${token}` 
            }*/
        });

        console.log()
        
    }, [])

    return(
        <>
        <div className="container d-flex flex-column w-100 justify-content-center">
            <div className="menu-reacciones mb-4">
                {reacciones.length > 0 ? (
                    <>
                    <button className="btn btn-reaction" onClick={() => setAllReactions(reacciones)}>Todos</button>
                    {react1.length > 0 ? (<button className="btn btn-reaction" onClick={() => setAllReactions(react1)}><img src={reaccion1} className="icon-reaction" alt="Me gusta"/>{react1.length}</button>) : (<></>)}
                    {react2.length > 0 ? (<button className="btn btn-reaction" onClick={() => setAllReactions(react2)}><img src={reaccion2} className="icon-reaction" alt="Me gusta"/>{react2.length}</button>) : (<></>)}
                    {react3.length > 0 ? (<button className="btn btn-reaction" onClick={() => setAllReactions(react3)}><img src={reaccion3} className="icon-reaction" alt="Me gusta"/>{react3.length}</button>) : (<></>)}
                    {react4.length > 0 ? (<button className="btn btn-reaction" onClick={() => setAllReactions(react4)}><img src={reaccion4} className="icon-reaction" alt="Me gusta"/>{react4.length}</button>) : (<></>)}
                    {react5.length > 0 ? (<button className="btn btn-reaction" onClick={() => setAllReactions(react5)}><img src={reaccion5} className="icon-reaction" alt="Me gusta"/>{react5.length}</button>) : (<></>)}
                    {react6.length > 0 ? (<button className="btn btn-reaction" onClick={() => setAllReactions(react6)}><img src={reaccion6} className="icon-reaction" alt="Me gusta"/>{react6.length}</button>) : (<></>)}
                    </>
                ) : (<></>)}
            </div>

            {allReactions.map(reac => (
                <div key={reac.id} className="d-flex justify-content-between align-items-center gap-2 p-2 border-bottom">
                    <div className="d-flex align-items-center">
                        <img src={mascotas.find(mas => mas.id == reac.mascota)?.foto_perfil} alt="Perfil" className="rounded-circle perfil-img ms-1"/>
                        
                        <img src={imgreacciones[reac.tipo_reaccion]} alt="Reacción" className="reaccion-icon ms-1"/>
                        <p className="mb-0 fw-bold nombre-usuario ms-2">{mascotas.find(mas => mas.id == reac.mascota)?.nombre_usuario}</p>
                    </div>
                    <button className="btn" style={{backgroundColor: '#7B1FA2', color: 'white'}} onClick={() => {}}>Enviar solicitud</button>
                </div>
            ))}
        </div>
        </>
    );
}