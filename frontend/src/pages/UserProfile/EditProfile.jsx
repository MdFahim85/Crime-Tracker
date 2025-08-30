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
import { Camera } from "lucide-react";

const editProfileSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be at most 20 characters"),
    oldPassword: z.string().optional(),
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
  const [preview, setPreview] = useState(user?.image || "");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      username: user?.username || "",
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (image instanceof File) {
      const objectUrl = URL.createObjectURL(image);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (image && typeof image === "object" && image.path) {
      setPreview(image.path);
    }
  }, [image]);

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
    if (data.oldPassword) formData.append("oldPassword", data.oldPassword);
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
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-2xl px-8 pt-10 pb-8 w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <img
              src={preview.url ? preview.url : preview}
              alt="Profile Preview"
              className="w-28 h-28 rounded-full object-cover border-4 border-gray-200 shadow-md"
            />
            <label
              htmlFor="picture"
              className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow cursor-pointer hover:bg-blue-700 transition"
            >
              <Camera className="w-4 h-4" />
            </label>
            <Input
              id="picture"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">
          Edit Profile
        </h2>

        <div className="space-y-5">
          <div>
            <Label htmlFor="username" className="text-sm font-medium">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              {...register("username")}
              placeholder="Update username"
              className="mt-1"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="oldPassword" className="text-sm font-medium">
              Old Password
            </Label>
            <Input
              id="oldPassword"
              type="password"
              {...register("oldPassword")}
              placeholder="Enter old password (optional)"
              className="mt-1"
            />
            {errors.oldPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.oldPassword.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder="Update password (optional)"
              className="mt-1"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              placeholder="Confirm updated password"
              className="mt-1"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex justify-center space-x-4 mt-6">
            <Button
              type="submit"
              className="px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Save
            </Button>
            <Button
              type="button"
              className="px-6 py-2 rounded-full border border-red-500 bg-white text-red-500 hover:bg-red-500 hover:text-white transition"
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
