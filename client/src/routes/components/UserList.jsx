import React, { useEffect } from "react";
import { useUserListHook } from "../../hooks/useUserListHook";
import { useDeleteUser } from "../../hooks/useDeleteUser";
import { Spinner } from "./Spinner";
import { Pagination } from "react-bootstrap";
import '../../CSS/userlist.css';

export const UserList = () => {
  const { users, loading, error, page, totalPages, handlePageChange } = useUserListHook();
  const { deleteUser } = useDeleteUser();

  useEffect(() => { console.log(`Fetching users for page: ${page}`); }, [page]);

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
                      <button className="btn btn-sm btn-primary mx-auto">
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