import { styled, Tooltip, tooltipClasses } from "@mui/material";

export const HtmlLightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f05736",
    color: "#fff",
    maxWidth: "100%",
    height: 30,
    fontSize: theme.typography.pxToRem(12),
    fontFamily: '"Inter", sans-serif',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#f05736", // Match this to the backgroundColor of the tooltip
    "&:before": {
      // border: "1px solid #000",
      border: "none",
    },
  },
}));
export const WhiteSingleTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#fff",
    color: "#f05736",
    maxWidth: 220,
    // height: 30,
    fontSize: theme.typography.pxToRem(12),
    fontFamily: '"Inter", sans-serif',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Added box shadow
    // overflow: "auto", // Add scroll if content overflows
    // height: "120px", // Limit the height of the tooltip
    padding: "8px 16px",
    position: "relative", // Ensure the tooltip container is positioned
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#fff", // Match this to the backgroundColor of the tooltip
    [`&:before`]: {
      border: "none",
      content: '""', // Ensure the arrow content is set
    },
    // Ensure the arrow is positioned correctly
    position: "absolute",
    [theme.breakpoints.up("sm")]: {
      // Adjust arrow positioning for different breakpoints
      marginTop: "-5px",
    },
  },
}));
export const WhiteTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#fff",
    color: "#000",
    maxWidth: 250,
    // height: 30,
    fontSize: theme.typography.pxToRem(12),
    fontFamily: '"Inter", sans-serif',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Added box shadow
    // overflow: "auto", // Add scroll if content overflows
    height: "110px", // Limit the height of the tooltip
    padding: "8px 16px",
    position: "relative", // Ensure the tooltip container is positioned
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#fff", // Match this to the backgroundColor of the tooltip
    [`&:before`]: {
      border: "none",
      content: '""', // Ensure the arrow content is set
    },
    // Ensure the arrow is positioned correctly
    position: "absolute",
    [theme.breakpoints.up("sm")]: {
      // Adjust arrow positioning for different breakpoints
      marginTop: "-5px",
    },
  },
}));
export const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "#f05736",
    // boxShadow: theme.shadows[4],
    boxShadow:
      "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
    fontSize: 11,
    fontFamily: "Montserrat, sans-serif",
    letterSpacing: "0.05em",
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.white, // Background color for the arrow
    "&:before": {
      // boxShadow: theme.shadows[2], // Box shadow for the arrow
      boxShadow:
        "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
    },
  },
}));
