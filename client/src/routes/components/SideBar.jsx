import 'bootstrap-icons/font/bootstrap-icons.css'
import '../../CSS/sidebar.css'
import logo from '../../assets/LogoCentral.svg'
import { jwtDecode } from "jwt-decode"
import { useNavigate, NavLink } from "react-router-dom";
import { AuthContext } from '../../hooks/AuthContext';
import { useContext, useEffect, useState } from 'react';
import { useNotification } from '../components/Notifications';

export const SideBar = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);
    const { showConfirmNotification } = useNotification();

    const token = localStorage.getItem('token');
    let userName = 'Cargando...'; // Valor por defecto
    let userLastNameInitial = '';

    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            console.log(decodedToken);
            const names = decodedToken.names; // Asumiendo que el nombre está en el campo "names" del token
            const surnames = decodedToken.surnames; // Asumiendo que el apellido está en el campo "surnames" del token

            if (names && surnames) {
                userName = names.split(' ')[0]; // Obtener la primera palabra del nombre
                userLastNameInitial = surnames.charAt(0); // Obtener la primera letra del apellido
            }
        } catch (error) {
            console.error('Error al decodificar el token:', error);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setTimeout(() => {
            logout(); // Llamar a la función logout del contexto
            navigate('/login'); // Redirigir a la página de login
        }, 2500);
    };

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);


    return (
        <>
            <div className="container">
                <div className="row">
                    <div className='col col-md-12 side_Background vh-100 col-auto col-sm-10 d-flex flex-column justify-content-between'>
                        <div className='my-3 mx-0'>
                            <NavLink to="/app" className='text-decoration-none text-white d-flex my-2 d-flex flex-row'>
                                <img className='logo_SideBar ' src={logo} alt="logo" />
                                <span className='ms-2 fs-5 text-center align-content-center d-none d-sm-block position-relative'>FHyE </span>
                                <span className='ms-2 fs-5 text-center align-content-center d-none d-sm-block text-danger position-absolute app_2'>APP</span>
                            </NavLink>
                            <hr className='text-secondary' />
                            <ul className="nav nav-pills flex-column">

                                <li className="nav-item text-white fs-4 my-1 py-2 py-sm-0">
                                    <NavLink to="/app/" end className={({ isActive }) => `nav-link text-white fs-5 ${isActive ? 'active' : ''}`} aria-current="page">
                                        <i className='bi bi-people-fill'></i>
                                        <span className='ms-3 d-none d-sm-inline'>Perfil</span>

                                    </NavLink>
                                </li>

                                <li className="nav-item text-white fs-4 my-1 py-2 py-sm-0 ">
                                    <NavLink to="/app/dashboard" className="nav-link text-white fs-5" aria-current="page">
                                        <i className='bi bi-speedometer2'></i>
                                        <span className='ms-3 d-none d-sm-inline'>Estadísticas</span>

                                    </NavLink>
                                </li>
                                <li className="nav-item text-white fs-4 my-1 py-2 py-sm-0">
                                    <NavLink to="/app/data" className="nav-link text-white fs-5" aria-current="page">
                                        <i className='bi bi-person-vcard-fill'></i>
                                        <span className='ms-3 d-none d-sm-inline'>Datos</span>

                                    </NavLink>
                                </li>

                                <li className="nav-item dropend text-white fs-4 my-1 py-2 py-sm-0">
                                    <a
                                        className="nav-link dropdown-toggle text-white fs-5 text-center d-flex flex-row justify-content-start align-items-center open"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <i className='bi bi-file-earmark-spreadsheet'></i>
                                        <span className='ms-3 d-none d-sm-inline pointer'>Planillas de <br></br> movimiento</span>
                                    </a>
                                    <ul className="dropdown-menu mx-1 ">
                                        <li>
                                            <NavLink className={({ isActive }) => `dropdown-item ${isActive ? 'active' : ''}`}
                                                to="/app/sheets" >
                                                Ingreso de prorrogas 
                                            </NavLink></li>
                                        <li>
                                            <NavLink className={({ isActive }) => `dropdown-item ${isActive ? 'active' : ''}`}
                                                to="/app/sheets/register" >
                                                Crear Planilla
                                            </NavLink>
                                        </li>
                                        {/* ... (otros elementos del dropdown planillas) ... */}
                                    </ul>
                                </li>
                                <li className="nav-item dropend text-white fs-4 my-1 py-2 py-sm-0">
                                    <a
                                        className="nav-link dropdown-toggle text-white fs-5 text-center d-flex flex-row justify-content-start align-items-center"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="true"
                                    >
                                        <i className='bi bi-people-fill'></i>
                                        <span className='ms-3 d-none d-sm-inline pointer'>Usuarios</span>
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-start mx-1">
                                        <li>
                                            <NavLink className="dropdown-item" to="users">
                                                Lista de Usuarios
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink className="dropdown-item" to="users/register">
                                                Registrar Usuarios
                                            </NavLink>
                                        </li>
                                        {/* ... (otros elementos del dropdown) ... */}
                                    </ul>
                                </li>
                            </ul>
                        </div>
                        <div className="dropup open mb-5">
                            <a
                                className="text-decoration-none dropdown-toggle text-white p-3"
                                type="button"
                                id="triggerId"
                                data-bs-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                            >
                                <i className="bi bi-person-circle fs-2 d-sm-fs-3"></i>
                                <span className='ms-2 fw-bold letter d-none d-sm-inline me-1'>{userName} {userLastNameInitial}.</span>
                            </a>
                            <div className="dropdown-menu ms-3" aria-labelledby="triggerId">
                                <NavLink className="dropdown-item" to="/app/setup-user">
                                    <i className="bi bi-gear">
                                        <span> Configuración</span>
                                    </i>
                                </NavLink>
                                <a className="dropdown-item pointer-event" onClick={() =>
                                    showConfirmNotification("¿Seguro que quieres cerrar la sesión?", "warning", () => handleLogout())
                                }>
                                    <i className="bi bi-box-arrow-right">
                                        <span className='pointer'> Cerrar sesión</span>
                                    </i>
                                </a>
                            </div>
                        </div>

                    </div>

                    <div className='col col-auto content-container'>

                    </div>
                </div>
            </div>

        </>
    )
}
