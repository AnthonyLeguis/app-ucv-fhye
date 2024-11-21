import { useState, useEffect } from 'react';

export const useRememberMe = () => {
    const [nationalId, setNationalId] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMee, setRememberMee] = useState(false);

    useEffect(() => {
        const savedNationalId = localStorage.getItem('rememberedNationalId');
        const savedPassword = localStorage.getItem('rememberedPassword');
        const rememberMe = localStorage.getItem('rememberMe') === 'true';
        
        if (savedNationalId && rememberMe) {
            setNationalId(savedNationalId);
            setRememberMee(true);
        }

        if (savedPassword && rememberMe) {
            setPassword(savedPassword);
        }

    }, []);

    useEffect(() => {
      if (rememberMee) {
        localStorage.setItem('rememberedNationalId', nationalId);
        localStorage.setItem('rememberedPassword', password);
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberedNationalId');
        localStorage.removeItem('rememberedPassword');  
        localStorage.removeItem('rememberMe');
      }
    
    }, [nationalId, password, rememberMee]);
    

    const handleRememberMeChange = (event) => {
        setRememberMee(event.target.checked);
    };

    return { nationalId, setNationalId, password, setPassword, rememberMee, handleRememberMeChange };
}