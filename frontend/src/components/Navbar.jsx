import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../feature/authSlice";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Menu, User, LogOut } from "lucide-react";
import Notification from "./Notification";

const Navbar = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const isAuthenticated = currentUser ? true : false;

  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged Out Successfully");
    navigate("/");
    setTimeout(() => navigate("/"), 0);
  };

  const navItems = [
    { to: "/report", label: "File a Report" },
    { to: "/allreports", label: "Incident Map" },
  ];

  return (
    <nav className="bg-blue-600 text-white shadow-sm shadow-blue-700 px-4 py-3 fixed top-0 left-0 right-0 z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-bold hover:text-white transition-colors"
        >
          CrimeTracker
        </Link>

        {/* PC navbar */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-white ${
                  isActive ? "text-white" : "text-slate-300"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              {currentUser.role != "user" && (
                <NavLink
                  to={currentUser.role == "user" ? "/my-profile" : "/admin"}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors hover:text-white ${
                      isActive ? "text-white" : "text-slate-300"
                    }`
                  }
                >
                  Dashboard
                </NavLink>
              )}
              <Notification />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full p-0 hover:bg-blue-900"
                  >
                    <Avatar className="h-10 w-10 border-2 border-blue-100">
                      <AvatarImage
                        src={
                          currentUser?.image?.url ||
                          "https://imgs.search.brave.com/6G4l561oIhgssjfbYvozwAIa5jx6fv6YhMrFjEGbdhM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4x/Lmljb25maW5kZXIu/Y29tL2RhdGEvaWNv/bnMvYXZhdGFyLXZv/bC05LzUxMi80LTEy/OC5wbmc"
                        }
                        alt="Profile Picture"
                      />
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem asChild>
                    <Link to="/my-profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>{currentUser.username}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Button
                asChild
                size="sm"
                className="bg-transparent text-white hover:bg-blue-500 hover:text-white transition duration-300 ease-in-out"
              >
                <Link to="/login">Login</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-slate-200 text-slate-900 hover:bg-blue-500 hover:text-white transition duration-300 ease-in-out"
              >
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile navbar */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-slate-800"
              >
                <Menu className="size-7" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-80 bg-slate-900 text-white border-slate-800"
            >
              <SheetHeader>
                <SheetTitle className="text-white">CrimeTracker</SheetTitle>
              </SheetHeader>

              <div className="flex flex-col space-y-4 ">
                {isAuthenticated ? (
                  <>
                    <div className="border-b border-slate-800 pb-4 mb-4 ">
                      <div className="flex items-center space-x-3 py-2 px-3">
                        <Avatar className="h-10 w-10 border-2 border-slate-300">
                          <AvatarImage
                            src={
                              currentUser?.image?.url ||
                              "https://imgs.search.brave.com/6G4l561oIhgssjfbYvozwAIa5jx6fv6YhMrFjEGbdhM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4x/Lmljb25maW5kZXIu/Y29tL2RhdGEvaWNv/bnMvYXZhdGFyLXZv/bC05LzUxMi80LTEy/OC5wbmc"
                            }
                            alt="Profile Picture"
                          />
                          <AvatarFallback>
                            <User className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {currentUser?.username || "User"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-2 px-3">
                      <span className="text-sm">Notifications</span>
                      <Notification />
                    </div>

                    <Button
                      asChild
                      variant="ghost"
                      className="justify-start text-left hover:bg-slate-800"
                      onClick={() => setIsOpen(false)}
                    >
                      <Link to="/my-profile" className="flex items-center">
                        <User className="mr-3 h-4 w-4" />
                        Profile
                      </Link>
                    </Button>

                    <Button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      variant="ghost"
                      className="justify-start text-left text-red-400 hover:text-red-300 hover:bg-slate-800"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <div className="border-b border-slate-800 pb-4 mb-4 space-y-3">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-slate-500 bg-transparent text-white hover:bg-slate-800"
                      onClick={() => setIsOpen(false)}
                    >
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button
                      asChild
                      className="w-full bg-slate-200 text-slate-900 hover:bg-slate-300"
                      onClick={() => setIsOpen(false)}
                    >
                      <Link to="/register">Register</Link>
                    </Button>
                  </div>
                )}
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `text-left py-2 px-3 rounded-md transition-colors  ${
                        isActive
                          ? "bg-slate-800 text-white"
                          : "hover:bg-slate-800 hover:text-white"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
                {isAuthenticated && (
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `text-left py-2 px-3 rounded-md transition-colors  ${
                        isActive
                          ? "bg-slate-800 text-white"
                          : "hover:bg-slate-800 hover:text-white"
                      }`
                    }
                  >
                    Dashboard
                  </NavLink>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
