import { Header } from "../components/Header";
import { Navigation } from "../components/Navigation";
import { SideColumn } from "../components/SideColumn";

export const Layout = ({ children }) => {
    const user = JSON.parse(sessionStorage.getItem("usuario"));

    return (
        <div className="container-fluid principalDos">
            <Header usuario={user} />
            <div className="row m-0">
                <Navigation />
                <div className="col-lg-7 col-md-8 col-12 offset-lg-2 offset-md-3 pt-2">
                    {children}
                </div>
                <SideColumn />
            </div>
        </div>
    );
};