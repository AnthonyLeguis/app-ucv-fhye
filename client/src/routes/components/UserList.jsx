import React, { useEffect, useState } from "react";
import { useUserListHook } from "../../hooks/useUserListHook";
import { useDeleteUser } from "../../hooks/useDeleteUser";
import { useUpdateUser } from "../../hooks/useUpdateUser";
import { Spinner } from "./Spinner";
import { Pagination, Button, Modal, Form } from "react-bootstrap";
import '../../CSS/userlist.css';

export const UserList = () => {
  const { users, loading, error, page, totalPages, handlePageChange } = useUserListHook();
  const { deleteUser } = useDeleteUser();
  const { updateUser } = useUpdateUser();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    password: "",
    phone: "",
    email: "",
    confirmPassword: ""
  });

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditFormData({
      password: "",
      phone: "",
      email: "",
      confirmPassword: ""
    });
  }

  const handleShowEditModal = (user) => {
    setEditingUser(user);
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

    // Validar que las contraseñas coincidan (opcional)
    if (editFormData.password && editFormData.password !== editFormData.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    await updateUser(editingUser.id, editFormData);

    handleCloseEditModal();
    updateUser();
  }

  //useEffect(() => { console.log(`Fetching users for page: ${page}`); }, [page]);

  if (loading) {
    return (<div> <Spinner /> </div>);
  }

  if (error) {
    return <p>Error al obtener la lista de usuarios: {error}</p>;
  }

  return (
    <>
      <div
        className="container-fluid contain overflow-auto h-100">
        <div className="row d-flex align-items-center justify-content-between">
          <div className="col-12 col-md-8 mx-auto d-flex flex-row mt-5 mb-5">
            <h1 className="TitleName text-center mx-auto ">Lista de usuarios</h1>
          </div>
        </div>

        <div>

        </div>

        <div className="row d-flex align-items-top justify-content-top">
          <div className="table-responsive col-12 col-md-10 col-lg-8 mx-auto p-2 shadow rounded-4">
            <table className="table table-striped table-hover table-responsive-sm">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Apellido</th>
                  <th scope="col">Área</th>
                  <th scope="col">Estatus</th>
                  <th scope="col">Modificar</th>
                  <th scope="col">Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id}>
                    <th scope="row" className="align-middle">{index + 1}</th>
                    <td className="align-middle">{user.names.split(" ")[0].toUpperCase()}</td>
                    <td className="align-middle">{user.surnames.split(" ")[0].toUpperCase()}</td>
                    <td className="align-middle">{user.area}</td>
                    <td className="text-center align-middle">
                      <span className={user.status ? 'user_status_true' : 'user_status_false'}>
                        {/* Mostrar el estado en español */}
                        {user.status ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="text-center align-middle">
                      <button className="btn btn-sm btn-primary mx-auto" onClick={() => handleShowEditModal(user)}>
                        <i className="bi bi-pencil-fill mx-auto"></i>
                      </button>
                    </td>
                    <td className="text-center align-middle">
                      <button className="btn btn-sm btn-danger mx-auto" onClick={() => deleteUser(user._id)}>
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
                <Modal.Title>Editar el Usuario: {editingUser ? `${editingUser.names.split(" ")[0]} ${editingUser.surnames.split(" ")[0]}` : ""} </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleEditFormSubmit}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label className="fw-bold">Correo electrónico</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Ingresa el correo electrónico"
                      name="email"
                      value=""
                      onChange={handleEditFormChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicPhone">
                    <Form.Label className="fw-bold mt-3">Teléfono</Form.Label>
                    <Form.Control
                      type="tel"
                      placeholder="Ingresa el teléfono"
                      name="phone"
                      value=""
                      onChange={handleEditFormChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword">
                    <Form.Label className="fw-bold mt-3">Nueva contraseña</Form.Label>
                    <div className="input-group"> {/* <-- Contenedor para el input y el botón */}
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Ingresa la nueva contraseña"
                        name="password"
                        value={editFormData.password}
                        onChange={handleEditFormChange}
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`bi ${showPassword ? "bi-eye-fill" : "bi-eye-slash-fill"} text-primary`}></i>
                      </button>
                    </div>
                  </Form.Group>

                  <Form.Group controlId="formBasicConfirmPassword">
                    <Form.Label className="fw-bold mt-3">Confirmar nueva contraseña</Form.Label>
                    <div className="input-group"> {/* <-- Contenedor para el input y el botón */}
                      <Form.Control
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirma la nueva contraseña"
                        name="confirmPassword"
                        value={editFormData.confirmPassword}
                        onChange={handleEditFormChange}
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <i className={`bi ${showConfirmPassword ? "bi-eye-fill" : "bi-eye-slash-fill"} text-primary`}></i>
                      </button>
                    </div>
                  </Form.Group>

                  <Button variant="primary" type="submit" className="align-center mt-3">
                    Confirmar Actualización
                  </Button>
                </Form>
              </Modal.Body>
            </Modal>

            {/* Paginación */}
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
  );
}