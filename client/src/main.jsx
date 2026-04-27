import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline } from "@mui/material";
import { RouterProvider } from "react-router-dom";
import router from "./router.jsx";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import "./index.css";
import "./utils/i18n";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CssBaseline />
    <Toaster position="top-center" reverseOrder={false} />
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>



  </React.StrictMode>
);
