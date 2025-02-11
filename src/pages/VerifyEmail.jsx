import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services"; 
import "bootstrap/dist/css/bootstrap.min.css"; 

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");

    if (!token) {
      alert(
        "Invalid token. Please check your email for the verification link."
      );
      setLoading(false);
      return;
    }

    try {
      await axiosInstance.get(`/user/verify?token=${token}`); // Use axiosInstance
      alert("Email verified successfully. You can now log in.");
      navigate("/");
    } catch (error) {
      console.error(error);
      const message =
        error.response?.data?.message ||
        "Verification failed. Please try again.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      {loading ? (
        <h2>Verifying your email...</h2>
      ) : (
        <button className="btn btn-success btn-lg" onClick={handleVerify}>
          Verify Email
        </button>
      )}
    </div>
  );
};

export default VerifyEmail;
