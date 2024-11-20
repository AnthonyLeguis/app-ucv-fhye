import { useState } from 'react'
import { useNotification } from "../routes/components/Notifications";

export const useUpdateUser = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { showNotification } = useNotification();

    const updateUser = async (userId, updatedData) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_USER_URL}/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: localStorage.getItem('token')
                },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar el usuario');
            }

            showNotification('El usuario ha sido actualizado de manera exitosa', 'success');

            // Actualizar la lista de usuarios recargando la página
            window.location.reload();
        } catch (error) {
            showNotification(error.message, 'error');
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        updateUser,
        isLoading,
        error
    }
}
