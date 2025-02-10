import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar.jsx";
import PasswordInput from "../../components/Input/PasswordInput.jsx";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper.js";
import axiosInstance from "../../utils/axiosInstance.js";
import { useSnackbar } from 'notistack';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password.");
      return;
    }
    
    setError(null); 

    try {
      const response = await axiosInstance.post('/login', { email, password });
      if (response.data && response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        enqueueSnackbar("Login successful", { variant: "success" });
        navigate('/dashboard');
      }

    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
        enqueueSnackbar(error.response.data.message, { variant: "error" }); // Show error snackbar
      } else {
        setError("Please try again");
        enqueueSnackbar("Please try again", { variant: "error" }); // Show generic error
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl mb-7">Login</h4>
            <input
              type="text"
              placeholder="Email"
              className="w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded mb-4 outline-none"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null); // Reset error on change
              }}
            />
            <PasswordInput
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null); // Reset error on change
              }}
            />
            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
            <button type="submit" className="btn-primary">
              Login
            </button>
            <p className="text-sm text-center mt-4">
              Not registered yet?{" "}
              <Link to="/signup" className="font-medium text-primary underline">
                Create an Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;