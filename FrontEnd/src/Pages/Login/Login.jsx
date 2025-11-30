import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Login.css";
import PrimaryBtn from "../../components/Button/PrimaryBtn";

// dummy data
const USER = [
  {username: "user",password: "password",role: "ADMIN"},
  {username: "admin",password:"admin", role:"ADMIN"},
  {username:"manager",password:"manager",role:"MANAGER"},
  {username:"employee",password:"employee",role:"EMPLOYEE"},
];

export function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!username || !password) {
      toast.error("Username and password are required");
      return;
    }

    setLoading(true);

    //---------------------- API call------------------------
    /*
    
    const response = await axios.post('/api/login', {
      
    })

    */
   const user = USER.find((u)=> u.username === username.trim() && u.password === password);
    if (user) {
      toast.success("Login successful!");
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "ADMIN") navigate("/admin");
      else if (user.role === "MANAGER") navigate("/manager");
      else if(user.role === "EMPLOYEE") navigate("/employee");

      setUsername("");
      setPassword("");

      //navigating to home
      // navigate("/home");
    } else {
      toast.error("Invalid username or password");
    }
    setLoading(false);
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

        <div className="formGroup">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            placeholder="Username"
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

        <PrimaryBtn onClick={handleSubmit} disabled={loading} loading={loading}>
          SUBMIT
        </PrimaryBtn>
      </div>
    </div>
  );
}
