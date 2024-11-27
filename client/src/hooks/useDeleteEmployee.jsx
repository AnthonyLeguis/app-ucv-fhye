import { useState } from 'react'
import { useNotification } from '../routes/components/Notifications';
import { useEmployeeListHook } from './useEmployeeListHook';

export const useDeleteEmployee = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { showConfirmNotification, showNotification } = useNotification();
    const { updateEmployees } = useEmployeeListHook(); // Obtener la función updateEmployees
  
    const deleteEmployee = async (employeeId) => {
      try {
        showConfirmNotification(
          "¿Estás seguro de que quieres eliminar este empleado?",
          "warning",
          async () => {
            try {
              const response = await fetch(`${import.meta.env.VITE_API_EMPLOYEE_URL}/delete-employee/${employeeId}`, {
                method: 'DELETE',
                headers: {
                  authorization: `${localStorage.getItem('token')}`,
                },
              });
  
              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al eliminar el empleado');
              }
  
              showNotification("Empleado eliminado correctamente", "success");
  
              updateEmployees(); // Actualizar la lista de empleados después de eliminar
            } catch (error) {
              showNotification(error.message, "error");
              setError(error.message);
            }
          },
          {
            buttons: {
              cancel: {
                text: "Cancelar",
                className: "btn btn-secondary"
              },
              confirm: {
                text: "Eliminar",
                className: "btn btn-danger"
              }
            }
          }
        );
      } catch (error) {
        setError(error.message);
        showNotification(error.message, "error");
      } finally {
        setIsLoading(false);
      }
    };
  
    return {
      deleteEmployee,
      isLoading,
      error
    };
  };
