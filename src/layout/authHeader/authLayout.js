import React from "react";
import Navbar from "./AuthNavbar";
import Footer from "./AuthFooter";
import { Outlet } from "react-router-dom";

function AuthLayout({ children }) {
  return (
    <main>
      <Navbar />
      <Outlet />
      <Footer />
    </main>
  );
}

export default AuthLayout;
