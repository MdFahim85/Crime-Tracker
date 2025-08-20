import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function AdminRoute({ children }) {
  const users = useSelector((state) => state.register.users);
  const authuser = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const [authorized, setAuthorized] = useState(null);
  const thisUser = users.find((u) => u.username === authuser?.username);

  useEffect(() => {
    if (thisUser) {
      if (thisUser.role === "admin") {
        setAuthorized(true);
      } else {
        toast.error("You are not authorized to perform this action");
        setAuthorized(false);
        navigate("/", { replace: true });
      }
    }
  }, [thisUser, navigate]);

  if (authorized === null) return null;
  if (authorized === false) return null;

  return children;
}

export default AdminRoute;
