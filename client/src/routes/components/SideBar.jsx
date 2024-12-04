import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../CSS/sidebar.css';
import logo from '../../assets/LogoCentral.svg';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { AuthContext } from '../../hooks/AuthContext';
import { useContext, useEffect, useState } from 'react';
import { useNotification } from '../components/Notifications';
import { Collapse, Button, Badge } from 'react-bootstrap';
import { useAlerts } from '../../hooks/useAlerts'; // Importar el hook de alertas

export const SideBar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [isExpanded, setIsExpanded] = useState(true);
    const [openPlanillas, setOpenPlanillas] = useState(false);
    const [openUsuarios, setOpenUsuarios] = useState(false);
    const [openEmpleados, setOpenEmpleados] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useContext(AuthContext);
    const { showConfirmNotification } = useNotification();
    const { pendingSheets, rejectedSheets, approvedSheets } = useAlerts();

    const token = localStorage.getItem('token');
    let userName = 'Cargando...';
    let userLastNameInitial = '';
    let userRole = '';

    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            const names = decodedToken.names;
            const surnames = decodedToken.surnames;
            userRole = decodedToken.role;

            if (names && surnames) {
                userName = names.split(' ')[0];
                userLastNameInitial = surnames.charAt(0);
            }
        } catch (error) {
            console.error('Error al decodificar el token:', error);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setTimeout(() => {
            logout();
            navigate('/login');
        }, 2500);
    };

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const toggleSideBar = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={`sidebar-container ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <div className='sidebar d-flex flex-column justify-content-between'>
                <div className='my-3 mx-0'>
                    <NavLink to="/app/profile" className='text-decoration-none text-white d-flex my-2 flex-row'>
                        <img className='logo_SideBar' src={logo} alt="logo" />
                        <span className='ms-2 fs-5 text-center align-content-center d-none d-sm-block position-relative'>FHyE</span>
                        <span className='ms-2 fs-5 text-center align-content-center d-none d-sm-block text-danger position-absolute app_2'>APP</span>
                    </NavLink>
                    <hr className='text-secondary' />
                    <ul className="nav nav-pills flex-column">
                        <li className="nav-item text-white fs-4 my-1 py-2 py-sm-0">
                            <NavLink
                                to="/app/profile"
                                end
                                className={({ isActive }) =>
                                    `nav-link text-white fs-5 ${isActive ? 'active' : ''}`
                                }
                                aria-current="page"
                            >
                                <i className="bi bi-people-fill"></i>
                                <span className="ms-3 d-none d-sm-inline">Perfil</span>
                            </NavLink>
                        </li>
                        {userRole === 'role_master' && (
                            <>
                                <li className="nav-item text-white fs-4 my-1 py-2 py-sm-0">
                                    <NavLink
                                        to="/app/dashboard"
                                        className={({ isActive }) =>
                                            `nav-link text-white fs-5 ${isActive ? 'active' : ''}`
                                        }
                                        aria-current="page"
                                    >
                                        <i className="bi bi-speedometer2"></i>
                                        <span className="ms-3 d-none d-sm-inline">Estadísticas</span>
                                    </NavLink>
                                </li>
                                <li className="nav-item text-white fs-4 my-1 py-2 py-sm-0">
                                    <NavLink
                                        to="/app/data"
                                        className={({ isActive }) =>
                                            `nav-link text-white fs-5 ${isActive ? 'active' : ''}`
                                        }
                                        aria-current="page"
                                    >
                                        <i className="bi bi-person-vcard-fill"></i>
                                        <span className="ms-3 d-none d-sm-inline">Datos</span>
                                    </NavLink>
                                </li>
                            </>
                        )}
                        <li className="nav-item text-white fs-4 my-1 py-2 py-sm-0">
                            <Button
                                onClick={() => setOpenEmpleados(!openEmpleados)}
                                aria-controls="empleados-collapse-text"
                                aria-expanded={openEmpleados}
                                className="nav-link text-white fs-5 w-100 text-start "
                                variant="link"
                            >
                                <i className="bi bi-person-rolodex"></i>
                                <span className="ms-3 d-none d-sm-inline pointer">Personal</span>
                                <i className={`bi bi-chevron-${openEmpleados ? 'up' : 'down'} ms-1 fs-5 text-white align-self-center itemOption`}></i>
                            </Button>
                            <Collapse in={openEmpleados}>
                                <ul id="empleados-collapse-text" className="list-unstyled ps-4 mt-1">
                                    {(userRole === 'role_master' || userRole === 'role_rrhh') && (
                                        <li>
                                            <NavLink
                                                className={({ isActive }) =>
                                                    `dropdown-item ${isActive ? 'active' : ''}  py-2`
                                                }
                                                to="/app/employees/register"
                                            >
                                                Registrar Personal
                                            </NavLink>
                                        </li>
                                    )}
                                    <li>
                                        <NavLink
                                            className={({ isActive }) =>
                                                `dropdown-item ${isActive ? 'active' : ''}  py-2`
                                            }
                                            to="/app/employees/list"
                                        >
                                            Listado de Personal
                                        </NavLink>
                                    </li>
                                </ul>
                            </Collapse>
                        </li>
                        <li className="nav-item text-white fs-4 my-1 py-2 py-sm-0">
                            <Button
                                onClick={() => setOpenPlanillas(!openPlanillas)}
                                aria-controls="planillas-collapse-text"
                                aria-expanded={openPlanillas}
                                className="nav-link text-white fs-5 w-100 text-start "
                                variant="link"
                            >
                                <i className="bi bi-file-earmark-spreadsheet"></i>
                                <span className="ms-3 d-none d-sm-inline pointer">Planillas</span>
                                <i className={`bi bi-chevron-${openPlanillas ? 'up' : 'down'} ms-1 fs-5 text-white align-self-center itemOption`}></i>
                            </Button>
                            <Collapse in={openPlanillas}>
                                <ul id="planillas-collapse-text" className="list-unstyled ps-4 mt-1">
                                    {userRole === 'role_analyst' && (
                                        <>
                                            <li>
                                                <NavLink
                                                    className={({ isActive }) =>
                                                        `dropdown-item ${isActive ? 'active' : ''}  py-2`
                                                    }
                                                    to="/app/sheets/register"
                                                >
                                                    Crear Nueva Planilla
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink
                                                    className={({ isActive }) =>
                                                        `dropdown-item ${isActive ? 'active' : ''} py-2`
                                                    }
                                                    to="/app/sheets/approved"
                                                >
                                                    Planillas Aprobadas <Badge variant="success">{approvedSheets}</Badge>
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink
                                                    className={({ isActive }) =>
                                                        `dropdown-item ${isActive ? 'active' : ''} py-2`
                                                    }
                                                    to="/app/sheets/rejected"
                                                >
                                                    Planillas Rechazadas <Badge variant="danger">{rejectedSheets}</Badge>
                                                </NavLink>
                                            </li>
                                        </>
                                    )}
                                    {(userRole === 'role_budget' || userRole === 'role_rrhh') && (
                                        <li>
                                            <NavLink
                                                className={({ isActive }) =>
                                                    `dropdown-item ${isActive ? 'active' : ''} py-2`
                                                }
                                                to="/app/sheets/tobeapproved"
                                            >
                                                Planillas por Aprobar <Badge variant="warning">{pendingSheets}</Badge>
                                            </NavLink>
                                        </li>
                                    )}
                                </ul>
                            </Collapse>
                        </li>
                        {userRole === 'role_master' && (
                            <>
                                <li className="nav-item text-white fs-4 my-1 py-2 py-sm-0">
                                    <NavLink
                                        to="/app/sheet-status"
                                        className={({ isActive }) =>
                                            `nav-link text-white fs-5 ${isActive ? 'active' : ''}`
                                        }
                                        aria-current="page"
                                    >
                                        <i className="bi bi-eye-fill"></i>
                                        <span className="ms-3 d-none d-sm-inline">Ver Estado de Planillas</span>
                                    </NavLink>
                                </li>
                                <li className="nav-item text-white fs-4 my-1 py-2 py-sm-0">
                                    <NavLink
                                        to="/app/sheet-details"
                                        className={({ isActive }) =>
                                            `nav-link text-white fs-5 ${isActive ? 'active' : ''}`
                                        }
                                        aria-current="page"
                                    >
                                        <i className="bi bi-info-circle-fill"></i>
                                        <span className="ms-3 d-none d-sm-inline">Ver Detalles de Planillas</span>
                                    </NavLink>
                                </li>
                            </>
                        )}
                        {(userRole === 'role_master' || userRole === 'role_rrhh') && (
                            <li className="nav-item text-white fs-4 my-1 py-2 py-sm-0">
                                <Button
                                    onClick={() => setOpenUsuarios(!openUsuarios)}
                                    aria-controls="usuarios-collapse-text"
                                    aria-expanded={openUsuarios}
                                    className="nav-link text-white fs-5 w-100 text-start"
                                    variant="link"
                                >
                                    <i className="bi bi-people-fill"></i>
                                    <span className="ms-3 d-none d-sm-inline pointer">Usuarios</span>
                                    <i className={`bi bi-chevron-${openUsuarios ? 'up' : 'down'} ms-1 fs-5 text-white align-self-center itemOption`}></i>
                                </Button>
                                <Collapse in={openUsuarios}>
                                    <ul id="usuarios-collapse-text" className="list-unstyled ps-4 mt-1">
                                        <li>
                                            <NavLink className="dropdown-item py-2" to="/app/users">
                                                Lista de Usuarios
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink className="dropdown-item py-2" to="/app/users/register">
                                                Registrar Usuarios
                                            </NavLink>
                                        </li>
                                    </ul>
                                </Collapse>
                            </li>
                        )}
                    </ul>
                </div>
                <div className="dropup open mb-5">
                    <a
                        className="text-decoration-none dropdown-toggle text-white p-3 d-block d-sm-flex align-items-center"
                        type="button"
                        id="triggerId"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                    >
                        <i className="bi bi-person-circle fs-2 d-sm-fs-3"></i>
                        <span className="ms-2 fw-bold letter d-none d-sm-inline me-1 ms-1">{userName} {userLastNameInitial}.</span>
                    </a>
                    <div className="dropdown-menu ms-3" aria-labelledby="triggerId">
                        <NavLink className="dropdown-item" to="/app/setup-user">
                            <i className="bi bi-gear ms-2 fontColor">
                                <span className="pointer ms-1"> Configuración</span>
                            </i>
                        </NavLink>
                        <a className="dropdown-item pointer-event" onClick={() =>
                            showConfirmNotification("¿Seguro que quieres cerrar la sesión?", "warning", () => handleLogout())
                        }>
                            <i className="bi bi-box-arrow-right ms-2 fontColor">
                                <span className="pointer ms-1"> Cerrar sesión</span>
                            </i>
                        </a>
                    </div>
                </div>
            </div>
            <div className="toggle-btn" onClick={toggleSideBar}>
                <i className={`bi bi-chevron-${isExpanded ? 'left' : 'right'} fs-6 text-white align-self-center fw-bold`}></i>
            </div>
        </div>
    );
};
