import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function AdminRoute({ children }) {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    if (user) {
      if (user.role === "admin" || user.role === "master_admin") {
        setAuthorized(true);
      } else {
        toast.error("You are not authorized to perform this action");
        setAuthorized(false);
        navigate("/", { replace: true });
      }
    }
  }, [user, navigate]);

  if (authorized === null) return null;
  if (authorized === false) return null;

  return children;
}

export default AdminRoute;
