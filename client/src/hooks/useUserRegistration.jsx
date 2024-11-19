import { useState } from 'react'
import { useNotification } from "../routes/components/Notifications";


export const useUserRegistration = () => {
    const { showNotification } = useNotification();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);


    const [formData, setFormData] = useState({
        names: '',
        surnames: '',
        email: '',
        nationalId: '',
        phone: '',
        area: '',
        role: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        let transformedValue = value

        if (name === 'names' || name === 'surnames') {
            transformedValue = value.toUpperCase();
        } else if (name === 'email') {
            transformedValue = value.toLowerCase();
        }

        setFormData({ ...formData, [name]: transformedValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Validaciones con expresiones regulares
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const numericRegex = /^\d+$/;

        if (!emailRegex.test(formData.email)) {
            setError('El correo electrónico no es válido');
            setIsLoading(false);
            return;
        }

        if (!numericRegex.test(formData.nationalId)) {
            setError('La cédula de identidad debe ser numérica');
            setIsLoading(false);
            return;
        }

        // Si todas las validaciones pasan, procede con el registro
        setIsLoading(true);
        setError(null);


        try {
            const response = await fetch(`${import.meta.env.VITE_API_USER_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al registrar usuario');
            }

            // Procesar la respuesta exitosa
            const data = await response.json();
            // Obtener la primera palabra del nombre
            const firstName = data.names.split(" ")[0];
            // Obtener la primera palabra del apellido
            const firstSurname = data.surnames.split(" ")[0];
            const area = data.area;

            // Mostrar la notificación con la primera palabra del nombre y apellido
            showNotification(`Se ha registrado el usuario: ${firstName} ${firstSurname} en el area: ${area}`, "success");
            setSuccess(true);

        } catch (error) {
            // Mostrar notificación de error
            showNotification(error.message, "error");
            setError(error.message);
        } finally {
            setIsLoading(false);

            setFormData({
                names: '',
                surnames: '',
                email: '',
                nationalId: '', // ci
                phone: '',
                area: '', // school
                role: '',
            });
        }
    };

    return {
        formData,
        isLoading,
        error,
        success,
        handleChange,
        handleSubmit,
        setSuccess,
        setFormData
    };
};
