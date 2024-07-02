import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext({});

function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState(null);
    const [tokenVerified, setTokenVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = sessionStorage.getItem('token');
        if (storedToken) {
            try {
                const decodedToken = jwtDecode(storedToken);
                const currentTime = Date.now() / 1000;
                if (decodedToken.exp < currentTime) {
                    sessionStorage.removeItem('token');
                    setIsAuthenticated(false);
                } else {
                    setUserId(decodedToken.id);
                    setUserData(decodedToken);
                    setIsAuthenticated(true);
                    setToken(storedToken);
                }
            } catch (error) {
                console.error('Error al decodificar el token:', error);
                sessionStorage.removeItem('token');
                setIsAuthenticated(false);
            }
        }
        setTokenVerified(true);
        setIsLoading(false); 
    }, [ ]);

    const login = (token, userId) => {
        sessionStorage.setItem('token', token);
        setUserId(userId);
        setIsAuthenticated(true);
    };

    const logout = () => {
        sessionStorage.removeItem('token');
        setUserId(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userId, userData, tokenVerified, isLoading, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthProvider, AuthContext };