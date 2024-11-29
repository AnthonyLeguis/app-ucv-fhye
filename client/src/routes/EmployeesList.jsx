import { useState } from 'react'
import { useEmployeeListHook } from '../hooks/useEmployeeListHook'
import { useDeleteEmployee } from '../hooks/useDeleteEmployee'
import { useUpdateEmployee } from '../hooks/useUpdateEmployee'
import {
  VenezuelanBanks,
  studiesGrade,
  maritalStatus,
  gender,
} from '../helpers/listFormEmployee'
import { Spinner } from './components/Spinner'
import { Pagination, Button, Modal, Form } from 'react-bootstrap'
import '../CSS/data.css'

export const EmployeesList = () => {
  const { employees, loading, error, page, totalPages, handlePageChange, updateEmployees } = useEmployeeListHook();
  const { deleteEmployee } = useDeleteEmployee();
  const { updateEmployee } = useUpdateEmployee();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editFormData, setEditFormData] = useState({
    names: "",
    surnames: "",
    email: "",
    area: '',
    idType: 'V',
    nationalId: '',
    rif: '',
    birthdate: '',
    countryOfBirth: '',
    cityOfBirth: '',
    maritalStatus: '',
    gender: '',
    familyDependents: 0,
    educationLevel: '',
    phoneNumber: '',
    address: '',
    bank: '',
    payrollAccount: '',
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleCloseEditModal = () => setShowEditModal(false);

  const handleShowEditModal = (employee) => {
    setEditingEmployee(employee);
    setEditFormData({
      names: employee.names,
      surnames: employee.surnames,
      email: employee.email,
      area: employee.area,
      idType: employee.idType,
      nationalId: employee.nationalId,
      rif: employee.rif,
      birthdate: formatDate(employee.birthdate), // Formatear la fecha aquí
      countryOfBirth: employee.countryOfBirth,
      cityOfBirth: employee.cityOfBirth,
      maritalStatus: employee.maritalStatus,
      gender: employee.gender,
      familyDependents: employee.familyDependents,
      educationLevel: employee.educationLevel,
      phoneNumber: employee.phoneNumber,
      address: employee.address,
      bank: employee.bank,
      payrollAccount: employee.payrollAccount,
    });
    setShowEditModal(true);
  };

  const handleEditFormChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    // Lógica para validar y enviar los datos del formulario de edición
    await updateEmployee(editingEmployee._id, editFormData); // Ajustado al API
    handleCloseEditModal();
    updateEmployees(); // Actualizar la lista después de editar
  };

  if (loading) {
    return (<div> <Spinner /> </div>);
  }

  if (error) {
    return <p>Error al obtener la lista de empleados: {error}</p>;
  }

  return (
    <>
      <div className="container-fluid contain overflow-auto h-100">
        <div className='my-4'>
          <h1 className="TitleName text-center text-center m-0">
            Lista de empleados
          </h1>
        </div>

        {/* Tabla del personal */}
        <div className="row d-flex align-items-top justify-content-top fs-6">
          <div className="table-responsive col-12 col-md-10 col-lg-8 mx-auto p-2 shadow rounded-4">
            <table className="table table-striped table-hover table-responsive-sm">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Apellido</th>
                  <th scope="col">Cédula</th>
                  <th scope="col">Área</th>
                  <th scope="col">Modificar</th>
                  <th scope="col">Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee, index) => (
                  <tr key={employee._id}>
                    <th scope="row" className="align-middle">{index + 1}</th>
                    <td className="align-middle">{employee.names.split(" ")[0].toUpperCase()} {/*{employee.names.split(" ")[1] ? employee.names.split(" ")[1].charAt(0).toUpperCase() + '.' : ''}*/}</td>
                    <td className="align-middle">{employee.surnames.split(" ")[0].toUpperCase()} {/*{employee.surnames.split(" ")[1] ? employee.surnames.split(" ")[1].charAt(0).toUpperCase() + '.' : ''}*/}</td>
                    <td className="align-middle">{employee.nationalId}</td>
                    <td className="align-middle">{employee.area}</td>
                    <td className="text-center align-middle">
                      <button className="btn btn-sm btn-primary mx-auto" onClick={() => handleShowEditModal(employee)}>
                        <i className="bi bi-pencil-fill mx-auto"></i>
                      </button>
                    </td>
                    <td className="text-center align-middle">
                      <button className="btn btn-sm btn-danger mx-auto" onClick={() => deleteEmployee(employee._id)}>
                        <i className="bi bi-trash3-fill mx-auto"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Modal de edición */}
            <Modal show={showEditModal} onHide={handleCloseEditModal}>
              <Modal.Header closeButton>
                <Modal.Title>Editar Empleado</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleEditFormSubmit}>
                  <Form.Group controlId="area">
                    <Form.Label>Área:</Form.Label>
                    <Form.Control
                      type="text"
                      name="area"
                      value={editFormData.area || ""} // Mostrar el valor actual o un string vacío si es null o undefined
                      disabled
                    />
                  </Form.Group>

                  <div className='row'>
                    <div className='col'>
                      <Form.Group controlId="names">
                        <Form.Label>Nombres:</Form.Label>
                        <Form.Control
                          type="text"
                          name="names"
                          value={editFormData.names || ""}
                          disabled
                        />
                      </Form.Group>
                    </div>
                    <div className="col">
                      <Form.Group controlId="surnames">
                        <Form.Label>Apellidos:</Form.Label>
                        <Form.Control
                          type="text"
                          name="surnames"
                          value={editFormData.surnames || ""}
                          disabled
                        />
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <Form.Group controlId="idType">
                        <Form.Label>Tipo de ID:</Form.Label>
                        <Form.Control
                          type="text"
                          name="idType"
                          value={editFormData.idType || ""}
                          disabled
                        />
                      </Form.Group>

                    </div>
                    <div className="col">
                      <Form.Group controlId="nationalId">
                        <Form.Label>Cédula:</Form.Label>
                        <Form.Control
                          type="text"
                          name="nationalId"
                          value={editFormData.nationalId || ""}
                          disabled
                        />
                      </Form.Group>

                    </div>
                  </div>
                  <div className='row'>
                    <div className="col">
                      <Form.Group controlId="rif">
                        <Form.Label>RIF:</Form.Label>
                        <Form.Control
                          type="text"
                          name="rif"
                          value={editFormData.rif || ""}
                          disabled
                        />
                      </Form.Group>
                    </div>
                    <div className="col">

                      <Form.Group controlId="birthdate">
                        <Form.Label>Fecha de Nacimiento:</Form.Label>
                        <Form.Control
                          type="text"
                          name="birthdate"
                          value={editFormData.birthdate || ""}
                          disabled
                        />
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <Form.Group controlId="countryOfBirth">
                        <Form.Label>País de Nacimiento:</Form.Label>
                        <Form.Control
                          type="text"
                          name="countryOfBirth"
                          value={editFormData.countryOfBirth || ""}
                          disabled
                        />
                      </Form.Group>
                    </div>
                    <div className="col">
                      <Form.Group controlId="cityOfBirth">
                        <Form.Label>Ciudad de Nacimiento:</Form.Label>
                        <Form.Control
                          type="text"
                          name="cityOfBirth"
                          value={editFormData.cityOfBirth || ""}
                          disabled
                        />
                      </Form.Group>
                    </div>
                  </div>
                  {/* Campos editables */}
                  <div className="row">
                    <div className="col">
                      <Form.Group controlId="email">
                        <Form.Label>Email:</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={editFormData.email || ""}
                          onChange={handleEditFormChange}
                        />
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <Form.Group controlId="maritalStatus">
                        <Form.Label>Estado Civil:</Form.Label>
                        <Form.Select
                          type="text"
                          name="maritalStatus"
                          value={editFormData.maritalStatus || ""}
                          onChange={handleEditFormChange}
                        >
                          <option value="">Seleccionar...</option>
                          {maritalStatus.map((estado, index) => (
                            <option key={index} value={estado}>
                              {estado}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </div>
                    <div className="col">
                      <Form.Group controlId="gender">
                        <Form.Label>Género:</Form.Label>
                        <Form.Select
                          type="text"
                          name="gender"
                          value={editFormData.gender || ""}
                          onChange={handleEditFormChange}
                        >
                          <option value="">Seleccionar...</option>
                          {gender.map((genero) => (
                            <option key={genero.value} value={genero.value}>
                              {genero.label}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <Form.Group controlId="educationLevel">
                        <Form.Label>Nivel de Educación:</Form.Label>
                        <Form.Select
                          type="text"
                          name="educationLevel"
                          value={editFormData.educationLevel || ""}
                          onChange={handleEditFormChange}
                        >
                          <option value="">Seleccionar...</option>
                          {studiesGrade.map((nivel, index) => (
                            <option key={index} value={nivel}>
                              {nivel}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </div>
                    <div className="col">
                      <Form.Group controlId="familyDependents">
                        <Form.Label>Familiares Dependientes:</Form.Label>
                        <Form.Control
                          type="number"
                          name="familyDependents"
                          value={editFormData.familyDependents || ""}
                          onChange={handleEditFormChange}
                        />
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">

                      <Form.Group controlId="phone">
                        <Form.Label>Tel&eacute;fono:</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={editFormData.phone || ""}
                          onChange={handleEditFormChange}
                        />
                      </Form.Group>
                    </div>
                    <div className="col">
                      <Form.Group controlId="address">
                        <Form.Label>Direcci&oacute;n:</Form.Label>
                        <Form.Control
                          type="text"
                          name="address"
                          value={editFormData.address || ""}
                          onChange={handleEditFormChange}
                        />
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <Form.Group controlId="bank">
                        <Form.Label>Banco:</Form.Label>
                        <Form.Select
                          type="text"
                          name="bank"
                          value={editFormData.bank || ""}
                          onChange={handleEditFormChange}
                        >
                          <option value="">Seleccionar...</option>
                          {VenezuelanBanks.map((banco, index) => (
                            <option key={index} value={banco}>
                              {banco}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </div>
                    <div className="col">
                      <Form.Group controlId="account">
                        <Form.Label>Cuenta:</Form.Label>
                        <Form.Control
                          type="number"
                          name="account"
                          value={editFormData.account || ""}
                          onChange={handleEditFormChange}
                          maxLength="20"
                        />
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row my-2">
                    <div className="col d-flex justify-content-center">
                      <Button variant="primary" type="submit" className="align-center mt-3">
                        Confirmar Actualización
                      </Button>
                    </div>
                  </div>
                </Form>
              </Modal.Body>
            </Modal>

            <Pagination>
              <Pagination.Prev
                disabled={page === 1}
                onClick={(e) => { e.preventDefault(); handlePageChange(page - 1); }}
              />
              {Array.from({ length: totalPages }, (_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === page}
                  onClick={(e) => { e.preventDefault(); handlePageChange(i + 1); }}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                disabled={page === totalPages}
                onClick={(e) => { e.preventDefault(); handlePageChange(page + 1); }}
              />
            </Pagination>
          </div>
        </div>
      </div>
    </>
  )
}
