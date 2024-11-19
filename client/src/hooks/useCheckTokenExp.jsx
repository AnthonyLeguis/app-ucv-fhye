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

                    //console.log("Tiempo de expiración del token:", decodedToken.exp);
                    //console.log("Tiempo actual:", currentTime);

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

        const delay = (ms) => new Promise (
            resolve => setTimeout(resolve, ms)
        )

        //Ejecutar el retraso inicial de 30 segundos
        delay(30000).then(() => {
            checkTokenExpiration();

            // Verificar cada minuto
            intervalId = setInterval(checkTokenExpiration, 60000);
        });

        // Limpiar el intervalo al desmontar el componente
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [navigate]);

    return isTokenExpired;
};

