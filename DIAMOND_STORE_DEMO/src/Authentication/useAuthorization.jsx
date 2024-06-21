import { useAuth } from "./AuthContext";

export function useAuthorization(requiredRoles) {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return null; // Still loading, authorization undetermined
    }

    if (!currentUser) {
        return false;
    }

    return requiredRoles.some(role => currentUser.roles.includes(role));
}