import { useState, useEffect } from 'react';

export const useAlerts = () => {
    const [pendingSheets, setPendingSheets] = useState(0);
    const [rejectedSheets, setRejectedSheets] = useState(0);
    const [approvedSheets, setApprovedSheets] = useState(0);

    const fetchAlerts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_SHEET_URL}/alerts`, {
                headers: {
                    'Authorization': ` ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setPendingSheets(data.pendingSheets);
                setRejectedSheets(data.rejectedSheets);
                setApprovedSheets(data.approvedSheets);
            } else {
                console.error("Error fetching alerts");
            }
        } catch (error) {
            console.error('Error fetching alerts:', error);
        }
    };

    useEffect(() => {
        fetchAlerts();
    }, []);

    return { pendingSheets, rejectedSheets, approvedSheets, fetchAlerts };
};
