import React from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import Navbar from "./navbar";
import { Outlet } from "react-router-dom";
import Footer from "./footer";

function AuthLayout({ children }) {
  // return <Box sx={{ display: "flex", height: "100vh" }}>{children}</Box>;

  return (
    <main>
      <Navbar />
      <Outlet />
      <Footer />
    </main>
  );
}

export default AuthLayout;
