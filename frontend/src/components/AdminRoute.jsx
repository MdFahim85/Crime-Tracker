import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function AdminRoute({ children }) {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    if (user) {
      if (user.role === "admin" || user.role === "master_admin") {
        setAuthorized(true);
      } else {
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
