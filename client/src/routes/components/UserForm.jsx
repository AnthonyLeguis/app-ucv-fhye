import { useEffect, useState } from "react"
import { useUserRegistration } from "../../hooks/useUserRegistration"
import { useNotification } from "./Notifications";
import { jwtDecode } from "jwt-decode";
import * as ExcelJS from 'exceljs';

export const UserForm = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneOperator, setPhoneOperator] = useState("");
  const { showNotification } = useNotification();
  const [userRole, setUserRole] = useState("");
  const [areaOptions, setAreaOptions] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const {
    formData,
    handleChange,
    handleSubmit,
    isLoading,
    success,
    setSuccess,
    setFormData,
  } = useUserRegistration();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.role);
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    }
  }, [])


  useEffect(() => {
    let timeoutId;
    if (success && formRef.current) {
      timeoutId = setTimeout(() => {

        // Limpiar el estado del formulario después de restablecer
        setFormData({
          names: "",
          surnames: "",
          email: "",
          nationalId: "",
          phone: "",
          area: "",
          role: "",
        });

        setSuccess(false);
      }, 3000);
    }

    return () => clearTimeout(timeoutId);
  }, [success, setFormData, setSuccess]);


  useEffect(() => {
    // Evitar la actualización del estado si no ha cambiado el operador o número
    if (phoneNumber && phoneOperator) {
      const rawPhoneNumber = phoneNumber.replace(/-/g, '');
      setFormData({
        ...formData,
        phone: `${phoneOperator}${rawPhoneNumber}`,
      });
    }
  }, [phoneNumber, phoneOperator, setFormData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/formOptions.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        // 1. Crear un nuevo libro de trabajo de ExcelJS
        const workbook = new ExcelJS.Workbook();
        // 2. Cargar el arrayBuffer en el libro de trabajo
        await workbook.xlsx.load(arrayBuffer);

        // 3. Obtener la hoja de trabajo "area"
        const worksheet = workbook.getWorksheet("area");
        // 4. Convertir los datos de la hoja de trabajo a un array de objetos
        const jsonData = [];
        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber !== 1) { // Ignorar la primera fila (encabezados)
            const rowData = {};
            row.eachCell((cell, colNumber) => {
              // Usar los valores de la primera fila como claves para el objeto
              rowData[worksheet.getCell(1, colNumber).value] = cell.value;
            });
            jsonData.push(rowData);
          }
        });
        setAreaOptions(jsonData);
        setFilteredOptions(jsonData);
        //console.log("Datos obtenidos:", jsonData[0]?.Area);
        

        setFormData((prevFormData) => ({
          ...prevFormData,
          area: jsonData[0]?.Area || '',
        }));
      } catch (error) {
        console.error("Error al obtener los datos", error);
      }
    };

    fetchData();
  }, [setFormData]);

  useEffect(() => {
    if (areaOptions.length > 0 && areaOptions.every(item => item.Area)) {
      const filtered = areaOptions.filter((item) =>
        item.Area.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [searchText, areaOptions]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Validar formato de cédula
    const numericRegex = /^\d+$/;
    if (!numericRegex.test(formData.nationalId)) {
      showNotification(
        "La cédula de identidad debe ser numérica",
        "warning"
      );
      return;
    }

    await handleSubmit(event);
  };

  const handlePhoneOperatorChange = (event) => {
    setPhoneOperator(event.target.value); // Actualizar el operador
  };

  return (
    <>
      <div className="container-fluid contain overflow-auto h-100">

        <div className="row d-flex align-items-center justify-content-between">

          <div className="col-12 col-md-8 mx-auto d-flex flex-row mt-5 mb-5">
            <h1 className="TitleName text-center mx-auto ">Registro de usuarios</h1>
          </div>

          <div className="row d-flex align-items-center justify-content-center h-100">

            <form
              onSubmit={handleFormSubmit}
              className="needs-validation col-12 col-md-8 mx-auto p-2 shadow rounded-4 h-100"
            >
              {/* Campos del formulario */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="names" className="form-label">
                    Nombres:
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="names"
                    name="names"
                    value={formData.names}
                    onChange={handleChange}
                    required
                  />            </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="surnames" className="form-label">
                    Apellidos:
                  </label>
                  <input type="text"
                    className="form-control form-control-sm"
                    id="surnames"
                    name="surnames"
                    value={formData.surnames} onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Correo electrónico:
                </label>
                <input type="email"
                  className="form-control form-control-sm"
                  id="email"
                  name="email"
                  autoComplete="on"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="row mb-3">
                <div className="col-md-6 mt-3 mt-xs-0 mb-3">
                  <label htmlFor="nationalId" className="form-label">
                    Cédula de Identidad:
                  </label>
                  <input type="text"
                    className="form-control form-control-sm"
                    id="nationalId"
                    name="nationalId"
                    value={formData.nationalId}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mt-3 mt-xs-0 mb-3">
                  <label htmlFor="phone" className="form-label">Teléfono:</label>
                  <div className="input-group d-flex flex-row">
                    <div className="col-4">
                      <select
                        className="form-select form-select-sm"
                        id="phoneOperator"
                        name="phoneOperator"
                        value={phoneOperator || ""}
                        onChange={handlePhoneOperatorChange}
                      >
                        <option value="">Operadora</option>
                        <option value="0412">0412</option>
                        <option value="0414">0414</option>
                        <option value="0424">0424</option>
                        <option value="0416">0416</option>
                        <option value="0426">0426</option>
                      </select>

                    </div>
                    <div className="col-8">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="phone"
                        name="phone"
                        autoComplete="on"
                        placeholder="Teléfono"
                        value={phoneNumber}
                        onChange={(e) => {
                          const input = e.target.value.replace(/\D/g, '');
                          if (input.length <= 7) {
                            const formattedPhone = input.replace(/(\d{3})(\d{2})(\d{2})/, '$1-$2-$3');
                            setPhoneNumber(formattedPhone);
                          }
                        }}
                        onBlur={(e) => {
                          if (e.target.value.replace(/-/g, "").length < 7) {
                            showNotification(
                              "El número de teléfono debe tener 7 dígitos",
                              "warning"
                            );
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mt-3 mt-xs-0 mb-3">
                  <label htmlFor="area" className="form-label">Instancia: </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="areaSearch"
                    name="areaSearch"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Escriba el nombre del area..."
                  />
                  <select
                    className="form-select form-select-sm mt-2"
                    id="area"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccionar...</option>
                    {filteredOptions.map((item, index) => (
                      <option key={index} value={`${item.Código} - ${item.Area}`}> {/* Usar item.Código */}
                        {item.Area}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mt-3 mt-xs-0 mb-3">
                  <label htmlFor="role" className="form-label">
                    Rol:
                  </label>
                  <select
                    className="form-select form-select-sm"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccionar...</option>

                    {/* Mostrar opciones según el rol del usuario */}
                    {userRole === "role_master" && (
                      <>
                        <option value="role_rrhh">Recursos Humanos</option>
                        <option value="role_budget">Presupuesto</option>
                        <option value="role_analyst">Analista</option>
                      </>
                    )}

                    {userRole === "role_rrhh" && (
                      <>
                        <option value="role_budget">Presupuesto</option>
                        <option value="role_analyst">Analista</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Mensajes de éxito y error con estilos opcionales
              {success && (
                <div className="alert alert-success" role="alert">
                  Usuario registrado correctamente
                </div>
              )}
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )} */}

              <div className="d-flex justify-content-center mt-5 mb-4">
                <button type="submit" className="btn btn-primary item-center" disabled={isLoading}>
                  {isLoading ? 'Registrando...' : 'Registrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
