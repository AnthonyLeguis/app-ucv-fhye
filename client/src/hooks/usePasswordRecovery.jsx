import { useState } from 'react';
import { useNotification } from '../routes/components/Notifications';

export const usePasswordRecovery = () => {
    const [email, setEmail] = useState('');
    const { showNotification } = useNotification();

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordRecovery = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_USER_URL}/recover-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            //console.log(response);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al solicitar recuperación de contraseña');
            }

            // Obtener la respuesta del servidor
            const data = await response.json();

            // Mostrar notificación de éxito usando el mensaje del servidor
            showNotification(data.message, 'success');
            console.log(data.message);
            

            // Opcional: Limpiar el campo de email
            setEmail('');


        } catch (error) {
            showNotification(error.message, 'error');
        }
    };


    return { email, handleEmailChange, handlePasswordRecovery };
}
