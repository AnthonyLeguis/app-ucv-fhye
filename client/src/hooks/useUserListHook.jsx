import { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { jwtDecode } from 'jwt-decode';

export const useUserListHook = () => {
  const { token, isLoading } = useContext(AuthContext);
  const [users, setUsers] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = sessionStorage.getItem('token');

      if (!token) {
        return;
      }

      if (isLoading) {
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        const response = await fetch(`${import.meta.env.VITE_API_USER_URL}/list/${currentPage}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al obtener usuarios');
        }

        const data = await response.json();
        setUsers(data);
        console.log(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUsers();
  }, [token, isLoading, currentPage]); // <-- Agrega currentPage como dependencia

  return { users, error, isLoading, currentPage, setCurrentPage };
};

