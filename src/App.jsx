import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Admin from "./pages/Admin";
import AdminSide from "./pages/AdminSide";

function App() {
  return (
    <div className="app-root">
      <Navbar />
      <main className="page-content">
        <Routes>
          {/* Main Single-Page Website */}
          <Route path="/" element={<Home />} />

          {/* Admin Portal */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/adminside" element={<AdminSide />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
