
import { useContext, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { user, loading, isAdmin } = useContext(AuthContext);

  if (loading) {
    // You could show a loading spinner here
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    // User is not authenticated, redirect to sign in
    return <Navigate to="/signin" replace />;
  }

  if (adminOnly && !isAdmin) {
    // User is not an admin, redirect to home
    return <Navigate to="/" replace />;
  }

  // User is authenticated (and is an admin if adminOnly is true)
  return <>{children}</>;
};

export default ProtectedRoute;
