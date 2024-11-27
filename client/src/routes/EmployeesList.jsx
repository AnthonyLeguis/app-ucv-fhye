import { useState } from 'react'
import { useEmployeeListHook } from '../hooks/useEmployeeListHook'
import { useDeleteEmployee } from '../hooks/useDeleteEmployee'
import { useUpdateEmployee } from '../hooks/useUpdateEmployee'
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
    email: ""
  });

  const handleCloseEditModal = () => setShowEditModal(false);

  const handleShowEditModal = (employee) => {
    setEditingEmployee(employee);
    setEditFormData({
      names: employee.names,
      surnames: employee.surnames,
      email: employee.email
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
    // ... lógica para validar y enviar los datos del formulario de edición ...
    await updateEmployee(editingEmployee._id, editFormData); // Ajustar según tu API
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
                    <td className="align-middle">{employee.names.split(" ")[0].toUpperCase()} {employee.names.split(" ")[1] ? employee.names.split(" ")[1].charAt(0).toUpperCase() + '.' : ''}</td>
                    <td className="align-middle">{employee.surnames.split(" ")[0].toUpperCase()} {employee.surnames.split(" ")[1] ? employee.surnames.split(" ")[1].charAt(0).toUpperCase() + '.' : ''}</td>
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
                      onChange={handleEditFormChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="names">
                    <Form.Label>Nombres:</Form.Label>
                    <Form.Control
                      type="text"
                      name="names"
                      value={editFormData.names || ""}
                      onChange={handleEditFormChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="names">
                    <Form.Label>Apellido:</Form.Label>
                    <Form.Control
                      type="text"
                      name="names"
                      value={editFormData.surnames || ""}
                      onChange={handleEditFormChange}
                    />
                  </Form.Group>
                  {/* ... (resto de los campos del formulario) ... */}
                  <Form.Group controlId="payrollAccount">
                    <Form.Label>Cuenta nómina:</Form.Label>
                    <Form.Control
                      type="text"
                      name="payrollAccount"
                      value={editFormData.payrollAccount || ""}
                      onChange={handleEditFormChange}
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit" className="align-center mt-3">
                    Confirmar Actualización
                  </Button>
                </Form>
              </Modal.Body>
            </Modal>

            {/* Paginación */}
            {/* ... (código de la paginación) ... */}
          </div>
        </div>
      </div>
    </>
  )
}
