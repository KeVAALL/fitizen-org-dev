import {
  CircularProgress,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import React from "react";

function TableLoader({ columns }) {
  return (
    <TableBody className="table_body_main">
      <TableRow>
        <TableCell colSpan={columns.length + 1} align="center">
          <div
            className="col-xl-12"
            style={{
              position: "relative",
              height: "150px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress
              style={{
                color: "#f05736",
              }}
            />
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  );
}

export default TableLoader;
