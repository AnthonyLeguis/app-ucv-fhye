import { Route, Routes, Navigate, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { NavBar } from "./routes/components/NavBar";
import { Home } from "./routes/Home";
import { Login } from "./routes/Login";
import { SideBar } from "./routes/components/SideBar";
import { UserProfile } from "./routes/UserProfile";
import { Users } from "./routes/Users";
import { UserForm } from "./routes/components/UserForm";
import { Dashboard } from "./routes/Dashboard";
import { Data } from "./routes/Data";
import { Sheets } from "./routes/Sheets";
import { SheetsForm } from "./routes/components/SheetsForm";
import { SetupUser } from "./routes/SetupUser";
import { EmployeesPerArea } from "./routes/EmployeesPerArea";
import { EmployeesList } from "./routes/EmployeesList";
import { AuthContext } from "./hooks/AuthContext";
import { NotFound } from "./routes/components/NotFound";
import { PassRecovery } from "./routes/PassRecovery";
import Swal from "sweetalert2";
import './CSS/App.css';

export const App = () => {
    const { isAuthenticated, isLoading, logout, isInitialLoading } = useContext(AuthContext);
    const [tokenExpired, setTokenExpired] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (tokenExpired && isAuthenticated) {
            Swal.fire({
                icon: "error",
                title: "Por favor ingrese nuevamente",
                text: "Su sesión ha expirado",
                showCancelButton: false,
                confirmButtonText: 'Aceptar',
            }).then((result) => {
                if (result.isConfirmed) {
                    logout();
                    navigate("/login");
                    setTokenExpired(false);
                }
            });
        }
    }, [isAuthenticated, tokenExpired, logout, navigate]);

    // Define el componente PrivateRoute
    const PrivateRoute = () => {
        if (!isAuthenticated && !isInitialLoading) {
            return <Navigate to="/login" />;
        }
        return (
            <div className="d-flex flex-nowrap vh-100 content-scroll">
                <SideBar isAuthenticated={isAuthenticated} /> {/* SideBar fuera de Outlet */}
                <div className="col mx-auto d-flex flex-column align-content-center">
                    <Outlet /> 
                </div>
            </div>
        );
    };

    return (
        <>
            {tokenExpired}

            {/* Condicionar la renderización de NavBar */}
            {location.pathname === '/' || location.pathname === '/login' || location.pathname === '/reset-password' ? (
                <NavBar isAuthenticated={isAuthenticated} />
            ) : null}

            <Routes>
                <Route
                    path="/"
                    element={
                        isLoading
                            ? null
                            : isAuthenticated ? (
                                <Navigate to="/app/" />
                            ) : (
                                <Home />
                            )
                    }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/reset-password" element={<PassRecovery />} />

                {/* Rutas privadas (con SideBar) */}
                <Route path="/app" element={<PrivateRoute />}>
                    <Route path="profile" element={<UserProfile />} />
                    <Route path="users" element={<Users />} />
                    <Route path="users/register" element={<UserForm />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="data" element={<Data />} />
                    <Route path="sheets" element={<Sheets />} />
                    <Route path="sheets/register" element={<SheetsForm />} />
                    <Route path="employees/register" element={<EmployeesPerArea />} />
                    <Route path="employees/list" element={<EmployeesList />} />
                    <Route path="setup-user" element={<SetupUser />} />
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
};
