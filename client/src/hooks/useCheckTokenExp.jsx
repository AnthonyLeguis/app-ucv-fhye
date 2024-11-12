import  { jwtDecode }  from "jwt-decode";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useCheckTokenExp = () => {

    const navigate = useNavigate();
    const [isTokenExpired, setIsTokenExpired] = useState(false);

    useEffect(() => {
        let intervalId;

        const checkTokenExpiration = () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    const currentTime = Math.floor(Date.now() / 1000);

                    console.log("Tiempo de expiración del token:", decodedToken.exp);
                    console.log("Tiempo actual:", currentTime);

                    if (decodedToken.exp < currentTime) {
                        localStorage.removeItem('token');
                        setIsTokenExpired(true);
                        navigate('/login', { state: { message: "Su sesión ha culminado" } });
                    } else {
                        setIsTokenExpired(false);
                    }
                } catch (error) {
                    console.error("Error al decodificar el token:", error);
                    localStorage.removeItem('token');
                    navigate('/login', { state: { message: "Su sesión ha culminado" } });

                }
            } else {
                setIsTokenExpired(true);
            }
        };

        // Verificar al inicio
        checkTokenExpiration();

        // Verificar cada minuto
        intervalId = setInterval(checkTokenExpiration, 60000);

        // Limpiar el intervalo al desmontar el componente
        return () => clearInterval(intervalId);
    }, [navigate]);

    return isTokenExpired;
};

