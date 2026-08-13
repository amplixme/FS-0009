import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;