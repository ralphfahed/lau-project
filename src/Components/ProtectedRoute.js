// src/Components/ProtectedRoute.js
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/check_auth", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoggedIn(data.authenticated);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoggedIn(false);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // or a spinner component
  }

  return isLoggedIn ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
