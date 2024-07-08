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

    const login = (token) => {
        const userData = getUserFromToken(token);
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
    const decodedToken = jwtDecode(token);
    console.log('Decoded token:', decodedToken);
    const userId = decodedToken.id;
    if (!userId) {
        console.warn('User ID not found in the token');
    }

    return {
        token,
        name: decodedToken.name,
        roles: decodedToken.role,
        userid: userId
    };
}