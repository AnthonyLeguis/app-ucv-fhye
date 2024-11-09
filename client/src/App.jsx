import { Route, Routes, Navigate, useLocation, Outlet, useNavigate } from "react-router-dom"
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
import { ProtectedRoute } from "./routes/components/ProtectedRoute"
import './CSS/App.css'
import Swal from "sweetalert2"

export const App = () => {
    const { isAuthenticated, userId, isLoading, logout } = useContext(AuthContext);
    const [tokenExpired, setTokenExpired] = useState(false);
    const location = useLocation();
    const isExpired = useCheckTokenExp();
    const navigate = useNavigate();

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
        if (isAuthenticated) {
            setTokenExpired(false); 

            const checkExpirationInterval = setInterval(() => {
                setTokenExpired(isExpired);
                console.log("Token expirado:", isExpired);

                if (isExpired) {
                    localStorage.removeItem("token");
                    sessionStorage.removeItem("token");
                }
            }, 3600);

            return () => clearInterval(checkExpirationInterval);
        }
    }, [isAuthenticated, isExpired]);

    useEffect(() => {
        if (tokenExpired && isAuthenticated) {
            Swal.fire({
                icon: "error",
                title: "Por favor ingrese nuevamente",
                text: "Su sesión ha expirado",
            }).then((result) => {
                if (result.isConfirmed) {
                    // Llama a la función logout del contexto para actualizar isAuthenticated
                    logout(); // Asegúrate de tener esta función en tu AuthContext
                    navigate("/login");
                }
            });
        }
    }, [tokenExpired, isAuthenticated, logout, navigate]);


    return (
        <>
            {tokenExpired && <ExpiredTime />}

            {/* Renderiza NavBar solo si la ruta es / o /login */}
            {location.pathname === '/' || location.pathname === '/login' ? (
                <NavBar isAuthenticated={isAuthenticated} />
            ) : null}

            <Routes> {/* Mueve Routes aquí, antes de todas las rutas */}
                <Route
                    path="/"
                    element={
                        isLoading
                            ? null
                            : isAuthenticated
                                ? <Navigate to={`/app/profile/${userId} || /app`} />
                                : <Home />
                    }
                />
                <Route path="/login" element={<Login />} />

                {/* Rutas privadas (con SideBar) */}
                <Route
                    path="/app"
                    element={
                        <div className="d-flex flex-nowrap vh-100 content-scroll">
                            <div className="col-auto">
                                {isAuthenticated ? (
                                    <SideBar isAuthenticated={isAuthenticated} />
                                ) : null}
                            </div>
                            <div className="col mx-auto d-flex flex-column align-content-center">
                                <Outlet />
                            </div>
                        </div>
                    }
                >
                    {/* Aquí van todas tus rutas protegidas, envueltas por ProtectedRoute */}
                    {isAuthenticated && (
                        <>
                            <Route path={`profile/${userId}`} element={<UserProfile />} />
                            <Route path="users" element={<Users />} />
                            <Route
                                path="users/register"
                                element={
                                        <UserForm />
                                }
                            />
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="data" element={<Data />} />
                            <Route path="sheets" element={<Sheets />} />
                            <Route
                                path="sheets/register"
                                element={
                                        <SheetsForm />
                                }
                            />
                            <Route path="setup-user" element={<SetupUser />} />
                        </>
                    )}
                    <Route
                        index
                        element={
                            isAuthenticated ? (
                                <Navigate to={`profile/${userId}`} />
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />
                </Route>

                {/* Ruta catch-all */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
};
