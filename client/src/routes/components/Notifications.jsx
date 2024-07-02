import { useEffect, useState } from "react";
import Swal from 'sweetalert2';

export const useNotification = () => {
    const [notification, setNotification] = useState(null); // Notificación simple
    const [confirmNotification, setConfirmNotification] = useState(null); // Notificación con confirmación

    // Efecto para notificaciones simples
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                Swal.fire({
                    title: notification.message,
                    icon: notification.type,
                    timer: 3000,
                    showConfirmButton: false,
                }).then(() => {
                    setNotification(null);
                });
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [notification]);

    // Efecto para notificaciones con confirmación
    useEffect(() => {
        if (confirmNotification) {
            Swal.mixin({
                customClass: {
                    confirmButton: "btn btn-success mx-2",
                    cancelButton: "btn btn-danger mx-2"
                },
                buttonsStyling: false
            }).fire({
                title: confirmNotification.message,
                icon: confirmNotification.type,
                showCancelButton: true,
                confirmButtonText: "Confirmar",
                cancelButtonText: "Cancelar",
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    confirmNotification.onConfirm();
                }
                setConfirmNotification(null);
            });
        }
    }, [confirmNotification]);

    // Función para mostrar notificaciones simples
    const showNotification = (message, type = 'info') => {
        return new Promise((resolve) => {
            setNotification({ message, type });
            setTimeout(resolve, 1000);
        });
    };

    // Función para mostrar notificaciones con confirmación
    const showConfirmNotification = (message, type = 'warning', onConfirm) => {
        setConfirmNotification({ message, type, onConfirm });
    };

    return { showNotification, showConfirmNotification };
};


