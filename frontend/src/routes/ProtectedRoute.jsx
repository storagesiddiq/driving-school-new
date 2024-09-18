import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { loginAuthStatus, loginAuthUser, loginIsAuthenticated } from '../slices/authSlice';
import Spinner from '../utils/Spinner';

const ProtectedRoute = ({ children, isAdmin, isOwner, isInst, isLearner }) => {
    const isAuthenticated = useSelector(loginIsAuthenticated);
    const authStatus = useSelector(loginAuthStatus);
    const user = useSelector(loginAuthUser);

    // Show loading spinner while auth status is being checked
    if (authStatus === 'loading') {
        return <Spinner />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    if (isAdmin && user?.role !== 'admin') {
        return <Navigate to="/" />;
    }

    if (!isAdmin && user?.role === 'admin') {
        return children;
    }

    if (!isOwner && user?.role === 'owner') {
        return children;
    }

    if (isOwner && user?.role !== 'owner') {
        return <Navigate to="/" />;
    }

    if (isInst && user?.role === 'instructor') {
        return children;
    }

    if (isInst && user?.role !== 'instructor') {
        return <Navigate to="/" />;
    }

    
    if (isLearner && user?.role === 'learner') {
        return children;
    }

    if (isLearner && user?.role !== 'learner') {
        return <Navigate to="/" />;
    }

    // If all conditions are met, render the children (protected content)
    return children;
};

export default React.memo(ProtectedRoute);
