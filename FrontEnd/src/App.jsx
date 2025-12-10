import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Login } from "./Pages/Login/Login";
import Home from "./Pages/Home/Home";
import AdminPage from "./Pages/AdminPage/AdminPage";
import EmployeePage from "./Pages/EmployeePage/EmployeePage";
import ManagerPage from "./Pages/ManagerPage/ManagerPage";
import "./App.css";

function App() {
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/manager" element={<ManagerPage />} />
        <Route path="/employee" element={<EmployeePage />} />
      </Routes>
    </div>
  );
}

export default App;
