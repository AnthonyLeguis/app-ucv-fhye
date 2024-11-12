import { useEffect, useState, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotification } from './components/Notifications';
import { AuthContext } from '../hooks/AuthContext';
import { useRememberMe } from '../hooks/useRememberMe';
import { usePasswordRecovery } from '../hooks/usePasswordRecovery';
import logo from '../assets/LogoCentral.svg'
import '../CSS/login.css'

export const Login = () => {

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
  const [showRecoveryForm, setShowRecoveryForm] = useState(false);

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

  const handleToggleRecoveryForm = () => {
    setShowRecoveryForm(!showRecoveryForm); // Cambia el estado para mostrar/ocultar el formulario de recuperación
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

              {/* Mostrar el título condicionalmente */}
              <div className="divider d-flex align-items-center my-4">
                <p className="text-center fw-bold mx-3 mb-0">
                  {showRecoveryForm
                    ? "Ingrese su correo para recuperar su contraseña"
                    : "Ingrese con sus datos"}
                </p>
              </div>

              {/* Mostrar el formulario de login solo si showRecoveryForm es false */}
              {!showRecoveryForm && (
                <form onSubmit={handleSubmit} className='h-100'>

                  <div data-mdb-input-init className="form-outline mb-4">
                    <label className="form-label" htmlFor="form3Example3">Cédula de Identidad</label>
                    <input type="text"
                      id="form3Example3"
                      className="form-control form-control-lg"
                      placeholder="Ingrese su número de Cédula"
                      value={rememberedNationalId}
                      autoComplete='on'
                      onChange={(e) => setRememberedNationalId(e.target.value)}
                    />
                  </div>

                  <div data-mdb-input-init className="form-outline mb-3">
                    <label className="form-label" htmlFor="form3Example4">Contraseña</label>
                    <input
                      type="password"
                      id="form3Example4"
                      className="form-control form-control-lg"
                      placeholder="Enter password"
                      value={rememberedPassword}
                      autoComplete='current-password'
                      onChange={(e) => setRememberedPassword(e.target.value)}
                    />
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <div className="form-check mb-0">
                      <input
                        className="form-check-input me-2"
                        type="checkbox"
                        value=""
                        id="form2Example3"

                        checked={rememberMee}
                        onChange={handleRememberMeChange}
                      />
                      <label className="form-check-label" htmlFor="form2Example3">
                        Recuerdame
                      </label>
                    </div>

                    <a href="#!" className="icon-link icon-link-hover" onClick={handleToggleRecoveryForm}>¿Olvidó su contraseña?

                      <i className="bi bi-arrow-right"></i>
                    </a>

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
              )}

              {/* Formulario de recuperación de contraseña */}
              {showRecoveryForm && (
                <form onSubmit={handlePasswordRecovery} className='h-100'>
                  <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="form3Example3">Correo</label>
                    <input type="email"
                      id="form3Example3"
                      className="form-control form-control-lg"
                      placeholder="Ingrese su correo"
                      value={email}
                      onChange={handleEmailChange}
                    />

                  </div>
                  <div className="text-center text-lg-start mt-4 pt-2">

                  <button type="submit"
                    className="btn btn-primary btn-md"
                  >
                    Enviar
                  </button>
                  </div>
                  <div className="text-center text-lg-start mt-4 pt-2">

                  <a href="/login" className="icon-link icon-link-hover mt-2 align-items-center"> 
                      <i className="bi bi-arrow-left"></i>
                      Volver al login
                    </a>
                  </div>
                </form>
              )}

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
