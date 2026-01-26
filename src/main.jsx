import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/ui/header";
// import ComingSoon from "./components/pages/ComingSoon";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <CssBaseline />
      <Header />
{/* 
      <Routes>
        <Route path="/" element={<ComingSoon />} />
        <Route path="/how-it-work" element={<ComingSoon />} />
        <Route path="/about" element={<ComingSoon />} />
        <Route path="/contact" element={<ComingSoon />} />
        <Route path="/pricing" element={<ComingSoon />} />
        <Route path="/blog" element={<ComingSoon />} />
      </Routes> */}
    </BrowserRouter>
  </React.StrictMode>
);
