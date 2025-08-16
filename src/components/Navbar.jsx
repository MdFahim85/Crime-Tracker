import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../feature/authSlice";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);

  const isAuthenticated = user ? true : false;

  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged Out Successfully");
    navigate("/");
    setTimeout(() => navigate("/"), 0);
  };

  return (
    <nav className="bg-slate-900 text-white shadow-md px-4 py-3 fixed top-0 left-0 right-0 z-999">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold self-start ">
          CrimeTracker
        </Link>
        <div className="block justify-end text-end">
          <div className="md:hidden">
            <Button
              className="focus:outline-none bg-slate-900 hover:bg-slate-900"
              onClick={toggleMenu}
            >
              {isOpen ? `❌` : `☰`}
            </Button>
          </div>

          <div
            onClick={() => setIsOpen(false)}
            className={`${
              isOpen ? "flex flex-col items-end space-y-2" : "hidden"
            } md:flex md:items-center md:justify-end md:space-x-4 text-sm`}
          >
            <NavLink
              to="/report"
              className={({ isActive }) =>
                isActive
                  ? "text-slate-300"
                  : "block mt-2 md:mt-0  hover:text-slate-300"
              }
            >
              Report a Crime
            </NavLink>
            <NavLink
              to="/allreports"
              className={({ isActive }) =>
                isActive
                  ? "text-slate-300"
                  : "block mt-2 md:mt-0  hover:text-slate-300"
              }
            >
              View Reports
            </NavLink>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                isActive
                  ? "text-slate-300"
                  : "block mt-2 md:mt-0  hover:text-slate-300"
              }
            >
              Admin
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/my-profile">
                  <Button className="border border-slate-500 bg-slate-900 text-white hover:bg-slate-500">
                    View Profile
                  </Button>
                </NavLink>

                <Button
                  onClick={() => handleLogout()}
                  className="border border-red-500 bg-slate-900 text-white hover:bg-red-500"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="px-2 py-1 border border-slate-500 bg-slate-900 text-white hover:bg-slate-500 rounded transition-all duration-150 ease-in-out"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="px-2 py-1 bg-slate-500  text-white hover:bg-slate-700 rounded transition-all duration-150 ease-in-out"
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
