// src/ToasterContext.jsx
import React from "react";
import { Toaster } from "react-hot-toast";

const ToasterContext = React.createContext();

export const ToasterProvider = ({ children }) => (
  <ToasterContext.Provider value={{}}>
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      }}
    />
    {children}
  </ToasterContext.Provider>
);

export default ToasterContext;
