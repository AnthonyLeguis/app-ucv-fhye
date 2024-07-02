import { useEffect, useState } from "react"
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useNotification } from "./Notifications";

export const PrivateRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { showNotification } = useNotification();
    const location = useLocation();

    useEffect(() => {
        // Verificar si el usuario está autenticado
        const token = sessionStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    useEffect(() => {
        // Verificar si la navegación proviene de una ruta pública y no está autenticado
        if ((location.state?.from?.pathname === '/' || location.state?.from?.pathname === '/login') && !isAuthenticated) {
            showNotification("Debes iniciar sesión para continuar", "warning");
            console.log("Debes iniciar sesión para continuar");
        }
    }, [location, isAuthenticated]);

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
};
