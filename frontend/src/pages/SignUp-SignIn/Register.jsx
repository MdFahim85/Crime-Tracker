import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, resetState } from "../../feature/registerSlice";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { loginSuccess } from "../../feature/authSlice";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be atleast 3characters")
    .max(20, "Username must be at most 20 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password must be at most 50 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),
  confirmPassword: z
    .string()
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
  email: z.email(),
});

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, success, users } = useSelector((state) => state.register);
  const { image, setImage } = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    if (success) {
      const username = users[users.length - 1].username;
      const fakeToken = btoa(username + "_fakejwt");
      const user = { username, fakeToken, image, role: "user" };
      dispatch(loginSuccess(user));
      dispatch(resetState());
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/allreports");
    }
  }, [success, navigate, dispatch, users]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    dispatch(
      registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
        date: new Date().toLocaleDateString(),
        image,
        role: "user",
      })
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <div className="space-y-4">
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

          <Label htmlFor="email" className="mb-2">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="Enter email"
            className={`${errors.email ? "focus:ring-red-500" : ""}`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}

          <Label htmlFor="picture" className="mb-2">
            Profile Image
          </Label>
          <Input
            id="picture"
            name="picture"
            type="file"
            onChange={handleImageChange}
            accept="image/*"
          />

          <Label htmlFor="password" className="mb-2">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            {...register("password")}
            placeholder="Enter password"
            className={`${errors.password ? "focus:ring-red-500" : ""}`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}

          <Label htmlFor="confirmPassword" className="mb-2">
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
            placeholder="Confirm Password"
            className={`${errors.confirmPassword ? "focus:ring-red-500" : ""}`}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}

          {error && <p className="mb-4 text-red-500 text-center">{error}</p>}

          <div className="flex justify-between items-center">
            <Button variant="primary" type="submit">
              Register
            </Button>
            <div className="flex flex-col items-end text-sm">
              <p className=" text-slate-500">Already Registered? </p>
              <Link to="/login" className="  bg-white text-slate-500 underline">
                Log In
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
