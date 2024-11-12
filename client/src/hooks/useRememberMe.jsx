import { useState, useEffect } from 'react';

export const useRememberMe = () => {
    const [nationalId, setNationalId] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMee, setrememberMee] = useState(false);

    useEffect(() => {
        const savedNationalId = localStorage.getItem('nationalId');
        const savedPassword = localStorage.getItem('password');
        const rememberMe = localStorage.getItem('rememberMe') === 'true';
        
        if (savedNationalId && rememberMe) {
            setNationalId(savedNationalId);
            setrememberMee(true);
        }

        if (savedPassword && rememberMe) {
            setPassword(savedPassword);
        }

    }, []);

    const handleRememberMeChange = (event) => {
        setrememberMee(event.target.checked);

        if (event.target.checked) {
            localStorage.setItem('nationalId', nationalId);
            localStorage.setItem('password', password);
            localStorage.setItem('rememberMe', 'true');
        } else {
            localStorage.removeItem('nationalId');
            localStorage.removeItem('password');
            localStorage.removeItem('rememberMe');
        }
    };

    return { nationalId, setNationalId, password, setPassword, rememberMee, handleRememberMeChange };
}