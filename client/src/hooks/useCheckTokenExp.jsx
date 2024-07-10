import { jwtDecode } from "jwt-decode";

export const useCheckTokenExp = () => {
    const token = localStorage.getItem('token');

    if (!token) {
        return true;
    }

    try {
        decodedToken = jwtDecode (token); // Decodifica el token con la librería jwtDecode(token);
        const currentTime = Date.now() / 1000; // Obtiene la fecha actual en segundos
        return decodedToken.exp > currentTime;
    } catch (error) {
        console.error('Error al decodificar el token:', error);
        return true;
    }

}
