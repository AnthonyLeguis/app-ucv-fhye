import { useState } from 'react'

export const useForgetPass = () => {
    const [showModal, setShowModal] = useState(false);
    const [ci, setCi] = useState('');
    const [email, setEmail] = useState('');

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {

            console.log('Enviando datos:', { ci, email });
        } catch (error) {
            console.error(error);
        }
    }

    const modal = (
        <div className="modal fade" id="useForgetPass" tabIndex="-1" aria-labelledby="recuperarContrasenaModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    {/* ... (contenido del modal, igual que en el ejemplo anterior) */}
                    <form onSubmit={handleSubmit}>
                        {/* ... (campos del formulario) */}
                    </form>
                </div>
            </div>
        </div>
    )

    return { showModal, handleOpenModal, handleCloseModal, modal };
}
