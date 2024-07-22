import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../hooks/AuthContext';
import { jwtDecode } from 'jwt-decode';
import '../CSS/userprofile.css'
import img_male from '../assets/perfil_male.png'
import img_female from '../assets/perfil_female.png'
import { Spinner } from './components/Spinner';
import { ChangeImagen } from './components/ChangeImagen';


export const UserProfile = () => {
    const { userData, setUserData, isLoading: authLoading } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (authLoading) {
            return;
        }

        const fetchData = async () => {
            const token = sessionStorage.getItem('token');

            if (!token) {
                return;
            }

            try {
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.id;

                const response = await fetch(`${import.meta.env.VITE_API_USER_URL}/profile/${userId}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Error al obtener los datos del usuario");
                }
                const data = await response.json();
                setUserData(data); // Actualiza el estado userData en el AuthContext
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setError(error.message); // Almacena el mensaje de error
                setIsLoading(false); // Desactiva el spinner incluso en caso de error
            }
        };

        fetchData();
    }, [authLoading, setUserData]);

    return (
        <>
            <div className="container-fluid contain overflow-auto">
                <div className="row h-100 sm-flex-column">
                    <div className="col mt-4 mb-2 rounded-1 col-md-8 mx-auto d-flex flex-row justify-content-center justify-content-md-right">
                        <h1 className="SchoolName text-center text-center m-0">Escuela: {userData?.users?.school}</h1>
                    </div>
                    {console.log('userData:', userData)}

                    {error ? (
                        <div className="alert alert-danger col-6 mx-auto">{error}</div>
                    ) : isLoading || !userData || !userData.users ? (
                        <Spinner />
                    ) : (
                        <div className="col container-fluid mt-5 col-12 col-md-10 d-flex flex-column justify-content-center align-items-center">

                            <div className="container-fluid d-flex flex-column flex-lg-row mx-auto">
                                <div className='container profile_image mb-5 mt-0 col-4 m-2 mx-auto my-md-auto'>
                                    <img className='profile_image' src={userData.users.image ? userData.users.image : (userData.gender === 'M' ? img_male : img_female)} alt="Imagen de perfil" />
                                    <ChangeImagen />
                                </div>

                                <div className='container-fluid col-8'>

                                    <table className='container-fluid table table-responsive table-striped table-hover mx-auto'>
                                        <thead>
                                            <tr >
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
                                                <th scope="row">Cedula:</th>
                                                <td>{userData.users.ci}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Correo:</th>
                                                <td>{userData.users.email}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Genero:</th>
                                                <td>{userData.users.gender}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Edad:</th>
                                                <td>{userData.users.age}</td>
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
                                            <th scope="row">Rol:</th>
                                            <td>{userData.users.role}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Idac:</th>
                                            <td>{userData.users.idac}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Usuario creado:</th>
                                            <td>{new Date(userData.users.created_at).toLocaleString(undefined,
                                                {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: 'numeric',
                                                    minute: 'numeric',
                                                    hour12: true
                                                }
                                            )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Fecha de ingreso:</th>
                                            <td>{new Date(userData.users.hire_date).toLocaleString(undefined,
                                                {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: 'numeric',
                                                    minute: 'numeric',
                                                    hour12: true
                                                }
                                            )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    )}

                </div>

            </div>
        </>
    );
};