import { useState, useEffect } from 'react';
import { useNotification } from '../routes/components/Notifications';

export const useSheetsListUpdate = () => {
    const { showNotification } = useNotification();
    const [sheets, setSheets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchSheets = async (status) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            console.log('Token:', token);
            console.log('Query URL:', `${import.meta.env.VITE_API_SHEET_URL}/list-sheets?status=${status}`);
            const response = await fetch(`${import.meta.env.VITE_API_SHEET_URL}/list-sheets?status=${status}`, {
                method: 'GET',
                headers: {
                    'Authorization': `${token}`,
                },
            });

            console.log('Response status:', response.status);
            console.log('Response body:', await response.clone().json());

            if (response.ok) {
                const data = await response.json();
                console.log('Data received:', data);
                setSheets(data.sheets);
            } else {
                const errorData = await response.json();
                showNotification(errorData.message, 'error');
                setError(errorData.message);
                console.error('Error Data:', errorData);
            }
        } catch (error) {
            showNotification('Error al obtener las planillas', 'error');
            setError(error.message);
            console.error('Catch Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateSheet = async (sheetId, updates) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_SHEET_URL}/update-sheet/${sheetId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                },
                body: JSON.stringify(updates),
            });

            console.log('Update Response status:', response.status);
            console.log('Update Response body:', await response.clone().json());

            if (response.ok) {
                const data = await response.json();
                showNotification('Planilla actualizada con éxito', 'success');
                fetchSheets(); // Refrescar el listado de planillas
            } else {
                const errorData = await response.json();
                showNotification(errorData.message, 'error');
                setError(errorData.message);
                console.error('Update Error Data:', errorData);
            }
        } catch (error) {
            showNotification('Error al actualizar la planilla', 'error');
            setError(error.message);
            console.error('Update Catch Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return { sheets, fetchSheets, updateSheet, loading, error };
};
