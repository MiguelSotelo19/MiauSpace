import { Header } from "../components/Header";
import { Navigation } from "../components/Navigation";
import { SideColumn } from "../components/SideColumn";

export const Layout = ({ children }) => {
    const user = JSON.parse(sessionStorage.getItem("usuario"));

    return (
        <div className="container-fluid principal">
            <Header usuario={user} />
            <div className="row" style={{ margin: 0 }}>
                <Navigation />
                <div className="col-lg-7 col-md-8 col-12 offset-lg-2 offset-md-3" style={{ paddingTop: '20px' }}>
                    {children}
                </div>
                <SideColumn />
            </div>
        </div>
    );
};