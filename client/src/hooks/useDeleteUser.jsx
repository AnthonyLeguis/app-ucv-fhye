import { useState } from 'react'
import { useNotification } from "../routes/components/Notifications";
import { useUserListHook } from './useUserListHook';

export const useDeleteUser = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { showConfirmNotification, showNotification } = useNotification();
    const { updateUsers } = useUserListHook();

    const deleteUser = async (userId) => {
        try {
            showConfirmNotification(
                "¿Estás seguro de que quieres eliminar este usuario?",
                "warning",
                async () => {
                    try {
                        const response = await fetch(`${import.meta.env.VITE_API_USER_URL}/delete/${userId}`, {
                            method: 'DELETE',
                            headers: {
                                authorization: `${localStorage.getItem('token')}`,
                            },
                        });

                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.message || 'Error al eliminar el usuario');
                        }

                        showNotification("Usuario eliminado correctamente", "success");

                        window.location.reload();

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
        deleteUser,
        isLoading,
        error
    };
};


