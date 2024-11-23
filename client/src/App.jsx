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
import { useCheckTokenExp } from "./hooks/useCheckTokenExp"
import { PassRecovery } from "./routes/PassRecovery"
import './CSS/App.css'
import Swal from "sweetalert2"

export const App = () => {
    const { isAuthenticated } = useContext(AuthContext); // Elimina isLoading
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated && location.pathname === '/') {
            navigate('/app/profile', { replace: true });
        }
    }, [isAuthenticated, location.pathname, navigate]);

    const PrivateRoute = () => {
        if (!isAuthenticated) {
            return <Navigate to="/login" />;
        }
        return (
            <div className="d-flex flex-nowrap vh-100 content-scroll">
                <div className="col-auto">
                    <SideBar isAuthenticated={isAuthenticated} />
                </div>
                <div className="col mx-auto d-flex flex-column align-content-center">
                    <Outlet />
                </div>
            </div>
        );
    };

    return (
        <>
            {/* Renderiza NavBar solo si la ruta es / o /login */}
            {location.pathname === '/' || location.pathname === '/login' ? (
                <NavBar isAuthenticated={isAuthenticated} />
            ) : null}

            <Routes>
                <Route
                    path="/"
                    element={
                        isAuthenticated ? (
                            <Navigate to="/app/" replace />
                        ) : (
                            <Home />
                        )
                    }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/reset-password" element={<PassRecovery />} />

                {/* Rutas privadas (con SideBar) */}
                <Route path="/app/" element={<PrivateRoute />}>
                    <Route path="profile" element={<UserProfile />} />
                    <Route path="users" element={<Users />} />
                    <Route path="users/register" element={<UserForm />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="data" element={<Data />} />
                    <Route path="sheets" element={<Sheets />} />
                    <Route path="sheets/register" element={<SheetsForm />} />
                    <Route path="setup-user" element={<SetupUser />} />
                </Route>

                {/* Ruta catch-all */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
};
