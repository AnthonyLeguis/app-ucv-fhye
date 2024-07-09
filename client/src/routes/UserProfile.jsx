import { useContext } from 'react';
import { AuthContext } from '../hooks/AuthContext';
import '../CSS/userprofile.css'
import img_male from '../assets/perfil_male.png'
import img_female from '../assets/perfil_female.png'


export const UserProfile = () => {
    const { userData } = useContext(AuthContext);

    return (
        <>
            <div className="container-fluid contain">
                <div className="row h-100">
                    <div className="col mt-4 mb-5 rounded-1 col-md-8 mx-auto d-flex flex-row align-content-center justify-content-center">
                        <h1 className="text-center text-center m-0">Perfil</h1>
                    </div>
                    {console.log('userData:', userData)}
                    {!userData ? (
                        <div>Cargando...</div>
                    ) : (
                        <div className="col container-fluid mt-5 col-12 col-md-10 d-flex flex-column justify-content-center align-items-center">

                            <div className="container-fluid d-flex flex-column flex-lg-row mx-auto">
                                <div className='container profile_image col-4 m-2 mx-auto'>
                                    <img className='profile_image' src={userData.image ? userData.image : (userData.gender === 'M' ? img_male : img_female)} alt="Imagen de perfil" />
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
                                                <td>{userData.names.split(' ')[0]} {userData.names.split(' ')[1]?.charAt(0)}.</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Apellido:</th>
                                                <td>{userData.surnames.split(' ')[0]} {userData.surnames.split(' ')[1]?.charAt(0)}.</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Cedula:</th>
                                                <td>{userData.ci}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Correo:</th>
                                                <td>{userData.email}</td>
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
                                            <td>{userData.role}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">ID:</th>
                                            <td>{userData.id}</td>
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