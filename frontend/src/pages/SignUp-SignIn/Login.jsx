import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../feature/authSlice";
import toast from "react-hot-toast";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password must be at most 50 characters"),
});

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const users = useSelector((state) => state.register.users);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data) => {
    const { username, password } = data;

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
    const user = {
      username: existingUser.username,
      fakeToken,
      image: existingUser.image,
      role: existingUser.role,
    };

    dispatch(loginSuccess(user));
    toast.success(`Welcome Back ${user.username}`);
    localStorage.setItem("user", JSON.stringify(user));

    if (existingUser.role === "user") {
      navigate(from);
    } else {
      navigate("/admin");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
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
            {...register("username")}
            className={`${errors.username ? "focus:ring-red-500" : ""}`}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        <div className="mb-6 relative flex items-end gap-4">
          <div className="flex-1">
            <Label htmlFor="password" className="mb-2">
              Password
            </Label>
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter Password"
              {...register("password")}
              className={`${errors.password ? "focus:ring-red-500" : ""}`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
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
            <p className="text-slate-500">Don't have an account?</p>
            <Link to="/register" className="bg-white text-slate-500 underline">
              Register
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
