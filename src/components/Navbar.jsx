import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Button from "./Button";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../feature/authSlice";
import toast from "react-hot-toast";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);

  const isAuthenticated = user ? true : false;

  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const toggleMenu = () => setIsOpen(!isOpen);
  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged Out Successfully");
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
              className={"focus:outline-none"}
              onClick={toggleMenu}
              text={isOpen ? `❌` : `☰`}
            />
          </div>

          <div
            onClick={() => setIsOpen(false)}
            className={`${
              isOpen ? "flex flex-col items-end space-y-2" : "hidden"
            } md:flex md:items-center md:justify-end md:space-x-6`}
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
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/my-reports"
                  className="block mt-2 md:mt-0 px-2 py-1 rounded border-2 border-slate-600 hover:bg-slate-800 "
                >
                  My Reports
                </NavLink>
                <NavLink
                  to="/my-profile"
                  className="block mt-2 md:mt-0 px-2 py-1 rounded border-2 border-slate-600 hover:bg-slate-800 "
                >
                  View Profile
                </NavLink>
                <Button
                  className={
                    "block mt-2 md:mt-0 px-2 py-1 rounded border-2 border-red-500 hover:bg-red-500 hover:text-white"
                  }
                  text={"Logout"}
                  onClick={() => handleLogout()}
                />
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="block mt-2 md:mt-0 px-2 py-1 rounded hover:bg-slate-600 "
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="block mt-2 md:mt-0 px-2 py-1 rounded bg-slate-400 hover:bg-slate-600 "
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
