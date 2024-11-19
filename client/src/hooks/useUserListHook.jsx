import { useState, useEffect } from 'react';
import { useNotification } from "../routes/components/Notifications";

export const useUserListHook = () => {
  const { showNotification } = useNotification();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        const response = await fetch(`${import.meta.env.VITE_API_USER_URL}/list?page=${page}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al obtener la lista de usuarios');
        }

        const data = await response.json();
        console.log(data);
        
        setUsers(data.users);
        setTotalPages(data.pages);

      } catch (error) {
        setError(error.message);
        showNotification(error.message, 'error');

      } finally {
        setLoading(false);

      }
    };

    fetchUsers();
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const updateUsers = () => {
    // Lógica para actualizar la lista de usuarios
    fetchUsers();
  }

  return {
    users,
    loading,
    error,
    page,
    totalPages,
    handlePageChange
  };

};

