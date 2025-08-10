import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, resetState } from "../../feature/registerSlice";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
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
      navigate("/my-reports");
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

        <label className="block mb-2 text-gray-700" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          value={form.username}
          onChange={handleChange}
          placeholder="Enter username"
          required
          className="w-full border border-gray-300 rounded py-2 px-3 mb-4 focus:outline-none focus:ring-2 focus:ring-slate-600"
        />

        <label className="block mb-2 text-gray-700" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter email"
          required
          className="w-full border border-gray-300 rounded py-2 px-3 mb-4 focus:outline-none focus:ring-2 focus:ring-slate-600"
        />

        <label className="block mb-2 text-gray-700" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter password"
          required
          className="w-full border border-gray-300 rounded py-2 px-3 mb-4 focus:outline-none focus:ring-2 focus:ring-slate-600"
        />

        <label className="block mb-2 text-gray-700" htmlFor="confirmPassword">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm password"
          required
          className="w-full border border-gray-300 rounded py-2 px-3 mb-6 focus:outline-none focus:ring-2 focus:ring-slate-600"
        />

        {error && <p className="mb-4 text-red-500 text-center">{error}</p>}

        <Button
          type="submit"
          text={"Register"}
          className="w-full bg-slate-600 text-white font-semibold py-2 px-4 rounded hover:bg-slate-700"
        />
      </form>
    </div>
  );
}
