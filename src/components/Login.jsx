import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../feature/authSlice";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const fakeToken = btoa(username + "_fakejwt");
    const user = { username, fakeToken };
    dispatch(loginSuccess(user));

    localStorage.setItem("user", JSON.stringify(user));

    navigate("/allreports");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border border-emerald-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-emerald-600"
            type="text"
            placeholder="Enter your username"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full text-emerald-600 border-2  border-emerald-600 hover:bg-emerald-600 hover:text-white font-semibold py-2 px-4 rounded"
        >
          Log In
        </button>
      </form>
    </div>
  );
}

export default Login;
