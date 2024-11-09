import { useEffect, useRef } from "react"
import PhoneNumberInput from './PhoneNumberInput.jsx';
import { useUserRegistration } from "../../hooks/useUserRegistration"

export const UserForm = () => {
  const { formData, handleChange, handleSubmit, isLoading, error, success, setSuccess, setFormData } = useUserRegistration()
  const formRef = useRef(null)

  useEffect(() => {
    let timeoutId;
    if (success && formRef.current) {
      timeoutId = setTimeout(() => {
        formRef.current.reset();

        // Limpiar el estado del formulario después de restablecer
        setFormData({
          names: '',
          surnames: '',
          email: '',
          password: '',
          ci: '',
          idac: '',
          address: '',
          phone: '',
          school: '',
          department: '',
          professorship: '',
          current_dedication: '',
          executing_unit: '',
          hire_date: '',
          gender: '',
          ci_tipo: '',
        });

        setSuccess(false);
      }, 3000);
    }

    return () => clearTimeout(timeoutId);
  }, [success, setFormData, setSuccess]);


  return (
    <>
      <div className="container h-100 overflow-y-scroll">
        {success && <div className="alert alert-success">Usuario registrado correctamente</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <h1>Registro de usuario</h1>

        <form ref={formRef} onSubmit={handleSubmit} className="needs-validation col-12 col-md-8 mx-auto p-2 shadow-sm ">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="names" className="form-label">Nombres:</label>
              <input type="text" className="form-control form-control-sm" id="names" name="names" value={formData.names} onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="surnames" className="form-label">Apellidos:</label>
              <input type="text" className="form-control form-control-sm" id="surnames" name="surnames" value={formData.surnames} onChange={handleChange} required />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo electrónico:</label>
            <input type="email" className="form-control form-control-sm" id="email" name="email" autoComplete="on" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="gender" className="form-label">Genero:</label>
              <select className="form-select form-select-sm" id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Seleccionar...</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="password" className="form-label">Contraseña:</label>
              <input type="password" className="form-control form-control-sm" id="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>

          </div>


          <div className="row">
            <div className="col-md-4 mb-3">
              <label htmlFor="ci" className="form-label">Cédula de Identidad:</label>
              <input type="text" className="form-control form-control-sm" id="ci" name="ci" value={formData.ci} onChange={handleChange} required />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="ci_tipo" className="form-label">Tipo de Cédula:</label>
              <select className="form-select form-select-sm" id="ci_tipo" name="ci_tipo" value={formData.ci_tipo} onChange={handleChange} required>
                <option value="">-- Seleccione --</option>
                <option value="V">V</option>
                <option value="E">E</option>
              </select>
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="idac" className="form-label">IDAC:</label>
              <input type="text" className="form-control form-control-sm" id="idac" name="idac" value={formData.idac} onChange={handleChange} required />
            </div>
          </div>

          <div className="row">

            <div className="col-md-4 mb-3">
              <label htmlFor="school" className="form-label">Escuela:</label>
              <input type="text" className="form-control form-control-sm" id="school" name="school" value={formData.school} onChange={handleChange} required />
            </div>

            <div className="col-md-4 mb-3">
              <label htmlFor="address" className="form-label">Dirección:</label>
              <input type="text" className="form-control form-control-sm" autoComplete="on" id="address" name="address" value={formData.address} onChange={handleChange} required />
            </div>

            <div className="col-md-4 mb-3">
                <label htmlFor="phone" className="form-label">Teléfono:</label>
                <PhoneNumberInput />
            </div>

          </div>

          {/* ... (otros campos del formulario: department, professorship, etc.) ... */}
          <div className="row">
            <div className="col-md-4 mb-3">
              <label htmlFor="department" className="form-label">Departamento:</label>
              <input type="text" className="form-control" id="department" name="department" value={formData.department} onChange={handleChange} required />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="professorship" className="form-label">Cátedra:</label>
              <input type="text" className="form-control" id="professorship" name="professorship" value={formData.professorship} onChange={handleChange} required />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="current_dedication" className="form-label">Dedicación Actual:</label>
              <input type="text" className="form-control" id="current_dedication" name="current_dedication" value={formData.current_dedication} onChange={handleChange} required />
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label htmlFor="executing_unit" className="form-label">Unidad Ejecutora:</label>
              <input type="text" className="form-control" id="executing_unit" name="executing_unit" value={formData.executing_unit} onChange={handleChange} required />
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="hire_date" className="form-label">Fecha de Contratación:</label>
              <input type="date" className="form-control" id="hire_date" name="hire_date" value={formData.hire_date} onChange={handleChange} required />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>
      </div>
    </>
  )
}
