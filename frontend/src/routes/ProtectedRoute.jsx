import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { loginAuthStatus, loginAuthUser, loginIsAuthenticated } from '../slices/authSlice';
import Spinner from '../utils/Spinner';

const ProtectedRoute = ({ children, isAdmin }) => {
    const isAuthenticated = useSelector(loginIsAuthenticated);
    const authStatus = useSelector(loginAuthStatus);
    const user = useSelector(loginAuthUser);

    // Show loading spinner while auth status is being checked
    if (authStatus === 'loading') {
        return <Spinner />;
    }

    // Redirect to home if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    // Handle admin access
    if (isAdmin && user?.role !== 'admin') {
        return <Navigate to="/" />;
    }

    // Handle user access (non-admin)
    if (!isAdmin && user?.role === 'admin') {
        return <Navigate to="/admin/dashboard" />;
    }

    // If all conditions are met, render the children (protected content)
    return children;
};

export default React.memo(ProtectedRoute);
