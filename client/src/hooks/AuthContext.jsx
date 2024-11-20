import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext({});

function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState(null);
    const [tokenVerified, setTokenVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [token, setToken] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            try {
                const decodedToken = jwtDecode(storedToken);
                const currentTime = Math.floor(Date.now() / 1000);
                if (decodedToken.exp < currentTime) {
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                } else {
                    setUserId(decodedToken.id);
                    setIsAuthenticated(true);
                    setToken(storedToken);
                }
            } catch (error) {
                console.error('Error al decodificar el token:', error);
                localStorage.removeItem('token');
                setIsAuthenticated(false);
            }
        }
        setTokenVerified(true);
        setIsLoading(false);
    }, []);

    const login = (token, userId) => {
        localStorage.setItem('token', token);
        setUserId(userId);
        setIsAuthenticated(true);
        // Redirigir a /app después del login
        navigate('/app');
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUserId(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userId, userData, tokenVerified, isLoading, token, login, logout, setUserData }}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthProvider, AuthContext };