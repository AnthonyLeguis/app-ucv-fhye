import { useState, useContext } from 'react';
import { AuthContext } from '../../hooks/AuthContext';
import { useNotification } from './Notifications';
import '../../CSS/imageForm.css'
export const ChangeImagen = ({ buttonClassName = 'btn btn-primary m-auto bi bi-pencil-square', setReload }) => {

    const { userData, setUserData } = useContext(AuthContext);
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { showNotification } = useNotification();

    const [previewImage, setPreviewImage] = useState(null); // Estado para la previsualización
    const [showPopup, setShowPopup] = useState(false); // Estado para mostrar la ventana emergente

    const handleFileChange = (event) => {
        const selectedFile = (event.target.files[0]);

        // Validar el formato y el tamaño de la imagen ANTES de previsualizarla
        const allowedExtensions = ['jpg', 'png', 'jpeg', 'webp'];
        const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
        const maxSize = 2 * 1024 * 1024; // 2MB

        if (!allowedExtensions.includes(fileExtension)) {
            showNotification('Extensión de archivo no permitida.', 'error');
            return;
        }

        if (selectedFile.size > maxSize) {
            showNotification(`El tamaño de la imagen excede el límite de ${maxSize / 1024 / 1024}MB.`, 'error');
            return;
        }

        setFile(selectedFile);

        // Crear la URL de previsualización
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result);
            setShowPopup(true); // Mostrar el popup después de cargar la imagen
        }
        reader.readAsDataURL(selectedFile);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setPreviewImage(null);
        setFile(null); // Limpiar el archivo seleccionado al cerrar el popup
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Form submitted');
        setIsLoading(true);

        if (!file) {
            showNotification('Por favor, selecciona una imagen', 'error');
            setIsLoading(false);
            return;
        }

        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        const formData = new FormData();
        formData.append('image', file);
        console.log('Form data:', formData);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_USER_URL}/upload-image`, {
                method: 'POST',
                headers: {
                    Authorization: `${token}`,
                },
                body: formData,
            });

            console.log('Response:', response);

            if (response.ok) {
                const data = await response.json();
                console.log('Response data:', data);

                setUserData(prevUserData => ({
                    ...prevUserData,
                    users: {
                        ...data.user
                    }
                }));

                showNotification('Imagen cambiada correctamente', 'success');

                setReload(prevReload => !prevReload);
                
                setShowPopup(false);
                setIsLoading(false);
            } else {
                const errorData = await response.json();
                console.log('Error data:', errorData);
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
        <div>
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
                    onClick={() => {
                        console.log('Clic en el botón');
                        document.getElementById("fileInput").click()
                    }}
                >
                    {isLoading ? "Subiendo..." : ""}
                </button>
                {/* <button type='submit' >Submit</button> */}
            </form>

            {/* Popup */}
            {showPopup && (
                <div className="popup">
                    <div className="popup-content d-flex flex-column justify-between">
                        <span className="close text-end text-lg fw-bold" onClick={handleClosePopup}>&times;</span>

                        <div className="popup-header flex-row justify-content-around">
                            <h2>Previsualización</h2>
                        </div>
                        <div className="popup-body d-flex justify-content-center m-2">
                            {previewImage && <img src={previewImage} alt="Previsualización" />}
                        </div>
                        <div className='d-flex align-items-end mt-1'>
                            <button onClick={handleSubmit} disabled={isLoading} className="btn btn-primary m-auto">
                                {isLoading ? "Subiendo..." : "Subir"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
}
