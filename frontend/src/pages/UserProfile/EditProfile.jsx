import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { reset, updateProfile } from "../../feature/authSlice";
import LoadingSpinner from "../../components/LoadingSpinner";

const editProfileSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be at most 20 characters"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(50, "Password must be at most 50 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        "Password must contain at least one lowercase letter, one uppercase letter, and one number"
      )
      .optional()
      .or(z.literal("")),
    confirmPassword: z.string().optional(),
  })
  .refine((data) => !data.password || data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function EditProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const { user, isError, isLoading, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const [image, setImage] = useState(user?.image || "");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      username: user?.username || "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (user) {
      setValue("username", user.username || "");
      setImage(user.image || "");
    }
  }, [user, setValue]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("username", data.username);
    if (image) formData.append("image", image);

    if (data.password) formData.append("password", data.password);

    dispatch(updateProfile(formData));
    setSubmitted(true);
  };

  useEffect(() => {
    if (!submitted) {
      return;
    }
    if (isSuccess) {
      toast.success("Profile updated successfully!");
      navigate("/my-profile");
    }
    if (isError) {
      toast.error(message || "Failed to update profile");
    }
    dispatch(reset());
  }, [isSuccess, isError, message, navigate]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
        <div className="space-y-4">
          {/* Username */}
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            {...register("username")}
            placeholder="Update username"
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username.message}</p>
          )}

          {/* Profile Image */}
          <Label htmlFor="picture">Profile Image</Label>
          <Input
            id="picture"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {image && (
            <img
              src={image}
              alt="Profile Preview"
              className="mt-2 w-20 h-20 rounded-full object-cover"
            />
          )}

          {/* Password */}
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            {...register("password")}
            placeholder="Update password (optional)"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}

          {/* Confirm Password */}
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
            placeholder="Confirm updated password"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}

          <div className="flex justify-center space-x-4">
            <Button
              type="submit"
              className="border border-slate-500 bg-white text-slate-500 hover:text-white hover:bg-slate-500"
            >
              Save
            </Button>
            <Button
              type="button"
              className="border border-red-500 bg-white text-red-500 hover:text-white hover:bg-red-500"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
