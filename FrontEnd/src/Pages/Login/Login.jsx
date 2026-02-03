import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Login.css";
import PrimaryBtn from "../../components/Button/PrimaryBtn";
import api from "../../services/api";

export function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Username and password are required");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Login to get token
      const loginResponse = await api.post("/auth/login", {
        email: username.trim(),
        password: password,
      });

      const authData = loginResponse.data;

      if (authData && authData.token) {
        // userId is now returned directly from the backend
        const userId = authData.userId;
        console.log("Login - User ID from response:", userId);

        // Store complete user data with user_id
        const fullUser = {
          token: authData.token,
          user_id: userId ? parseInt(userId) : null,
          firstName: authData.firstName,
          username: authData.firstName,
          email: username.trim(),
          role: authData.role,
        };

        localStorage.setItem("user", JSON.stringify(fullUser));
        console.log("Stored user:", fullUser);

        toast.success("Login successful!");

        // Navigate based on role
        if (authData.role === "ADMIN") navigate("/admin");
        else if (authData.role === "MANAGER") navigate("/manager");
        else if (authData.role === "EMPLOYEE") navigate("/employee");
        else navigate("/employee"); // Default fallback

        setUsername("");
        setPassword("");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="bubbleBlue"></div>
      <div className="bubbleOrange"></div>

      <div className="loginCard">
        <div className="header">
          <span className="logo">Welcome to Task Flow</span>
          <h1>Login</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label htmlFor="username">Email:</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your email"
              className="inputField"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="formGroup">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="inputField"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <PrimaryBtn type="submit" disabled={loading} loading={loading}>
            SUBMIT
          </PrimaryBtn>
        </form>
      </div>
    </div>
  );
}
