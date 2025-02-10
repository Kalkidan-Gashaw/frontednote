import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack"; // Import SnackbarProvider
import Home from "./pages/Home/Home.jsx";
import Login from "./pages/Login/Login.jsx";
import SignUp from "./pages/SignUP/SignUp.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";

const App = () => {
  return (
    <SnackbarProvider maxSnack={3}>
      <BrowserRouter>
        <div>
          <Routes>
            <Route path="/dashboard" element={<Home />} />
            <Route path="/" element={<Login />} />
            <Route path="/verify/:token" element={<VerifyEmail />} /> 
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </div>
      </BrowserRouter>
    </SnackbarProvider>
  );
};

export default App;
