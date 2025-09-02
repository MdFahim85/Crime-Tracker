import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

function GuestRoute({ children }) {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.token) {
      return navigate("/");
    }
  }, [user]);

  return children;
}

export default GuestRoute;
