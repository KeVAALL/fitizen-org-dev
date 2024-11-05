// React imports
import React from "react";

// Project-specific imports
import Navbar from "./AuthNavbar";
import Footer from "./AuthFooter";

// React Router imports
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
