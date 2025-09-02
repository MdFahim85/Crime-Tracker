import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingSpinner from "../../components/LoadingSpinner";

import { registerUser, googleLogin, reset } from "../../feature/authSlice";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Lock, Image, Shield, ArrowRight } from "lucide-react";

const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be atleast 3 characters")
    .max(20, "Username must be at most 20 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password must be at most 50 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      "Password must contain at least one lowercase, one uppercase, and one number"
    ),
  confirmPassword: z.string(),
  email: z.string().email("Enter a valid email"),
});

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );
  const [image, setImage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess) {
      toast.success("Registration Successful");
      navigate("/");
    }
    dispatch(reset());
  }, [dispatch, isError, isSuccess, user, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const handleGoogleLogin = (credentialResponse) => {
    dispatch(googleLogin(credentialResponse));
  };

  const onSubmit = (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("date", new Date().toLocaleDateString());
    formData.append("role", "user");
    if (image) {
      formData.append("image", image);
    }
    dispatch(registerUser(formData));
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-blue-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="relative z-10 w-full max-w-md mt-12">
        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="pb-4 space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-slate-900">
              Register
            </CardTitle>
            <CardDescription className="text-center text-slate-600">
              Fill in your details to create an account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-sm font-medium text-slate-700 flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  {...register("username")}
                  className={`h-11 ${
                    errors.username
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : "border-slate-300 focus:border-purple-500 focus:ring-purple-500/20"
                  }`}
                />
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-700 flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-slate-500" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  {...register("email")}
                  className={`h-11 ${
                    errors.email
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : "border-slate-300 focus:border-purple-500 focus:ring-purple-500/20"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="picture"
                  className="text-sm font-medium text-slate-700 flex items-center gap-2"
                >
                  <Image className="w-4 h-4 text-slate-500" />
                  Profile Image
                </Label>
                <Input
                  id="picture"
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700 flex items-center gap-2"
                >
                  <Lock className="w-4 h-4 text-slate-500" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  {...register("password")}
                  className={`h-11 ${
                    errors.password
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : "border-slate-300 focus:border-purple-500 focus:ring-purple-500/20"
                  }`}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-slate-700 flex items-center gap-2"
                >
                  <Lock className="w-4 h-4 text-slate-500" />
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  {...register("confirmPassword")}
                  className={`h-11 ${
                    errors.confirmPassword
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : "border-slate-300 focus:border-purple-500 focus:ring-purple-500/20"
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-center">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-400 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 group"
                >
                  {isLoading ? (
                    "Registering..."
                  ) : (
                    <>
                      Register
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </Button>
                <span className="my-4">Or</span>
                <GoogleLogin
                  theme="filled_blue"
                  onSuccess={handleGoogleLogin}
                  onError={() => console.log("Google login failed")}
                />
              </div>

              <div className="text-center pt-4 border-t border-slate-100 ">
                <p className="text-sm text-slate-600 mb-2">
                  Already have an account?
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link
                    to="/login"
                    className="flex items-center justify-center gap-2"
                  >
                    Log In
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
