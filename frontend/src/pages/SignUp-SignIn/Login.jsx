import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, reset } from "../../feature/authSlice";
import toast from "react-hot-toast";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "../../components/LoadingSpinner";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.email("Enter a valid email"),
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

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };

  useEffect(() => {
    if (isSuccess && user) {
      toast.success(`Welcome back ${user.username}`);

      const from = location.state?.from?.pathname || "/allreports";

      if (user.role == "user") {
        navigate(from, { replace: true });
      } else {
        navigate("/admin", { replace: true });
      }
    }
    dispatch(reset());
    if (isError) {
      toast.error(message);
    }
  }, [isSuccess, isError, user, message, navigate, location]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {/* Email */}
        <div className="mb-4">
          <Label htmlFor="email" className="mb-2">
            Email
          </Label>
          <Input
            type="text"
            id="email"
            placeholder="Enter Email"
            {...register("email")}
            className={`${errors.email ? "focus:ring-red-500" : ""}`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
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

        {/* Actions */}
        <div className="flex justify-between items-center">
          <Button variant="primary" type="submit" disabled={isLoading}>
            Log in
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
