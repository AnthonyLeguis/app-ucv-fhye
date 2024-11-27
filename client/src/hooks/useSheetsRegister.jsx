import { useState } from 'react';
import { useNotification } from '../routes/components/Notifications';

export const useSheetsRegister = () => {
    const { showNotification } = useNotification();

    const [formData, setFormData] = useState({
        seccionA: {
            sheetNumber: '',
            movementType: '',
            area: '',
            introducedDate: '',
            sentDate: '',
            observations_general: '',

        },
        seccionB: {
            facultyOrDependency: '',
            entryDate: '',
            effectiveDate: '',
            contractEndDate: '',
            executingUnit: '',
            dedication: '',
            teachingCategory: '',
            ubication: '',
            idac: '',
            position: '',
            currentPosition: '',
            grade: '',
            opsuTable: '',
            personnelType: '',
            workingDay: '',
            typeContract: '',
            valueSalary: '',
            mounthlySalary: '',
            ReasonForMovement: '',
        },
        seccionC: {
            nationalId: '',
            employee: null, // Datos del empleado seleccionado
        },
    });

    const [employees, setEmployees] = useState([]); // Estado para manejar los empleados encontrados

    const handleChange = (seccion, field, value) => {
        setFormData(prevData => ({
            ...prevData,
            [seccion]: {
                ...prevData[seccion],
                [field]: value,
            }
        }));
    };

    const validateForm = () => {
        if (!formData.seccionA.sheetNumber || !formData.seccionB.facultyOrDependency) {
            return false; // Formulario inválido
        }
        return true; // Formulario válido
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            showNotification('Por favor, complete todos los campos obligatorios', 'warning');
            return;
        }

        try {
            const token = localStorage.getItem('token'); // Obtener el token de autenticación del localStorage
            const response = await fetch(`${import.meta.env.VITE_API_SHEET_URL}/create-sheet`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Incluir el token de autenticación en los encabezados
                },
                body: JSON.stringify({
                    ...formData.seccionA,
                    ...formData.seccionB,
                    ...formData.seccionC
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Respuesta del servidor:', data);
                showNotification('Planilla creada con éxito', 'success');
            } else {
                const errorData = await response.json();
                console.error('Error al crear la planilla:', errorData);
                showNotification('Error al crear la planilla', 'error');
            }
        } catch (error) {
            console.error('Error al crear la planilla:', error);
            showNotification('Error al crear la planilla', 'error');
        }
    };

    const findEmployees = async (query) => {
        try {
            const token = localStorage.getItem('token'); // Obtener el token de autenticación del localStorage
            const response = await fetch(`${import.meta.env.VITE_API_EMPLOYEE_URL}/list-employees?${new URLSearchParams(query)}`, {
                headers: {
                    'Authorization': `${token}` // Incluir el token de autenticación en los encabezados
                }
            });
            if (response.ok) {
                const data = await response.json();
                setEmployees(data.employess); // Actualiza el estado con los empleados encontrados
                console.log(data);
            } else {
                const errorData = await response.json();
                showNotification(errorData.message, 'error');
            }
        } catch (error) {
            console.error('Error al buscar empleados:', error);
            showNotification('Error al buscar empleados', 'error');
        }
    };

    return { formData, handleChange, handleSubmit, findEmployees, employees };
};
