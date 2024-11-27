import { useState, useEffect } from 'react';
import { useNotification } from '../routes/components/Notifications';
import { Country, State } from 'country-state-city';
import * as ExcelJS from 'exceljs';

export const useEmployeeRegister = () => {
    const { showNotification } = useNotification();
    const [areaOptions, setAreaOptions] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [countries, setCountries] = useState([]); // Estado para los países
    const [cities, setCities] = useState([]); // Estado para las ciudades
    const [selectedCountry, setSelectedCountry] = useState('');
    const [formData, setFormData] = useState({
        area: '',
        names: '',
        surnames: '',
        idType: 'V', // Valor por defecto
        nationalId: '',
        rif: '',
        birthdate: '',
        countryOfBirth: '',
        cityOfBirth: '',
        maritalStatus: '',
        gender: '',
        familyDependents: 0, // Valor por defecto
        educationLevel: '',
        email: '',
        phoneNumber: '',
        address: '',
        bank: '',
        payrollAccount: '',
    })

    const token = localStorage.getItem('token');
    if (!token) {
        console.error('Token de autenticación no encontrado en el localStorage');
        return null;
    }

    const handleSubmit = async (e) => {  // Define handleSubmit aquí
        e.preventDefault();

        if (!validateForm()) {
            showNotification('Por favor, complete todos los campos obligatorios', 'warning');
            return;
        }

        setIsLoading(true);
        try {
            console.log("Enviando datos al servidor:", formData);

            const response = await fetch(`${import.meta.env.VITE_API_EMPLOYEE_URL}/register-employee`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}` // Asegúrate de que el token sea válido
                },
                body: JSON.stringify(formData),
            });

            setIsLoading(true);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error al registrar el empleado:', errorData);
                showNotification('Error al registrar el empleado', 'error');
            } else {
                const data = await response.json();
                console.log('Respuesta del servidor:', data);
                showNotification('Empleado registrado exitosamente', 'success');
                setFormData({
                    area: '',
                    names: '',
                    surnames: '',
                    idType: 'V',
                    nationalId: '',
                    rif: '',
                    birthdate: '',
                    countryOfBirth: '',
                    cityOfBirth: '',
                    maritalStatus: '',
                    gender: '',
                    familyDependents: 0,
                    educationLevel: '',
                    email: '',
                    phoneNumber: '',
                    address: '',
                    bank: '',
                    payrollAccount: '',
                });
            };

        } catch (error) {
            console.error('Error al registrar el empleado:', error);
            showNotification('Error al registrar el empleado', 'error');
            setIsLoading(false);
        }
    };

    const validateForm = () => {
        if (
            !formData.area ||
            !formData.names ||
            !formData.surnames ||
            !formData.nationalId ||
            !formData.email ||
            !formData.phoneNumber ||
            !formData.address) {
            showNotification('Por favor, complete todos los campos obligatorios', 'warning');
            return false; // Formulario inválido
        }
        if (formData.payrollAccount.length < 20) {
            showNotification('Faltan dígitos en el número de cuenta', 'warning');
            return false;
        } else if (formData.payrollAccount.length > 20 || !/^\d+$/.test(formData.payrollAccount)) {
            showNotification('La cuenta nómina debe tener exactamente 20 dígitos numéricos', 'warning');
            return false;
        }
        return true;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/formOptions.xlsx');
                const arrayBuffer = await response.arrayBuffer();
                const workbook = new ExcelJS.Workbook();
                await workbook.xlsx.load(arrayBuffer);
                const worksheet = workbook.getWorksheet("area");
                const jsonData = [];
                worksheet.eachRow((row, rowNumber) => {
                    if (rowNumber !== 1) {
                        const rowData = {};
                        row.eachCell((cell, colNumber) => {
                            rowData[worksheet.getCell(1, colNumber).value] = cell.value;
                        });
                        jsonData.push(rowData);
                    }
                });
                setAreaOptions(jsonData);
                setFilteredOptions(jsonData);
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    area: jsonData[0]?.Area || '',
                }));
            } catch (error) {
                console.error("Error al obtener los datos", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (areaOptions.length > 0 && areaOptions.every(item => item.Area)) {
            const filtered = areaOptions.filter((item) =>
                item.Area.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredOptions(filtered);
        }
    }, [searchText, areaOptions]);

    useEffect(() => {
        setCountries(Country.getAllCountries());
    }, []);

    const handleCountryChange = (event) => {
        const countryCode = event.target.value;
        setSelectedCountry(countryCode);

        setCities(State.getStatesOfCountry(countryCode));

        setFormData({
            ...formData,
            countryOfBirth: countryCode // Actualizar el estado formData con el código del país
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === 'names' || name === 'surnames' || name === 'address') {
            newValue = value.toUpperCase();
        } else if (name === 'email') {
            newValue = value.toLowerCase();
        } else if (name === "nationalId") {
            newValue = value.replace(/[^0-9]/g, '');
            if (newValue.length > 8) {
                newValue = newValue.slice(0, 8); // Truncar a 8 dígitos

            }
        } else if (name === "payrollAccount") {
            newValue = value.replace(/[^0-9]/g, '');
            if (newValue.length > 20) {
                newValue = newValue.slice(0, 20); // Trunca a 20 dígitos

            }
        }

        setFormData({
            ...formData,
            [name]: newValue,  // <-- Usar newValue en lugar de e.target.value
        });
    };

    return {
        areaOptions,
        setSearchText,
        searchText,
        filteredOptions,
        isLoading,
        formData,
        handleChange,
        handleSubmit,
        handleCountryChange,
        countries,
        cities,
        selectedCountry
    }
};