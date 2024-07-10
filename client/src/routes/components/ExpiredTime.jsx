import React from 'react'
import { useNavigate } from 'react-router-dom'

export const ExpiredTime = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/login');
    }

    return (
        <>
            <div className="modal fade" id="modal" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Tiempo de sesión expirado</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>Por favor inicie sesión nuevamente.</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" onClick={handleLogout}
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
