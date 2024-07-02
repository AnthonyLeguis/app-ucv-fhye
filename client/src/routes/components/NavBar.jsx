import { Link, NavLink } from "react-router-dom";
import { Squash as Hamburger } from 'hamburger-react'
import { useState, useEffect } from "react";
import logo from '../../assets/LogoCentral.svg'
import 'bootstrap-icons/font/bootstrap-icons.css'
import '../../CSS/navBar.css'


export const NavBar = () => {
    const [isOpen, setOpen] = useState(false);
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);

    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 992);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleIngresarClick = () => {
        setTimeout(() => {
            setOpen(false); // Cerrar menú desplegable después de 1 segundo
        }, 1000);
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar_color ">
                <div className="container-fluid mx-4 transition z-3" style={{ transitionDuration: '1s' }}>
                    <Link to={"/"} className="navbar-brand text-white d-flex align-items-center ">
                        <div className="d-flex flex-column">
                            <h2 className="m-0 text-white">FHyE-APP</h2>
                            <span className="fs-5 m-0 font-monospace fw-bold fst-italic text-end tracking-wide text-primary">admin</span>
                        </div>
                    </Link>

                    {/* Botón de hamburguesa (visible solo en pantallas pequeñas y medianas) */}
                    <button
                        className="navbar-toggler border-0 text-light btn-sm"
                        type="button"
                        onClick={() => setOpen(!isOpen)}
                        aria-controls="navbarNav"
                        aria-expanded={isOpen}
                        aria-label="Toggle navigation"
                    >
                        <Hamburger toggled={isOpen} />
                    </button>

                    {/* Menú desplegable (visible solo en pantallas pequeñas y medianas) */}
                    {!isLargeScreen && ( // Mostrar solo en pantallas pequeñas y medianas
                        <div className={`collapse navbar-collapse d-flex justify-content-center align-items-center vh-100 ${isOpen ? 'show' : ''}`} id="navbarNav">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <NavLink to="/login" className="nav-link text-white text-center "
                                        aria-current="page"
                                        onClick={handleIngresarClick}>
                                        <button className="btn btn-primary text-center">
                                            <p className="fs-4 my-auto pb-1">
                                                <i className="bi bi-box-arrow-in-right fs-4 me-2"></i>
                                                Ingrese
                                            </p>
                                        </button>
                                    </NavLink>
                                </li>
                            </ul>
                        </div>
                    )}
                    
                    <div className="d-none d-lg-flex justify-content-center align-items-center marginer fade-in">
                    <img className="img_logo d-none d-lg-block align-content-center" src={logo} alt="Logo" />
                    </div>


                    {/* Botón "Ingresar" (visible solo en pantallas grandes) */}
                    {isLargeScreen && ( // Mostrar solo en pantallas grandes
                        <NavLink to="/login" className="nav-link text-white" aria-current="page">
                            <button className="btn btn-primary text-center btn-sm">
                                <p className="fs-4 my-auto pb-1">
                                    <i className="bi bi-box-arrow-in-right fs-4 me-2"></i>
                                    Ingrese
                                </p>
                            </button>
                        </NavLink>
                    )}
                </div>
            </nav>
        </>
    );
};