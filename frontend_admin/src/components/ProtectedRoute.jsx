import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken"); // ubah ke 'adminToken'
  return token ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
