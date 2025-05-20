import { Navigate } from "react-router-dom";
import { useGlobalContext } from "./context/globalContextProvider";

export default function AdminProtectedRoute({ children }) {
  const { user, token } = useGlobalContext();

  // Show nothing or a loader until context is ready
  if (!token || !user?.role) return null;

  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}