import React, { useContext, useState, useEffect } from "react";

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Assume a function getUserFromToken(token) that fetches user details from token
            const userData = getUserFromToken(token);
            setCurrentUser(userData);
        }
    }, []);

    const login = (userData) => {
        setCurrentUser(userData);
        localStorage.setItem('token', userData.token);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setCurrentUser(null);
    };

    const value = { currentUser, login, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function getUserFromToken(token) {
    // Decode the token to extract user information
    // This is a mock function for demonstration purposes
    return { token, name: "User" };
}
