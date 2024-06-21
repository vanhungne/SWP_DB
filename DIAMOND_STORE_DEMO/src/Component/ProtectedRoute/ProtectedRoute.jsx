import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth} from "../../Authentication/AuthContext";
import { useAuthorization} from "../../Authentication/useAuthorization";

function ProtectedRoute({ children, requiredRoles }) {
    const { currentUser, loading } = useAuth();
    const isAuthorized = useAuthorization(requiredRoles);
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!currentUser) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (isAuthorized === false) {
        return <div>You do not have permission to access this page.</div>;
    }

    return children;
}

export default ProtectedRoute;