import React, { useState } from "react"; // Import React and useState
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import axiosInstance from "../services"; // Import your axios instance
import "../index.css"; // Import your CSS for Tailwind or other styles

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token"); // Use token

    if (!token) {
      alert(
        "Invalid token. Please check your email for the verification link."
      );
      setLoading(false);
      return;
    }

    try {
      await axiosInstance.get(`/verify?token=${token}`); // Use axiosInstance
      alert("Email verified successfully. You can now log in.");
      navigate("/");
    } catch (error) {
      console.log(error);
      const message =
        error.response?.data?.message ||
        "Verification failed. Please try again.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {loading ? (
        <h2 className="text-xl">Verifying your email...</h2>
      ) : (
        <button
          className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200"
          onClick={handleVerify}
        >
          Verify Email
        </button>
      )}
    </div>
  );
};

export default VerifyEmail;
