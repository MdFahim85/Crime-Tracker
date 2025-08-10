import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../feature/authSlice";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import Button from "../../components/Button";

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

    navigate(from);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border border-slate-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-slate-600"
            type="text"
            placeholder="Enter your username"
            required
          />
        </div>

        <div className="mb-6 relative">
          <label
            className="block text-gray-700 text-sm mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border border-slate-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-slate-600 pr-10"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            required
          />
          <Button
            type={"button"}
            onClick={() => setShowPassword((prev) => !prev)}
            className={
              "absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            }
            text={
              showPassword ? (
                <EyeOffIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )
            }
          />
        </div>

        <Button
          type={"submit"}
          className={
            "w-full text-slate-600 border-2 border-slate-600 hover:bg-slate-600 hover:text-white font-semibold py-2 px-4 rounded"
          }
          text={"Log In"}
        />
      </form>
    </div>
  );
}

export default Login;
