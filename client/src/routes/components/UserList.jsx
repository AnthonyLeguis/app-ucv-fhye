import { useState, useMemo } from "react";
import { useUserListHook } from "../../hooks/useUserListHook";

export const UserList = () => {
  const { users, error, isLoading, currentPage, setCurrentPage } = useUserListHook()
  const [showList, setShowList] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState('');

  const uniqueSchools = useMemo(() => Array.from(new Set(users?.users?.map(user => user.school) || [])), [users]);

  const filteredUsers = useMemo(() => {
    if (!users || !users.users) return [];

    return selectedSchool
      ? users.users.filter(user => user.school === selectedSchool)
      : users.users;
  }, [selectedSchool, users]);

  const handleShowList = () => {
    setShowList(!showList);
  };

  const handleSchoolChange = (event) => {
    setSelectedSchool(event.target.value);
  };

  if (isLoading) {
    return <div>Cargando listado de usuarios...</div>;
  }

  if (error) {
    return <div>Error al cargar listado de usuarios: {console.log(error)}</div>;
  }

  const totalPages = Math.ceil(users?.total / users?.itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  console.log(filteredUsers);

  return (
    <>
      <div className="container-fluid mt-4 mb-5 d-flex flex-column justify-content-center align-items-center">
        <h1>Lista de usuarios</h1>

        <div className="row col col-sm-8 col-lg-6 my-3 d-flex flex-column flex-md-row justify-content-center align-items-center mx-auto my-4">
          <select
            className="col form-select mx-2"
            aria-label="Small select example"
            value={selectedSchool}
            onChange={handleSchoolChange}>
            <option value="">Todas las escuelas</option>
            {uniqueSchools.map((school, index) => (
              <option key={index} value={school}>{school}</option>
            ))}
          </select>
          <button
            className="col btn btn-sm btn-primary mx-2"
            onClick={handleShowList}>
            {showList ? 'Ocultar lista' : 'Mostrar lista'}
          </button>
        </div>

        {showList && (
          <div className="col col-md-10 d-flex flex-column justify-content-center align-content-center">

            <table className="table table-striped table-responsive-sm" >
              <thead>
                <tr className="thead_bg">
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Correo</th>
                  <th>Escuela</th>
                  <th>Idac</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={index}>
                    <td>{user.names.split(' ').slice(0, -1).join(' ')}</td>
                    <td>{user.surnames.split(' ').slice(0, -1).join(' ')}</td>
                    <td>{user.email}</td>
                    <td>{user.school}</td>
                    <td>{user.idac}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {showList && (
              <nav aria-label="col col-sm-12 Page navigation example d-flex justify-content-end align-items-center">
                <ul className="pagination justify-content-end"> {/* Cambiamos 'class' por 'className' y agregamos justify-content-end */}
                  {/* Botón "Anterior" */}
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      aria-label="Previous"
                    >
                      <span aria-hidden="true">&laquo;</span>
                    </button>
                  </li>
                  {/* Números de página */}
                  {Array.from({ length: totalPages }, (_, index) => (
                    <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  {/* Botón "Siguiente" */}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      aria-label="Next"
                    >
                      <span aria-hidden="true">&raquo;</span>
                    </button>
                  </li>
                </ul>
              </nav>
            )}



          </div>
        )}


      </div>
    </>
  )
}