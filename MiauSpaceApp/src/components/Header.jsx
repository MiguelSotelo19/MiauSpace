import logo from '../assets/logo.png'

export const Header  = ({ usuario }) => {
    return(
        <>
        <header className="ps-5 pe-5" style={{borderBottom: '1px solid gray'}}>
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
        </>
    );
}