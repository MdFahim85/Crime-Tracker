import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { updateUser } from "../../feature/registerSlice";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const regUsers = useSelector((state) => state.register.users);
  const { error, success } = useSelector((state) => state.register);
  const thisUser = regUsers.filter(
    (regUser) => regUser.username === user?.username
  );

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (thisUser) {
      setForm({
        username: thisUser.username || "",
        email: thisUser.email || "",
        password: "",
      });
    }
  }, [thisUser]);

  useEffect(() => {
    if (success) {
      toast.success("Profile updated successfully!");
    }
    if (error) {
      toast.error(error);
    }
  }, [success, error]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    dispatch(
      updateUser({
        username: form.username,
        email: form.email,
        password: form.password || undefined,
      })
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
        <div className="space-y-4">
          <Label htmlFor="username" className="mb-2">
            User Name
          </Label>
          <Input
            id="username"
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter username"
            required
          />

          <Label htmlFor="password" className="mb-2">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter new password (optional)"
          />

          <Label htmlFor="confirmPassword" className="mb-2">
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
          />

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
