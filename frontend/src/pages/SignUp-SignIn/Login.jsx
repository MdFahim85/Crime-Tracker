import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, reset } from "../../feature/authSlice";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, Shield, ArrowRight } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
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
  }, [isSuccess, isError, user, message, navigate, location, dispatch]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mb-4">
            <Badge className="mb-4 bg-blue-500/20 text-gray-800 border-blue-500/30">
              <Shield className="w-3 h-3 mr-1" />
              Secure Login
            </Badge>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-400">
            Sign in to access your CrimeTracker account
          </p>
        </div>

        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-center text-slate-900">
              Login
            </CardTitle>
            <CardDescription className="text-center text-slate-600">
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-700 flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-slate-500" />
                  Email Address
                </Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  className={`h-11 ${
                    errors.email
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : "border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                  } transition-colors`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700 flex items-center gap-2"
                >
                  <Lock className="w-4 h-4 text-slate-500" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter your password"
                    {...register("password")}
                    className={`h-11 pr-11 ${
                      errors.password
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                        : "border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                    } transition-colors`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1 h-9 w-9 p-0 hover:bg-slate-100"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-500" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 group"
              >
                {isLoading ? (
                  "Signing in..."
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </Button>

              <div className="text-center pt-4 border-t border-slate-100">
                <p className="text-sm text-slate-600 mb-2">
                  Don't have an account?
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link
                    to="/register"
                    className="flex items-center justify-center gap-2"
                  >
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Login;
