import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (nombre_usuario, password) => {
    try{
        const response = await axios({
            method: "POST",
            url: `${API_URL}/mascotas/token/`,
            data: {
                nombre_usuario: nombre_usuario,
                password: password
            }
        })
        if(response.data.access){
            localStorage.setItem("accessToken",response.data.access);
            localStorage.setItem("refreshToken",response.data.refresh);
        }
        return response.data;
    } catch(error) {
        console.error(error);
    }
    
}

export const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.reload();
}