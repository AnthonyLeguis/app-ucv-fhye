import { useState } from 'react';
import { useNotification } from '../routes/components/Notifications';

export const useSheetsRegister = () => {
    const { showNotification } = useNotification();

    const [formData, setFormData] = useState({
        seccionGeneralInformation: {
            sheetNumber: 0, // O "" si prefieres que inicie vacío
            movementType: '',
            ubication: '',
        },
        seccionA: {
            introducedDate: '',
            sentDate: '',
            observations_general: '',
            employeeId: '',
            employeeNames: '', // Si necesitas estos campos para mostrar datos del empleado
            employeeSurnames: '',
            employeeEmail: '',
            employeeNationalId: '',
        },
        seccionB: {
            TypeOfPayroll: '',
            facultyOrDependency: '',
            entryDate: '',
            effectiveDate: '',
            contractEndDate: '',
            executingUnit: '',
            dedication: '',
            teachingCategory: '',
            position: '',
            currentPosition: '',
            grade: '',
            opsuTable: '',
            personnelType: '',
            workingDay: '',
            typeContract: '',
            valueSalary: 0,
            mounthlySalary: 0,
            ReasonForMovement: ''
        },
        seccionC: {
            employee: {},
            nationalId: '',
            recognitionDate: '',
            // ... otros campos de la sección C ...
        },
        seccionD: {
            salaryCompensationDiff: 0,
            representationExpenses: 0,
            typePrimaA: '',
            amountPrimaA: 0,
            typePrimaB: '',
            amountPrimaB: 0,
            primaRangoV: 0,
            otherCompensation: 0,
        },
        seccionE: {
            budgetCode: '',
            accountingCode: 0,
            executingUnit_E: 0,
            personnelType_E: '',
        },
        seccionObservations: {
            observations: '',
        },
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (seccion, field, value) => {
        setFormData(prevData => ({
            ...prevData,
            [seccion]: {
                ...prevData[seccion],
                [field]: value,
            },
        }));
    };

    const validateForm = () => {
        return formData.seccionGeneralInformation.sheetNumber
            && formData.seccionGeneralInformation.movementType
            && formData.seccionC.employee._id;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            showNotification('Por favor, complete todos los campos obligatorios y seleccione un empleado', 'warning');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_SHEET_URL}/create-sheet`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': ` ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Data recibida:', data);
                
                showNotification('Planilla creada con éxito', 'success');
                // Actualiza el estado con el employeeId y los demás datos del empleado
                setFormData(prevData => ({
                    ...prevData,
                    seccionC: {
                        ...prevData.seccionC,
                        employee: data.employee
                    },
                    seccionA: {
                        ...prevData.seccionA,
                        employeeId: data.employee._id,
                        employeeNames: data.employee.names,
                        employeeSurnames: data.employee.surnames,
                        employeeNationalId: data.employee.nationalId,
                    }
                }));
            } else {
                const errorData = await response.json();
                showNotification(errorData.message, 'error');
            }
        } catch (error) {
            showNotification('Error al crear la planilla', 'error');
        } finally {
            setLoading(false);
        }
    };

    const findEmployee = async (nationalId) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_EMPLOYEE_URL}/find-employee?nationalId=${nationalId}`, {
                headers: {
                    'Authorization': ` ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Empleado encontrado:", data);
                handleChange('seccionC', 'employee', data.employee);
                handleChange('seccionA', 'employeeNames', data.employee.names);
                handleChange('seccionA', 'employeeSurnames', data.employee.surnames);
                handleChange('seccionA', 'employeeNationalId', data.employee.nationalId);
            } else {
                const errorData = await response.json();
                showNotification(errorData.message, 'error');
            }
        } catch (error) {
            showNotification('Error al buscar el empleado', 'error');
        } finally {
            setLoading(false);
        }
    };

    return { formData, handleChange, handleSubmit, findEmployee, loading };
};
