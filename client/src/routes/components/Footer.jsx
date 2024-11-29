import React from 'react';
import logo from '../../assets/LogoCentral.svg';
import '../../CSS/footer.css'; // Asegúrate de que la ruta sea correcta

export const Footer = () => {
    return (
        <footer className="container-fluid d-flex flex-column flex-md-row text-white flex-wrap justify-content-around m-0">
            <div className="fs-6 text-center fw-bolder">
                Todos los derechos reservados
                <div>
                    &copy; {new Date().getFullYear()}
                </div>
            </div>
            <div className="d-flex flex-row fs-6 justify-content-around">
                <img src={logo} alt="Logo" className="img_logoFooter align-self-center mx-1" />
                <div className="fw-bolder fs-5">
                    FHyE-APP
                </div>
                <h5 className="fs-6 fw-bold text-primary text-end fst-italic mx-1">
                    Admin
                </h5>
            </div>
        </footer>
    );
};