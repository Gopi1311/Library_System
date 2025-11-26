import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  userRole: string;
  allowed: string[];
  element: React.ReactElement;
}

const ProtectedRoute = ({ userRole, allowed, element }: ProtectedRouteProps) => {
  return allowed.includes(userRole) ? element : <Navigate to="/unauthorized" />;
};

export default ProtectedRoute;
