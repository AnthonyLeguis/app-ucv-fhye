import { useState, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useNotification } from './components/Notifications';
import { AuthContext } from '../hooks/AuthContext';
import { useRememberMe } from '../hooks/useRememberMe';
import { usePasswordRecovery } from '../hooks/usePasswordRecovery';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import '../CSS/login.css'

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleOpenRecoveryModal = () => setShowRecoveryModal(true); // Define la función aquí
  const handleCloseRecoveryModal = () => setShowRecoveryModal(false);

  // hook de autentificación
  const {
    nationalId: rememberedNationalId,
    setNationalId: setRememberedNationalId,
    password: rememberedPassword,
    setPassword: setRememberedPassword,
    rememberMee, handleRememberMeChange
  } = useRememberMe();

  const { email, handleEmailChange, handlePasswordRecovery } = usePasswordRecovery();
  const { showNotification } = useNotification();
  const { login } = useContext(AuthContext);
  const location = useLocation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_USER_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nationalId: rememberedNationalId, password: rememberedPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Error al iniciar sesión';
        setError(errorMessage);
        showNotification(errorMessage, 'error');
      } else {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        login(data.token, data.user.id);

        navigate('/app/profile');
      }

    } catch (error) {
      const errorMessage = 'Error en la comunicación con el servidor';
      setError(errorMessage);
      showNotification(errorMessage, 'error');
      console.error(error);
    }
  };

  return (
    <>
      <section className="section vh-100 d-flex flex-column justify-content-between bg-body">
        <div className="container-fluid d-flex flex-column justify-content-center align-content-center my-auto flex-grow-1">
          <div className="row d-flex justify-content-center align-items-center bg-body mb-3 d-lg-mb-0">
            <div className="col-md-6 col-lg-4 col-xl-4">
              <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                className="img-fluid h-100" alt="Sample image" />
            </div>
            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
              <div className="divider d-flex align-items-center my-4">
                <p className="text-center fw-bold mx-3 mb-0">Ingrese con sus datos</p>
              </div>

              {/* Formulario con React Bootstrap */}
              <Form onSubmit={handleSubmit} className='h-100'>
                {error && <Alert variant="danger">{error}</Alert>} {/* Mostrar error */}

                <Form.Group className="mb-4" controlId="nationalID">
                  <Form.Label>Cédula de Identidad</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese su número de Cédula"
                    value={rememberedNationalId}
                    autoComplete='on'
                    onChange={(e) => setRememberedNationalId(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Contraseña</Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type={showPassword ? "text" : "password"}

                      placeholder="Ingrese su contraseña"
                      value={rememberedPassword}
                      autoComplete='current-password'
                      onChange={(e) => setRememberedPassword(e.target.value)}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`bi ${showPassword ? "bi-eye-fill" : "bi-eye-slash-fill"} text-primary`}></i>
                    </Button>
                  </div>
                </Form.Group>

                <div className="d-flex justify-content-between align-items-center">
                  <Form.Group className="mb-0" controlId="rememberUser">
                    <Form.Check
                      type="checkbox"
                      label="Recuerdame"
                      checked={rememberMee}
                      onChange={handleRememberMeChange}
                    />
                  </Form.Group>

                  <Button variant="link" onClick={handleOpenRecoveryModal}>
                    ¿Olvidó su contraseña?
                  </Button>
                </div>

                <div className="text-center text-lg-start mt-4 pt-2">
                  <Button variant="primary" type="submit" className='buttonLogin'>
                    Entrar
                  </Button>
                </div>
              </Form>

              {/* Modal de recuperación de contraseña */}
              <Modal show={showRecoveryModal} onHide={handleCloseRecoveryModal} centered>
                <Modal.Header closeButton>
                  <Modal.Title>Recuperar Contraseña</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form onSubmit={handlePasswordRecovery}>
                    <Form.Group controlId="recoveryEmail">
                      <Form.Label className="fw-bold">
                        Correo electrónico de recuperación
                      </Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Ingrese su correo electrónico"
                        value={email}
                        onChange={handleEmailChange}
                      />
                      <Form.Text style={{ color: '#950000' }}>
                        *Ingrese el correo electrónico asociado a su cuenta
                      </Form.Text>
                    </Form.Group>
                    <Button variant="primary" type="submit" className='mt-4'>
                      Enviar
                    </Button>
                  </Form>
                </Modal.Body>
              </Modal>
            </div>
          </div>
        </div>

        {location.state?.from && (
          <p>Debes iniciar sesión para acceder a {location.state.from.pathname}</p>
        )}

        <footer className='container-fluid d-flex flex-column flex-md-row text-white flex-wrap justify-content-around '>
          {/* ... (código del footer) ... */}
        </footer>
      </section>
    </>
  )
}
