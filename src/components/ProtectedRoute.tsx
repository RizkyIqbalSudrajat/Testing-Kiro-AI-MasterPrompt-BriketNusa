import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRole && currentUser.role !== allowedRole) {
    // Redirect to their own dashboard
    const destination =
      currentUser.role === 'supplier'
        ? '/supplier'
        : currentUser.role === 'pembeli'
        ? '/pembeli'
        : '/admin';
    return <Navigate to={destination} replace />;
  }

  return <>{children}</>;
};
