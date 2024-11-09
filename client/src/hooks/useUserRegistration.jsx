import { useState } from 'react'

export const useUserRegistration = () => {

    const [formData, setFormData] = useState({
        names: '',
        surnames: '',
        email: '',
        password: '',
        ci: '',
        idac: '',
        address: '',
        phone: '',
        school: '',
        department: '',
        professorship: '',
        current_dedication: '',
        executing_unit: '',
        hire_date: '',
        gender: '',
        ci_tipo: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Validaciones con expresiones regulares
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
        const numericRegex = /^\d+$/;

        if (!emailRegex.test(formData.email)) {
            setError('El correo electrónico no es válido');
            return;
        }

        if (!passwordRegex.test(formData.password)) {
            setError('La contraseña debe tener entre 8 y 16 caracteres y contener letras y números');
            return;
        }

        if (!numericRegex.test(formData.ci)) {
            setError('La cédula de identidad debe ser numérica');
            return;
        }

        if (!numericRegex.test(formData.idac)) {
            setError('El IDAC debe ser numérico');
            return;
        }

        if (!numericRegex.test(formData.executing_unit)) {
            setError('La unidad ejecutora debe ser numérica');
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

            setSuccess(true);

        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);

            setFormData({
                names: '',
                surnames: '',
                email: '',
                password: '',
                ci: '',
                idac: '',
                school: '',
                department: '',
                professorship: '',
                current_dedication: '',
                executing_unit: '',
                hire_date: '',
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
