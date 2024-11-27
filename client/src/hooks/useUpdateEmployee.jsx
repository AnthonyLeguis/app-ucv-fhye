import { useState } from 'react'
import { useNotification } from '../routes/components/Notifications';
import { useEmployeeListHook } from './useEmployeeListHook';

export const useUpdateEmployee = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { showNotification } = useNotification();
    const { updateEmployees } = useEmployeeListHook(); // Obtener la función updateEmployees
  
    const updateEmployee = async (employeeId, updatedData) => {
      setIsLoading(true);
      setError(null);
  
      try {
        const response = await fetch(`${import.meta.env.VITE_API_EMPLOYEE_URL}/update-employee/${employeeId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            authorization: localStorage.getItem('token')
          },
          body: JSON.stringify(updatedData)
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al actualizar el empleado');
        }
  
        showNotification('El empleado ha sido actualizado de manera exitosa', 'success');
  
        updateEmployees(); // Actualizar la lista de empleados después de editar
      } catch (error) {
        showNotification(error.message, 'error');
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    return {
      updateEmployee,
      isLoading,
      error
    }
  }
