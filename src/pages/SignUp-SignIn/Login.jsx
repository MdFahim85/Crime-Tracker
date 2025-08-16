import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../feature/authSlice";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const users = useSelector((state) => state.register.users);

  const handleLogin = (e) => {
    e.preventDefault();

    const existingUser = users.find(
      (u) =>
        u.username.trim().toLowerCase() === username.trim().toLowerCase() &&
        u.password === password
    );

    if (!existingUser) {
      toast.error("Invalid username or password.");
      return;
    }

    const from = location.state?.from?.pathname || "/allreports";
    const fakeToken = btoa(username + "_fakejwt");
    const user = { username: existingUser.username, fakeToken };

    dispatch(loginSuccess(user));
    toast.success(`Welcome Back ${user.username}`);
    localStorage.setItem("user", JSON.stringify(user));
    if (existingUser.role == "user") {
      navigate(from);
    } else {
      navigate("/admin");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <div className="mb-4">
          <Label htmlFor="username" className="mb-2">
            User Name
          </Label>
          <Input
            type="text"
            id="username"
            placeholder="Enter User Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-6 relative flex items-end gap-4">
          <div>
            <Label htmlFor="password" className="mb-2">
              Password
            </Label>
            <Input
              className="w-66"
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            variant="primary"
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <EyeOffIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </Button>
        </div>
        <div className="flex justify-between items-center">
          <Button variant="primary" type="submit">
            Log In
          </Button>
          <div className="flex flex-col items-end text-sm">
            <p className=" text-slate-500">Dont have an account? </p>
            <Link
              to="/register"
              className="  bg-white text-slate-500 underline"
            >
              Register
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
