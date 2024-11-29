import { useState, useEffect } from 'react';
import { useNotification } from '../routes/components/Notifications';
import { Country, City } from 'country-state-city';
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

        setIsLoading(true);

        if (!validateForm()) {
            showNotification('Por favor, complete todos los campos obligatorios', 'warning');
            return;
        }

        setIsLoading(false);
        try {
            const countryName = Country.getCountryByCode(formData.countryOfBirth)?.name;
            const formDataToSend = {
                ...formData,
                countryOfBirth: countryName, // Reemplazar el código con el nombre
            };
            console.log("Enviando datos al servidor:", formDataToSend);

            const response = await fetch(`${import.meta.env.VITE_API_EMPLOYEE_URL}/register-employee`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}` // Asegúrate de que el token sea válido
                },
                body: JSON.stringify(formDataToSend),
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
        } finally {
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

        setCities(City.getCitiesOfCountry(countryCode));

        setFormData({
            ...formData,
            countryOfBirth: countryCode // Actualizar el estado formData con el código del país
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]:
                name === 'names' || name === 'surnames' || name === 'address'
                    ? value.toUpperCase()
                    : name === 'email'
                        ? value.toLowerCase()
                        : name === "nationalId"
                            ? value.replace(/[^0-9]/g, '').slice(0, 8)
                            : name === "payrollAccount"
                                ? value.replace(/[^0-9]/g, '').slice(0, 20)
                                : name === 'familyDependents'
                                    ? parseInt(value.replace(/[^0-9]/g, ''), 10)
                                    : value,
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