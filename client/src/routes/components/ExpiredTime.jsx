import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

export const ExpiredTime = () => {
    const navigate = useNavigate();

    useEffect(() => {
        Swal.fire({
            title: 'Su sesión ha expirado',
            text: 'Inicie sesión nuevamente.',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Login'
        }).then((result) => {
            if (result.isConfirmed) {
                navigate('/login')
            }
        })
    }, [])

    return null;
}
