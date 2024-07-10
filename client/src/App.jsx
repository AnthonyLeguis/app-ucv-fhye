import { Route, Routes, Navigate, useLocation, Outlet } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import { NavBar } from "./routes/components/NavBar"
import { Home } from "./routes/Home"
import { Login } from "./routes/Login"
import { SideBar } from "./routes/components/SideBar"
import { UserProfile } from "./routes/UserProfile"
import { Users } from "./routes/Users"
import { UserForm } from "./routes/components/UserForm"
import { Dashboard } from "./routes/Dashboard"
import { Data } from "./routes/Data"
import { Sheets } from "./routes/Sheets"
import { SheetsForm } from "./routes/components/SheetsForm"
import { SetupUser } from "./routes/SetupUser"
import { AuthContext } from "./hooks/AuthContext"
import { NotFound } from "./routes/components/NotFound"
import { ExpiredTime } from "./routes/components/ExpiredTime"
import { useCheckTokenExp } from "./hooks/useCheckTokenExp"
import Swal from 'sweetalert2';
import './CSS/App.css'

export const App = () => {
    const { isAuthenticated, userId, isLoading } = useContext(AuthContext);
    const [tokenExpired, setTokenExpired] = useState(false);
    const location = useLocation();
    const isExpired = useCheckTokenExp();

    const [shouldRedirect, setShouldRedirect] = useState(false);

    useEffect(() => {
        if (isAuthenticated && !userId) {
            // Esperar a que userId tenga un valor antes de redirigir
            setShouldRedirect(true);
        } else if (isAuthenticated && userId && location.pathname === '/') {
            // Redirigir a la ruta del perfil si el usuario está autenticado y en la ruta raíz
            <Navigate to={`/app/profile/${userId}`} />
        }
    }, [isAuthenticated, userId, location.pathname]);

    useEffect(() => {
        if (shouldRedirect && userId) {
            <Navigate to={`/app/profile/${userId}`} replace={true} />;
        }
    }, [shouldRedirect, userId]);

    useEffect(() => {

        const chekExpirationInterval = setInterval(() => {
            setTokenExpired(isExpired);

            if (isExpired && isAuthenticated) {
                localStorage.removeItem('token');
                sessionStorage.removeItem('token');
                setShouldRedirect(true);

                try {
                    <Navigate to="/login" replace={true} />
                } catch (error) {
                    console.error("Error al redirigir:", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Hubo un problema al redirigir al inicio de sesión. Por favor, inténtalo de nuevo.',
                    });
                }
            }
        }, 10000);

        return () => clearInterval(chekExpirationInterval);
    }, [isAuthenticated, isExpired]);



    return (
        <>
            {tokenExpired && <ExpiredTime />}

            {/* Renderiza NavBar solo si la ruta es / o /login */}
            {location.pathname === '/' || location.pathname === '/login' ? (
                <NavBar isAuthenticated={isAuthenticated} />
            ) : null}

            <Routes>
                <Route path="/" element={
                    isLoading ? null : isAuthenticated ? <Navigate to={`/app/profile/${userId} || /app`} /> : <Home />
                } />
                <Route path="/login" element={<Login />} />

                {/* Rutas privadas (con SideBar) */}
                <Route path="/app" element={
                    <div className="d-flex flex-nowrap vh-100 content-scroll">
                        <div className="col-auto">
                            {isAuthenticated ? <SideBar isAuthenticated={isAuthenticated} /> : null}
                        </div>
                        <div className="col mx-auto d-flex flex-column align-content-center">
                            <Outlet />
                        </div>
                    </div>
                }>
                    {/* Solo renderizar rutas privadas si está autenticado */}
                    {isAuthenticated && (
                        <>
                            <Route path={`profile/${userId}`} element={<UserProfile />} />
                            <Route path="users" element={<Users />} />
                            <Route path="users/register" element={<UserForm />} />
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="data" element={<Data />} />
                            <Route path="sheets" element={<Sheets />} />
                            <Route path="sheets/register" element={<SheetsForm />} />
                            <Route path="setup-user" element={<SetupUser />} />
                        </>
                    )}
                    <Route index element={
                        isAuthenticated ? <Navigate to={`profile/${userId}`} /> : <Navigate to="/login" />
                    } />
                </Route>

                {/* Ruta catch-all */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
};
