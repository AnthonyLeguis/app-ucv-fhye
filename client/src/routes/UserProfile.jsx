import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../hooks/AuthContext';
import { Spinner } from './components/Spinner';
import { ChangeImagen } from './components/ChangeImagen';
import { useUserRole } from '../hooks/useUserRole';
import { useNotification } from './components/Notifications';
import '../CSS/userprofile.css';

export const UserProfile = () => {
    const { userData, setUserData, isAuthenticated, logout } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { showNotification } = useNotification();
    const mapUserRole = useUserRole();

    const fetchData = async () => {
        if (!isAuthenticated) {
            return;
        }

        console.log('llamada a la API');
        setIsLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
            console.log("Token no encontrado");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_USER_URL}/profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log("Error al obtener los datos del usuario", errorData);
                if (errorData.message === 'Token inválido' || response.status === 401) {
                    logout();
                    return;
                }
                throw new Error("Error al obtener los datos del usuario");
            }

            const data = await response.json();
            console.log("Data del usuario obtenida", data);
            setUserData(data);

            setIsLoading(false);
        } catch (error) {
            console.error("Error al obtener los datos del usuario:", error);
            setError(error.message);
            showNotification("NO se logra obtener la data", "error");
        } finally {
            //console.log("En el bloque finally:", isLoading);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated && !userData) {
            fetchData();
        }
    }, [isAuthenticated, userData]);

    const handleImageChange = () => {
        fetchData();
    }

    return (
        <div className="container-fluid contain overflow-auto">
            <div className="row h-100 sm-flex-column">
                <div className="col mt-4 mb-2 rounded-1 col-md-8 mx-auto d-flex flex-row justify-content-center justify-content-md-right">
                    <h1 className="SchoolName text-center text-center m-0">Área: {userData?.users?.area.split(' - ')[1]}</h1>
                </div>
                {error ? (
                    <div className="alert alert-danger col-6 mx-auto">{error}</div>
                ) : isLoading || !userData || !userData.users ? (
                    <Spinner />
                ) : (
                    <div className="col container-fluid mt-5 col-12 col-md-10 d-flex flex-column justify-content-center align-items-center">
                        <div className="container-fluid d-flex flex-column flex-md-row mx-auto">
                            <div className='container profile_image col-4 mb-4 m-2 mx-auto my-md-auto'>
                                <img className='profile_image text-center my-auto' src={userData.users.image} alt="Imagen de perfil" />
                                <ChangeImagen onImageChange={handleImageChange} />
                            </div>
                            <div className='container-fluid col-8'>
                                <table className='container-fluid table table-responsive table-striped table-hover mx-auto'>
                                    <thead>
                                        <tr>
                                            <th colSpan="2" scope="col" className='text-start fw-bold thead_bg'>Información Personal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th scope="row">Nombre:</th>
                                            <td>{userData.users.names.split(' ')[0]} {userData.users.names.split(' ')[1]?.charAt(0)}.</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Apellido:</th>
                                            <td>{userData.users.surnames.split(' ')[0]} {userData.users.surnames.split(' ')[1]?.charAt(0)}.</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Cédula:</th>
                                            <td>{userData.users.nationalId}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Correo:</th>
                                            <td>{userData.users.email}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Teléfono:</th>
                                            <td>{userData.users.phone}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="container-fluid d-flex flex-column flex-lg-row">
                            <table className='container-fluid table table-responsive table-striped table-hover'>
                                <thead>
                                    <tr>
                                        <th colSpan="2" scope="col" className='text-start fw-bold thead_bg'>Información Administrativa</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th scope="row">Tipo de usuario:</th>
                                        <td>{mapUserRole(userData.users.role)}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Usuario creado:</th>
                                        <td>{new Date(userData.users.created_at).toLocaleString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: 'numeric',
                                            hour12: true,
                                        })}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
