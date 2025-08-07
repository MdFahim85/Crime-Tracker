import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Button from "./Button";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../feature/authSlice";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);

  const isAuthenticated = user ? true : false;

  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const toggleMenu = () => setIsOpen(!isOpen);
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-emerald-900 text-white shadow-md px-4 py-3 fixed top-0 left-0 right-0 z-999">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold ">
          CrimeTracker
        </Link>

        <div className="md:hidden">
          <Button
            className={"focus:outline-none"}
            onClick={toggleMenu}
            text={"☰"}
          />
        </div>

        <div
          className={`${
            isOpen ? "block" : "hidden"
          } md:flex md:items-center md:justify-end md:space-x-6`}
        >
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-emerald-500"
                : "block mt-2 md:mt-0  hover:text-emerald-500"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/report"
            className={({ isActive }) =>
              isActive
                ? "text-emerald-500"
                : "block mt-2 md:mt-0  hover:text-emerald-500"
            }
          >
            Report a Crime
          </NavLink>
          <NavLink
            to="/allreports"
            className={({ isActive }) =>
              isActive
                ? "text-emerald-500"
                : "block mt-2 md:mt-0  hover:text-emerald-500"
            }
          >
            View Reports
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink
                to="/my-reports"
                className="block mt-2 md:mt-0 px-2 py-1 rounded border-2 border-emerald-600 hover:bg-emerald-800 "
              >
                My Reports
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
                className="block mt-2 md:mt-0 px-2 py-1 rounded hover:bg-emerald-600 "
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="block mt-2 md:mt-0 px-2 py-1 rounded bg-emerald-400 hover:bg-emerald-600 "
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
