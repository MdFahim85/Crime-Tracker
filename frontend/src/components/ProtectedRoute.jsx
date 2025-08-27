import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

function ProtectedRoute({ children }) {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  if (!user) {
    toast.error("Please log in to access this resource");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;
