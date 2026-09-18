import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const RequireAuth = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export const RequireRole = ({ roles, children }) => {
  const { currentUser } = useAuth();
  if (!roles.includes(currentUser.role)) return <Navigate to="/dashboard" replace />;
  return children;
};
