import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";

export const useCheckTokenExp = () => {
    const token = localStorage.getItem('token');
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;
                console.log("Token decodificado:", decodedToken);
                console.log("Fecha de expiración:", decodedToken.exp);
                console.log("Tiempo actual:", currentTime);
                
                setIsExpired(decodedToken.exp < currentTime);
            } catch (error) {
                console.error('Error al decodificar el token:', error);
                setIsExpired(true);
            }
        }
    }, [token]);

    return isExpired;

}
