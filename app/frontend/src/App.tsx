import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import LogInPage from "./pages/LogIn";
import SignUpPage from "./pages/SignUp";
import NotFoundPage from "./pages/NotFound";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(localStorage.getItem("token")));

  useEffect(() => {
    const sync = () => setIsLoggedIn(Boolean(localStorage.getItem("token")));
    window.addEventListener("storage", sync);
    window.addEventListener("auth", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("auth", sync);
    };
  }, []);

  return (
    <Routes>
      <Route path="/" element={isLoggedIn ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} />
      <Route path="/home" element={isLoggedIn ? <HomePage /> : <Navigate to="/login" replace />} />
      <Route path="/login" element={isLoggedIn ? <Navigate to="/home" replace /> : <LogInPage />} />
      <Route path="/signup" element={isLoggedIn ? <Navigate to="/home" replace /> : <SignUpPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
