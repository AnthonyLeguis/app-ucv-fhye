import { useState, useContext } from 'react';
import { AuthContext } from '../../hooks/AuthContext';
import { useNotification } from './Notifications';
export const ChangeImagen = ({ buttonClassName = 'btn btn-primary m-auto bi bi-pencil-square' }) => {

    const { user, setUserData } = useContext(AuthContext);
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { showNotification } = useNotification();

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        if (!file) {
            showNotification('Por favor, selecciona una imagen', 'error');
            setIsLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_USER_URL}/upload-image`, {
                method: 'POST',
                headers: {
                    Authorization: `${sessionStorage.getItem('token')}`, // Incluye el token de autenticación
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setUserData(data.user);
                showNotification('Imagen cambiada correctamente', 'success');
            } else {
                const errorData = await response.json();
                showNotification(errorData.message || 'Error al subir la imagen', 'error');
            }

        } catch (error) {
            console.error('Error al subir la imagen:', error);
            showNotification('Error en la comunicación con el servidor', 'error');
        } finally {
            setIsLoading(false);
        }

    };

    return (
        <form onSubmit={handleSubmit}>
        <input
          type="file"
          id="fileInput"
          onChange={handleFileChange}
          style={{ display: "none" }} // Ocultar el input de tipo file
        />
        <button
          type="button"
          className={buttonClassName}
          disabled={isLoading}
          onClick={() => document.getElementById("fileInput").click()} // Simular clic en el input
        >
          {isLoading ? "Subiendo..." : ""}
        </button>
      </form>
    );
}
