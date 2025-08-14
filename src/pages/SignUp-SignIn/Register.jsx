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

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, success } = useSelector((state) => state.register);

  useEffect(() => {
    if (success) {
      const username = form.username;
      const fakeToken = btoa(username + "_fakejwt");
      const user = { username, fakeToken };
      dispatch(loginSuccess(user));
      dispatch(resetState());
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/allreports");
    }
  }, [success, navigate, dispatch, form.username]);

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
      registerUser({
        username: form.username,
        email: form.email,
        password: form.password,
        date: new Date().toLocaleDateString(),
      })
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
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

          <Label htmlFor="email" className="mb-2">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter email"
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
            placeholder="Enter password"
            required
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
