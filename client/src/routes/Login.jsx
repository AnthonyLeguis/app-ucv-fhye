import { useEffect, useState, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotification } from './components/Notifications';
import { AuthContext } from '../hooks/AuthContext';
import { useRememberMe } from '../hooks/useRememberMe';
import { usePasswordRecovery } from '../hooks/usePasswordRecovery';
import { Modal, Button, Form } from 'react-bootstrap';
import logo from '../assets/LogoCentral.svg'
import '../CSS/login.css'

export const Login = () => {
  // Estado para controlar la visibilidad de la contraseña
  const [showPassword, setShowPassword] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const handleOpenRecoveryModal = () => setShowRecoveryModal(true);
  const handleCloseRecoveryModal = () => setShowRecoveryModal(false);

  // hook de autentificación
  const { nationalId: rememberedNationalId,
    setNationalId: setRememberedNationalId,
    password: rememberedPassword,
    setPassword: setRememberedPassword,
    rememberMee, handleRememberMeChange
  } = useRememberMe();
  const [error, setError] = useState(null);

  //hook de recuperación de  contraseña
  const { email, handleEmailChange, handlePasswordRecovery } = usePasswordRecovery();

  const { showNotification } = useNotification();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (error) {
      setRememberedNationalId('');
      setRememberedPassword('');

      const timer = setTimeout(() => {
        window.location.reload();
        //ejecutar el reload despues de 5 segundos
      }, 3000)

      return () => clearTimeout(timer);
    }
  }, [error]);

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
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Error al iniciar sesión';
        setError(errorMessage);
        showNotification(errorMessage, 'error');
      } else {
        const data = await response.json();
        console.log(data);
        localStorage.setItem('token', data.token);
        login(data.token, data.user.id);

        navigate('/app/');
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
                <p className="text-center fw-bold mx-3 mb-0">Ingrese
                  con sus datos</p>
              </div>

              <form onSubmit={handleSubmit} className='h-100'>

                <div data-mdb-input-init className="form-outline mb-4">
                  <label className="form-label" htmlFor="nationalID">Cédula de Identidad</label>
                  <input type="text"
                    id="nationalID"
                    className="form-control form-control-lg text-dark"
                    placeholder="Ingrese su número de Cédula"
                    value={rememberedNationalId}
                    autoComplete='on'
                    onChange={(e) => setRememberedNationalId(e.target.value)}
                  />
                </div>

                <div data-mdb-input-init className="form-outline mb-3">
                  <label className="form-label" htmlFor="password">Contraseña</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="form-control form-control-lg"
                      placeholder="Enter password"
                      value={rememberedPassword}
                      autoComplete='current-password'
                      onChange={(e) => setRememberedPassword(e.target.value)}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`bi ${showPassword ? "bi-eye-fill" : "bi-eye-slash-fill"} text-primary`}></i>
                    </button>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <div className="form-check mb-0">
                    <input
                      className="form-check-input me-2"
                      type="checkbox"
                      value=""

                      id="rememberUser"

                      checked={rememberMee}
                      onChange={handleRememberMeChange}
                    />
                    <label className="form-check-label" htmlFor="rememberUser">
                      Recuerdame
                    </label>
                  </div>

                  <Button variant="link" onClick={handleOpenRecoveryModal}>
                    ¿Olvidó su contraseña?
                  </Button>

                </div>

                <div className="text-center text-lg-start mt-4 pt-2">
                  <button type="submit"
                    data-mdb-ripple="true"
                    data-mdb-button-init data-mdb-ripple-init
                    className="btn btn-primary btn-md buttonLogin">
                    Entrar
                  </button>
                </div>

              </form>

              {/* Modal de recuperación de contraseña */}
              <Modal show={showRecoveryModal} onHide={handleCloseRecoveryModal} centered>
                <Modal.Header closeButton>
                  <Modal.Title>Recuperar Contraseña</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form onSubmit={handlePasswordRecovery}>
                    <Form.Group>
                      <Form.Label htmlFor="recoveryEmail" className="fw-bold">
                        Correo electrónico de recuperación
                      </Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Ingrese su correo electrónico"
                        id="recoveryEmail"
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
          <div className='fs-6 text-center fw-bold'>
            Todos los derechos reservados
            <div>
              &copy; {new Date().getFullYear()}
            </div>
          </div>
          <div className='d-flex flex-column fs-6'>
            <img src={logo} alt="Logo" className='img_logoFooter align-self-center' />
            <div className='fw-bold fs-5'>
              FHyE-APP
            </div>
            <h5 className='fs-6 fw-bold text-primary text-end'>
              Admin
            </h5>
          </div>
        </footer>
      </section>
    </>
  )
}
