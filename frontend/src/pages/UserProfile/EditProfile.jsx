import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { updateUser } from "../../feature/registerSlice";
import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const editProfileSchema = z
  .object({
    email: z.string().email("Invalid email address"),
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
  const user = useSelector((state) => state.auth.user);
  const regUsers = useSelector((state) => state.register.users);
  const { error } = useSelector((state) => state.register);

  const [image, setImage] = useState("");

  const thisUser = regUsers.find(
    (regUser) => regUser.username === user?.username
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (thisUser) {
      setValue("email", thisUser.email || "");
      setImage(thisUser.image || "");
    }
  }, [thisUser, setValue]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data) => {
    dispatch(
      updateUser({
        username: user.username,
        email: data.email,
        password: data.password || undefined,
        image,
      })
    );
    toast.success("Profile updated successfully!");
    navigate("/my-profile");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
        <div className="space-y-4">
          <Label htmlFor="email" className="mb-2">
            User Email
          </Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="Update user email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          <Label htmlFor="picture" className="mb-2">
            Profile Image
          </Label>
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

          <Label htmlFor="password" className="mb-2">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            {...register("password")}
            placeholder="Update password (optional)"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}

          <Label htmlFor="confirmPassword" className="mb-2">
            Confirm Password
          </Label>
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

          {error && <p className="mb-4 text-red-500 text-center">{error}</p>}

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
