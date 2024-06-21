import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const userData = getUserFromToken(token);
            setCurrentUser(userData);
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setCurrentUser(userData);
        localStorage.setItem('token', userData.token);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setCurrentUser(null);
    };

    const value = { currentUser, login, logout, loading };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function getUserFromToken(token) {
    const userData = jwtDecode(token);
    return {token, name: userData.name, roles: userData.role};
}