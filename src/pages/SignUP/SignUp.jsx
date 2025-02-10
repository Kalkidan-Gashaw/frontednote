import React, {useState} from 'react'
import Navbar from '../../components/Navbar/Navbar'
import PasswordInput from '../../components/Input/PasswordInput'
import { Link, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import axiosInstance from '../../utils/axiosInstance';

const SignUp = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const { enqueueSnackbar } = useSnackbar();

    const navigate = useNavigate()

  const handelSignUp = async (e) => {
    e.preventDefault();
    if (!name) {
      setError("Please enter your name");
      return;
    }

    if (!email) {
      setError("Please enter your email");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    setError(null);

    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });

      if (response.data && response.data.error) {
        setError(response.data.message);
        return;
      }

      // Show success message for account creation and email verification
      enqueueSnackbar(
        "Account created successfully. Please check your email for the verification link.",
        { variant: "success" }
      );

      // Optionally, navigate to another page or keep the user on the signup page
      // navigate("/dashboard");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("Please try again");
      }
    }
  };
  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handelSignUp}>
            <h4 className="text-2xl mb-7">SignUp</h4>
            <input
              type="text"
              placeholder="Name"
              className="w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded mb-4 outline-none"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
            />
            <input
              type="text"
              placeholder="Email"
              className="w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded mb-4 outline-none"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null); // Reset error on change
              }} // Corrected onChange
            />
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
            <button type="submit" className="btn-primary">
              Create Account
            </button>
            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <Link to="/" className="font-medium text-primary underline">
             
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignUp