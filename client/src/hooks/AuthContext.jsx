import { jwtDecode } from 'jwt-decode';
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext({});

function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState(null);
    const [userData, setUserData] = useState(null);
    const [token, setToken] = useState(null);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    useEffect(() => {
        let intervalId;
        const checkTokenExpiration = () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    const decodedToken = jwtDecode(storedToken);
                    const currentTime = Math.floor(Date.now() / 1000);

                    if (decodedToken.exp < currentTime) {
                        localStorage.removeItem('token');
                        setIsAuthenticated(false);
                        setToken(null);
                        navigate('/login', { state: { message: "Su sesión ha culminado" } });
                    } else {
                        setIsAuthenticated(true);
                        setToken(storedToken);
                        setUserId(decodedToken.id);
                    }
                } catch (error) {
                    console.error('Error al decodificar el token:', error);
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                    setToken(null);
                    navigate('/login', { state: { message: "Su sesión ha culminado" } });
                }
            } else {
                setIsAuthenticated(false);
                setToken(null);
            }

            setIsInitialLoading(false);
        };

        checkTokenExpiration();

        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        delay(60000).then(() => {
            checkTokenExpiration();
            intervalId = setInterval(checkTokenExpiration, 60000);
        });

        return () => clearInterval(intervalId);
    }, [navigate]);

    const login = useCallback((token, userId) => {
        localStorage.setItem('token', token);
        setUserId(userId);
        setIsAuthenticated(true);
        setToken(token);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setUserId(null);
        setIsAuthenticated(false);
        setToken(null);
    }, []);

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            isInitialLoading,
            userId,
            userData,
            token,
            login,
            logout,
            setUserData
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthProvider, AuthContext };
