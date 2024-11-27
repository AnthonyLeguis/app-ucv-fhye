import { useState, useEffect } from 'react'
import { useNotification } from '../routes/components/Notifications';
import { Spinner } from '../routes/components/Spinner';
import { Pagination, Button, Modal, Form } from 'react-bootstrap';
import '../CSS/employeeList.css'

export const useEmployeeListHook = () => {
    const { showNotification } = useNotification();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');

                const response = await fetch(`${import.meta.env.VITE_API_EMPLOYEE_URL}/list-employees?page=${page}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error al obtener la lista de empleados');
                }

                const data = await response.json();
                //console.log(data);
                setEmployees(data.employess);
                setTotalPages(data.pages);

            } catch (error) {
                setError(error.message);
                showNotification(error.message, 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();

    }, [page]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const updateEmployees = () => {
        fetchEmployees();
    }

    return {
        employees,
        loading,
        error,
        page,
        totalPages,
        handlePageChange,
        updateEmployees
    }
}
