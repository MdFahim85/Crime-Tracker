import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

function ProtectedRoute({ children }) {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      toast.error("Log In To Perform This Action");
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;
