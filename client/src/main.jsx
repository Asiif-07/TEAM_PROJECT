import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline } from "@mui/material";
import { RouterProvider } from "react-router-dom";
import router from "./router.jsx";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { NotificationProvider } from "./context/NotificationContext";
import { Toaster } from "react-hot-toast";
import "./index.css";
import "./utils/i18n";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CssBaseline />
    <Toaster position="top-right" reverseOrder={false} />
    <AuthProvider>
      <SocketProvider>
        <NotificationProvider>
          <RouterProvider router={router} />
        </NotificationProvider>
      </SocketProvider>
    </AuthProvider>



  </React.StrictMode>
);
