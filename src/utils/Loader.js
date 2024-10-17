import { Backdrop, CircularProgress } from "@mui/material";
import React from "react";

function Loader({ fetching }) {
  return (
    <div
      className="col-xl-12"
      style={{ position: "relative", height: "300px" }}
    >
      <Backdrop
        sx={{
          color: "#f05736",
          backgroundColor: "#fff",
          position: "absolute", // Make Backdrop absolute to the row div
          top: "50%", // Set the top position to 50%
          left: "50%", // Set the left position to 50%
          transform: "translate(-50%, -50%)", // Translate to center
          width: "100%",
          height: "100%",
          zIndex: 1, // Ensure it's above the content inside the row div
        }}
        open={fetching}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default Loader;
