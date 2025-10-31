import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import LogInPage from "./pages/LogIn";
import SignUpPage from "./pages/SignUp";
import NotFoundPage from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<LogInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}