import { useContext } from 'react'
import { AuthContext } from '../../hooks/AuthContext'
import { Navigate, useLocation } from 'react-router-dom'
import { SideBar } from './SideBar'

export const ProtectedRoute = ({ children, redirectTo = "/app" }) => {
    const { isAuthenticated } = useContext(AuthContext);
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
      }

    return (
        <>
          <SideBar isAuthenticated={isAuthenticated} />
          {children}
        </>
      );
}
