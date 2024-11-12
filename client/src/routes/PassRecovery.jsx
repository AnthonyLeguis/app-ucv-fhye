import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showNotification } from '../routes/components/Notifications';

export const PassRecovery = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError(null);

        // Validaciones del frontend

        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (newPassword.length < 8 || newPassword.length > 16) {
            setError('La contraseña debe tener entre 8 y 16 caracteres');
            return;
        }

        try {

            //Obtener el token de la URL
            const token = new URLSearchParams(window.location.search).get('token');

            // Realizar la solicitud para cambiar la contraseña
            const response = await fetch(`${import.meta.env.VITE_API_USER_URL}/reset-passwordToken?token=${token}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newPassword, confirmPassword }),
            });

            if (response.ok) {
                setSuccess(true);

                // Mostrar notificación de éxito
                showNotification('La contraseña se ha restablecido correctamente, será redirigido al inicio de sesión', 'success');

                // Redirigir al usuario a la página de login después de un tiempo
                setTimeout(() => {
                    navigate('/login');
                }, 5000); // 5 segundos
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Error al restablecer la contraseña');

                // Mostrar notificación de error
                showNotification(errorData.message || 'Error al restablecer la contraseña', 'error');

            }

        } catch (error) {
            setError('Error en la comunicación con el servidor');

            // Mostrar notificación de error
            showNotification('Error en la comunicación con el servidor', 'error');
        }
    }

    // Estado para controlar la visibilidad de la contraseña
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <div>
                <h1>Restablecer contraseña</h1>

                {success ? (
                    <div>
                        <p>Contraseña restablecida correctamente.</p>
                        <p>Serás redirigido a la página de inicio de sesión en 3 segundos.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="newPassword">Nueva contraseña:</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <i
                                className={`bi ${showPassword ? 'bi-eye' : 'bi-eye-slash'}`} // Cambiar el icono según el estado
                                onClick={toggleShowPassword} // Llamar a la función para cambiar el estado
                            ></i>
                        </div>
                        <div>
                            <label htmlFor="confirmPassword">Confirmar contraseña:</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <i
                                className={`bi ${showPassword ? 'bi-eye' : 'bi-eye-slash'}`} // Cambiar el icono según el estado
                                onClick={toggleShowPassword} // Llamar a la función para cambiar el estado
                            ></i>
                        </div>
                        {error && <p className="error">{error}</p>}
                        <button type="submit">Restablecer
                            contraseña</button>
                    </form>
                )}
            </div>
        </>
    )
}
