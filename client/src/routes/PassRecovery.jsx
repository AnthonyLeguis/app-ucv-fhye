import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from './components/Notifications';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';

export const PassRecovery = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();
    const { showNotification } = useNotification();

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
        <Container className="mt-5 vh-100">
            <Row className="justify-content-md-center my-auto">
                <Col xs={12} md={6}>
                    <h1 className="text-center mb-4">Restablecer contraseña</h1>

                    {success ? (
                        <Alert variant="success">
                            <p>Contraseña restablecida correctamente.</p>
                            <p>Serás redirigido a la página de inicio de sesión en 5 segundos.</p>
                        </Alert>
                    ) : (
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="formNewPassword">
                                <Form.Label>Nueva contraseña:</Form.Label>
                                <div className="input-group">
                                    <Form.Control
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Ingrese su nueva contraseña"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <i className={`bi ${showPassword ? "bi-eye-fill" : "bi-eye-slash-fill"} text-primary`}></i>
                                    </Button>
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formConfirmPassword">
                                <Form.Label>Confirmar contraseña:</Form.Label>
                                <div className="input-group"> {/* Agrega input-group aquí también */}
                                    <Form.Control
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Confirme su nueva contraseña"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <i className={`bi ${showPassword ? "bi-eye-fill" : "bi-eye-slash-fill"} text-primary`}></i>
                                    </Button>
                                </div>
                            </Form.Group>

                            {error && <Alert variant="danger">{error}</Alert>}

                            <Button variant="primary" type="submit" className="w-100">
                                Restablecer contraseña
                            </Button>
                        </Form>
                    )}
                </Col>
            </Row>
        </Container>
    );
};